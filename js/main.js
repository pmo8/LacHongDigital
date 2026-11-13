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

  // 7. Consultation & Contact Form Handling (Tích hợp Web3Forms gửi thẳng về contact@lachongdigital.vn)
  function handleWeb3FormSubmit(form, submitBtn, defaultBtnHtml, successMessage) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi yêu cầu...';
      }

      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(async function (response) {
          const json = await response.json();
          if (response.status === 200 && json.success) {
            alert(successMessage || 'Cảm ơn Quý đối tác! Yêu cầu đã được gửi thành công đến hòm thư contact@lachongdigital.vn. Chuyên viên Viện Lạc Hồng Digital sẽ liên hệ trong thời gian sớm nhất.');
            form.reset();
          } else {
            alert(json.message || 'Có lỗi xảy ra khi gửi. Quý vị vui lòng thử lại hoặc liên hệ hotline: 0909.860.118!');
          }
        })
        .catch(function () {
          alert('Không thể kết nối đến máy chủ gửi thư. Quý vị vui lòng gọi hotline 0909.860.118 để được hỗ trợ tức thì!');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = defaultBtnHtml;
          }
        });
    });
  }

  // 7.1. Form Gửi Yêu Cầu Tư Vấn / Hợp Tác (trên trang liên hệ lien-he.html)
  const contactPageForm = document.getElementById('contactPageForm');
  const contactPageSubmitBtn = document.getElementById('contactPageSubmitBtn');
  handleWeb3FormSubmit(
    contactPageForm,
    contactPageSubmitBtn,
    '<i class="fas fa-paper-plane"></i> Gửi Yêu Cầu Trực Tuyến',
    'Cảm ơn Quý đối tác! Yêu cầu tư vấn / hợp tác đã được gửi thành công đến hòm thư contact@lachongdigital.vn. Chuyên gia Lạc Hồng Digital sẽ phản hồi trong vòng 24 giờ làm việc.'
  );

  // 7.2. Form Nhận Hồ Sơ Năng Lực & Tư Vấn (trên trang chủ index.html)
  const ctaForm = document.getElementById('consultationForm');
  const consultationSubmitBtn = document.getElementById('consultationSubmitBtn');
  handleWeb3FormSubmit(
    ctaForm,
    consultationSubmitBtn,
    '<i class="fas fa-paper-plane"></i> Gửi Yêu Cầu Hỗ Trợ',
    'Cảm ơn Quý đối tác! Yêu cầu nhận hồ sơ năng lực & tư vấn đã được gửi thành công đến hòm thư contact@lachongdigital.vn. Chuyên viên Lạc Hồng Digital sẽ liên hệ sớm nhất.'
  );

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

  // 9. Core Values - Interactive Tree of Values (Tối ưu hóa tuyệt đối cho Mobile & Tablet)
  const cvInteractives = document.querySelectorAll('.cv-interactive');
  const cvSpotlightBox = document.getElementById('cvSpotlightBox');
  const cvSpotlightBadge = document.getElementById('cvSpotlightBadge');
  const cvSpotlightText = document.getElementById('cvSpotlightText');
  const cvSpotlightClose = document.getElementById('cvSpotlightClose');

  if (cvInteractives.length) {
    const cvData = {
      '1': 'Mãi mãi tinh thần Khởi nghiệp',
      '2': 'Thích ứng nhanh là sức mạnh cạnh tranh',
      '3': 'Lựa chọn đúng quan trọng hơn sự nỗ lực cố gắng',
      '4': 'Trưởng thành qua thách thức và thất bại',
      '5': 'Đồng hành, hiện diện, kề vai sát cánh và chung lưng đấu cật cùng dân tộc',
      '6': 'Đông Tây kết hợp'
    };

    // Kiểm tra xem thiết bị có phải là màn hình cảm ứng (Mobile/Tablet) không
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;

    let currentActiveId = null;

    // Hiển thị nội dung giá trị cốt lõi to rõ ràng
    function showCoreValue(pairId) {
      if (!pairId || !cvData[pairId]) return;
      currentActiveId = pairId;

      // 1. Cập nhật trạng thái trên cây (phóng to chữ và làm sáng hoa tương ứng)
      cvInteractives.forEach(function (el) {
        const id = el.getAttribute('data-pair');
        if (id === pairId) {
          el.classList.add('is-active');
          if (el.classList.contains('cv-tree-text')) {
            el.classList.add('cv-zoomed');
          }
        } else {
          el.classList.remove('is-active');
          el.classList.remove('cv-zoomed');
        }
      });

      // 2. Cập nhật hộp đọc to rõ Spotlight Box (nằm ngay dưới gốc cây)
      if (cvSpotlightBox && cvSpotlightText) {
        if (cvSpotlightBadge) cvSpotlightBadge.textContent = '0' + pairId;
        cvSpotlightText.textContent = cvData[pairId];
        cvSpotlightBox.classList.add('show');
      }
    }

    // Đóng phóng to và đưa về trạng thái bình thường
    function hideCoreValue() {
      currentActiveId = null;
      cvInteractives.forEach(function (el) {
        el.classList.remove('is-active');
        el.classList.remove('cv-zoomed');
      });
      if (cvSpotlightBox) {
        cvSpotlightBox.classList.remove('show');
      }
    }

    // Nút đóng hộp đọc
    if (cvSpotlightClose) {
      cvSpotlightClose.addEventListener('click', function (e) {
        e.stopPropagation();
        hideCoreValue();
      });
    }

    cvInteractives.forEach(function (el) {
      if (el.classList.contains('cv-grand-bud')) return;
      const pairId = el.getAttribute('data-pair');
      if (!pairId) return;

      // KHI RÊ CHUỘT (CHỈ DÀNH CHO DESKTOP CÓ CHUỘT THẬT)
      if (!isTouchDevice) {
        el.addEventListener('mouseenter', function () {
          showCoreValue(pairId);
        });

        el.addEventListener('mouseleave', function () {
          hideCoreValue();
        });
      }

      // KHI CHẠM / CLICK (Dành cho Mobile, Tablet & Desktop click)
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentActiveId === pairId) {
          // Chạm lần 2 vào cùng 1 giá trị -> Thu nhỏ lại như cũ
          hideCoreValue();
        } else {
          // Chạm vào giá trị -> Mở to và giữ nguyên để người dùng đọc dễ dàng
          showCoreValue(pairId);
        }
      });
    });

    // Chạm ra ngoài vùng cây: Thu nhỏ trở lại như cũ
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cv-interactive') && !e.target.closest('#cvSpotlightBox')) {
        hideCoreValue();
      }
    });

    // 10. Hiệu ứng lấp lánh nhẹ nhàng khi di chuột trên Desktop (Tuyệt đối không chạy trên Mobile để tránh quá tải/crash)
    const treeCenter = document.querySelector('.cv-tree-center');
    const sparkleLayer = document.querySelector('.cv-tree-sparkles-layer');

    if (treeCenter && sparkleLayer && !isTouchDevice) {
      let lastSparkleTime = 0;
      const treeGoldColors = ['#ffd700', '#fff3a8', '#fde047', '#ffffff'];

      treeCenter.addEventListener('mousemove', function (e) {
        if (e.target.closest('.cv-tree-flower')) return;
        const now = Date.now();
        if (now - lastSparkleTime < 50) return;
        lastSparkleTime = now;

        const rect = treeCenter.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const s = document.createElement('div');
        s.className = 'cv-tree-sparkle';
        const size = 3 + Math.random() * 4;
        const color = treeGoldColors[Math.floor(Math.random() * treeGoldColors.length)];

        s.style.cssText =
          'left:' + (x + (Math.random() - 0.5) * 20) + 'px;' +
          'top:' + (y + (Math.random() - 0.5) * 20) + 'px;' +
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'background:' + color + ';' +
          'border-radius:50%;' +
          'box-shadow:0 0 8px ' + color + ';' +
          'animation:cvTreeSparkleAnim 0.6s ease-out forwards;';

        sparkleLayer.appendChild(s);
        setTimeout(function () {
          if (s.parentNode) s.parentNode.removeChild(s);
        }, 650);
      });
    }
  }
});
