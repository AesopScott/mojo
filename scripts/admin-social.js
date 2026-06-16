/**
 * admin-social.js — Mojo social post workspace and calendar.
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
  let filters = { status: 'active', platform: 'all', search: '' };
  let calendarFilters = { window: 'week', platform: 'all', siteFunction: 'all', campaign: 'all' };

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
  const markPostedBtn = document.getElementById('mark-posted-btn');
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
  markPostedBtn.addEventListener('click', markCurrentPostPosted);

  document.getElementById('post-platform').addEventListener('change', updatePlatformLink);
  [
    'post-title',
    'post-platform',
    'post-status',
    'post-function',
    'post-client',
    'post-campaign',
    'post-scheduled-at',
    'post-body',
    'post-asset-url',
  ].forEach((id) => {
    document.getElementById(id).addEventListener('input', renderPlatformPreview);
    document.getElementById(id).addEventListener('change', renderPlatformPreview);
  });
  document.querySelector('[data-filter="status"]').addEventListener('change', handlePostFilter);
  document.querySelector('[data-filter="platform"]').addEventListener('change', handlePostFilter);
  document.querySelector('[data-filter="search"]').addEventListener('input', handlePostFilter);
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

      if (tab.dataset.tab === 'calendar') {
        renderCalendar();
      } else {
        renderPosts();
      }
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
      renderPosts();
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
      showMessage('Post saved', 'success');
      await loadPosts();
      const saved = posts.find((post) => post.id === result.post?.id);
      if (saved) fillForm(saved);
    } catch (err) {
      console.error('[admin-social] savePost error:', err);
      showMessage(err.message || 'Error saving post', 'error');
    }
  }

  async function updatePostStatus(postId, status, extra = {}) {
    try {
      await adminRequest('adminUpdateSocialPostStatus', {
        method: 'POST',
        body: { postId, status, ...extra },
      });
      await loadPosts();
      showMessage(`Post marked ${status}`, 'success');
    } catch (err) {
      console.error('[admin-social] updatePostStatus error:', err);
      showMessage(err.message || 'Error updating post', 'error');
    }
  }

  async function deletePost(postId) {
    if (!confirm('Delete this social post record?')) return;

    try {
      await adminRequest('adminDeleteSocialPost', {
        method: 'POST',
        body: { postId },
      });
      resetForm();
      await loadPosts();
      showMessage('Post deleted', 'success');
    } catch (err) {
      console.error('[admin-social] deletePost error:', err);
      showMessage(err.message || 'Error deleting post', 'error');
    }
  }

  function renderPosts() {
    const list = document.getElementById('post-list');
    const visiblePosts = filteredPosts()
      .sort((a, b) => sortDate(b) - sortDate(a));

    if (!visiblePosts.length) {
      list.innerHTML = '<div class="empty-state">No posts match these filters.</div>';
      return;
    }

    list.innerHTML = '';
    visiblePosts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-card-header">
          <div>
            <h3>${escapeHtml(post.title || 'Untitled post')}</h3>
            <div class="meta-row">
              <span>${escapeHtml(platformLabel(post.platform))}</span>
              <span>${escapeHtml(functionLabel(post.siteFunction))}</span>
              ${post.clientName ? `<span>${escapeHtml(post.clientName)}</span>` : ''}
              ${post.campaign ? `<span>${escapeHtml(post.campaign)}</span>` : ''}
            </div>
          </div>
          <span class="status-badge status-${escapeHtml(post.status || 'draft')}">${escapeHtml(statusLabel(post.status))}</span>
        </div>
        <p class="post-body-preview">${escapeHtml(shorten(post.body || '', 280))}</p>
        <div class="meta-row">
          <span>Created ${escapeHtml(formatDateTime(post.createdAtMillis))}</span>
          ${post.scheduledAtIso ? `<span>Scheduled ${escapeHtml(formatDateTime(post.scheduledAtIso))}</span>` : ''}
          ${post.postedAtIso ? `<span>Posted ${escapeHtml(formatDateTime(post.postedAtIso))}</span>` : ''}
        </div>
        <div class="post-actions" style="margin-top: 14px;">
          <button class="btn-primary" data-action="load" data-post-id="${escapeAttribute(post.id)}" type="button">Load</button>
          <button class="btn-dark" data-action="copy" data-post-id="${escapeAttribute(post.id)}" type="button">Copy</button>
          <a class="button-link btn-ghost" href="${escapeAttribute(platformUrl(post.platform))}" target="_blank" rel="noopener">Open</a>
          <button class="btn-ghost" data-action="staged" data-post-id="${escapeAttribute(post.id)}" type="button">Staged</button>
          <button class="btn-ghost" data-action="posted" data-post-id="${escapeAttribute(post.id)}" type="button">Posted</button>
          <button class="btn-danger" data-action="delete" data-post-id="${escapeAttribute(post.id)}" type="button">Delete</button>
        </div>
      `;
      card.addEventListener('click', handlePostCardAction);
      list.appendChild(card);
    });
  }

  function renderCalendar() {
    const board = document.getElementById('calendar-board');
    const groups = calendarGroups(calendarPosts());

    board.innerHTML = groups.map((group) => `
      <section class="calendar-group">
        <h2>${escapeHtml(group.label)}</h2>
        <p>${escapeHtml(group.description)}</p>
        <div class="calendar-items">
          ${group.items.length ? group.items.map(renderCalendarItem).join('') : '<div class="empty-state">No posts</div>'}
        </div>
      </section>
    `).join('');

    board.querySelectorAll('[data-calendar-action]').forEach((button) => {
      button.addEventListener('click', handleCalendarActionClick);
    });
  }

  function renderCalendarItem(post) {
    return `
      <article class="calendar-item">
        <div class="calendar-item-header">
          <h3>${escapeHtml(post.title || 'Untitled')}</h3>
          <span class="status-badge status-${escapeHtml(post.status || 'draft')}">${escapeHtml(statusLabel(post.status))}</span>
        </div>
        <time datetime="${escapeAttribute(post.scheduledAtIso || post.postedAtIso || '')}">${escapeHtml(formatDateTime(post.scheduledAtIso || post.postedAtIso || post.updatedAtMillis))}</time>
        <div class="meta-row">
          <span>${escapeHtml(platformLabel(post.platform))}</span>
          <span>${escapeHtml(functionLabel(post.siteFunction))}</span>
          ${post.clientName ? `<span>${escapeHtml(post.clientName)}</span>` : ''}
          ${post.campaign ? `<span>${escapeHtml(post.campaign)}</span>` : ''}
        </div>
        <p class="post-body-preview">${escapeHtml(shorten(post.body || '', 160))}</p>
        <div class="calendar-actions">
          <button class="btn-primary" data-calendar-action="load" data-post-id="${escapeAttribute(post.id)}" type="button">Load</button>
          <button class="btn-dark" data-calendar-action="copy" data-post-id="${escapeAttribute(post.id)}" type="button">Copy</button>
          <a class="button-link btn-ghost" href="${escapeAttribute(platformUrl(post.platform))}" target="_blank" rel="noopener">Open</a>
          <button class="btn-ghost" data-calendar-action="posted" data-post-id="${escapeAttribute(post.id)}" type="button">Posted</button>
          <button class="btn-ghost" data-calendar-action="canceled" data-post-id="${escapeAttribute(post.id)}" type="button">Cancel</button>
        </div>
      </article>
    `;
  }

  function calendarGroups(items) {
    const now = new Date();
    const groups = [
      { id: 'overdue', label: 'Overdue', description: 'Scheduled dates before today.', items: [] },
      { id: 'today', label: 'Today', description: 'Posts due today.', items: [] },
      { id: 'upcoming', label: 'Upcoming', description: 'Future scheduled work.', items: [] },
      { id: 'completed', label: 'Completed', description: 'Posted or canceled records.', items: [] },
    ];

    items.forEach((post) => {
      if (['posted', 'canceled'].includes(post.status)) {
        groups[3].items.push(post);
        return;
      }

      const scheduledAt = new Date(post.scheduledAtIso || post.updatedAtMillis || post.createdAtMillis || Date.now());
      if (Number.isNaN(scheduledAt.getTime())) {
        groups[2].items.push(post);
      } else if (scheduledAt.getTime() < startOfToday(now).getTime()) {
        groups[0].items.push(post);
      } else if (isSameLocalDay(scheduledAt, now)) {
        groups[1].items.push(post);
      } else {
        groups[2].items.push(post);
      }
    });

    groups.forEach((group) => {
      group.items.sort((a, b) => sortDate(a) - sortDate(b));
    });
    return groups;
  }

  function filteredPosts() {
    return posts.filter((post) => {
      const matchesStatus = filters.status === 'all'
        || (filters.status === 'active' && !['posted', 'canceled'].includes(post.status))
        || post.status === filters.status;
      const matchesPlatform = filters.platform === 'all' || post.platform === filters.platform;
      const haystack = [
        post.title,
        post.body,
        post.clientName,
        post.campaign,
        post.siteFunction,
        post.notes,
      ].join(' ').toLowerCase();
      const matchesSearch = !filters.search || haystack.includes(filters.search.toLowerCase());
      return matchesStatus && matchesPlatform && matchesSearch;
    });
  }

  function calendarPosts() {
    return posts.filter((post) => {
      const matchesPlatform = calendarFilters.platform === 'all' || post.platform === calendarFilters.platform;
      const matchesFunction = calendarFilters.siteFunction === 'all' || post.siteFunction === calendarFilters.siteFunction;
      const matchesCampaign = calendarFilters.campaign === 'all' || post.campaign === calendarFilters.campaign;
      return matchesPlatform && matchesFunction && matchesCampaign && matchesCalendarWindow(post);
    });
  }

  function matchesCalendarWindow(post) {
    if (calendarFilters.window === 'all') return true;
    const value = post.scheduledAtIso || post.postedAtIso || post.updatedAtMillis || post.createdAtMillis;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return true;
    const now = new Date();
    if (calendarFilters.window === 'today') return isSameLocalDay(date, now);
    if (calendarFilters.window === 'upcoming') return date.getTime() >= now.getTime();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    return date.getTime() <= weekEnd.getTime();
  }

  function handlePostFilter(event) {
    const field = event.target.dataset.filter;
    filters[field] = event.target.value || '';
    renderPosts();
  }

  function handleCalendarFilter(event) {
    const field = event.target.dataset.calendarFilter;
    calendarFilters[field] = event.target.value || 'all';
    renderCalendar();
  }

  async function handlePostCardAction(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const post = posts.find((item) => item.id === target.dataset.postId);
    if (!post) return;

    if (target.dataset.action === 'load') fillForm(post);
    if (target.dataset.action === 'copy') await copyPostText(post);
    if (target.dataset.action === 'staged') await updatePostStatus(post.id, 'staged');
    if (target.dataset.action === 'posted') await promptAndMarkPosted(post);
    if (target.dataset.action === 'delete') await deletePost(post.id);
  }

  async function handleCalendarActionClick(event) {
    const post = posts.find((item) => item.id === event.currentTarget.dataset.postId);
    if (!post) return;
    const action = event.currentTarget.dataset.calendarAction;

    if (action === 'load') fillForm(post);
    if (action === 'copy') await copyPostText(post);
    if (action === 'posted') await promptAndMarkPosted(post);
    if (action === 'canceled') await updatePostStatus(post.id, 'canceled');
  }

  function fillForm(post) {
    document.getElementById('post-id').value = post.id || '';
    document.getElementById('post-title').value = post.title || '';
    document.getElementById('post-platform').value = post.platform || 'x';
    document.getElementById('post-status').value = post.status || 'draft';
    document.getElementById('post-function').value = post.siteFunction || 'general';
    document.getElementById('post-client').value = post.clientName || '';
    document.getElementById('post-campaign').value = post.campaign || '';
    document.getElementById('post-scheduled-at').value = toDateTimeLocal(post.scheduledAtIso);
    document.getElementById('post-body').value = post.body || '';
    document.getElementById('post-asset-url').value = post.assetUrl || '';
    document.getElementById('post-url').value = post.postUrl || '';
    document.getElementById('post-notes').value = post.notes || '';
    updatePlatformLink();
    renderPlatformPreview();
    document.getElementById('tab-compose').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    postForm.reset();
    document.getElementById('post-id').value = '';
    document.getElementById('post-platform').value = 'x';
    document.getElementById('post-status').value = 'draft';
    document.getElementById('post-function').value = 'general';
    updatePlatformLink();
    renderPlatformPreview();
  }

  function readForm() {
    const status = document.getElementById('post-status').value || 'draft';
    const scheduledAtIso = fromDateTimeLocal(document.getElementById('post-scheduled-at').value);
    return {
      id: document.getElementById('post-id').value.trim(),
      title: document.getElementById('post-title').value.trim(),
      platform: document.getElementById('post-platform').value,
      status,
      siteFunction: document.getElementById('post-function').value,
      clientName: document.getElementById('post-client').value.trim(),
      campaign: document.getElementById('post-campaign').value.trim(),
      scheduledAtIso,
      body: document.getElementById('post-body').value.trim(),
      assetUrl: document.getElementById('post-asset-url').value.trim(),
      postUrl: document.getElementById('post-url').value.trim(),
      notes: document.getElementById('post-notes').value.trim(),
    };
  }

  async function copyCurrentPostText() {
    await copyPostText(readForm());
  }

  async function markCurrentPostPosted() {
    const post = readForm();
    if (!post.id) {
      showMessage('Save this post before marking it posted', 'error');
      return;
    }
    await promptAndMarkPosted(post);
  }

  async function promptAndMarkPosted(post) {
    const postUrl = prompt('Paste the live post URL if you have it:', post.postUrl || '');
    if (postUrl === null) return;
    await updatePostStatus(post.id, 'posted', { postUrl: postUrl.trim() });
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

  function renderFilterOptions() {
    setSelectOptions(
      document.querySelector('[data-filter="platform"]'),
      uniqueValues(posts.map((post) => post.platform)),
      filters.platform,
      platformLabel
    );
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
    const status = document.getElementById('post-status').value || 'draft';
    const scheduledAt = fromDateTimeLocal(document.getElementById('post-scheduled-at').value);
    const assetUrl = document.getElementById('post-asset-url').value.trim();
    const count = body === 'Write the platform-ready social post here.' ? 0 : body.length;
    const overLimit = preview.max && count > preview.max;

    document.getElementById('platform-preview').dataset.platform = platform;
    document.getElementById('preview-icon').textContent = preview.icon;
    document.getElementById('preview-platform-name').textContent = platformLabel(platform);
    document.getElementById('preview-handle').textContent = preview.handle;
    document.getElementById('preview-status').textContent = statusLabel(status);
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-body').textContent = body;
    document.getElementById('preview-meta').textContent = [
      functionLabel(siteFunction),
      client || 'Mojo',
      campaign || 'No campaign',
      scheduledAt ? formatDateTime(scheduledAt) : null,
    ].filter(Boolean).join(' · ');
    document.getElementById('preview-actions').innerHTML = preview.actions
      .map((action) => `<span>${escapeHtml(action)}</span>`)
      .join('');

    const countEl = document.getElementById('post-character-count');
    countEl.textContent = preview.max ? `${count} / ${preview.max} characters` : `${count} characters`;
    countEl.style.color = overLimit ? '#b91c1c' : '';

    const asset = document.getElementById('preview-asset');
    if (isImageUrl(assetUrl)) {
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

  function statusLabel(value) {
    const labels = {
      draft: 'Draft',
      scheduled: 'Scheduled',
      staged: 'Staged',
      posted: 'Posted',
      canceled: 'Canceled',
    };
    return labels[value] || value || 'Draft';
  }

  function sortDate(post) {
    return new Date(post.scheduledAtIso || post.postedAtIso || post.updatedAtMillis || post.createdAtMillis || 0).getTime();
  }

  function startOfToday(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function isSameLocalDay(left, right) {
    return left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate();
  }

  function formatDateTime(value) {
    if (!value) return 'No date';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No date';
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function toDateTimeLocal(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function fromDateTimeLocal(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function shorten(value, length) {
    const text = String(value || '');
    return text.length > length ? `${text.slice(0, length - 3)}...` : text;
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
