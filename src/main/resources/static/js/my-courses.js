let allEnrollments = [];
let currentFilter = 'all';

async function loadMyCourses() {
    if (!requireStudent()) return;

    const container = document.getElementById('enrollments-list');
    container.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const auth = getAuth();
        const data = await api('/enrollments/user/' + auth.id);
        allEnrollments = data.data;
        renderEnrollments();
        updateStats();
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><h3>Failed to load courses</h3></div>';
    }
}

function updateStats() {
    const enrolled = allEnrollments.length;
    const completed = allEnrollments.filter(e => e.status === 'COMPLETED').length;
    const inProgress = allEnrollments.filter(e => e.status === 'ACTIVE').length;
    const totalLessons = allEnrollments.reduce((sum, e) => sum + (e.totalLessons || 0), 0);
    const completedLessons = allEnrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0);
    const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    animateValue('stat-enrolled', enrolled);
    animateValue('stat-completed', completed);
    animateValue('stat-inprogress', inProgress);
    animateValue('stat-lessons', totalLessons);
    document.getElementById('stat-overall').textContent = overallPercent + '%';
}

function animateValue(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const increment = Math.ceil(target / 20);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 25);
}

function filterEnrollments(filter) {
    currentFilter = filter;
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderEnrollments();
}

function renderEnrollments() {
    const container = document.getElementById('enrollments-list');
    const emptyState = document.getElementById('enrollments-empty');

    let filtered = allEnrollments;
    if (currentFilter === 'active') {
        filtered = filtered.filter(e => e.status === 'ACTIVE');
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(e => e.status === 'COMPLETED');
    }

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filtered.map((enrollment, index) => `
        <div class="enrollment-card animate-card-reveal" style="animation-delay: ${index * 0.1}s; margin-bottom: 1.5rem;">
            <div class="enrollment-card-image">
                <img src="${enrollment.courseImage || 'https://via.placeholder.com/400x200'}" alt="${enrollment.courseTitle}">
            </div>
            <div class="enrollment-card-body">
                <div class="enrollment-card-header">
                    <div>
                        <span class="badge ${enrollment.status === 'COMPLETED' ? 'badge-secondary' : 'badge-primary'}">${enrollment.status}</span>
                        <h3 style="margin-top: 0.625rem; font-size: 1.25rem; font-weight: 700;">${enrollment.courseTitle}</h3>
                        <p style="font-size: 0.8125rem; color: var(--gray-400); margin-top: 0.25rem;">By ${enrollment.instructor}</p>
                    </div>
                </div>
                <div class="enrollment-card-progress">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.625rem;">
                        <span style="font-size: 0.8125rem; color: var(--gray-500);">${enrollment.completedLessons} of ${enrollment.totalLessons} lessons</span>
                        <span class="progress-text">${enrollment.progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${enrollment.progressPercentage}%"></div>
                    </div>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
                        <a href="course-detail.html?id=${enrollment.courseId}" class="btn btn-primary btn-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Continue
                        </a>
                        ${enrollment.status === 'COMPLETED' ? `
                            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewCertificate(${enrollment.courseId})">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Certificate
                            </button>
                        ` : ''}
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); dropCourse(${enrollment.id})">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            Drop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function dropCourse(enrollmentId) {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
        await api('/enrollments/' + enrollmentId, { method: 'DELETE' });
        showToast('Course dropped successfully');
        await loadMyCourses();
    } catch (error) {
        showToast(error.message || 'Failed to drop course', 'error');
    }
}

function viewCertificate(courseId) {
    window.location.href = 'course-detail.html?id=' + courseId;
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

document.addEventListener('DOMContentLoaded', loadMyCourses);
