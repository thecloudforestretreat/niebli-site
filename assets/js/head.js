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

  // expose for overrides per page
  window.setHead = setHead;
})();
