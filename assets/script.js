(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var menuLabel = toggle ? toggle.querySelector(".sr-only") : null;

  function setMenu(open) {
    if (!toggle || !menu) return;

    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);

    if (menuLabel) {
      menuLabel.textContent = open ? "Close navigation menu" : "Open navigation menu";
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMenu(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("open")) return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        setMenu(false);
      }
    });
  }

  var gallery = document.getElementById("recent-project-gallery");
  var galleryStatus = document.getElementById("gallery-status");

  if (gallery) {
    var galleryApi = gallery.getAttribute("data-gallery-api");
    var supportedPhoto = /\.(avif|bmp|gif|jpe?g|jfif|png|webp)$/i;
    var extensionPreference = ["png", "webp", "avif", "jpg", "jpeg", "jfif", "gif", "bmp"];

    function projectTitle(filename) {
      var title = filename
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\b(img|dsc|pxl)\s*\d+\b/gi, "")
        .replace(/\b\w/g, function (letter) { return letter.toUpperCase(); })
        .replace(/\s+/g, " ")
        .trim();

      if (!title || /^Project\s*\d*$/i.test(title)) return "Recent Project";
      return title;
    }

    function renderGallery(files) {
      var uniqueFiles = new Map();

      files
        .filter(function (file) {
          return file.type === "file" && supportedPhoto.test(file.name) && file.download_url;
        })
        .sort(function (a, b) {
          var aExtension = a.name.split(".").pop().toLowerCase();
          var bExtension = b.name.split(".").pop().toLowerCase();
          return extensionPreference.indexOf(aExtension) - extensionPreference.indexOf(bExtension);
        })
        .forEach(function (file) {
          if (!uniqueFiles.has(file.sha)) uniqueFiles.set(file.sha, file);
        });

      var photos = Array.from(uniqueFiles.values()).sort(function (a, b) {
        return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: "base" });
      });

      if (!photos.length) throw new Error("No supported project photos found");

      var fragment = document.createDocumentFragment();

      photos.forEach(function (file) {
        var title = projectTitle(file.name);
        var item = document.createElement("figure");
        var media = document.createElement("div");
        var image = new Image();
        var caption = document.createElement("figcaption");
        var strong = document.createElement("strong");
        var detail = document.createElement("span");

        item.className = "gallery-item";
        media.className = "gallery-media";
        image.className = "project-photo";
        image.src = file.download_url;
        image.alt = title + " by Wagler's Amish Construction in Michigan";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", function () { item.remove(); });
        strong.textContent = title;
        detail.textContent = "Recent project";

        media.appendChild(image);
        caption.appendChild(strong);
        caption.appendChild(detail);
        item.appendChild(media);
        item.appendChild(caption);
        fragment.appendChild(item);
      });

      gallery.replaceChildren(fragment);
      if (galleryStatus) galleryStatus.textContent = "";
    }

    if (galleryApi && window.fetch) {
      fetch(galleryApi, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store"
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Gallery request failed");
          return response.json();
        })
        .then(renderGallery)
        .catch(function () {
          if (galleryStatus) {
            galleryStatus.textContent = "Showing the latest available project photo. Please check back for more.";
          }
        });
    }
  }
})();
