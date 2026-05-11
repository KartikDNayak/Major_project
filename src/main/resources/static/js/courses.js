let allCourses = [];
let currentCategory = '';
let searchQuery = '';

async function loadCourses() {
    const container = document.getElementById('courses-grid');
    container.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const data = await api('/courses');
        allCourses = data.data;
        renderCourses();
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><h3>Failed to load courses</h3></div>';
    }
}

async function loadCategories() {
    try {
        const data = await api('/courses/categories');
        const container = document.getElementById('category-filters');
        const categories = data.data;

        container.innerHTML = `<button class="filter-tag active" data-category="">All</button>` +
            categories.map(cat => `<button class="filter-tag" data-category="${cat}">${cat}</button>`).join('');

        container.querySelectorAll('.filter-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                renderCourses();
            });
        });
    } catch (e) {}
}

function renderCourses() {
    const container = document.getElementById('courses-grid');
    const emptyState = document.getElementById('courses-empty');

    let filtered = allCourses;

    if (currentCategory) {
        filtered = filtered.filter(c => c.category === currentCategory);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.instructor?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q)
        );
    }

    const sortValue = document.getElementById('sort-select')?.value;
    if (sortValue === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortValue === 'students') {
        filtered.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
    }

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filtered.map((course, index) => `
        <div class="card course-card animate-card-reveal" style="animation-delay: ${index * 0.06}s" onclick="window.location.href='course-detail.html?id=${course.id}'">
            <div class="card-image" style="position: relative;">
                <img src="${course.imageUrl || 'https://via.placeholder.com/400x200'}" alt="${course.title}" loading="lazy">
                <span class="badge badge-primary" style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">${course.category}</span>
                <div style="position: absolute; bottom: 1rem; right: 1rem; z-index: 2; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display: inline; vertical-align: middle; margin-right: 0.25rem;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    ${course.totalLessons || 0} lessons
                </div>
            </div>
            <div class="card-body">
                <div class="course-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${course.duration}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        ${course.totalStudents || 0}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        ${course.totalLessons || 0} lessons
                    </span>
                </div>
                <h3 class="card-title">${course.title}</h3>
                <p class="card-text">${course.description?.substring(0, 90) || ''}...</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="course-rating">${renderStars(course.rating)} ${course.rating}</div>
                    <span style="font-size: 0.8125rem; color: var(--gray-500);">${course.instructor}</span>
                </div>
            </div>
        </div>
    `).join('');
}

const debouncedSearch = debounce((query) => {
    searchQuery = query;
    renderCourses();
}, 300);

document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadCategories();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', renderCourses);
    }

    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
        currentCategory = category;
    }
});
