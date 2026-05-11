let allCourses = [];
let editingCourseId = null;
let lessonCounter = 0;

async function initAdmin() {
    if (!requireAdmin()) return;
    await loadStats();
    await loadCourses();
}

async function loadStats() {
    try {
        const data = await api('/admin/stats');
        const stats = data.data;
        animateValue('admin-stat-courses', stats.totalCourses || 0);
        animateValue('admin-stat-users', stats.totalUsers || 0);
        animateValue('admin-stat-enrollments', stats.totalEnrollments || 0);
        animateValue('admin-stat-categories', stats.categories?.length || 0);
    } catch (e) {}
}

function animateValue(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const increment = Math.ceil(target / 25);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
}

async function loadCourses() {
    const tbody = document.getElementById('courses-tbody');
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;"><div class="loading-spinner" style="margin: 2rem auto;"></div></td></tr>';

    try {
        const data = await api('/courses');
        allCourses = data.data;
        renderCoursesTable();
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">Failed to load courses</td></tr>';
    }
}

function renderCoursesTable() {
    const tbody = document.getElementById('courses-tbody');

    if (allCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No courses found</td></tr>';
        return;
    }

    tbody.innerHTML = allCourses.map(course => `
        <tr>
            <td style="font-weight: 600; color: var(--gray-400);">#${course.id}</td>
            <td style="font-weight: 600;">${course.title}</td>
            <td><span class="badge badge-primary">${course.category}</span></td>
            <td>${course.instructor}</td>
            <td>${course.duration}</td>
            <td>${course.totalLessons || 0}</td>
            <td>${course.totalStudents || 0}</td>
            <td><span class="course-rating">${renderStars(course.rating)} ${course.rating}</span></td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-ghost btn-sm" onclick="editCourse(${course.id})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openCourseModal() {
    editingCourseId = null;
    document.getElementById('modal-title').textContent = 'Add New Course';
    document.getElementById('course-form').reset();
    document.getElementById('course-id').value = '';
    document.getElementById('lessons-container').innerHTML = '';
    lessonCounter = 0;
    addLessonRow();
    document.getElementById('course-modal').classList.add('active');
}

function closeCourseModal() {
    document.getElementById('course-modal').classList.remove('active');
}

function addLessonRow(lesson = null) {
    lessonCounter++;
    const container = document.getElementById('lessons-container');
    const div = document.createElement('div');
    div.className = 'card animate-fade-in-up';
    div.style.cssText = 'padding: 1.25rem; margin-bottom: 0.875rem; border: 1px solid var(--gray-100);';
    div.dataset.lessonId = lessonCounter;
    div.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;">
            <input type="text" class="form-input lesson-title" placeholder="Lesson title *" value="${lesson?.title || ''}" required>
            <input type="text" class="form-input lesson-duration" placeholder="Duration (e.g., 20 min)" value="${lesson?.duration || ''}">
        </div>
        <div style="margin-top: 0.625rem;">
            <input type="text" class="form-input lesson-desc" placeholder="Description" value="${lesson?.description || ''}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 90px; gap: 0.875rem; margin-top: 0.625rem;">
            <input type="url" class="form-input lesson-video" placeholder="Video URL" value="${lesson?.videoUrl || ''}">
            <input type="number" class="form-input lesson-order" placeholder="Order" value="${lesson?.orderIndex || lessonCounter}" min="1">
        </div>
        <div style="text-align: right; margin-top: 0.75rem;">
            <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.card').remove()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Remove
            </button>
        </div>
    `;
    container.appendChild(div);
}

async function editCourse(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    editingCourseId = courseId;
    document.getElementById('modal-title').textContent = 'Edit Course';
    document.getElementById('course-id').value = course.id;
    document.getElementById('course-title').value = course.title;
    document.getElementById('course-category').value = course.category;
    document.getElementById('course-description').value = course.description;
    document.getElementById('course-duration').value = course.duration;
    document.getElementById('course-instructor').value = course.instructor;
    document.getElementById('course-image').value = course.imageUrl || '';
    document.getElementById('course-rating').value = course.rating || 4.5;
    document.getElementById('course-featured').checked = course.featured || false;

    document.getElementById('lessons-container').innerHTML = '';
    lessonCounter = 0;

    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach(lesson => addLessonRow(lesson));
    } else {
        addLessonRow();
    }

    document.getElementById('course-modal').classList.add('active');
}

async function saveCourse() {
    const title = document.getElementById('course-title').value;
    const category = document.getElementById('course-category').value;
    const description = document.getElementById('course-description').value;
    const duration = document.getElementById('course-duration').value;
    const instructor = document.getElementById('course-instructor').value;

    if (!title || !category || !description || !duration || !instructor) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    const lessons = [];
    document.querySelectorAll('#lessons-container .card').forEach(card => {
        const lessonTitle = card.querySelector('.lesson-title').value;
        if (lessonTitle) {
            lessons.push({
                title: lessonTitle,
                description: card.querySelector('.lesson-desc').value,
                duration: card.querySelector('.lesson-duration').value,
                videoUrl: card.querySelector('.lesson-video').value,
                orderIndex: parseInt(card.querySelector('.lesson-order').value) || 1
            });
        }
    });

    const payload = {
        title,
        category,
        description,
        duration,
        instructor,
        imageUrl: document.getElementById('course-image').value,
        rating: parseFloat(document.getElementById('course-rating').value) || 4.5,
        featured: document.getElementById('course-featured').checked,
        lessons
    };

    try {
        if (editingCourseId) {
            await api('/admin/courses/' + editingCourseId, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showToast('Course updated successfully');
        } else {
            await api('/admin/courses', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showToast('Course created successfully');
        }
        closeCourseModal();
        await loadCourses();
        await loadStats();
    } catch (error) {
        showToast(error.message || 'Failed to save course', 'error');
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    try {
        await api('/admin/courses/' + courseId, { method: 'DELETE' });
        showToast('Course deleted successfully');
        await loadCourses();
        await loadStats();
    } catch (error) {
        showToast(error.message || 'Failed to delete course', 'error');
    }
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

document.addEventListener('DOMContentLoaded', initAdmin);
