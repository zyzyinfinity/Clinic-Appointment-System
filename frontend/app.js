// Same-origin: the Express server serves this frontend and the /api routes.
const API_URL = '/api';

// EmailJS Configuration (from User Input)
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_cblwqc9',
    TEMPLATE_ID: 'template_p2ozxm6',
    PUBLIC_KEY: '9OyXEhZtG0A6igSw6'
};

const app = {
    init() {
        this.updateNav();
        this.attachAuthListeners();
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    updateNav() {
        const authNav = document.getElementById('auth-nav');
        if (!authNav) return;

        if (this.isAuthenticated()) {
            const user = JSON.parse(localStorage.getItem('user'));
            authNav.innerHTML = `
                <a href="appointments.html"><i class="fas fa-calendar"></i> My Appointments</a>
                <span style="font-weight: 600; margin-left:10px;">Hi, ${user.name}</span>
                <button onclick="app.logout()" class="btn btn-secondary" style="padding: 6px 12px; margin-left: 10px;">Logout</button>
            `;
        } else {
            authNav.innerHTML = `
                <a href="index.html" class="btn">Login / Register</a>
            `;
            // Redirect to login if on protected page
            const protectedPages = ['book-appointment.html', 'appointments.html'];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'index.html';
            }
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.querySelector('.message').textContent = message;
        toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
        
        const icon = toast.querySelector('.icon');
        icon.className = type === 'success' ? 'fas fa-check-circle icon' : 'fas fa-exclamation-circle icon';

        setTimeout(() => {
            toast.className = `toast ${type === 'error' ? 'error' : ''}`;
        }, 3000);
    },

    async request(endpoint, method = 'GET', body = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (this.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${this.getToken()}`;
        }

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            
            return data;
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        }
    },

    attachAuthListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                try {
                    const data = await this.request('/auth/login', 'POST', { email, password });
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    this.showToast('Login successful!');
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {}
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const phone = document.getElementById('register-phone').value;
                const password = document.getElementById('register-password').value;

                try {
                    await this.request('/auth/register', 'POST', { name, email, phone, password });
                    this.showToast('Registration successful! Please login.');
                    document.getElementById('show-login').click();
                } catch (error) {}
            });
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    // Include EmailJS script dynamically
    initEmailJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        };
        document.head.appendChild(script);
    },

    async sendConfirmationEmail(appointmentDetails) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const templateParams = {
                to_name: user.name,
                to_email: user.email,
                doctor_name: appointmentDetails.doctor_name,
                appointment_date: appointmentDetails.date,
                appointment_time: appointmentDetails.time
            };

            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            );
            console.log("Email sent successfully!");
        } catch (error) {
            console.error("Failed to send email:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
    app.initEmailJS();
});

window.app = app;
