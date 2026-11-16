/**
 * LẠC HỒNG DIGITAL - IN-PAGE ADMIN CMS SCRIPT (SONG NGỮ TỰ ĐỘNG & QUẢN LÝ HÌNH ẢNH)
 * Trình biên tập nội dung trực tiếp trên website (Live In-Page Editor)
 * - Quét toàn diện 100% các vị trí văn bản, nút bấm, menu, tiêu đề, thẻ dự án...
 * - TỰ ĐỘNG DỊCH TIẾNG ANH (AI Auto-Translate): Gõ tiếng Việt xong là có ngay tiếng Anh, không cần gõ thêm!
 * - THAY ĐỔI HÌNH ẢNH TRỰC TIẾP: Click vào bất kỳ ảnh nào để tải ảnh mới từ máy tính hoặc dán link!
 * - Tự động upload ảnh và tạo Commit lên kho GitHub (pmo8/LacHongDigital) - 100% không cần Database
 */

(function () {
  'use strict';

  // Cấu hình mặc định cho kho GitHub của Lạc Hồng Digital
  const DEFAULT_CONFIG = {
    owner: 'pmo8',
    repo: 'LacHongDigital',
    branch: 'main'
  };

  const changedElements = new Map();     // Các phần tử HTML (Tiếng Việt) đã sửa
  const changedTranslations = new Map(); // Các bản dịch Tiếng Anh { viKey => enText }
  const changedImages = new Map();       // Các hình ảnh đã sửa { el => info }
  let isEditingActive = false;
  let isPreviewMode = false;
  let translationDebounceTimer = null;
  let currentTargetImageEl = null;       // Phần tử ảnh đang được mở modal để đổi

  // 1. TIỆN ÍCH MÃ HÓA VÀ DECODE UTF-8 CHO GITHUB REST API
  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToUtf8(base64) {
    const clean = base64.replace(/\s/g, '');
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  }

  function isCurrentLangEn() {
    if (window.LacHongI18n && typeof window.LacHongI18n.getLang === 'function') {
      return window.LacHongI18n.getLang() === 'en';
    }
    return document.documentElement.lang === 'en';
  }

  // 2. CÔNG CỤ TỰ ĐỘNG DỊCH TIẾNG VIỆT ➔ TIẾNG ANH (AI AUTO-TRANSLATE)
  async function autoTranslateViToEn(text) {
    if (!text || !text.trim()) return '';
    const trimmed = text.trim();

    // A. Kiểm tra trong từ điển có sẵn của Lạc Hồng
    if (window.LacHongI18n && typeof window.LacHongI18n.translate === 'function') {
      const existing = window.LacHongI18n.translate(trimmed);
      if (existing && existing !== trimmed) {
        return existing;
      }
    }

    // B. Gọi Google Translate API miễn phí (siêu tốc ~100ms)
    try {
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=' + encodeURIComponent(trimmed);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const translated = data[0].map(item => item[0]).join('');
          if (translated && translated.trim()) {
            return translated.trim();
          }
        }
      }
    } catch (e) {
      console.warn('[AutoTranslate Google Error]', e);
    }

    // C. Dự phòng: MyMemory Translation API
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=vi|en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          return data.responseData.translatedText.trim();
        }
      }
    } catch (e) {}

    return '';
  }

  // 3. LẤY TÊN FILE TRANG HIỆN TẠI
  function getCurrentPageFileName() {
    let path = window.location.pathname;
    let fileName = path.substring(path.lastIndexOf('/') + 1);
    if (!fileName || fileName === '' || fileName === '/') {
      fileName = 'index.html';
    }
    if (!fileName.endsWith('.html')) {
      fileName += '.html';
    }
    return fileName;
  }

  // 4. HIỂN THỊ THÔNG BÁO TOAST
  function showToast(message, type = 'success', duration = 4000) {
    let toast = document.getElementById('lh-admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lh-admin-toast';
      document.body.appendChild(toast);
    }

    toast.className = '';
    if (type === 'error') toast.classList.add('error');
    if (type === 'warning') toast.classList.add('warning');

    let icon = '<i class="fas fa-check-circle" style="color: #28a745;"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>';
    if (type === 'warning') icon = '<i class="fas fa-magic" style="color: #ffd700;"></i>';

    toast.innerHTML = icon + ' <span>' + message + '</span>';
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 5. KHỞI TẠO CÁC MODAL VÀ THANH CÔNG CỤ ADMIN
  function injectAdminUI() {
    if (document.getElementById('lh-admin-bar')) return;

    // A. Thanh công cụ Admin Bar
    const bar = document.createElement('div');
    bar.id = 'lh-admin-bar';
    bar.style.display = 'none';
    bar.innerHTML = `
      <div class="lh-admin-badge">
        <i class="fas fa-user-shield"></i> Admin Editor
      </div>
      <div class="lh-admin-counter" id="lhAdminCounter">
        <i class="fas fa-file-code"></i> ${getCurrentPageFileName()}
      </div>
      <div class="lh-admin-lang-indicator" id="lhAdminLangBadge">
        <i class="fas fa-globe"></i> <span id="lhAdminLangText">VI</span>
      </div>
      <div class="lh-admin-counter" id="lhChangeCountBadge">
        <i class="fas fa-pen"></i> <span>0 thay đổi</span>
      </div>
      <div class="lh-admin-actions">
        <button class="lh-admin-btn lh-admin-btn-save" id="lhBtnSaveGitHub" title="Lưu và đẩy commit lên GitHub">
          <i class="fas fa-cloud-upload-alt"></i> Lưu lên GitHub
        </button>
        <button class="lh-admin-btn" id="lhBtnDownloadHtml" title="Tải file HTML đã sửa về máy dự phòng">
          <i class="fas fa-download"></i> Tải HTML
        </button>
        <button class="lh-admin-btn lh-admin-btn-preview" id="lhBtnTogglePreview" title="Bật/Tắt chế độ xem thử">
          <i class="fas fa-eye"></i> Xem thử
        </button>
        <button class="lh-admin-btn lh-admin-btn-exit" id="lhBtnExitAdmin" title="Đăng xuất chế độ Admin">
          <i class="fas fa-sign-out-alt"></i> Thoát
        </button>
      </div>
    `;
    document.body.appendChild(bar);

    // B. Modal Đăng Nhập
    const loginModal = document.createElement('div');
    loginModal.id = 'lh-admin-login-modal';
    loginModal.className = 'lh-modal-backdrop';
    loginModal.innerHTML = `
      <div class="lh-modal-card">
        <div class="lh-modal-header">
          <h3><i class="fas fa-shield-alt"></i> Đăng Nhập Quản Trị Website</h3>
          <button class="lh-modal-close" id="lhLoginModalClose">&times;</button>
        </div>
        <div class="lh-modal-body">
          <p style="margin-top: 0; color: #bbb;">
            Chỉnh sửa nội dung & hình ảnh trực tiếp trên site (Tự động dịch sang tiếng Anh) và lưu về GitHub repository 
            <strong style="color: #ffd700;">pmo8/LacHongDigital</strong> mà không cần máy chủ Database.
          </p>
          <div class="lh-form-group">
            <label for="lhGhToken"><i class="fas fa-key"></i> GitHub Personal Access Token *</label>
            <input type="password" id="lhGhToken" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off" />
            <div class="lh-form-help">
              Mã token của bạn được lưu an toàn trong trình duyệt (localStorage).<br>
              👉 <a href="https://github.com/settings/tokens/new?scopes=repo&description=LacHongDigital_Admin_CMS" target="_blank">Bấm vào đây để tạo nhanh GitHub Token</a> (chọn quyền <code>repo</code>).
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <div class="lh-form-group" style="flex: 2;">
              <label for="lhGhRepo">Repository</label>
              <input type="text" id="lhGhRepo" value="${DEFAULT_CONFIG.owner}/${DEFAULT_CONFIG.repo}" />
            </div>
            <div class="lh-form-group" style="flex: 1;">
              <label for="lhGhBranch">Nhánh (Branch)</label>
              <input type="text" id="lhGhBranch" value="${DEFAULT_CONFIG.branch}" />
            </div>
          </div>
        </div>
        <div class="lh-modal-footer">
          <button class="lh-admin-btn" id="lhBtnGuestMode" title="Chỉnh sửa thử nghiệm và chỉ lưu file về máy">
            <i class="fas fa-laptop-code"></i> Thử nghiệm (Không Token)
          </button>
          <button class="lh-admin-btn lh-admin-btn-save" id="lhBtnSubmitLogin">
            <i class="fas fa-unlock-alt"></i> Đăng Nhập & Bật Sửa
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(loginModal);

    // C. Modal Đổi Hình Ảnh (Image Manager Modal)
    const imageModal = document.createElement('div');
    imageModal.id = 'lh-admin-image-modal';
    imageModal.className = 'lh-modal-backdrop';
    imageModal.innerHTML = `
      <div class="lh-modal-card">
        <div class="lh-modal-header">
          <h3><i class="fas fa-camera"></i> Thay Đổi Hình Ảnh</h3>
          <button class="lh-modal-close" id="lhImageModalClose">&times;</button>
        </div>
        <div class="lh-modal-body">
          <p style="margin-top: 0; color: #ccc; font-size: 13px;">
            Bạn có thể tải ảnh mới từ máy tính lên (tự động upload lên thư mục <code>assets/images/uploads/</code> trên GitHub) hoặc dán đường dẫn ảnh.
          </p>

          <div class="lh-img-preview-box">
            <img id="lhImgPreview" src="" alt="Xem trước hình ảnh" />
          </div>

          <div class="lh-dropzone" id="lhDropzone">
            <i class="fas fa-cloud-upload-alt"></i>
            <strong style="color: #ffd700; font-size: 14px;">Chọn hoặc Kéo thả ảnh vào đây</strong>
            <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">Hỗ trợ định dạng JPG, PNG, WEBP, SVG</p>
            <input type="file" id="lhFileInput" accept="image/*" style="display: none;" />
          </div>

          <div class="lh-form-group">
            <label for="lhImageUrlInput"><i class="fas fa-link"></i> Hoặc dán đường dẫn ảnh (URL hoặc đường dẫn nội bộ):</label>
            <input type="text" id="lhImageUrlInput" placeholder="https://... hoặc assets/images/..." />
          </div>
        </div>
        <div class="lh-modal-footer">
          <button class="lh-admin-btn" id="lhImageModalCancel">Hủy Bỏ</button>
          <button class="lh-admin-btn lh-admin-btn-save" id="lhBtnApplyImage">
            <i class="fas fa-check"></i> Áp Dụng Thay Đổi
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(imageModal);

    // D. Modal Xác Nhận Lưu GitHub Song Ngữ & Hình Ảnh
    const saveModal = document.createElement('div');
    saveModal.id = 'lh-admin-save-modal';
    saveModal.className = 'lh-modal-backdrop';
    saveModal.innerHTML = `
      <div class="lh-modal-card">
        <div class="lh-modal-header">
          <h3><i class="fas fa-cloud-upload-alt"></i> Xác Nhận Lưu Thay Đổi Lên GitHub</h3>
          <button class="lh-modal-close" id="lhSaveModalClose">&times;</button>
        </div>
        <div class="lh-modal-body">
          <p style="margin-top: 0; color: #ddd;">
            Trang: <strong style="color: #ffd700;" id="lhSavePageName">${getCurrentPageFileName()}</strong> &bull; 
            Tổng số mục sửa: <strong style="color: #28a745;" id="lhSaveChangeCount">0</strong>
          </p>
          <div style="background: rgba(40, 167, 69, 0.12); border: 1px solid rgba(40, 167, 69, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 15px; font-size: 12px; color: #81c784;">
            <i class="fas fa-magic" style="color: #ffd700;"></i> 
            <strong>Tự động hóa:</strong> Câu tiếng Anh đã được AI dịch sẵn, hình ảnh mới tải lên sẽ tự động được commit thẳng vào kho lưu trữ GitHub!
          </div>
          <div class="lh-changes-list" id="lhChangesList"></div>
          <div class="lh-form-group">
            <label for="lhCommitMsg">Thông điệp cập nhật (Commit message):</label>
            <input type="text" id="lhCommitMsg" value="Cập nhật nội dung trang ${getCurrentPageFileName()} từ Admin In-Page Editor" />
          </div>
          <div class="lh-form-help">
            Sau khi lưu thành công, website <strong style="color: #ffd700;">lachongdigital.vn</strong> sẽ tự động cập nhật sau 30-60 giây.
          </div>
        </div>
        <div class="lh-modal-footer">
          <button class="lh-admin-btn" id="lhSaveModalCancel">Hủy Bỏ</button>
          <button class="lh-admin-btn lh-admin-btn-save" id="lhBtnConfirmPushGitHub">
            <i class="fas fa-check"></i> Xác Nhận & Đẩy Commit
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(saveModal);

    bindEvents();
  }

  // 6. QUÉT TOÀN DIỆN 100% CÁC PHẦN TỬ CHỮ & HÌNH ẢNH ĐỂ CHO PHÉP CHỈNH SỬA
  function enableEditMode() {
    isEditingActive = true;
    document.body.classList.add('lh-admin-active');

    const bar = document.getElementById('lh-admin-bar');
    if (bar) bar.style.display = 'flex';
    updateLangIndicator();

    // ── A. QUÉT CÁC PHẦN TỬ CHỮ (TEXT CONTENT) ──
    const candidateTags = 'h1, h2, h3, h4, h5, h6, p, a, button, span, strong, em, b, i, li, label, th, td, blockquote, div';
    const allTextElements = document.body.querySelectorAll(candidateTags);

    allTextElements.forEach(el => {
      if (el.closest('#lh-admin-bar, .lh-modal-backdrop, #lh-admin-toast, .lang-switch, script, style, svg, noscript')) {
        return;
      }

      // Bỏ qua nếu là thẻ chứa ảnh hoặc khối ảnh
      if (el.tagName === 'IMG' || el.classList.contains('hero-bg')) return;

      const hasBlockChildren = el.querySelector('h1, h2, h3, h4, h5, h6, p, div, ul, ol, table, form, section, article');
      if (hasBlockChildren) {
        return;
      }

      const text = el.textContent.trim();
      if (!text || text.length === 0) {
        return;
      }

      el.setAttribute('data-lh-editable', 'true');
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');

      if (!el._lhOriginalHtml) {
        el._lhOriginalHtml = el.innerHTML;
        el._lhOriginalText = text;
      }

      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) {
        el.removeEventListener('click', handleEditableClick);
        el.addEventListener('click', handleEditableClick);
      }

      el.removeEventListener('input', handleElementInput);
      el.addEventListener('input', handleElementInput);
      el.removeEventListener('blur', handleElementBlur);
      el.addEventListener('blur', handleElementBlur);
    });

    // ── B. QUÉT CÁC PHẦN TỬ HÌNH ẢNH (IMG & BACKGROUND-IMAGE) ──
    const allImgElements = document.querySelectorAll('img, .hero-bg, [style*="background-image"]');
    allImgElements.forEach(el => {
      if (el.closest('#lh-admin-bar, .lh-modal-backdrop, #lh-admin-toast, .lang-switch')) return;

      el.setAttribute('data-lh-image', 'true');
      el.setAttribute('title', 'Click để thay đổi hình ảnh này');

      if (!el._lhOriginalSrc) {
        if (el.tagName === 'IMG') {
          el._lhOriginalSrc = el.getAttribute('src');
        } else {
          const bgMatch = (el.getAttribute('style') || '').match(/background-image:\s*url\((['"]?)([^'")]+)\1\)/i);
          el._lhOriginalSrc = bgMatch ? bgMatch[2] : '';
        }
      }

      el.removeEventListener('click', handleImageClick);
      el.addEventListener('click', handleImageClick);
    });

    sessionStorage.setItem('lh_admin_active', 'true');
    window.dispatchEvent(new CustomEvent('adminModeChanged', { detail: { active: true } }));
    showToast('Chế độ Quản trị đã kích hoạt! Bạn có thể click vào chữ để sửa hoặc click vào ảnh để đổi.', 'success', 5000);
  }

  function handleEditableClick(e) {
    if (isEditingActive && !isPreviewMode) {
      if (this.closest('.slider-arrow, .slider-dot, .modal-close, #projectModalClose, #searchModalClose')) {
        return; // Cho phép chuyển slide hoặc đóng modal bình thường
      }
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }
  }

  // Xử lý khi Admin click vào một hình ảnh trên web
  function handleImageClick(e) {
    if (!isEditingActive || isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    currentTargetImageEl = this;
    openImageModal(this);
  }

  function openImageModal(el) {
    const modal = document.getElementById('lh-admin-image-modal');
    const previewImg = document.getElementById('lhImgPreview');
    const urlInput = document.getElementById('lhImageUrlInput');
    const fileInput = document.getElementById('lhFileInput');

    if (!modal) return;
    if (fileInput) fileInput.value = '';

    let currentSrc = '';
    if (el.tagName === 'IMG') {
      currentSrc = el.getAttribute('src');
    } else {
      const bgMatch = (el.getAttribute('style') || '').match(/background-image:\s*url\((['"]?)([^'")]+)\1\)/i);
      currentSrc = bgMatch ? bgMatch[2] : '';
    }

    if (previewImg) previewImg.src = currentSrc || '';
    if (urlInput) urlInput.value = currentSrc || '';

    modal.classList.add('show');
  }

  function updateLangIndicator() {
    const textEl = document.getElementById('lhAdminLangText');
    if (textEl) {
      const en = isCurrentLangEn();
      textEl.textContent = en ? 'EN' : 'VI';
      textEl.style.color = en ? '#64b5f6' : '#ffd700';
    }
  }

  function handleElementInput(e) {
    const el = e.currentTarget;
    const currentHtml = el.innerHTML;
    const currentText = el.textContent.trim();
    const isEn = isCurrentLangEn();

    if (isEn) {
      const viKey = el._lhVi || el._lhOriginalText || currentText;
      if (currentText !== el._lhOriginalText) {
        el.classList.add('lh-item-changed');
        changedTranslations.set(viKey.trim().replace(/\s+/g, ' '), currentText);
      } else {
        el.classList.remove('lh-item-changed');
        changedTranslations.delete(viKey.trim().replace(/\s+/g, ' '));
      }
    } else {
      if (currentHtml !== el._lhOriginalHtml) {
        el.classList.add('lh-item-changed');

        let record = changedElements.get(el);
        if (!record) {
          record = {
            originalHtml: el._lhOriginalHtml,
            originalText: el._lhOriginalText,
            newHtml: currentHtml,
            newText: currentText,
            autoEnTranslation: '',
            tagName: el.tagName.toLowerCase()
          };
          changedElements.set(el, record);
        } else {
          record.newHtml = currentHtml;
          record.newText = currentText;
        }

        clearTimeout(translationDebounceTimer);
        translationDebounceTimer = setTimeout(async () => {
          if (currentText && currentText.length > 1) {
            const translated = await autoTranslateViToEn(currentText);
            if (translated) {
              record.autoEnTranslation = translated;
              changedTranslations.set(currentText, translated);
              if (window.LacHongI18n && typeof window.LacHongI18n.addTranslation === 'function') {
                window.LacHongI18n.addTranslation(currentText, translated);
              }
            }
          }
        }, 600);

      } else {
        el.classList.remove('lh-item-changed');
        changedElements.delete(el);
      }
    }
    updateChangeCounter();
  }

  async function handleElementBlur(e) {
    const el = e.currentTarget;
    const currentText = el.textContent.trim();
    if (!currentText || currentText === el._lhOriginalText) return;

    if (!isCurrentLangEn()) {
      const record = changedElements.get(el);
      if (record && !record.autoEnTranslation) {
        const translated = await autoTranslateViToEn(currentText);
        if (translated) {
          record.autoEnTranslation = translated;
          changedTranslations.set(currentText, translated);
          if (window.LacHongI18n && typeof window.LacHongI18n.addTranslation === 'function') {
            window.LacHongI18n.addTranslation(currentText, translated);
          }
          showToast(`✨ Đã tự động dịch EN: "${translated.length > 35 ? translated.substring(0, 35) + '...' : translated}"`, 'warning', 2500);
        }
      }
    }
  }

  function disableEditMode() {
    isEditingActive = false;
    document.body.classList.remove('lh-admin-active');
    document.body.classList.remove('lh-admin-preview');

    const bar = document.getElementById('lh-admin-bar');
    if (bar) bar.style.display = 'none';

    document.querySelectorAll('[data-lh-editable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-lh-editable');
      el.classList.remove('lh-item-changed');
      el.removeEventListener('click', handleEditableClick);
    });

    document.querySelectorAll('[data-lh-image="true"]').forEach(el => {
      el.removeAttribute('data-lh-image');
      el.removeAttribute('title');
      el.classList.remove('lh-item-changed');
      el.removeEventListener('click', handleImageClick);
    });

    changedElements.clear();
    changedTranslations.clear();
    changedImages.clear();
    sessionStorage.removeItem('lh_admin_active');
    window.dispatchEvent(new CustomEvent('adminModeChanged', { detail: { active: false } }));
    updateChangeCounter();
    showToast('Đã thoát chế độ Quản trị.', 'warning');
  }

  function updateChangeCounter() {
    const badge = document.querySelector('#lhChangeCountBadge span');
    const saveBtn = document.getElementById('lhBtnSaveGitHub');
    const totalCount = changedElements.size + changedTranslations.size + changedImages.size;

    if (badge) {
      badge.textContent = totalCount + ' thay đổi';
      if (totalCount > 0) {
        badge.parentElement.classList.add('has-changes');
      } else {
        badge.parentElement.classList.remove('has-changes');
      }
    }
    if (saveBtn) {
      saveBtn.disabled = (totalCount === 0 && !sessionStorage.getItem('lh_admin_guest'));
    }
  }

  // 7. GỌI GITHUB REST API ĐỂ LƯU NỘI DUNG, UPLOAD ẢNH VÀ TẠO COMMIT
  async function pushChangesToGitHub(commitMessage) {
    const token = localStorage.getItem('lh_gh_token');
    const repoFullName = localStorage.getItem('lh_gh_repo') || `${DEFAULT_CONFIG.owner}/${DEFAULT_CONFIG.repo}`;
    const branch = localStorage.getItem('lh_gh_branch') || DEFAULT_CONFIG.branch;
    const fileName = getCurrentPageFileName();

    if (!token) {
      showToast('Không tìm thấy GitHub Token! Vui lòng đăng nhập lại.', 'error');
      openLoginModal();
      return;
    }

    const saveConfirmBtn = document.getElementById('lhBtnConfirmPushGitHub');
    if (saveConfirmBtn) {
      saveConfirmBtn.disabled = true;
      saveConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang kết nối GitHub...';
    }

    // Thu thập các bản dịch tiếng Anh
    const enInputs = document.querySelectorAll('.lh-en-input-field');
    enInputs.forEach(input => {
      const viKey = input.getAttribute('data-vi-key');
      const enVal = input.value.trim();
      if (viKey && enVal) {
        changedTranslations.set(viKey, enVal);
      }
    });

    try {
      let savedSummary = [];

      // ── BƯỚC 1: UPLOAD CÁC FILE HÌNH ẢNH MỚI LÊN GITHUB ──
      for (const [el, imgInfo] of changedImages.entries()) {
        if (imgInfo.isUpload && imgInfo.base64Content) {
          if (saveConfirmBtn) saveConfirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang upload ảnh ${imgInfo.fileName}...`;

          const imgApiUrl = `https://api.github.com/repos/${repoFullName}/contents/${imgInfo.targetPath}`;
          
          // Kiểm tra xem ảnh này đã tồn tại chưa để lấy sha (nếu có)
          let fileSha = undefined;
          const checkRes = await fetch(`${imgApiUrl}?ref=${branch}`, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            fileSha = checkData.sha;
          }

          const putImgRes = await fetch(imgApiUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `Upload ảnh mới: ${imgInfo.fileName} từ Admin Live Editor`,
              content: imgInfo.base64Content,
              sha: fileSha,
              branch: branch
            })
          });

          if (!putImgRes.ok) {
            const errJson = await putImgRes.json().catch(() => ({}));
            throw new Error(errJson.message || `Lỗi khi upload ảnh ${imgInfo.fileName} lên GitHub.`);
          }
        }
      }

      if (changedImages.size > 0) {
        savedSummary.push(`${changedImages.size} ảnh mới`);
      }

      // ── BƯỚC 2: CẬP NHẬT FILE HTML TRANG HIỆN TẠI ──
      if (changedElements.size > 0 || changedImages.size > 0) {
        if (saveConfirmBtn) saveConfirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang lưu ${fileName}...`;

        const fileApiUrl = `https://api.github.com/repos/${repoFullName}/contents/${fileName}?ref=${branch}`;
        const getRes = await fetch(fileApiUrl, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!getRes.ok) {
          throw new Error(`Không thể đọc file ${fileName} từ GitHub (Mã lỗi ${getRes.status}).`);
        }

        const fileData = await getRes.json();
        const currentSourceHtml = base64ToUtf8(fileData.content);

        let updatedSourceHtml = currentSourceHtml;

        // Cập nhật văn bản
        changedElements.forEach((val) => {
          const oldSnippet = val.originalHtml.trim();
          const newSnippet = val.newHtml.trim();

          if (oldSnippet && updatedSourceHtml.includes(oldSnippet)) {
            updatedSourceHtml = updatedSourceHtml.replace(oldSnippet, newSnippet);
          } else {
            const oldText = val.originalText;
            const newText = val.newText;
            if (oldText && updatedSourceHtml.includes(oldText)) {
              updatedSourceHtml = updatedSourceHtml.replace(oldText, newText);
            }
          }
        });

        // Cập nhật đường dẫn hình ảnh
        changedImages.forEach((imgInfo) => {
          const oldSrc = imgInfo.originalSrc;
          const newSrc = imgInfo.isUpload ? imgInfo.targetPath : imgInfo.newSrc;

          if (oldSrc && newSrc && oldSrc !== newSrc) {
            // Thay thế src="..." hoặc url('...')
            updatedSourceHtml = updatedSourceHtml.split(oldSrc).join(newSrc);
          }
        });

        const putRes = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${fileName}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage || `Cập nhật nội dung & hình ảnh trang ${fileName} từ Admin Live Editor`,
            content: utf8ToBase64(updatedSourceHtml),
            sha: fileData.sha,
            branch: branch
          })
        });

        if (!putRes.ok) {
          const errJson = await putRes.json().catch(() => ({}));
          throw new Error(errJson.message || `Lỗi khi lưu file ${fileName} lên GitHub.`);
        }

        savedSummary.push(`trang ${fileName}`);
      }

      // ── BƯỚC 3: CẬP NHẬT TỪ ĐIỂN BẢN DỊCH TIẾNG ANH (js/translations.js) ──
      if (changedTranslations.size > 0) {
        if (saveConfirmBtn) saveConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu bản dịch tiếng Anh...';

        const transApiUrl = `https://api.github.com/repos/${repoFullName}/contents/js/translations.js?ref=${branch}`;
        const getTransRes = await fetch(transApiUrl, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getTransRes.ok) {
          const transData = await getTransRes.json();
          const transJsSource = base64ToUtf8(transData.content);

          const match = transJsSource.match(/const\s+PHRASE_MAP\s*=\s*(\{[\s\S]*?\n\s*\});/);
          if (match) {
            let phraseMap = {};
            try {
              phraseMap = JSON.parse(match[1]);
            } catch (e) {
              console.error('Không thể parse PHRASE_MAP:', e);
            }

            changedTranslations.forEach((enVal, viKey) => {
              phraseMap[viKey] = enVal;
            });

            const newPhraseMapCode = 'const PHRASE_MAP = ' + JSON.stringify(phraseMap, null, 2) + ';';
            const updatedTransJs = transJsSource.replace(/const\s+PHRASE_MAP\s*=\s*(\{[\s\S]*?\n\s*\});/, newPhraseMapCode);

            const putTransRes = await fetch(`https://api.github.com/repos/${repoFullName}/contents/js/translations.js`, {
              method: 'PUT',
              headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Cập nhật từ điển song ngữ tiếng Anh tự động từ Admin In-Page Editor`,
                content: utf8ToBase64(updatedTransJs),
                sha: transData.sha,
                branch: branch
              })
            });

            if (putTransRes.ok) {
              savedSummary.push('từ điển tiếng Anh (translations.js)');
            }
          }
        }
      }

      // Đặt lại trạng thái sau khi lưu thành công
      changedElements.forEach((val, el) => {
        el._lhOriginalHtml = el.innerHTML;
        el._lhOriginalText = el.textContent.trim();
        el.classList.remove('lh-item-changed');
      });
      changedImages.forEach((imgInfo, el) => {
        el._lhOriginalSrc = imgInfo.isUpload ? imgInfo.targetPath : imgInfo.newSrc;
        el.classList.remove('lh-item-changed');
      });

      changedElements.clear();
      changedTranslations.clear();
      changedImages.clear();
      updateChangeCounter();

      closeModal('lh-admin-save-modal');
      const savedText = savedSummary.join(' & ');
      showToast(`🎉 Lưu thành công ${savedText}! Website sẽ tự động cập nhật sau 30-60 giây.`, 'success', 6000);

    } catch (err) {
      console.error('[Admin CMS Error]', err);
      showToast(err.message || 'Lỗi khi lưu lên GitHub!', 'error', 6000);
    } finally {
      if (saveConfirmBtn) {
        saveConfirmBtn.disabled = false;
        saveConfirmBtn.innerHTML = '<i class="fas fa-check"></i> Xác Nhận & Đẩy Commit';
      }
    }
  }

  // 8. XUẤT / TẢI FILE HTML ĐÃ CẬP NHẬT VỀ MÁY
  function downloadUpdatedHtml() {
    const docClone = document.documentElement.cloneNode(true);
    docClone.querySelectorAll('#lh-admin-bar, .lh-modal-backdrop, #lh-admin-toast').forEach(el => el.remove());
    docClone.querySelectorAll('[data-lh-editable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-lh-editable');
      el.removeAttribute('spellcheck');
      el.classList.remove('lh-item-changed');
    });
    docClone.querySelectorAll('[data-lh-image]').forEach(el => {
      el.removeAttribute('data-lh-image');
      el.removeAttribute('title');
      el.classList.remove('lh-item-changed');
    });

    const bodyEl = docClone.querySelector('body');
    if (bodyEl) {
      bodyEl.classList.remove('lh-admin-active', 'lh-admin-preview');
    }

    const htmlContent = '<!DOCTYPE html>\n' + docClone.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCurrentPageFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Đã tải file ${getCurrentPageFileName()} về máy!`, 'success');
  }

  // 9. ĐIỀU KHIỂN CÁC MODAL
  function openLoginModal() {
    const modal = document.getElementById('lh-admin-login-modal');
    if (modal) {
      const tokenInput = document.getElementById('lhGhToken');
      if (tokenInput) tokenInput.value = localStorage.getItem('lh_gh_token') || '';
      modal.classList.add('show');
    }
  }

  async function openSaveModal() {
    const modal = document.getElementById('lh-admin-save-modal');
    if (!modal) return;

    const list = document.getElementById('lhChangesList');
    const countEl = document.getElementById('lhSaveChangeCount');
    const pageEl = document.getElementById('lhSavePageName');

    const totalCount = changedElements.size + changedTranslations.size + changedImages.size;
    if (pageEl) pageEl.textContent = getCurrentPageFileName();
    if (countEl) countEl.textContent = totalCount;

    if (list) {
      list.innerHTML = '';
      if (totalCount === 0) {
        list.innerHTML = '<div style="color: #888; text-align: center; padding: 10px;">Chưa có mục nào bị thay đổi.</div>';
      } else {
        // A. Hiển thị các hình ảnh đã đổi
        changedImages.forEach((imgInfo) => {
          const card = document.createElement('div');
          card.className = 'lh-change-card';
          card.innerHTML = `
            <div class="lh-change-header">
              <span class="lh-badge-img"><i class="fas fa-camera"></i> HÌNH ẢNH MỚI</span>
              <span style="font-size: 11px; color: #888;">${imgInfo.isUpload ? 'Upload file' : 'Đổi link URL'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px;">
              <img src="${imgInfo.previewUrl}" style="width: 55px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #ffd700;" />
              <div style="font-size: 12px; word-break: break-all;">
                <strong>${imgInfo.fileName || imgInfo.newSrc}</strong>
                <div style="color: #888; font-size: 11px;">Đường dẫn: <code>${imgInfo.isUpload ? imgInfo.targetPath : imgInfo.newSrc}</code></div>
              </div>
            </div>
          `;
          list.appendChild(card);
        });

        // B. Hiển thị các mục tiếng Việt đã sửa và tự động điền bản dịch tiếng Anh
        for (const [el, val] of changedElements.entries()) {
          const card = document.createElement('div');
          card.className = 'lh-change-card';
          const oldSnippet = val.originalText.length > 50 ? val.originalText.substring(0, 50) + '...' : val.originalText;
          const newSnippet = val.newText.length > 50 ? val.newText.substring(0, 50) + '...' : val.newText;

          let enText = val.autoEnTranslation || '';
          if (!enText) {
            enText = await autoTranslateViToEn(val.newText);
            val.autoEnTranslation = enText;
            if (enText) {
              changedTranslations.set(val.newText, enText);
            }
          }

          card.innerHTML = `
            <div class="lh-change-header">
              <span class="lh-badge-vi"><i class="fas fa-flag"></i> TIẾNG VIỆT</span>
              <span style="font-size: 11px; color: #888;">Thẻ &lt;${val.tagName}&gt;</span>
            </div>
            <div>
              <span style="color: #ff6b6b; text-decoration: line-through;">${escapeHtml(oldSnippet)}</span>
              &rarr;
              <strong style="color: #28a745;">${escapeHtml(newSnippet)}</strong>
            </div>
            <div class="lh-en-input-wrap">
              <label>
                <span class="lh-badge-en"><i class="fas fa-globe"></i> BẢN DỊCH TIẾNG ANH (TỰ ĐỘNG)</span>
                <span style="color: #ffd700; font-size: 11px;"><i class="fas fa-check-circle"></i> Đã tự sinh tự động</span>
              </label>
              <input type="text" class="lh-en-input-field" data-vi-key="${escapeHtml(val.newText)}" value="${escapeHtml(enText)}" placeholder="Đang tự động dịch..." />
            </div>
          `;
          list.appendChild(card);
        }

        // C. Hiển thị các bản dịch Tiếng Anh đã sửa khi duyệt chế độ EN
        changedTranslations.forEach((enVal, viKey) => {
          let alreadyShown = false;
          changedElements.forEach(val => {
            if (val.newText === viKey) alreadyShown = true;
          });
          if (alreadyShown) return;

          const card = document.createElement('div');
          card.className = 'lh-change-card';
          card.innerHTML = `
            <div class="lh-change-header">
              <span class="lh-badge-en"><i class="fas fa-globe"></i> TIẾNG ANH (TỪ ĐIỂN)</span>
              <span style="font-size: 11px; color: #888;">translations.js</span>
            </div>
            <div style="font-size: 11px; color: #bbb;">Gốc VI: <em>${escapeHtml(viKey)}</em></div>
            <div style="margin-top: 4px;">
              Bản dịch EN mới: <strong style="color: #64b5f6;">${escapeHtml(enVal)}</strong>
            </div>
          `;
          list.appendChild(card);
        });
      }
    }

    modal.classList.add('show');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 10. GẮN CÁC SỰ KIỆN TƯƠNG TÁC
  function bindEvents() {
    document.getElementById('lhLoginModalClose')?.addEventListener('click', () => closeModal('lh-admin-login-modal'));
    document.getElementById('lhSaveModalClose')?.addEventListener('click', () => closeModal('lh-admin-save-modal'));
    document.getElementById('lhSaveModalCancel')?.addEventListener('click', () => closeModal('lh-admin-save-modal'));
    document.getElementById('lhImageModalClose')?.addEventListener('click', () => closeModal('lh-admin-image-modal'));
    document.getElementById('lhImageModalCancel')?.addEventListener('click', () => closeModal('lh-admin-image-modal'));

    // Đăng nhập có Token
    document.getElementById('lhBtnSubmitLogin')?.addEventListener('click', () => {
      const token = document.getElementById('lhGhToken')?.value.trim();
      const repo = document.getElementById('lhGhRepo')?.value.trim() || `${DEFAULT_CONFIG.owner}/${DEFAULT_CONFIG.repo}`;
      const branch = document.getElementById('lhGhBranch')?.value.trim() || DEFAULT_CONFIG.branch;

      if (!token) {
        alert('Vui lòng nhập GitHub Personal Access Token để có thể lưu tự động lên GitHub repository!');
        return;
      }

      localStorage.setItem('lh_gh_token', token);
      localStorage.setItem('lh_gh_repo', repo);
      localStorage.setItem('lh_gh_branch', branch);
      sessionStorage.removeItem('lh_admin_guest');

      closeModal('lh-admin-login-modal');
      enableEditMode();
    });

    // Chế độ Guest không token
    document.getElementById('lhBtnGuestMode')?.addEventListener('click', () => {
      sessionStorage.setItem('lh_admin_guest', 'true');
      closeModal('lh-admin-login-modal');
      enableEditMode();
      showToast('Đang ở chế độ Thử nghiệm: Bạn có thể sửa trực tiếp và tải file HTML về máy.', 'warning', 4500);
    });

    // ── XỬ LÝ UPLOAD ẢNH TRONG MODAL ──
    const dropzone = document.getElementById('lhDropzone');
    const fileInput = document.getElementById('lhFileInput');
    const previewImg = document.getElementById('lhImgPreview');
    const urlInput = document.getElementById('lhImageUrlInput');

    let currentSelectedFile = null;
    let currentSelectedBase64 = null;

    dropzone?.addEventListener('click', () => fileInput?.click());

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processSelectedImageFile(e.dataTransfer.files[0]);
      }
    });

    fileInput?.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        processSelectedImageFile(this.files[0]);
      }
    });

    function processSelectedImageFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn một file hình ảnh (JPG, PNG, WEBP, SVG)!');
        return;
      }
      currentSelectedFile = file;

      const reader = new FileReader();
      reader.onload = function (e) {
        const fullDataUrl = e.target.result;
        currentSelectedBase64 = fullDataUrl.split(',')[1];
        if (previewImg) previewImg.src = fullDataUrl;
        if (urlInput) urlInput.value = file.name;
      };
      reader.readAsDataURL(file);
    }

    urlInput?.addEventListener('input', function () {
      if (this.value.trim()) {
        currentSelectedFile = null;
        currentSelectedBase64 = null;
        if (previewImg) previewImg.src = this.value.trim();
      }
    });

    // Áp dụng hình ảnh mới vào trang web
    document.getElementById('lhBtnApplyImage')?.addEventListener('click', () => {
      if (!currentTargetImageEl) return;

      const newUrl = urlInput?.value.trim();
      if (!currentSelectedBase64 && !newUrl) {
        alert('Vui lòng chọn file ảnh hoặc dán đường dẫn ảnh!');
        return;
      }

      const isImg = currentTargetImageEl.tagName === 'IMG';
      const originalSrc = currentTargetImageEl._lhOriginalSrc || (isImg ? currentTargetImageEl.getAttribute('src') : '');

      let displayUrl = '';
      let isUpload = false;
      let cleanFileName = '';
      let targetPath = '';

      if (currentSelectedFile && currentSelectedBase64) {
        isUpload = true;
        // Tạo tên file an toàn kèm timestamp để không bị trùng lặp
        const timeStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
        const safeName = currentSelectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        cleanFileName = `img_${timeStr}_${safeName}`;
        targetPath = `assets/images/uploads/${cleanFileName}`;
        displayUrl = previewImg?.src || targetPath;
      } else {
        displayUrl = newUrl;
        targetPath = newUrl;
      }

      // Cập nhật hiển thị ngay lập tức trên website
      if (isImg) {
        currentTargetImageEl.src = displayUrl;
      } else {
        currentTargetImageEl.style.backgroundImage = `url("${displayUrl}")`;
      }
      currentTargetImageEl.classList.add('lh-item-changed');

      // Lưu vào danh sách changedImages
      changedImages.set(currentTargetImageEl, {
        isUpload: isUpload,
        fileName: cleanFileName,
        targetPath: targetPath,
        originalSrc: originalSrc,
        newSrc: newUrl,
        base64Content: currentSelectedBase64,
        previewUrl: displayUrl
      });

      closeModal('lh-admin-image-modal');
      updateChangeCounter();
      showToast('Đã áp dụng ảnh mới trên giao diện! Đừng quên bấm "Lưu lên GitHub" để lưu vĩnh viễn.', 'success', 3500);
    });

    // Mở modal lưu GitHub
    document.getElementById('lhBtnSaveGitHub')?.addEventListener('click', () => {
      if (sessionStorage.getItem('lh_admin_guest') && !localStorage.getItem('lh_gh_token')) {
        openLoginModal();
        return;
      }
      openSaveModal();
    });

    // Xác nhận đẩy GitHub
    document.getElementById('lhBtnConfirmPushGitHub')?.addEventListener('click', () => {
      const msg = document.getElementById('lhCommitMsg')?.value.trim();
      pushChangesToGitHub(msg);
    });

    // Tải file HTML
    document.getElementById('lhBtnDownloadHtml')?.addEventListener('click', downloadUpdatedHtml);

    // Bật/tắt chế độ xem thử
    document.getElementById('lhBtnTogglePreview')?.addEventListener('click', function () {
      isPreviewMode = !isPreviewMode;
      if (isPreviewMode) {
        document.body.classList.add('lh-admin-preview');
        this.classList.add('active');
        this.innerHTML = '<i class="fas fa-edit"></i> Tiếp tục sửa';
      } else {
        document.body.classList.remove('lh-admin-preview');
        this.classList.remove('active');
        this.innerHTML = '<i class="fas fa-eye"></i> Xem thử';
      }
    });

    // Nút thoát Admin
    document.getElementById('lhBtnExitAdmin')?.addEventListener('click', () => {
      const totalCount = changedElements.size + changedTranslations.size + changedImages.size;
      if (totalCount > 0) {
        if (!confirm('Bạn có ' + totalCount + ' thay đổi chưa lưu lên GitHub. Bạn có chắc muốn thoát mà không lưu?')) {
          return;
        }
      }
      disableEditMode();
    });

    // Bắt phím tắt Ctrl + Shift + E để kích hoạt Admin
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleAdmin();
      }
    });

    // Lắng nghe sự kiện chuyển đổi ngôn ngữ để cập nhật badge VI / EN
    window.addEventListener('languageChanged', () => {
      updateLangIndicator();
    });

    // Cho phép kích hoạt qua các nút có class .lh-admin-trigger-link
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.lh-admin-trigger-link');
      if (trigger) {
        e.preventDefault();
        toggleAdmin();
      }
    });
  }

  function toggleAdmin() {
    if (isEditingActive) {
      if (confirm('Bạn đang ở chế độ Quản trị. Bạn có muốn thoát không?')) {
        disableEditMode();
      }
    } else {
      if (localStorage.getItem('lh_gh_token') || sessionStorage.getItem('lh_admin_guest')) {
        enableEditMode();
      } else {
        openLoginModal();
      }
    }
  }

  // 11. TỰ ĐỘNG KHỞI TẠO NẾU TRƯỚC ĐÓ ĐÃ BẬT HOẶC CÓ THAM SỐ URL ?admin=true
  function init() {
    injectAdminUI();

    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminParam = urlParams.has('admin') || urlParams.get('mode') === 'admin';
    const wasActive = sessionStorage.getItem('lh_admin_active') === 'true';

    if (hasAdminParam) {
      if (localStorage.getItem('lh_gh_token') || sessionStorage.getItem('lh_admin_guest')) {
        enableEditMode();
      } else {
        openLoginModal();
      }
    } else if (wasActive) {
      enableEditMode();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cung cấp API toàn cục
  window.LacHongAdmin = {
    enable: enableEditMode,
    disable: disableEditMode,
    toggle: toggleAdmin,
    openLogin: openLoginModal,
    openImageEditor: openImageModal,
    save: openSaveModal,
    download: downloadUpdatedHtml
  };
})();
