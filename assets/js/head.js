(function () {
  "use strict";

  function setHead(config) {
    if (!config) return;

    var head = document.head;

    function setTag(selector, attr, value) {
      var el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (selector.includes("property")) {
          el.setAttribute("property", selector.match(/"(.*?)"/)[1]);
        } else if (selector.includes("name")) {
          el.setAttribute("name", selector.match(/"(.*?)"/)[1]);
        }
        head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    if (config.title) {
      document.title = config.title;
    }

    if (config.description) {
      setTag('meta[name="description"]', "content", config.description);
    }

    if (config.url) {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        head.appendChild(canonical);
      }
      canonical.href = config.url;
    }

    if (config.ogImage) {
      setTag('meta[property="og:image"]', "content", config.ogImage);
      setTag('meta[name="twitter:image"]', "content", config.ogImage);
    }

    if (config.title) {
      setTag('meta[property="og:title"]', "content", config.title);
      setTag('meta[name="twitter:title"]', "content", config.title);
    }

    if (config.description) {
      setTag('meta[property="og:description"]', "content", config.description);
      setTag('meta[name="twitter:description"]', "content", config.description);
    }
  }

  function injectGlobalHead() {
    var head = document.head;

    // Fonts (your required block)
    var fontPreconnect1 = document.createElement("link");
    fontPreconnect1.rel = "preconnect";
    fontPreconnect1.href = "https://fonts.googleapis.com";

    var fontPreconnect2 = document.createElement("link");
    fontPreconnect2.rel = "preconnect";
    fontPreconnect2.href = "https://fonts.gstatic.com";
    fontPreconnect2.crossOrigin = "true";

    var fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap";

    head.appendChild(fontPreconnect1);
    head.appendChild(fontPreconnect2);
    head.appendChild(fontLink);

    // Theme color
    var theme = document.createElement("meta");
    theme.name = "theme-color";
    theme.content = "#081614";
    head.appendChild(theme);

    // Favicon (update later if needed)
    var favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = "/favicon.ico";
    head.appendChild(favicon);
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectGlobalHead();

    // Default page config (can be overridden per page)
    setHead({
      title: "Niebli | Retreats, Nature and Elevated Experiences",
      description:
        "Niebli curates immersive nature-driven experiences, retreats, and elevated environments designed for presence, calm, and connection.",
      url: "https://niebli.com/",
      ogImage:
        "https://niebli.com/assets/images/homepage/niebli_homepage_hero_01.jpg"
    });
  });

  // expose for overrides per page
  window.setHead = setHead;
})();
