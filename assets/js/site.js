(function () {
  "use strict";

  function initMobileMenu() {
    var toggle = document.querySelector(".menuToggle");
    var mobileMenu = document.querySelector(".mobileMenu");

    if (!toggle || !mobileMenu) return;

    function closeMenu() {
      mobileMenu.classList.remove("is-open");
      mobileMenu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      mobileMenu.hidden = false;
      mobileMenu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    closeMenu();

    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1040) {
        closeMenu();
      }
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");
        if (!targetId || targetId.length <= 1) return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".siteHeader");
    if (!header) return;

    function updateHeaderState() {
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  window.NiebliInit = function () {
    initMobileMenu();
    initSmoothScroll();
    initHeaderShadow();
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("siteHeader")) {
      window.NiebliInit();
    }
  });
})();
