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

    // Dọn dẹp an toàn các particle cũ trước khi tạo mới để tránh tràn bộ nhớ
    function cleanParticles(fwc) {
      if (!fwc) return;
      const old = fwc.querySelectorAll('.cv-particle');
      old.forEach(function (p) {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    }

    function createFirework(container, count, maxDist) {
      const fwc = container.querySelector('.cv-firework-container');
      if (!fwc) return;
      cleanParticles(fwc);

      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;
      const total = Math.min(count, 24); // Giới hạn số lượng an toàn cho mobile

      for (let i = 0; i < total; i++) {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 * i) / total + (Math.random() - 0.5) * 0.4;
        const dist = (maxDist * 0.4) + Math.random() * (maxDist * 0.6);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = 2.5 + Math.random() * 4;
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        const rnd = Math.random();
        const cls = rnd > 0.6 ? 'cv-particle comet' : rnd > 0.3 ? 'cv-particle spark' : 'cv-particle';

        p.className = cls;
        p.style.cssText =
          'left:' + (cx - size / 2) + 'px;' +
          'top:' + (cy - size / 2) + 'px;' +
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'background:' + color + ';' +
          'box-shadow:0 0 ' + (size * 2.5) + 'px ' + color + ';' +
          '--tx:' + tx + 'px;' +
          '--ty:' + ty + 'px;' +
          'animation-delay:' + (Math.random() * 0.08) + 's;' +
          'animation-duration:' + (0.4 + Math.random() * 0.35) + 's;';

        fwc.appendChild(p);
        setTimeout(function () {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 850);
      }
    }

    // Đóng phóng to tất cả các dòng chữ giá trị
    function resetAllZoomedTexts() {
      document.querySelectorAll('.cv-tree-text.cv-zoomed').forEach(function (item) {
        item.classList.remove('cv-zoomed');
      });
      document.querySelectorAll('.cv-interactive.is-active').forEach(function (item) {
        item.classList.remove('is-active');
      });
    }

    var cooldowns = new WeakMap();

    cvInteractives.forEach(function (el) {
      if (el.classList.contains('cv-grand-bud')) return;

      var isFlower = el.classList.contains('cv-tree-flower');
      var isText = el.classList.contains('cv-tree-text');
      var pairId = el.getAttribute('data-pair');

      // 1. KHI RÊ CHUỘT (Hover trên Desktop/Tablet)
      el.addEventListener('mouseenter', function () {
        var now = Date.now();
        var last = cooldowns.get(el) || 0;
        if (now - last < 250) return;
        cooldowns.set(el, now);

        if (isFlower) {
          // Bông hoa: Bung pháo hoa và phát sáng
          createFirework(el, 22, 80);
          el.classList.add('is-active');
          if (pairId) {
            var pairedText = document.querySelector('.cv-tree-text[data-pair="' + pairId + '"]');
            if (pairedText) {
              pairedText.classList.add('is-active');
              pairedText.classList.add('cv-zoomed');
            }
          }
        } else if (isText) {
          // Dòng chữ: Phóng to chữ to rõ để đọc dễ dàng
          el.classList.add('cv-zoomed');
          el.classList.add('is-active');
          if (pairId) {
            var pairedFlower = document.querySelector('.cv-tree-flower[data-pair="' + pairId + '"]');
            if (pairedFlower) {
              pairedFlower.classList.add('is-active');
              createFirework(pairedFlower, 18, 70);
            }
          }
        }
      });

      // KHI RỜI CHUỘT (Mouse Leave): Trở lại như cũ ngay lập tức
      el.addEventListener('mouseleave', function () {
        if (isText) {
          el.classList.remove('cv-zoomed');
          el.classList.remove('is-active');
        } else {
          el.classList.remove('is-active');
        }

        if (pairId) {
          var pairedEls = document.querySelectorAll('.cv-interactive[data-pair="' + pairId + '"]');
          pairedEls.forEach(function (paired) {
            paired.classList.remove('is-active');
            paired.classList.remove('cv-zoomed');
          });
        }
      });

      // 2. KHI CHẠM / NHẤN (Tap / Click trên Mobile, Tablet & Desktop)
      el.addEventListener('click', function (e) {
        e.stopPropagation();

        if (isText) {
          var isAlreadyZoomed = el.classList.contains('cv-zoomed');
          resetAllZoomedTexts();

          if (!isAlreadyZoomed) {
            // Phóng to dòng chữ này để người dùng đọc dễ dàng
            el.classList.add('cv-zoomed');
            el.classList.add('is-active');

            if (pairId) {
              var pairedFlower = document.querySelector('.cv-tree-flower[data-pair="' + pairId + '"]');
              if (pairedFlower) {
                pairedFlower.classList.add('is-active');
                createFirework(pairedFlower, 20, 75);
              }
            }
          }
        } else if (isFlower) {
          // Chạm vào bông hoa: Bung pháo hoa và phóng to dòng chữ tương ứng
          createFirework(el, 22, 80);
          el.classList.add('is-active');

          if (pairId) {
            resetAllZoomedTexts();
            var pairedText = document.querySelector('.cv-tree-text[data-pair="' + pairId + '"]');
            if (pairedText) {
              pairedText.classList.add('cv-zoomed');
              pairedText.classList.add('is-active');
            }
          }
        }
      });
    });

    // Khi chạm / click ra ngoài vùng cây: Tự động thu nhỏ tất cả chữ về kích thước bình thường
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cv-interactive')) {
        resetAllZoomedTexts();
      }
    });

    // 10. Hiệu ứng lấp lánh hoàng kim khi di chuyển chuột hoặc chạm vuốt vào thân cây (Cả Desktop, Tablet & Mobile)
    var treeCenter = document.querySelector('.cv-tree-center');
    var sparkleLayer = document.querySelector('.cv-tree-sparkles-layer');

    if (treeCenter && sparkleLayer) {
      var lastSparkleTime = 0;
      var treeGoldColors = ['#ffd700', '#fff3a8', '#fde047', '#ffb703', '#ffffff', '#e5c378'];

      function spawnTreeSparkles(clientX, clientY) {
        var now = Date.now();
        if (now - lastSparkleTime < 35) return; // Tạo luồng bụi sao dày dặn, mượt mà
        lastSparkleTime = now;

        var rect = treeCenter.getBoundingClientRect();
        var x = clientX - rect.left;
        var y = clientY - rect.top;

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
      }

      treeCenter.addEventListener('mousemove', function (e) {
        // Không tạo bụi sao nếu đang rê chuột lên trên bông hoa
        if (e.target.closest('.cv-tree-flower')) return;
        spawnTreeSparkles(e.clientX, e.clientY);
      });

      treeCenter.addEventListener('touchmove', function (e) {
        if (!e.touches || !e.touches[0]) return;
        if (e.target.closest('.cv-tree-flower')) return;
        spawnTreeSparkles(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
    }
  }
});
