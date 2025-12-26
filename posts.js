// Posts listing & single post view logic (posts.html, post.html)

const STORAGE_KEY = 'blog_posts';

/**
 * Get all posts from LocalStorage.
 * @returns {Array}
 */
function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Find a post by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getPostById(id) {
  const posts = getPosts();
  return posts.find(p => p.id === id) || null;
}

/**
 * Format a date for display.
 * @param {string|number|Date} date
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Create a post card element for the list page.
 * @param {Object} post
 * @returns {HTMLElement}
 */
function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h2');
  title.className = 'card-title';
  title.textContent = post.title;

  const meta = document.createElement('p');
  meta.className = 'card-meta';
  meta.textContent = formatDate(post.createdDate);

  const preview = document.createElement('p');
  preview.className = 'card-preview';
  // ✅ Use replaceAll instead of replace
  const textPreview = post.markdownContent.replaceAll(/\s+/g, ' ').slice(0, 100);
  preview.textContent = textPreview + (post.markdownContent.length > 100 ? '…' : '');

  const link = document.createElement('a');
  link.href = `post.html?id=${encodeURIComponent(post.id)}`;
  link.className = 'btn';
  link.textContent = 'Read';

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(preview);
  card.appendChild(link);

  return card;
}

/**
 * Render all posts on posts.html.
 */
function renderPostList() {
  const listEl = document.getElementById('postsList');
  const emptyEl = document.getElementById('emptyState');
  if (!listEl || !emptyEl) return;

  const posts = getPosts();

  if (!posts.length) {
    emptyEl.classList.remove('hidden');
    listEl.innerHTML = '';
    return;
  }

  emptyEl.classList.add('hidden');
  listEl.innerHTML = '';

  posts.forEach(post => {
    listEl.appendChild(createPostCard(post));
  });
}

/**
 * Render a single post on post.html using the query param id.
 */
function renderSinglePost() {
  const container = document.getElementById('postContainer');
  const notFound = document.getElementById('notFound');
  const titleEl = document.getElementById('postTitle');
  const metaEl = document.getElementById('postMeta');
  const contentEl = document.getElementById('postContent');

  if (!container || !titleEl || !metaEl || !contentEl || !notFound) return;

  const params = new URLSearchParams(globalThis.location.search); // ✅ globalThis instead of window
  const id = params.get('id');

  if (!id) {
    container.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  const post = getPostById(id);

  if (!post) {
    container.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  titleEl.textContent = post.title;
  metaEl.textContent = formatDate(post.createdDate);

  // Use stored HTML content to avoid re-parsing
  contentEl.innerHTML = post.htmlContent;
}

// Decide which page to render
document.addEventListener('DOMContentLoaded', () => {
  const onPostsPage = document.getElementById('postsList') !== null;
  const onPostPage = document.getElementById('postContainer') !== null;

  if (onPostsPage) renderPostList();
  if (onPostPage) renderSinglePost();
});