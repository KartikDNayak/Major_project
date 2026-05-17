let currentCourse = null;
let currentEnrollment = null;
let currentProgress = [];
let activeLessonIndex = 0;

function getCourseId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadCourseDetail() {
    const courseId = getCourseId();
    if (!courseId) {
        document.getElementById('course-detail-content').innerHTML = '<div class="empty-state"><h3>Course not found</h3></div>';
        return;
    }

    try {
        const data = await api('/courses/' + courseId);
        currentCourse = data.data;

        const auth = getAuth();
        if (auth) {
            try {
                const enrollData = await api('/enrollments/user/' + auth.id + '/course/' + courseId);
                currentEnrollment = enrollData.data;
                const progressData = await api('/progress/enrollment/' + currentEnrollment.id);
                currentProgress = progressData.data;
            } catch (e) {
                currentEnrollment = null;
                currentProgress = [];
            }
        }

        renderCourseDetail();
    } catch (error) {
        document.getElementById('course-detail-content').innerHTML = '<div class="empty-state"><h3>Failed to load course</h3></div>';
    }
}

function renderCourseDetail() {
    const auth = getAuth();
    const isEnrolled = !!currentEnrollment;
    const completedLessons = currentProgress.filter(p => p.completed).length;
    const totalLessons = currentCourse.lessons?.length || 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isCompleted = currentEnrollment?.status === 'COMPLETED';

    const container = document.getElementById('course-detail-content');
    container.innerHTML = `
        <div class="course-detail-hero">
            <div class="course-detail-grid">
                <div class="course-detail-info animate-fade-in-up">
                    <span class="badge badge-primary">${currentCourse.category}</span>
                    <h1>${currentCourse.title}</h1>
                    <p style="color: var(--gray-600); margin-bottom: 1.75rem; line-height: 1.8; font-size: 1rem;">${currentCourse.description}</p>
                    <div class="course-detail-meta">
                        <div class="course-detail-meta-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${currentCourse.duration}
                        </div>
                        <div class="course-detail-meta-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            ${totalLessons} lessons
                        </div>
                        <div class="course-detail-meta-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            ${currentCourse.totalStudents || 0} students enrolled
                        </div>
                        <div class="course-detail-meta-item course-rating">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ${currentCourse.rating} rating
                        </div>
                    </div>
                    <div class="course-instructor">
                        <div class="user-avatar">${getInitials(currentCourse.instructor)}</div>
                        <div>
                            <div style="font-weight: 600; color: var(--gray-800);">${currentCourse.instructor}</div>
                            <div style="font-size: 0.8125rem; color: var(--gray-400);">Course Instructor</div>
                        </div>
                    </div>

                    ${isEnrolled ? `
                        <div style="margin-top: 1.75rem; padding: 1.25rem; background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(16,185,129,0.02)); border-radius: var(--radius-lg); border: 1px solid rgba(99,102,241,0.08);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.625rem;">
                                <span style="font-weight: 700; font-size: 0.9375rem;">Your Progress</span>
                                <span class="progress-text">${progressPercent}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <p style="font-size: 0.8125rem; color: var(--gray-400); margin-top: 0.625rem;">${completedLessons} of ${totalLessons} lessons completed</p>
                        </div>
                        ${isCompleted ? `
                            <div style="margin-top: 1rem; padding: 1.25rem; background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02)); border-radius: var(--radius-lg); border: 1px solid rgba(16,185,129,0.12); animation: fadeInUp 0.5s ease;">
                                <div style="display: flex; align-items: center; gap: 0.875rem; color: var(--secondary);">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    <span style="font-weight: 700; font-size: 1.0625rem;">Course Completed!</span>
                                </div>
                                <button class="btn btn-secondary btn-sm" style="margin-top: 0.875rem;" onclick="showCertificate()">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    View Certificate
                                </button>
                            </div>
                        ` : ''}
                    ` : ''}
                </div>

                <div class="course-detail-sidebar animate-fade-in-up stagger-2">
                    <div class="course-detail-card">
                        <div class="card-image" style="height: 240px;">
                            <img src="${currentCourse.imageUrl || 'https://via.placeholder.com/400x200'}" alt="${currentCourse.title}">
                        </div>
                        <div class="card-body">
                            ${!isEnrolled ? `
                                <button class="btn btn-primary w-full btn-lg" id="enroll-btn" onclick="handleEnroll()" style="box-shadow: var(--shadow-primary);">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                                    Enroll Now
                                </button>
                                <p style="text-align: center; font-size: 0.8125rem; color: var(--gray-400); margin-top: 0.875rem;">Free enrollment &bull; Instant access</p>
                            ` : `
                                <div style="text-align: center; padding: 1.25rem 0;">
                                    <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--secondary), var(--secondary-dark)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.875rem; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <div style="color: var(--secondary); font-weight: 700; font-size: 1.125rem; margin-bottom: 0.25rem;">You are enrolled!</div>
                                    <p style="font-size: 0.8125rem; color: var(--gray-400);">Continue your learning journey below</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section" style="background: var(--gray-50);">
            <div class="section-container">
                <h2 style="font-size: 1.625rem; margin-bottom: 1.75rem; font-weight: 700;">Course Content</h2>

                ${isEnrolled && currentCourse.lessons?.length > 0 ? `
                    <div class="video-container animate-fade-in-up" style="margin-bottom: 2rem;">
                        <video id="lesson-video" controls poster="${currentCourse.imageUrl}">
                            <source src="${currentCourse.lessons[activeLessonIndex]?.videoUrl || ''}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div style="margin-bottom: 1.75rem; animation: fadeInUp 0.5s ease;">
                        <h3 id="active-lesson-title" style="font-size: 1.25rem; font-weight: 700;">${currentCourse.lessons[activeLessonIndex]?.title || ''}</h3>
                        <p id="active-lesson-desc" style="color: var(--gray-500); margin-top: 0.375rem; line-height: 1.7;">${currentCourse.lessons[activeLessonIndex]?.description || ''}</p>
                    </div>
                ` : ''}

                <div class="lesson-list">
                    ${currentCourse.lessons?.map((lesson, index) => {
                        const progress = currentProgress.find(p => p.lessonId === lesson.id);
                        const isCompleted = progress?.completed;
                        return `
                            <div class="lesson-item ${isCompleted ? 'completed' : ''} ${index === activeLessonIndex && isEnrolled ? 'active-lesson' : ''}" data-index="${index}">
                                <div class="lesson-checkbox ${isCompleted ? 'checked' : ''}" 
                                     onclick="event.stopPropagation(); ${isEnrolled ? `toggleLesson(${lesson.id}, ${index})` : 'showToast("Please enroll to track progress", "error")'}">
                                    ${isCompleted ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                                </div>
                                <div class="lesson-info" onclick="${isEnrolled ? `playLesson(${index})` : ''}" style="cursor: ${isEnrolled ? 'pointer' : 'default'};">
                                    <div class="lesson-title">${index + 1}. ${lesson.title}</div>
                                    <div class="lesson-duration">${lesson.duration}</div>
                                </div>
                                ${isEnrolled ? `
                                    <div class="lesson-play-btn">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('') || '<div style="padding: 3rem; text-align: center; color: var(--gray-400);">No lessons available</div>'}
                </div>
            </div>
        </div>
    `;
}

async function handleEnroll() {
    if (!requireAuth()) return;

    const btn = document.getElementById('enroll-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div> Enrolling...';

    try {
        const auth = getAuth();
        await api('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ userId: auth.id, courseId: currentCourse.id })
        });
        showToast('Enrolled successfully!');
        await loadCourseDetail();
    } catch (error) {
        showToast(error.message || 'Enrollment failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Enroll Now';
    }
}

async function toggleLesson(lessonId, index) {
    if (!currentEnrollment) return;

    const progress = currentProgress.find(p => p.lessonId === lessonId);
    const newStatus = !(progress?.completed);

    try {
        await api('/progress', {
            method: 'POST',
            body: JSON.stringify({
                enrollmentId: currentEnrollment.id,
                lessonId: lessonId,
                completed: newStatus
            })
        });

        showToast(newStatus ? 'Lesson completed! Keep going!' : 'Lesson marked as incomplete');
        await loadCourseDetail();
    } catch (error) {
        showToast(error.message || 'Failed to update progress', 'error');
    }
}

function playLesson(index) {
    activeLessonIndex = index;
    const lesson = currentCourse.lessons[index];
    const video = document.getElementById('lesson-video');
    const title = document.getElementById('active-lesson-title');
    const desc = document.getElementById('active-lesson-desc');

    if (video && lesson.videoUrl) {
        video.src = lesson.videoUrl;
        video.load();
        video.play();
    }
    if (title) {
        title.style.animation = 'none';
        title.offsetHeight;
        title.textContent = lesson.title;
        title.style.animation = 'fadeInUp 0.3s ease';
    }
    if (desc) {
        desc.style.animation = 'none';
        desc.offsetHeight;
        desc.textContent = lesson.description;
        desc.style.animation = 'fadeInUp 0.3s ease 0.1s both';
    }

    document.querySelectorAll('.lesson-item').forEach((el, i) => {
        el.classList.toggle('active-lesson', i === index);
    });
}

function showCertificate() {
    const auth = getAuth();
    const modal = document.getElementById('certificate-modal');
    const body = document.getElementById('certificate-body');

    const date = currentEnrollment?.completedAt 
        ? new Date(currentEnrollment.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    body.innerHTML = `
        <div class="certificate-container" id="certificate-to-download">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 1rem; letter-spacing: 0.1em; text-transform: uppercase;">LearnHub</div>
            <h1 class="certificate-title">Certificate of Completion</h1>
            <p class="certificate-subtitle">This certifies that</p>
            <div class="certificate-name">${auth?.fullName || 'Student'}</div>
            <p class="certificate-subtitle">has successfully completed the course</p>
            <div class="certificate-course">${currentCourse.title}</div>
            <div style="display: flex; justify-content: center; gap: 4rem; margin-top: 2.5rem;">
                <div style="text-align: center;">
                    <div style="border-top: 2px solid var(--gray-300); padding-top: 0.75rem; width: 180px;">
                        <div style="font-size: 0.9375rem; color: var(--gray-700); font-weight: 600;">${currentCourse.instructor}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-400); margin-top: 0.25rem;">Instructor</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="border-top: 2px solid var(--gray-300); padding-top: 0.75rem; width: 180px;">
                        <div style="font-size: 0.9375rem; color: var(--gray-700); font-weight: 600;">${date}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-400); margin-top: 0.25rem;">Date</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeCertificate() {
    document.getElementById('certificate-modal').classList.remove('active');
}

function downloadCertificate() {
    if (typeof html2pdf === 'undefined') {
        showToast('Download library not loaded. Please try again later.', 'error');
        return;
    }

    const element = document.getElementById('certificate-to-download');
    
    const opt = {
        margin:       10,
        filename:     `${currentCourse.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    const downloadBtn = document.querySelector('#certificate-modal .modal-footer .btn-primary');
    const originalText = downloadBtn.innerHTML;
    
    // Add simple loading text
    downloadBtn.innerHTML = 'Downloading...';
    downloadBtn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
        showToast('Certificate downloaded successfully!', 'success');
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        closeCertificate();
    }).catch(err => {
        console.error('Error generating PDF:', err);
        showToast('Failed to download certificate.', 'error');
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    });
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

document.addEventListener('DOMContentLoaded', loadCourseDetail);
