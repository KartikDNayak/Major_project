async function loadFeaturedCourses() {
    const container = document.getElementById('featured-courses');
    try {
        const data = await api('/courses/featured');
        const courses = data.data;

        if (courses.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No featured courses yet</h3></div>';
            return;
        }

        container.innerHTML = courses.map((course, index) => `
            <div class="card course-card animate-card-reveal" style="animation-delay: ${index * 0.1}s" onclick="window.location.href='course-detail.html?id=${course.id}'">
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
                            ${course.totalStudents || 0} students
                        </span>
                    </div>
                    <h3 class="card-title">${course.title}</h3>
                    <p class="card-text">${course.description?.substring(0, 100) || ''}...</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="course-rating">${renderStars(course.rating)} ${course.rating}</div>
                        <span style="font-size: 0.8125rem; color: var(--gray-500);">By ${course.instructor}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><h3>Failed to load courses</h3><p>Please refresh the page</p></div>';
    }
}

async function loadCategories() {
    const container = document.getElementById('categories-grid');
    try {
        const data = await api('/courses/categories');
        const categories = data.data;

        const categoryIcons = {
            'Programming': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
            'Web Development': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            'Data Science': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
            'Design': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
            'Mobile Development': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
            'Cloud Computing': '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
        };

        const categoryColors = {
            'Programming': '#6366f1',
            'Web Development': '#10b981',
            'Data Science': '#f59e0b',
            'Design': '#ec4899',
            'Mobile Development': '#8b5cf6',
            'Cloud Computing': '#06b6d4'
        };

        container.innerHTML = categories.map((cat, index) => `
            <a href="courses.html?category=${encodeURIComponent(cat)}" class="card category-card animate-card-reveal" style="animation-delay: ${index * 0.08}s; text-decoration: none;">
                <div class="category-icon" style="color: ${categoryColors[cat] || 'var(--primary)'};">
                    ${categoryIcons[cat] || '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>'}
                </div>
                <h3 style="font-size: 1.0625rem; margin-bottom: 0.375rem; color: var(--gray-900);">${cat}</h3>
                <p style="font-size: 0.8125rem; color: var(--gray-400);">Explore courses</p>
            </a>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><h3>Failed to load categories</h3></div>';
    }
}

async function loadStats() {
    try {
        const coursesData = await api('/courses');
        const courses = coursesData.data;

        animateCounter('stat-courses', courses.length);

        const instructors = [...new Set(courses.map(c => c.instructor))];
        animateCounter('stat-instructors', instructors.length);

        const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
        animateCounter('stat-students', totalStudents);
    } catch (e) {}
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + '+';
    }, 30);
}

function toggleMobileMenu() {
    showToast('Mobile menu - please use desktop for full experience', 'error');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCourses();
    loadCategories();
    loadStats();
});
