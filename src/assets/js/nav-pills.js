/* eslint-disable */

export default function setNavPills() {
  var total = document.querySelectorAll('.nav-pills');

  function initNavs() {
    total.forEach(function (item, i) {
      var first_li = item.querySelector('li:first-child .nav-link');
      if (!first_li) return;

      var moving_div = document.createElement('div');
      var tab = first_li.cloneNode();
      tab.innerHTML = "-";

      moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
      moving_div.appendChild(tab);
      item.appendChild(moving_div);

      moving_div.style.padding = '0px';
      moving_div.style.width = item.querySelector('li:nth-child(1)').offsetWidth + 'px';
      moving_div.style.transform = 'translate3d(0px, 0px, 0px)';
      moving_div.style.transition = '.5s ease';

      item.onmouseover = function (event) {
        let target = getEventTarget(event);
        let li = target.closest('li');
        if (li) {
          let nodes = Array.from(li.closest('ul').children);
          let index = nodes.indexOf(li) + 1;
          let navLink = item.querySelector('li:nth-child(' + index + ') .nav-link');
          if (navLink) {
            navLink.onclick = function () {
              let moving_div = item.querySelector('.moving-tab');
              if (!moving_div) return;
              let sum = 0;

              if (item.classList.contains('flex-column')) {
                for (var j = 1; j <= nodes.indexOf(li); j++) {
                  sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
                }
                moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
                moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight + 'px';
              } else {
                for (var j = 1; j <= nodes.indexOf(li); j++) {
                  sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
                }
                moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
                moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
              }
            }
          }
        }
      }
    });
  }

  setTimeout(initNavs, 100);

  window.addEventListener('resize', function () {
    total.forEach(function (item) {
      let oldMoving = item.querySelector('.moving-tab');
      if (oldMoving) oldMoving.remove();

      let activeNav = item.querySelector(".nav-link.active");
      if (!activeNav) return;

      var moving_div = document.createElement('div');
      var tab = activeNav.cloneNode();
      tab.innerHTML = "-";

      moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
      moving_div.appendChild(tab);
      item.appendChild(moving_div);

      moving_div.style.padding = '0px';
      moving_div.style.transition = '.5s ease';

      let li = activeNav.parentElement;
      if (!li) return;

      let nodes = Array.from(li.closest('ul').children);
      let index = nodes.indexOf(li) + 1;
      let sum = 0;

      if (item.classList.contains('flex-column')) {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
        }
        moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
        moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight + 'px';
      } else {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
        }
        moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
      }
    });

    // Ubah layout horizontal ↔ vertical berdasarkan lebar layar
    if (window.innerWidth < 991) {
      total.forEach(function (item) {
        if (!item.classList.contains('flex-column')) {
          item.classList.remove('flex-row');
          item.classList.add('flex-column', 'on-resize');

          let li = item.querySelector(".nav-link.active")?.parentElement;
          if (!li) return;
          let nodes = Array.from(li.closest('ul').children);
          let sum = 0;
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
          }
          var moving_div = item.querySelector('.moving-tab');
          if (moving_div) {
            moving_div.style.width = item.querySelector('li:nth-child(1)').offsetWidth + 'px';
            moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
          }
        }
      });
    } else {
      total.forEach(function (item) {
        if (item.classList.contains('on-resize')) {
          item.classList.remove('flex-column', 'on-resize');
          item.classList.add('flex-row');

          let li = item.querySelector(".nav-link.active")?.parentElement;
          if (!li) return;

          let nodes = Array.from(li.closest('ul').children);
          let index = nodes.indexOf(li) + 1;
          let sum = 0;
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
          }

          var moving_div = item.querySelector('.moving-tab');
          if (moving_div) {
            moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
            moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
          }
        }
      })
    }
  });

  // Inisialisasi layout awal
  if (window.innerWidth < 991) {
    total.forEach(function (item) {
      if (item.classList.contains('flex-row')) {
        item.classList.remove('flex-row');
        item.classList.add('flex-column', 'on-resize');
      }
    });
  }

  function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
  }
}
