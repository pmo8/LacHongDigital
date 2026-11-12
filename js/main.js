/**
 * LẠC HỒNG DIGITAL - VIỆN NGHIÊN CỨU CHIẾN LƯỢC VÀ PHÁT TRIỂN LẠC HỒNG
 * Main JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Sticky Navigation on Scroll
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Mobile dropdown toggle
    const dropdownItems = navMenu.querySelectorAll('.nav-item');
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');
      if (link && dropdown) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        });
      }
    });
  }

  // 3. Hero Slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    if (!slides.length) return;
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    if (!slides.length) return;
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  if (slides.length > 1) {
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });

    dots.forEach(dot => {
      dot.addEventListener('click', function () {
        const slideIndex = parseInt(this.getAttribute('data-slide') || '0', 10);
        showSlide(slideIndex);
        resetSlideTimer();
      });
    });

    function startSlideTimer() {
      slideInterval = setInterval(nextSlide, 6500);
    }

    function resetSlideTimer() {
      clearInterval(slideInterval);
      startSlideTimer();
    }

    startSlideTimer();
  }

  // 4. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter') || 'all';

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || category.includes(filterValue)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 5. Counters Animation with IntersectionObserver
  const counterElements = document.querySelectorAll('.counter-val');
  let animated = false;

  if (counterElements.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / (duration / 30)));
            let current = 0;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              counter.textContent = current;
            }, 30);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const counterSection = document.querySelector('.counter-section');
    if (counterSection) counterObserver.observe(counterSection);
  }

  // 6. Search Popup Modal
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const modalClose = document.getElementById('modalClose');

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      searchModal.classList.add('active');
      const input = searchModal.querySelector('input');
      if (input) setTimeout(() => input.focus(), 150);
    });

    if (modalClose) {
      modalClose.addEventListener('click', function () {
        searchModal.classList.remove('active');
      });
    }

    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
      }
    });
  }

  // 7. Consultation & Newsletter Form Handling
  const ctaForm = document.getElementById('consultationForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('input[name="fullname"]')?.value;
      const phone = this.querySelector('input[name="phone"]')?.value;

      if (!phone) {
        alert('Vui lòng nhập số điện thoại để chuyên gia Lạc Hồng Digital liên hệ hỗ trợ!');
        return;
      }

      alert(`Cảm ơn Quý khách ${name ? name : ''}! Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng (Lạc Hồng Digital) đã nhận thông tin và sẽ liên hệ tư vấn trong thời gian sớm nhất.`);
      ctaForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]')?.value;
      if (email) {
        alert(`Cảm ơn bạn đã đăng ký nhận bản tin nghiên cứu và sự kiện từ Lạc Hồng Digital (${email})!`);
        newsletterForm.reset();
      }
    });
  }

  // 8. Project Details Modal (Optional Click Preview)
  const projectDetailBtns = document.querySelectorAll('.btn-view-project');
  const projectModal = document.getElementById('projectDetailModal');
  const projectModalClose = document.getElementById('projectModalClose');

  if (projectDetailBtns.length && projectModal) {
    projectDetailBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const title = this.getAttribute('data-title') || 'Thông tin dự án';
        const desc = this.getAttribute('data-desc') || '';
        const scope = this.getAttribute('data-scope') || '';
        const client = this.getAttribute('data-client') || '';

        const mTitle = document.getElementById('projectModalTitle');
        const mDesc = document.getElementById('projectModalDesc');
        const mScope = document.getElementById('projectModalScope');
        const mClient = document.getElementById('projectModalClient');

        if (mTitle) mTitle.textContent = title;
        if (mDesc) mDesc.textContent = desc;
        if (mScope) mScope.textContent = scope;
        if (mClient) mClient.textContent = client;

        projectModal.classList.add('active');
      });
    });

    if (projectModalClose) {
      projectModalClose.addEventListener('click', function () {
        projectModal.classList.remove('active');
      });
    }

    projectModal.addEventListener('click', function (e) {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
      }
    });
  }

  // 9. Core Values - Firework Effect & Interactive Tree of Values
  const cvInteractives = document.querySelectorAll('.cv-interactive');

  if (cvInteractives.length) {
    const fireworkColors = [
      '#ff4444', '#ff6b35', '#ffd700', '#ff8c00',
      '#ffffff', '#ff1744', '#ffab40', '#ef5350',
      '#ffee58', '#f59e0b', '#f43f5e', '#fbbf24'
    ];

    function createFirework(container, count, maxDist) {
      const fwc = container.querySelector('.cv-firework-container');
      if (!fwc) return;

      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;
      const total = count + Math.floor(Math.random() * 8);

      for (let i = 0; i < total; i++) {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 * i) / total + (Math.random() - 0.5) * 0.5;
        const dist = (maxDist * 0.35) + Math.random() * (maxDist * 0.65);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = 2.5 + Math.random() * 4.5;
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        const rnd = Math.random();
        const cls = rnd > 0.65 ? 'cv-particle comet' : rnd > 0.35 ? 'cv-particle spark' : 'cv-particle';

        p.className = cls;
        p.style.cssText =
          'left:' + (cx - size / 2) + 'px;' +
          'top:' + (cy - size / 2) + 'px;' +
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'background:' + color + ';' +
          'box-shadow:0 0 ' + (size * 3) + 'px ' + color + ';' +
          '--tx:' + tx + 'px;' +
          '--ty:' + ty + 'px;' +
          'animation-delay:' + (Math.random() * 0.12) + 's;' +
          'animation-duration:' + (0.45 + Math.random() * 0.45) + 's;';

        fwc.appendChild(p);
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1200);
      }
    }

    function createSparkles(container, count, maxDist) {
      const fwc = container.querySelector('.cv-firework-container');
      if (!fwc) return;
      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;

      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const dist = (maxDist * 0.25) + Math.random() * (maxDist * 0.75);
        const size = 1.8 + Math.random() * 2.8;
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

        p.className = 'cv-particle spark';
        p.style.cssText =
          'left:' + (cx - size / 2) + 'px;' +
          'top:' + (cy - size / 2) + 'px;' +
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'background:' + color + ';' +
          'box-shadow:0 0 ' + (size * 3.5) + 'px ' + color + ';' +
          '--tx:' + (Math.cos(angle) * dist) + 'px;' +
          '--ty:' + (Math.sin(angle) * dist) + 'px;' +
          'animation-duration:' + (0.35 + Math.random() * 0.35) + 's;';

        fwc.appendChild(p);
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 900);
      }
    }

    var cooldowns = new WeakMap();

    cvInteractives.forEach(function (el) {
      // Bỏ qua nụ hoa: không kích hoạt pháo hoa trên nụ hoa
      if (el.classList.contains('cv-grand-bud')) return;

      var isFlower = el.classList.contains('cv-tree-flower') || el.classList.contains('cv-flower-wrap');
      var pairId = el.getAttribute('data-pair');
      var sparkleTimer = null;

      el.addEventListener('mouseenter', function () {
        var now = Date.now();
        var last = cooldowns.get(el) || 0;
        if (now - last < 350) return;
        cooldowns.set(el, now);

        // Bắn pháo hoa rực rỡ đa sắc khi rê chuột vào 6 bông hoa hoặc dòng chữ
        var burstCount = isFlower ? 32 : 24;
        var burstDist = isFlower ? 85 : 75;
        createFirework(el, burstCount, burstDist);

        // Hiệu ứng phát sáng hào quang đồng bộ hoa <-> chữ
        if (pairId && pairId !== 'grand') {
          var pairedEls = document.querySelectorAll('.cv-interactive[data-pair="' + pairId + '"]');
          pairedEls.forEach(function (paired) {
            if (paired !== el) paired.classList.add('is-active');
          });
        }
      });

      // Nhấp nháy phát sáng hào quang và bụi sao lấp lánh liên tục trong suốt thời gian rê chuột
      el.addEventListener('mouseenter', function () {
        sparkleTimer = setInterval(function () {
          createSparkles(el, 4, isFlower ? 60 : 55);
        }, 140);
      });

      el.addEventListener('mouseleave', function () {
        if (sparkleTimer) {
          clearInterval(sparkleTimer);
          sparkleTimer = null;
        }
        if (pairId && pairId !== 'grand') {
          var pairedEls = document.querySelectorAll('.cv-interactive[data-pair="' + pairId + '"]');
          pairedEls.forEach(function (paired) {
            paired.classList.remove('is-active');
          });
        }
      });
    });

    // 10. Hiệu ứng lấp lánh hoàng kim khi di chuyển chuột vào thân cây
    var treeCenter = document.querySelector('.cv-tree-center');
    var sparkleLayer = document.querySelector('.cv-tree-sparkles-layer');

    if (treeCenter && sparkleLayer) {
      var lastSparkleTime = 0;
      var treeGoldColors = ['#ffd700', '#fff3a8', '#fde047', '#ffb703', '#ffffff', '#e5c378'];

      treeCenter.addEventListener('mousemove', function (e) {
        // Không tạo bụi sao nếu đang rê chuột lên trên bông hoa
        if (e.target.closest('.cv-tree-flower')) return;

        var now = Date.now();
        if (now - lastSparkleTime < 35) return; // Tạo luồng bụi sao dày dặn, mượt mà
        lastSparkleTime = now;

        var rect = treeCenter.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        for (var i = 0; i < 3; i++) {
          var s = document.createElement('div');
          s.className = 'cv-tree-sparkle';
          var size = 3.5 + Math.random() * 6;
          var offsetX = (Math.random() - 0.5) * 32;
          var offsetY = (Math.random() - 0.5) * 32;
          var color = treeGoldColors[Math.floor(Math.random() * treeGoldColors.length)];
          var isStar = Math.random() > 0.35;

          s.style.cssText =
            'left:' + (x + offsetX) + 'px;' +
            'top:' + (y + offsetY) + 'px;' +
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'background:' + color + ';' +
            (isStar ? 'clip-path:polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);' : 'border-radius:50%;') +
            'box-shadow:0 0 10px ' + color + ', 0 0 20px #ffd700;' +
            '--dx:' + ((Math.random() - 0.5) * 45) + 'px;' +
            'animation:cvTreeSparkleAnim ' + (0.55 + Math.random() * 0.35) + 's ease-out forwards;';

          sparkleLayer.appendChild(s);
          (function (element) {
            setTimeout(function () {
              if (element.parentNode) element.parentNode.removeChild(element);
            }, 850);
          })(s);
        }
      });
    }
  }
});
