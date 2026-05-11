const AUTH_KEY = 'learning_platform_auth';

function getAuth() {
    return Storage.get(AUTH_KEY);
}

function setAuth(user) {
    Storage.set(AUTH_KEY, user);
    updateNavAuth();
}

function clearAuth() {
    Storage.remove(AUTH_KEY);
    updateNavAuth();
}

function isLoggedIn() {
    return !!getAuth();
}

function isAdmin() {
    const auth = getAuth();
    return auth && auth.role === 'ADMIN';
}

function requireAuth() {
    if (!isLoggedIn()) {
        showToast('Please login to continue', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!isAdmin()) {
        showToast('Admin access required', 'error');
        setTimeout(() => window.location.href = 'index.html', 1000);
        return false;
    }
    return true;
}

function requireStudent() {
    if (!requireAuth()) return false;
    if (isAdmin()) {
        showToast('Admin cannot access student side', 'error');
        setTimeout(() => window.location.href = 'admin.html', 1000);
        return false;
    }
    return true;
}

function updateNavAuth() {
    const auth = getAuth();
    const authContainer = document.getElementById('nav-auth');
    if (!authContainer) return;

    if (auth) {
        authContainer.innerHTML = `
            ${auth.role === 'ADMIN' ? '<a href="admin.html" class="nav-link">Admin</a>' : '<a href="my-courses.html" class="nav-link">My Courses</a>'}
            <div class="nav-user">
                <div class="user-avatar">${getInitials(auth.fullName)}</div>
                <span>${auth.fullName}</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="btn btn-ghost btn-sm">Sign In</a>
            <a href="login.html" class="btn btn-primary btn-sm">Get Started</a>
        `;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        setAuth(data.data);
        showToast('Welcome back, ' + data.data.fullName + '!');
        setTimeout(() => window.location.href = data.data.role === 'ADMIN' ? 'admin.html' : 'my-courses.html', 800);
    } catch (error) {
        showToast(error.message || 'Login failed', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const fullName = document.getElementById('reg-fullname').value;
    const role = document.getElementById('reg-role').value;

    try {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, fullName, role })
        });
        setAuth(data.data);
        showToast('Account created successfully!');
        setTimeout(() => window.location.href = data.data.role === 'ADMIN' ? 'admin.html' : 'my-courses.html', 800);
    } catch (error) {
        showToast(error.message || 'Registration failed', 'error');
    }
}

function handleLogout() {
    clearAuth();
    showToast('Logged out successfully');
    setTimeout(() => window.location.href = 'index.html', 500);
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', updateNavAuth);
