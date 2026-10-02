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
});
