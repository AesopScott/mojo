(function () {
  const state = {
    categories: [],
    threads: [],
    user: null,
    memberCount: 0,
    pendingEmail: '',
    selectedCategory: '',
    selectedThreadId: new URLSearchParams(window.location.search).get('thread') || '',
    search: '',
    currentPage: 1,
    pageSize: 5,
    composerMode: 'thread',
    editingThreadId: '',
    editingPostId: '',
  };

  const els = {
    categories: document.querySelector('[data-categories]'),
    threadList: document.querySelector('[data-thread-list]'),
    threadPagination: document.querySelector('[data-thread-pagination]'),
    threadDetail: document.querySelector('[data-thread-detail]'),
    replies: document.querySelector('[data-replies]'),
    empty: document.querySelector('[data-empty]'),
    search: document.querySelector('[data-search]'),
    currentCategory: document.querySelector('[data-current-category]'),
    viewTitle: document.querySelector('[data-view-title]'),
    threadForm: document.querySelector('[data-thread-form]'),
    replyForm: document.querySelector('[data-reply-form]'),
    threadStatus: document.querySelector('[data-thread-status]'),
    replyStatus: document.querySelector('[data-reply-status]'),
    authStatus: document.querySelector('[data-auth-status]'),
    authPanel: document.querySelector('[data-auth-panel]'),
    authEmailForm: document.querySelector('[data-auth-email-form]'),
    authCodeForm: document.querySelector('[data-auth-code-form]'),
    authSummary: document.querySelector('[data-auth-summary]'),
    memberCount: document.querySelector('[data-member-count]'),
    categorySelect: document.getElementById('thread-category'),
    openComposer: document.querySelector('[data-open-composer]'),
    openPoll: document.querySelector('[data-open-poll]'),
    closeComposer: document.querySelector('[data-close-composer]'),
    composerTitle: document.querySelector('[data-composer-title]'),
    composerSubmit: document.querySelector('[data-composer-submit]'),
    pollFields: Array.from(document.querySelectorAll('.forum-poll-fields')),
    replyTitle: document.querySelector('[data-reply-title]'),
    replySubmit: document.querySelector('[data-reply-submit]'),
  };

  els.openComposer.addEventListener('click', function () {
    openThreadComposer();
  });

  els.openPoll.addEventListener('click', function () {
    openPollComposer();
  });

  els.closeComposer.addEventListener('click', closeThreadComposer);
  document.querySelector('[data-logout]').addEventListener('click', logout);

  els.search.addEventListener('input', function () {
    state.search = els.search.value.trim().toLowerCase();
    state.currentPage = 1;
    renderThreads();
  });

  els.authEmailForm.addEventListener('submit', requestLoginCode);
  els.authCodeForm.addEventListener('submit', verifyLoginCode);
  els.threadForm.addEventListener('submit', submitThread);
  els.replyForm.addEventListener('submit', submitReply);

  loadForum();
  window.setInterval(autoRefreshForum, 5 * 60 * 1000);

  async function loadForum() {
    setStatus(els.threadStatus, '');
    try {
      await loadMe();
      await loadCategories();

      if (state.selectedThreadId) {
        await loadThread(state.selectedThreadId);
      } else {
        await loadThreads();
      }
    } catch (err) {
      showEmpty(err.message || 'Forum is not available yet.');
    }
  }

  async function loadMe() {
    const payload = await api('/api/forum/auth/me');
    state.user = payload.user || null;
    renderAuth();
  }

  async function loadCategories() {
    const payload = await api('/api/forum/categories');
    state.categories = payload.categories || [];
    state.memberCount = Number(payload.stats?.memberCount || 0);
    renderMemberCount();
    renderCategories();
  }

  async function loadThreads() {
    const query = state.selectedCategory ? `?category=${encodeURIComponent(state.selectedCategory)}` : '';
    const payload = await api(`/api/forum/threads${query}`);
    state.threads = payload.threads || [];
    state.selectedThreadId = '';
    state.currentPage = 1;
    setUrlThread('');
    renderThreads();
  }

  async function loadThread(id) {
    const payload = await api(`/api/forum/thread?id=${encodeURIComponent(id)}`);
    state.selectedThreadId = id;
    setUrlThread(id);
    renderThreadDetail(payload.thread);
  }

  function renderAuth() {
    const signedIn = Boolean(state.user);
    els.authPanel.classList.toggle('is-signed-in', signedIn);
    els.authSummary.textContent = signedIn
      ? `Signed in as ${state.user.displayName}${state.user.isAdmin ? ' · Admin' : ''}`
      : 'Sign in with email to post, reply, and vote.';
    els.authEmailForm.hidden = signedIn;
    els.authCodeForm.hidden = signedIn || !state.pendingEmail;
    document.querySelector('[data-logout]').hidden = !signedIn;
    els.openPoll.hidden = !(state.user && state.user.isAdmin);
  }

  function renderMemberCount() {
    const count = state.memberCount;
    els.memberCount.textContent = `${count.toLocaleString()} forum ${count === 1 ? 'member' : 'members'}`;
  }

  function renderCategories() {
    els.categories.replaceChildren();
    els.categorySelect.replaceChildren();

    const allButton = categoryButton({
      slug: '',
      name: 'All threads',
      threadCount: state.categories.reduce((sum, category) => sum + category.threadCount, 0),
    });
    els.categories.append(allButton);

    state.categories.forEach((category) => {
      els.categories.append(categoryButton(category));
      const option = document.createElement('option');
      option.value = category.slug;
      option.textContent = category.name;
      els.categorySelect.append(option);
    });
  }

  function categoryButton(category) {
    const button = document.createElement('button');
    button.className = 'forum-category';
    button.type = 'button';
    button.classList.toggle('is-active', state.selectedCategory === category.slug);

    const name = document.createElement('b');
    name.textContent = category.name;
    const count = document.createElement('span');
    count.textContent = `${category.threadCount || 0} threads`;

    button.append(name, count);
    button.addEventListener('click', async function () {
      state.selectedCategory = category.slug;
      state.currentPage = 1;
      renderCategories();
      await loadThreads();
    });
    return button;
  }

  function renderThreads() {
    els.threadDetail.hidden = true;
    els.threadDetail.classList.remove('is-pinned');
    els.replies.replaceChildren();
    resetReplyComposer();
    els.replyForm.classList.remove('is-open');
    els.threadList.replaceChildren();
    els.threadPagination.hidden = true;
    els.threadPagination.replaceChildren();

    const selected = state.categories.find((category) => category.slug === state.selectedCategory);
    els.currentCategory.textContent = selected ? selected.name : 'All categories';
    els.viewTitle.textContent = selected ? `${selected.name} threads` : 'Latest threads';

    const threads = state.threads
      .filter((thread) => {
        if (!state.search) return true;
        return [thread.title, thread.body, thread.authorName, thread.categoryName]
          .join(' ')
          .toLowerCase()
          .includes(state.search);
      })
      .sort(compareThreads);

    if (!threads.length) {
      showEmpty('No threads yet.');
      return;
    }

    els.empty.hidden = true;
    const totalPages = Math.max(1, Math.ceil(threads.length / state.pageSize));
    state.currentPage = Math.min(Math.max(state.currentPage, 1), totalPages);
    const start = (state.currentPage - 1) * state.pageSize;

    threads.slice(start, start + state.pageSize).forEach((thread) => {
      els.threadList.append(threadCard(thread));
    });
    renderPagination(totalPages);
  }

  function threadCard(thread) {
    const article = document.createElement('article');
    article.className = 'forum-thread';
    article.classList.toggle('is-pinned', Boolean(thread.pinned));
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Open thread: ${thread.title}`);
    article.addEventListener('click', function (event) {
      if (event.target.closest('button, a')) return;
      loadThread(thread.id);
    });
    article.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      loadThread(thread.id);
    });

    const meta = metaRow([
      thread.categoryName,
      thread.authorName,
      formatDate(thread.updatedAt),
      `${thread.replyCount || 0} replies`,
      thread.pinned ? 'Pinned' : '',
      thread.pollQuestion ? 'Poll' : '',
    ]);

    const title = document.createElement('h2');
    title.textContent = thread.title;

    const body = document.createElement('p');
    body.textContent = trimPreview(thread.body, 260);

    article.append(meta, title, body);
    appendMedia(article, thread);

    const actions = document.createElement('div');
    actions.className = 'forum-actions';
    const open = document.createElement('button');
    open.className = 'button dark';
    open.type = 'button';
    open.textContent = 'Open thread';
    open.addEventListener('click', function () {
      loadThread(thread.id);
    });
    actions.append(open);
    appendThreadEditAction(actions, thread);
    appendAdminThreadActions(actions, thread, false);
    article.append(actions);

    return article;
  }

  function compareThreads(a, b) {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  }

  function renderPagination(totalPages) {
    els.threadPagination.replaceChildren();
    if (totalPages <= 1) {
      els.threadPagination.hidden = true;
      return;
    }

    const previous = document.createElement('button');
    previous.className = 'button ghost';
    previous.type = 'button';
    previous.textContent = 'Previous';
    previous.disabled = state.currentPage <= 1;
    previous.addEventListener('click', function () {
      state.currentPage -= 1;
      renderThreads();
    });

    const count = document.createElement('span');
    count.className = 'forum-page-count';
    count.textContent = `Page ${state.currentPage} of ${totalPages}`;

    const next = document.createElement('button');
    next.className = 'button ghost';
    next.type = 'button';
    next.textContent = 'Next';
    next.disabled = state.currentPage >= totalPages;
    next.addEventListener('click', function () {
      state.currentPage += 1;
      renderThreads();
    });

    els.threadPagination.append(previous, count, next);
    els.threadPagination.hidden = false;
  }

  function renderThreadDetail(thread) {
    els.threadList.replaceChildren();
    els.replies.replaceChildren();
    els.threadPagination.hidden = true;
    els.threadPagination.replaceChildren();
    resetReplyComposer();
    els.empty.hidden = true;
    els.threadDetail.hidden = false;
    els.threadDetail.classList.toggle('is-pinned', Boolean(thread.pinned));
    els.threadDetail.replaceChildren();
    els.replyForm.classList.toggle('is-open', !thread.locked && Boolean(state.user));
    els.viewTitle.textContent = thread.title;
    els.currentCategory.textContent = thread.categoryName || 'Thread';

    const back = document.createElement('button');
    back.className = 'button ghost';
    back.type = 'button';
    back.textContent = 'Back to threads';
    back.addEventListener('click', loadThreads);

    const meta = metaRow([
      thread.categoryName,
      thread.authorName,
      formatDate(thread.createdAt),
      thread.pinned ? 'Pinned' : '',
      thread.locked ? 'Locked' : '',
    ]);

    const title = document.createElement('h2');
    title.textContent = thread.title;
    const body = document.createElement('p');
    body.textContent = thread.body;

    const adminActions = document.createElement('div');
    adminActions.className = 'forum-admin-actions';
    appendThreadEditAction(adminActions, thread);
    appendAdminThreadActions(adminActions, thread, true);

    els.threadDetail.append(back, meta, title);
    if (adminActions.childElementCount) els.threadDetail.append(adminActions);
    els.threadDetail.append(body);
    appendMedia(els.threadDetail, thread);
    appendPoll(els.threadDetail, thread);

    (thread.posts || []).forEach((post) => {
      els.replies.append(replyCard(post));
    });

    els.replyForm.dataset.threadId = thread.id;
    if (!state.user && !thread.locked) {
      const notice = document.createElement('div');
      notice.className = 'forum-empty';
      notice.textContent = 'Sign in to reply or vote.';
      els.replies.append(notice);
    }
  }

  function replyCard(post) {
    const article = document.createElement('article');
    article.className = 'forum-reply';
    const meta = metaRow([post.authorName, formatDate(post.createdAt)]);
    const body = document.createElement('p');
    body.textContent = post.body;
    article.append(meta, body);
    appendMedia(article, post);
    appendPostActions(article, post);
    return article;
  }

  function appendThreadEditAction(parent, thread) {
    if (!thread.canEdit) return;

    const edit = document.createElement('button');
    edit.className = 'button ghost';
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.addEventListener('click', function () {
      openEditThreadComposer(thread);
    });
    parent.append(edit);
  }

  function appendPostActions(parent, post) {
    const actions = document.createElement('div');
    actions.className = 'forum-admin-actions';

    if (post.canEdit) {
      const edit = document.createElement('button');
      edit.className = 'button ghost';
      edit.type = 'button';
      edit.textContent = 'Edit reply';
      edit.addEventListener('click', function () {
        openEditReplyComposer(post);
      });
      actions.append(edit);
    }

    appendAdminPostActions(actions, post);
    if (actions.childElementCount) parent.append(actions);
  }

  function appendAdminThreadActions(parent, thread, isDetail) {
    if (!state.user || !state.user.isAdmin) return;

    const pin = document.createElement('button');
    pin.className = 'button ghost';
    pin.type = 'button';
    pin.textContent = thread.pinned ? 'Unpin' : 'Pin';
    pin.addEventListener('click', async function () {
      await moderate({
        type: 'thread',
        id: thread.id,
        action: thread.pinned ? 'unpin' : 'pin',
      });
      if (isDetail || state.selectedThreadId === thread.id) {
        await loadCategories();
        await loadThread(thread.id);
      } else {
        await loadCategories();
        await loadThreads();
      }
    });

    const remove = document.createElement('button');
    remove.className = 'button ghost forum-danger';
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.addEventListener('click', async function () {
      if (!window.confirm('Delete this thread from the forum?')) return;
      await moderate({ type: 'thread', id: thread.id, action: 'delete' });
      await loadCategories();
      await loadThreads();
    });

    parent.append(pin, remove);
  }

  function appendAdminPostActions(parent, post) {
    if (!state.user || !state.user.isAdmin) return;

    const remove = document.createElement('button');
    remove.className = 'button ghost forum-danger';
    remove.type = 'button';
    remove.textContent = 'Delete reply';
    remove.addEventListener('click', async function () {
      if (!window.confirm('Delete this reply from the forum?')) return;
      await moderate({ type: 'post', id: post.id, action: 'delete' });
      await loadCategories();
      if (state.selectedThreadId) await loadThread(state.selectedThreadId);
    });
    parent.append(remove);
  }

  async function moderate(body) {
    try {
      await api('/api/forum/moderate', {
        method: 'POST',
        body,
      });
      setStatus(els.threadStatus, '');
      setStatus(els.replyStatus, '');
    } catch (err) {
      setStatus(els.threadStatus, err.message, true);
      throw err;
    }
  }

  function appendPoll(parent, thread) {
    if (!thread.pollQuestion || !thread.pollOptions || !thread.pollOptions.length) return;

    const poll = document.createElement('section');
    poll.className = 'forum-poll';
    const heading = document.createElement('h3');
    heading.textContent = thread.pollQuestion;
    poll.append(heading);

    thread.pollOptions.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'poll-option';
      button.type = 'button';
      button.disabled = !state.user;

      const label = document.createElement('b');
      label.textContent = option.label;
      const votes = document.createElement('span');
      votes.textContent = `${option.voteCount || 0} votes`;
      button.append(label, votes);
      button.addEventListener('click', async function () {
        if (!requireSignedIn(els.replyStatus)) return;
        try {
          await api('/api/forum/votes', {
            method: 'POST',
            body: {
              threadId: thread.id,
              optionId: option.id,
            },
          });
          await loadThread(thread.id);
        } catch (err) {
          setStatus(els.replyStatus, err.message, true);
        }
      });
      poll.append(button);
    });

    parent.append(poll);
  }

  function appendMedia(parent, item) {
    if (item.youtubeVideoId && item.youtubeUrl) {
      parent.append(mediaCard({
        href: item.youtubeUrl,
        image: item.youtubeThumbnailUrl || `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`,
        title: 'Open on YouTube',
        subtitle: 'youtube.com',
      }));
    }

    if (item.imageUrl) {
      parent.append(mediaCard({
        href: item.imageUrl,
        image: item.imageUrl,
        title: 'Open image',
        subtitle: imageHost(item.imageUrl),
      }));
    }
  }

  function mediaCard(media) {
    const link = document.createElement('a');
    link.className = 'forum-media';
    link.href = media.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const image = document.createElement('img');
    image.src = media.image;
    image.alt = media.title;
    image.loading = 'lazy';

    const copy = document.createElement('div');
    const title = document.createElement('b');
    title.textContent = media.title;
    const subtitle = document.createElement('span');
    subtitle.textContent = media.subtitle;
    copy.append(title, subtitle);

    link.append(image, copy);
    return link;
  }

  function openThreadComposer() {
    if (!requireSignedIn(els.threadStatus)) return;
    resetThreadComposer('thread');
    els.threadForm.classList.add('is-open');
    document.getElementById('thread-title').focus();
  }

  function openPollComposer() {
    if (!requireSignedIn(els.threadStatus)) return;
    if (!state.user.isAdmin) {
      setStatus(els.threadStatus, 'Only admins can create polls.', true);
      return;
    }
    resetThreadComposer('poll');
    els.threadForm.classList.add('is-open');
    document.getElementById('thread-title').focus();
  }

  function openEditThreadComposer(thread) {
    if (!requireSignedIn(els.threadStatus)) return;
    resetThreadComposer('edit-thread');
    state.editingThreadId = thread.id;
    els.threadForm.categorySlug.value = thread.categorySlug || state.selectedCategory || '';
    els.threadForm.title.value = thread.title || '';
    els.threadForm.body.value = thread.body || '';
    els.threadForm.classList.add('is-open');
    els.threadForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('thread-title').focus();
  }

  function openEditReplyComposer(post) {
    if (!requireSignedIn(els.replyStatus)) return;
    state.editingPostId = post.id;
    els.replyTitle.textContent = 'Edit reply';
    els.replySubmit.textContent = 'Save reply';
    els.replyForm.body.value = post.body || '';
    els.replyForm.classList.add('is-open');
    els.replyForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('reply-body').focus();
  }

  function closeThreadComposer() {
    els.threadForm.classList.remove('is-open');
    resetThreadComposer('thread');
  }

  function resetThreadComposer(mode) {
    state.composerMode = mode || 'thread';
    state.editingThreadId = '';
    els.threadForm.reset();
    if (state.selectedCategory && els.categorySelect.querySelector(`[value="${CSS.escape(state.selectedCategory)}"]`)) {
      els.categorySelect.value = state.selectedCategory;
    }

    const isPoll = state.composerMode === 'poll';
    els.pollFields.forEach((field) => {
      field.hidden = !isPoll;
    });

    els.composerTitle.textContent = state.composerMode === 'edit-thread'
      ? 'Edit thread'
      : isPoll ? 'New poll' : 'New thread';
    els.composerSubmit.textContent = state.composerMode === 'edit-thread'
      ? 'Save thread'
      : isPoll ? 'Publish poll' : 'Publish thread';
    setStatus(els.threadStatus, '');
  }

  function resetReplyComposer() {
    state.editingPostId = '';
    els.replyForm.reset();
    els.replyTitle.textContent = 'Reply';
    els.replySubmit.textContent = 'Post reply';
    setStatus(els.replyStatus, '');
  }

  async function autoRefreshForum() {
    if (hasOpenDraft()) return;
    try {
      await loadForum();
    } catch {
      // Keep quiet during passive refreshes; direct actions still surface errors.
    }
  }

  function hasOpenDraft() {
    if (els.threadForm.classList.contains('is-open')) return true;
    if (state.editingThreadId || state.editingPostId) return true;

    const threadForm = new FormData(els.threadForm);
    const replyForm = new FormData(els.replyForm);
    return ['title', 'body', 'pollQuestion', 'pollOptions'].some((key) => String(threadForm.get(key) || '').trim())
      || String(replyForm.get('body') || '').trim();
  }

  async function requestLoginCode(event) {
    event.preventDefault();
    const form = new FormData(els.authEmailForm);
    const email = String(form.get('email') || '').trim();
    const displayName = String(form.get('displayName') || '').trim();
    setStatus(els.authStatus, 'Sending code...');

    try {
      await api('/api/forum/auth/request-code', {
        method: 'POST',
        body: { email, displayName },
      });
      state.pendingEmail = email;
      renderAuth();
      setStatus(els.authStatus, 'Code sent. Check your email.');
      document.getElementById('forum-login-code').focus();
    } catch (err) {
      setStatus(els.authStatus, err.message, true);
    }
  }

  async function verifyLoginCode(event) {
    event.preventDefault();
    const form = new FormData(els.authCodeForm);
    setStatus(els.authStatus, 'Signing in...');

    try {
      const payload = await api('/api/forum/auth/verify', {
        method: 'POST',
        body: {
          email: state.pendingEmail,
          code: form.get('code'),
        },
      });
      state.user = payload.user || null;
      state.pendingEmail = '';
      els.authCodeForm.reset();
      renderAuth();
      setStatus(els.authStatus, 'Signed in.');
      await loadCategories();
      if (state.selectedThreadId) await loadThread(state.selectedThreadId);
    } catch (err) {
      setStatus(els.authStatus, err.message, true);
    }
  }

  async function logout() {
    setStatus(els.authStatus, 'Signing out...');
    try {
      await api('/api/forum/auth/logout', { method: 'POST' });
      state.user = null;
      renderAuth();
      setStatus(els.authStatus, 'Signed out.');
      await loadCategories();
      if (state.selectedThreadId) await loadThread(state.selectedThreadId);
    } catch (err) {
      setStatus(els.authStatus, err.message, true);
    }
  }

  async function submitThread(event) {
    event.preventDefault();
    if (!requireSignedIn(els.threadStatus)) return;
    const isEdit = state.composerMode === 'edit-thread';
    setStatus(els.threadStatus, isEdit ? 'Saving...' : 'Publishing...');
    const form = new FormData(els.threadForm);
    const isPoll = state.composerMode === 'poll';

    try {
      const body = {
        categorySlug: form.get('categorySlug'),
        title: form.get('title'),
        body: form.get('body'),
      };

      if (isEdit) {
        body.threadId = state.editingThreadId;
      } else {
        body.type = isPoll ? 'poll' : 'thread';
        if (isPoll) {
          body.pollQuestion = form.get('pollQuestion');
          body.pollOptions = String(form.get('pollOptions') || '').split(/\r?\n/);
        }
      }

      const payload = await api('/api/forum/threads', {
        method: isEdit ? 'PUT' : 'POST',
        body: {
          ...body,
        },
      });

      els.threadForm.classList.remove('is-open');
      resetThreadComposer('thread');
      await loadCategories();
      await loadThread(payload.thread.id);
      setStatus(els.threadStatus, '');
    } catch (err) {
      setStatus(els.threadStatus, err.message, true);
    }
  }

  async function submitReply(event) {
    event.preventDefault();
    if (!requireSignedIn(els.replyStatus)) return;
    const isEdit = Boolean(state.editingPostId);
    setStatus(els.replyStatus, isEdit ? 'Saving...' : 'Posting...');
    const form = new FormData(els.replyForm);
    const threadId = els.replyForm.dataset.threadId;

    try {
      await api('/api/forum/posts', {
        method: isEdit ? 'PUT' : 'POST',
        body: {
          threadId,
          postId: state.editingPostId,
          body: form.get('body'),
        },
      });

      resetReplyComposer();
      await loadCategories();
      await loadThread(threadId);
      setStatus(els.replyStatus, '');
    } catch (err) {
      setStatus(els.replyStatus, err.message, true);
    }
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'same-origin',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || 'Forum request failed.');
    }
    return payload;
  }

  function metaRow(items) {
    const row = document.createElement('div');
    row.className = 'forum-meta';
    items.filter(Boolean).forEach((item) => {
      const span = document.createElement('span');
      span.textContent = item;
      row.append(span);
    });
    return row;
  }

  function requireSignedIn(statusElement) {
    if (state.user) return true;
    setStatus(statusElement || els.authStatus, 'Sign in with email first.', true);
    document.getElementById('forum-login-email').focus();
    return false;
  }

  function showEmpty(message) {
    els.threadList.replaceChildren();
    els.threadPagination.hidden = true;
    els.threadPagination.replaceChildren();
    els.threadDetail.hidden = true;
    els.threadDetail.classList.remove('is-pinned');
    els.replies.replaceChildren();
    els.replyForm.classList.remove('is-open');
    els.empty.hidden = false;
    els.empty.textContent = message;
  }

  function setStatus(element, message, isError) {
    element.textContent = message || '';
    element.classList.toggle('is-error', Boolean(isError));
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function trimPreview(value, length) {
    const text = String(value || '').trim();
    return text.length > length ? `${text.slice(0, length - 1).trim()}...` : text;
  }

  function imageHost(value) {
    try {
      return new URL(value).hostname.replace(/^www\./, '');
    } catch {
      return 'image';
    }
  }

  function setUrlThread(id) {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set('thread', id);
    } else {
      url.searchParams.delete('thread');
    }
    window.history.replaceState({}, '', url);
  }
}());
