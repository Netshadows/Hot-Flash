// NOTE: We use window.renderX functions to allow local file execution without modules
const routes = {
    'login': { title: 'Login', render: window.renderLogin },
    'dashboard': { title: 'Dashboard', render: window.renderDashboard },
    'logging': { title: 'Log Symptom', render: window.renderLogging },
    'resources': { title: 'Library', render: window.renderResources },
    'settings': { title: 'Settings', render: window.renderSettings }
};

class App {
    constructor() {
        this.currentRoute = 'dashboard';
        this.contentArea = document.getElementById('main-content');
        this.pageTitle = document.getElementById('page-title');
        this.navItems = document.querySelectorAll('.nav-item');

        this.init();
    }

    init() {
        // Theme Logic
        this.initTheme();

        // Firebase Auth State Observer
        if (window.auth) {
            window.auth.onAuthStateChanged(user => {
                if (user) {
                    if (this.currentRoute === 'login' || !this.currentRoute) {
                        this.navigate('dashboard');
                    }
                    const btn = document.getElementById('logout-btn');
                    if (btn) btn.style.display = 'inline-block';
                } else {
                    this.navigate('login');
                    const btn = document.getElementById('logout-btn');
                    if (btn) btn.style.display = 'none';
                }
            });
        }

        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = item.getAttribute('data-target') || item.closest('.nav-item').getAttribute('data-target');
                this.navigate(target);
            });
        });

        // Avatar Click -> Toggle Theme (Shortcut)
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.style.cursor = 'pointer';
            avatar.onclick = () => this.toggleTheme();
        }

        this.navigate('dashboard');
    }

    initTheme() {
        // Default to light if not set
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    navigate(routeKey) {
        if (!routes[routeKey]) return;

        // Hide UI elements on Login Route
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) bottomNav.style.display = (routeKey === 'login') ? 'none' : 'flex';

        const avatar = document.querySelector('.user-avatar');
        if (avatar) avatar.style.display = (routeKey === 'login') ? 'none' : 'block';

        // Update State
        this.currentRoute = routeKey;

        // Update UI Tabs
        this.navItems.forEach(item => {
            const itemTarget = item.getAttribute('data-target');
            if (itemTarget === routeKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Header
        this.pageTitle.textContent = routes[routeKey].title;

        // Render Content
        // Ensure the function exists (it might be loaded async)
        if (typeof routes[routeKey].render !== 'function') {
            console.error("Render function not found for", routeKey);
            return;
        }

        const content = routes[routeKey].render();
        // If render returns a string, set innerHTML. If it returns an element (future proof), append it.
        // For MVP we assume string or simple sync execution.
        this.contentArea.innerHTML = content;

        // Setup post-render logic (charts, event listeners for new content)
        if (routeKey === 'dashboard') {
            // Re-trigger chart animations etc if needed
        }
        if (routeKey === 'logging') {
            // Attach event listeners to the new form
            this.attachLoggingListeners();
        }
    }

    attachLoggingListeners() {
        const form = document.querySelector('.logging-form');
        const chips = document.querySelectorAll('.tag-chip');
        if (!form) return;

        // Chip selection logic
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
        });

        const saveBtn = document.getElementById('save-log-btn');
        saveBtn.addEventListener('click', () => {
            this.handleLogSubmit();
        });
    }

    handleLogSubmit() {
        const intensity = document.getElementById('intensity-slider').value;
        const selectedSymptoms = Array.from(document.querySelectorAll('.tag-chip.selected')).map(c => c.textContent);

        if (selectedSymptoms.length === 0 && intensity == 0) {
            alert("Please select a symptom or intensity");
            return;
        }

        const logEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            symptoms: selectedSymptoms,
            intensity: parseInt(intensity)
        };

        // Save to LocalStorage
        const history = JSON.parse(localStorage.getItem('hotflash_logs') || '[]');
        history.push(logEntry);
        localStorage.setItem('hotflash_logs', JSON.stringify(history));

        // Provide feedback & redirect
        alert("Symptom logged successfully");
        this.navigate('dashboard');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
