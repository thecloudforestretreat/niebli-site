(function () {
  "use strict";

  function loadInclude(id, url) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();

    return fetch(url)
      .then(function (res) {
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (err) {
        console.warn("Include failed:", url, err);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      loadInclude("siteHeader", "/assets/includes/header.html"),
      loadInclude("siteFooter", "/assets/includes/footer.html")
    ]).then(function () {
      if (window.NiebliInit && typeof window.NiebliInit === "function") {
        window.NiebliInit();
      }
    });
  });
})();
