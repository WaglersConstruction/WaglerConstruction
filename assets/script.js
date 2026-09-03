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

  // Load project photos only when their expected files exist. If a file is
  // absent, the accessible, styled placeholder remains in place.
  document.querySelectorAll(".gallery-item[data-image]").forEach(function (item) {
    var source = item.getAttribute("data-image");
    var alt = item.getAttribute("data-alt") || "Wagler's Amish Construction project";
    var media = item.querySelector(".gallery-media");

    if (!source || !media) return;

    var image = new Image();
    image.className = "project-photo";
    image.alt = alt;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("load", function () {
      var placeholder = media.querySelector(".photo-placeholder");
      if (placeholder) placeholder.hidden = true;
      item.classList.add("has-photo");
    });

    image.addEventListener("error", function () {
      image.remove();
    });

    // A lazy-loaded image must be in the document before the browser will
    // request it. Keep the placeholder visible until loading succeeds.
    media.appendChild(image);
    image.src = source;
  });
})();
