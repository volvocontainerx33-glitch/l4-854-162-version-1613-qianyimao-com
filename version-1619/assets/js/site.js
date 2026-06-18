(function () {
  var buttons = document.querySelectorAll('[data-menu-button]');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var header = button.closest('.site-header');
      var panel = header ? header.querySelector('[data-mobile-panel]') : null;
      if (panel) {
        panel.classList.toggle('is-open');
      }
    });
  });
})();
