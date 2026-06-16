/**
 * admin-social.js — Mojo social post composer and posted-content calendar.
 */

(function () {
  const CLOUD_FUNCTION_REGION = 'us-central1';
  const CLOUD_FUNCTION_PROJECT = 'mojo-f86de';

  const PLATFORM_URLS = {
    x: 'https://x.com/compose/post',
    linkedin: 'https://www.linkedin.com/feed/',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/upload',
    youtube: 'https://studio.youtube.com/',
    threads: 'https://www.threads.net/',
    other: 'https://www.google.com/search?q=social+media+composer',
  };

  const PLATFORM_PREVIEW = {
    x: { icon: 'X', handle: '@MojoAiStudio', actions: ['Reply', 'Repost', 'Like'], max: 280 },
    linkedin: { icon: 'in', handle: 'Mojo AI Studio', actions: ['Like', 'Comment', 'Repost'], max: 3000 },
    facebook: { icon: 'f', handle: 'Mojo AI Studio', actions: ['Like', 'Comment', 'Share'], max: 63206 },
    instagram: { icon: '◎', handle: '@mojoaistudio', actions: ['Like', 'Comment', 'Send'], max: 2200 },
    tiktok: { icon: '♪', handle: '@mojoaistudio', actions: ['Like', 'Comment', 'Share'], max: 2200 },
    youtube: { icon: '▶', handle: '@MojoAiStudio', actions: ['Like', 'Comment', 'Share'], max: 5000 },
    threads: { icon: '@', handle: '@mojoaistudio', actions: ['Reply', 'Repost', 'Like'], max: 500 },
    other: { icon: '#', handle: 'Mojo AI Studio', actions: ['Review', 'Share', 'Save'], max: 2200 },
  };

  let adminKey = null;
  let posts = [];
  let calendarFilters = { platform: 'all', siteFunction: 'all', campaign: 'all' };
  let calendarMonth = new Date();
  let selectedMedia = null;
  calendarMonth.setDate(1);

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const adminKeyInput = document.getElementById('admin-key');
  const logoutBtn = document.getElementById('logout-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const tabs = document.querySelectorAll('.tab');
  const message = document.getElementById('message');
  const postForm = document.getElementById('post-form');
  const newPostBtn = document.getElementById('new-post-btn');
  const copyPostBtn = document.getElementById('copy-post-btn');
  const openPlatformLink = document.getElementById('open-platform-link');

  const urlKey = new URLSearchParams(window.location.search).get('key');
  const savedKey = sessionStorage.getItem('socialAdminKey');

  if (urlKey || savedKey) {
    adminKey = urlKey || savedKey;
    sessionStorage.setItem('socialAdminKey', adminKey);
    if (urlKey) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    showDashboard();
  } else {
    showLogin();
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const key = adminKeyInput.value.trim();
    if (!key) {
      showMessage('Please enter admin key', 'error');
      return;
    }
    adminKey = key;
    sessionStorage.setItem('socialAdminKey', key);
    showDashboard();
  });

  logoutBtn.addEventListener('click', function () {
    adminKey = null;
    sessionStorage.removeItem('socialAdminKey');
    showLogin();
  });

  refreshBtn.addEventListener('click', loadPosts);
  newPostBtn.addEventListener('click', resetForm);
  copyPostBtn.addEventListener('click', copyCurrentPostText);
  document.getElementById('post-media-file').addEventListener('change', handleMediaFileChange);
  document.getElementById('calendar-prev')?.addEventListener('click', function () {
    calendarMonth.setMonth(calendarMonth.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('calendar-next')?.addEventListener('click', function () {
    calendarMonth.setMonth(calendarMonth.getMonth() + 1);
    renderCalendar();
  });

  [
    'post-title',
    'post-platform',
    'post-function',
    'post-client',
    'post-campaign',
    'post-body',
    'post-asset-url',
  ].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('input', renderPlatformPreview);
    field.addEventListener('change', renderPlatformPreview);
  });
  document.getElementById('post-body').addEventListener('input', autoSizePostBody);

  document.getElementById('post-platform').addEventListener('change', updatePlatformLink);
  document.querySelectorAll('[data-calendar-filter]').forEach((field) => {
    field.addEventListener('change', handleCalendarFilter);
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      tabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');

      if (tab.dataset.tab === 'calendar') renderCalendar();
    });
  });

  postForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    await savePost();
  });

  async function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    resetForm();
    await loadPosts();
  }

  function showLogin() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    adminKeyInput.value = '';
  }

  async function loadPosts() {
    try {
      const response = await adminRequest('adminListSocialPosts');
      posts = response.posts || [];
      renderFilterOptions();
      renderCalendar();
    } catch (err) {
      console.error('[admin-social] loadPosts error:', err);
      handleAdminError(err, 'Error loading social posts');
    }
  }

  async function savePost() {
    const payload = readForm();
    if (!payload.title || !payload.body) {
      showMessage('Title and post text are required', 'error');
      return;
    }

    try {
      const result = await adminRequest('adminSaveSocialPost', {
        method: 'POST',
        body: payload,
      });
      showMessage('Posted record saved to calendar', 'success');
      await loadPosts();
      const saved = posts.find((post) => post.id === result.post?.id);
      if (saved) fillForm(saved);
    } catch (err) {
      console.error('[admin-social] savePost error:', err);
      showMessage(err.message || 'Error saving post', 'error');
    }
  }

  function renderCalendar() {
    const board = document.getElementById('calendar-board');
    const label = document.getElementById('calendar-month-label');
    if (!board || !label) return;

    label.textContent = calendarMonth.toLocaleDateString([], {
      month: 'long',
      year: 'numeric',
    });

    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - monthStart.getDay());

    const monthPosts = calendarPosts();
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cells = weekdayNames.map((day) => `<div class="calendar-heading-cell">${day}</div>`);
    const today = new Date();

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const items = monthPosts.filter((post) => isSameLocalDay(postDate(post), date));
      const outside = date.getMonth() !== calendarMonth.getMonth();
      const classes = [
        'calendar-day',
        outside ? 'is-outside' : '',
        isSameLocalDay(date, today) ? 'is-today' : '',
      ].filter(Boolean).join(' ');

      cells.push(`
        <div class="${classes}">
          <div class="calendar-day-number">${date.getDate()}</div>
          ${items.map(renderCalendarItem).join('')}
        </div>
      `);
    }

    board.innerHTML = cells.join('');
    board.querySelectorAll('[data-calendar-post-id]').forEach((button) => {
      button.addEventListener('click', function () {
        const post = posts.find((item) => item.id === button.dataset.calendarPostId);
        if (post) fillForm(post);
      });
    });
  }

  function renderCalendarItem(post) {
    return `
      <button class="calendar-item" data-calendar-post-id="${escapeAttribute(post.id)}" type="button">
        <h3>${escapeHtml(post.title || 'Untitled')}</h3>
        <span>${escapeHtml(platformLabel(post.platform))}${post.campaign ? ` · ${escapeHtml(post.campaign)}` : ''}</span>
      </button>
    `;
  }

  function calendarPosts() {
    return posts.filter((post) => {
      const matchesPlatform = calendarFilters.platform === 'all' || post.platform === calendarFilters.platform;
      const matchesFunction = calendarFilters.siteFunction === 'all' || post.siteFunction === calendarFilters.siteFunction;
      const matchesCampaign = calendarFilters.campaign === 'all' || post.campaign === calendarFilters.campaign;
      return matchesPlatform && matchesFunction && matchesCampaign;
    });
  }

  function handleCalendarFilter(event) {
    const field = event.target.dataset.calendarFilter;
    calendarFilters[field] = event.target.value || 'all';
    renderCalendar();
  }

  function fillForm(post) {
    document.getElementById('post-id').value = post.id || '';
    document.getElementById('post-title').value = post.title || '';
    document.getElementById('post-platform').value = post.platform || 'x';
    document.getElementById('post-function').value = post.siteFunction || 'general';
    document.getElementById('post-client').value = post.clientName || '';
    document.getElementById('post-campaign').value = post.campaign || '';
    document.getElementById('post-body').value = post.body || '';
    document.getElementById('post-asset-url').value = post.assetUrl || '';
    document.getElementById('post-url').value = post.postUrl || '';
    document.getElementById('post-notes').value = post.notes || '';
    clearSelectedMedia();
    updatePlatformLink();
    renderPlatformPreview();
    autoSizePostBody();
    showTab('compose');
    document.getElementById('tab-compose').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    postForm.reset();
    document.getElementById('post-id').value = '';
    document.getElementById('post-platform').value = 'x';
    document.getElementById('post-function').value = 'general';
    clearSelectedMedia();
    updatePlatformLink();
    renderPlatformPreview();
    autoSizePostBody();
  }

  function readForm() {
    return {
      id: document.getElementById('post-id').value.trim(),
      title: document.getElementById('post-title').value.trim(),
      platform: document.getElementById('post-platform').value,
      status: 'posted',
      siteFunction: document.getElementById('post-function').value,
      clientName: document.getElementById('post-client').value.trim(),
      campaign: document.getElementById('post-campaign').value.trim(),
      scheduledAtIso: null,
      body: document.getElementById('post-body').value.trim(),
      assetUrl: document.getElementById('post-asset-url').value.trim(),
      postUrl: document.getElementById('post-url').value.trim(),
      notes: document.getElementById('post-notes').value.trim(),
    };
  }

  async function copyCurrentPostText() {
    await copyPostText(readForm());
  }

  async function copyPostText(post) {
    const text = String(post.body || '').trim();
    if (!text) {
      showMessage('There is no post text to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showMessage('Post text copied', 'success');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showMessage('Post text copied', 'success');
    }
  }

  function handleMediaFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (selectedMedia?.url) URL.revokeObjectURL(selectedMedia.url);
    selectedMedia = null;
    if (!file) {
      renderPlatformPreview();
      return;
    }

    selectedMedia = {
      url: URL.createObjectURL(file),
      type: file.type || '',
      name: file.name || 'Selected media',
    };
    renderPlatformPreview();
  }

  function clearSelectedMedia() {
    if (selectedMedia?.url) URL.revokeObjectURL(selectedMedia.url);
    selectedMedia = null;
    const input = document.getElementById('post-media-file');
    if (input) input.value = '';
  }

  function autoSizePostBody() {
    const textarea = document.getElementById('post-body');
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(260, textarea.scrollHeight + 2)}px`;
  }

  function renderFilterOptions() {
    setSelectOptions(
      document.querySelector('[data-calendar-filter="platform"]'),
      uniqueValues(posts.map((post) => post.platform)),
      calendarFilters.platform,
      platformLabel
    );
    setSelectOptions(
      document.querySelector('[data-calendar-filter="siteFunction"]'),
      uniqueValues(posts.map((post) => post.siteFunction)),
      calendarFilters.siteFunction,
      functionLabel
    );
    setSelectOptions(
      document.querySelector('[data-calendar-filter="campaign"]'),
      uniqueValues(posts.map((post) => post.campaign)),
      calendarFilters.campaign,
      (value) => value
    );
  }

  function setSelectOptions(select, values, selected, labeler) {
    const current = selected || 'all';
    select.innerHTML = '<option value="all">All</option>' + values
      .map((value) => `<option value="${escapeAttribute(value)}">${escapeHtml(labeler(value))}</option>`)
      .join('');
    select.value = values.includes(current) ? current : 'all';
  }

  function uniqueValues(values) {
    return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))].sort();
  }

  function updatePlatformLink() {
    const platform = document.getElementById('post-platform').value || 'x';
    openPlatformLink.href = platformUrl(platform);
    renderPlatformPreview();
  }

  function renderPlatformPreview() {
    const platform = document.getElementById('post-platform').value || 'x';
    const preview = PLATFORM_PREVIEW[platform] || PLATFORM_PREVIEW.other;
    const title = document.getElementById('post-title').value.trim() || 'Untitled post';
    const body = document.getElementById('post-body').value.trim() || 'Write the platform-ready social post here.';
    const siteFunction = document.getElementById('post-function').value || 'general';
    const client = document.getElementById('post-client').value.trim();
    const campaign = document.getElementById('post-campaign').value.trim();
    const assetUrl = document.getElementById('post-asset-url').value.trim();
    const count = body === 'Write the platform-ready social post here.' ? 0 : body.length;
    const overLimit = preview.max && count > preview.max;

    document.getElementById('platform-preview').dataset.platform = platform;
    document.getElementById('preview-icon').textContent = preview.icon;
    document.getElementById('preview-platform-name').textContent = platformLabel(platform);
    document.getElementById('preview-handle').textContent = preview.handle;
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-body').textContent = body;
    document.getElementById('preview-meta').textContent = [
      functionLabel(siteFunction),
      client || 'Mojo',
      campaign || 'No campaign',
    ].filter(Boolean).join(' · ');
    document.getElementById('preview-actions').innerHTML = preview.actions
      .map((action) => `<span>${escapeHtml(action)}</span>`)
      .join('');

    const countEl = document.getElementById('post-character-count');
    countEl.textContent = preview.max ? `${count} / ${preview.max} characters` : `${count} characters`;
    countEl.style.color = overLimit ? '#b91c1c' : '';

    const asset = document.getElementById('preview-asset');
    if (selectedMedia?.url && selectedMedia.type.startsWith('video/')) {
      asset.innerHTML = `<video src="${escapeAttribute(selectedMedia.url)}" controls></video>`;
    } else if (selectedMedia?.url) {
      asset.innerHTML = `<img src="${escapeAttribute(selectedMedia.url)}" alt="${escapeAttribute(selectedMedia.name)}">`;
    } else if (isVideoUrl(assetUrl)) {
      asset.innerHTML = `<video src="${escapeAttribute(assetUrl)}" controls></video>`;
    } else if (isImageUrl(assetUrl)) {
      asset.innerHTML = `<img src="${escapeAttribute(assetUrl)}" alt="Post visual preview">`;
    } else if (assetUrl) {
      asset.textContent = assetUrl;
    } else {
      asset.textContent = visualPlaceholder(platform);
    }
  }

  function visualPlaceholder(platform) {
    const labels = {
      x: 'Link card or image preview',
      linkedin: 'Article, image, or document preview',
      facebook: 'Link, image, or reel preview',
      instagram: 'Image or reel preview',
      tiktok: 'Video cover preview',
      youtube: 'Short or video thumbnail',
      threads: 'Image or link preview',
      other: 'Visual or link preview',
    };
    return labels[platform] || labels.other;
  }

  function isImageUrl(value) {
    return /^https?:\/\/.+\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(String(value || '').trim());
  }

  function isVideoUrl(value) {
    return /^https?:\/\/.+\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(String(value || '').trim());
  }

  function showTab(tabName) {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
  }

  async function adminRequest(endpoint, options = {}) {
    const response = await fetch(
      `https://${CLOUD_FUNCTION_REGION}-${CLOUD_FUNCTION_PROJECT}.cloudfunctions.net/${endpoint}`,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Admin request failed');
    }

    return data;
  }

  function handleAdminError(err, fallback) {
    const text = err.message || fallback;
    if (/unauthorized/i.test(text)) {
      adminKey = null;
      sessionStorage.removeItem('socialAdminKey');
      showLogin();
      alert('Admin key rejected. Please sign in again with the current admin key.');
      return;
    }
    showMessage(text, 'error');
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
    setTimeout(() => {
      message.classList.remove('show');
    }, 4000);
  }

  function platformUrl(platform) {
    return PLATFORM_URLS[platform] || PLATFORM_URLS.other;
  }

  function platformLabel(platform) {
    const labels = {
      x: 'X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      threads: 'Threads',
      other: 'Other',
    };
    return labels[platform] || platform || 'Other';
  }

  function functionLabel(value) {
    const labels = {
      marketplace: 'Marketplace',
      'custom-development': 'Custom development',
      learn: 'Learn / Watch',
      'product-launch': 'Product launch',
      'client-work': 'Client work',
      event: 'Event',
      general: 'General Mojo',
    };
    return labels[value] || value || 'General Mojo';
  }

  function postDate(post) {
    const value = post.postedAtIso || post.updatedAtMillis || post.createdAtMillis || Date.now();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  function isSameLocalDay(left, right) {
    return left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }
}());
