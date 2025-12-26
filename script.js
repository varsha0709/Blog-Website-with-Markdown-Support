// Markdown Editor & Save Logic (index.html)

const STORAGE_KEY = 'blog_posts';

/**
 * Get all posts from LocalStorage.
 * @returns {Array} array of post objects
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
 * Save a single post to LocalStorage.
 * @param {Object} post - post object to save
 */
function savePost(post) {
  const posts = getPosts();
  posts.unshift(post); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/**
 * Generate a simple unique ID based on time and randomness.
 * @returns {string}
 */
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

// DOM elements
const titleInput = document.getElementById('postTitle');
const markdownInput = document.getElementById('markdownInput');
const previewEl = document.getElementById('preview');
const formEl = document.getElementById('postForm');
const clearBtn = document.getElementById('clearEditor');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true
});

// Live preview update
function updatePreview() {
  const md = markdownInput.value || '';
  const html = md.trim() ? marked.parse(md) : '<p class="muted">Start typing Markdown to see the rendered preview here.</p>';
  previewEl.innerHTML = html;
}

// Initialize default preview
updatePreview();

// Event listeners
markdownInput.addEventListener('input', updatePreview);

// Clear editor
clearBtn.addEventListener('click', () => {
  titleInput.value = '';
  markdownInput.value = '';
  updatePreview();
  titleInput.focus();
});

// Save post
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const markdownContent = markdownInput.value.trim();

  if (!title || !markdownContent) {
    alert('Please provide both a title and Markdown content.');
    return;
  }

  const htmlContent = marked.parse(markdownContent);

  const post = {
    id: generateId(),
    title,
    markdownContent,
    htmlContent,
    createdDate: new Date().toISOString()
  };

  savePost(post);

  // Visual feedback
  formEl.classList.add('saved');
  setTimeout(() => formEl.classList.remove('saved'), 600);

  // ✅ Use globalThis instead of window
  globalThis.location.href = 'posts.html';
});