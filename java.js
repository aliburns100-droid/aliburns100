let adminPassword = localStorage.getItem('ab_admin_password') || 'admin123';

// Fixed Header Update Function preserving HTML styling
function updateSiteHeader(logoText, badgeText, headingText) {
    if (logoText) {
        const logoEl = document.getElementById('site-logo');
        if (logoEl) logoEl.innerHTML = logoText;
    }
    if (badgeText) {
        const badgeEl = document.getElementById('badge-pill');
        if (badgeEl) badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span> ${badgeText}`;
    }
    if (headingText) {
        const headingEl = document.getElementById('core-expertise-heading');
        if (headingEl) headingEl.innerHTML = headingText;
    }
}

// Navigation & Theme Toggles
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light', !isDark);
    if (themeIcon) themeIcon.className = isDark ? 'fa-solid fa-moon text-base' : 'fa-solid fa-sun text-base';
    localStorage.setItem('ab_theme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('ab_theme') === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-base';
}

// Admin Auth Modal Functions with class switching
function openAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    document.getElementById('admin-auth-error')?.classList.add('hidden');
}

function closeAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function verifyAdminPassword() {
    const enteredPass = document.getElementById('admin-pass-input').value;
    if (enteredPass === adminPassword) {
        closeAdminAuthModal();
        openAdminPanel();
    } else {
        document.getElementById('admin-auth-error')?.classList.remove('hidden');
    }
}

// Enter Key listener for Password Input
document.getElementById('admin-pass-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        verifyAdminPassword();
    }
});

// Admin Panel Toggle Functions
function openAdminPanel() {
    const panel = document.getElementById('admin-panel-modal');
    if (panel) {
        panel.classList.remove('hidden');
        panel.classList.add('flex');
    }
    
    document.getElementById('edit-logo-text').value = document.getElementById('site-logo')?.innerHTML || '';
    document.getElementById('edit-badge-text').value = document.getElementById('badge-pill')?.innerText.trim() || '';
    document.getElementById('edit-expertise-heading').value = document.getElementById('core-expertise-heading')?.innerHTML || '';
    document.getElementById('edit-about-bio').value = document.getElementById('about-bio-text')?.innerText || '';
    document.getElementById('edit-contact-email').value = document.getElementById('contact-email-link')?.innerText || '';
    document.getElementById('edit-linkedin-url').value = document.getElementById('linkedin-link')?.href || '';
    document.getElementById('edit-profile-photo').value = document.getElementById('profile-img')?.getAttribute('src') || '';
}

function closeAdminPanel() {
    const panel = document.getElementById('admin-panel-modal');
    if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }
}

function saveAdminCustomizations(e) {
    e.preventDefault();

    const newLogo = document.getElementById('edit-logo-text').value;
    const newBadge = document.getElementById('edit-badge-text').value;
    const newHeading = document.getElementById('edit-expertise-heading').value;
    const newBio = document.getElementById('edit-about-bio').value;
    const newEmail = document.getElementById('edit-contact-email').value;
    const newLinkedin = document.getElementById('edit-linkedin-url').value;
    const newBgUrl = document.getElementById('edit-bg-url').value;
    const newPhoto = document.getElementById('edit-profile-photo').value;

    updateSiteHeader(newLogo, newBadge, newHeading);

    if (newBio) document.getElementById('about-bio-text').innerText = newBio;
    if (newEmail) {
        const emailLink = document.getElementById('contact-email-link');
        if (emailLink) {
            emailLink.innerText = newEmail;
            emailLink.href = `mailto:${newEmail}`;
        }
    }
    if (newLinkedin) document.getElementById('linkedin-link').href = newLinkedin;
    if (newPhoto) document.getElementById('profile-img').src = newPhoto;

    if (newBgUrl) {
        document.getElementById('dynamic-bg').style.backgroundImage = `linear-gradient(to bottom, rgba(10, 15, 29, var(--bg-overlay-opacity)), rgba(10, 15, 29, 0.97)), url('${newBgUrl}')`;
    }

    const customizationData = {
        logo: newLogo,
        badge: newBadge,
        heading: newHeading,
        bio: newBio,
        email: newEmail,
        linkedin: newLinkedin,
        bgUrl: newBgUrl,
        photo: newPhoto
    };
    localStorage.setItem('ab_portfolio_customizations', JSON.stringify(customizationData));

    closeAdminPanel();
}

// Startup Persistence Listener
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('ab_portfolio_customizations');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.logo || data.badge || data.heading) {
                updateSiteHeader(data.logo, data.badge, data.heading);
            }
            if (data.bio) document.getElementById('about-bio-text').innerText = data.bio;
            if (data.email) {
                const emailLink = document.getElementById('contact-email-link');
                if (emailLink) {
                    emailLink.innerText = data.email;
                    emailLink.href = `mailto:${data.email}`;
                }
            }
            if (data.linkedin) document.getElementById('linkedin-link').href = data.linkedin;
            if (data.photo) document.getElementById('profile-img').src = data.photo;
            if (data.bgUrl) {
                document.getElementById('dynamic-bg').style.backgroundImage = `linear-gradient(to bottom, rgba(10, 15, 29, var(--bg-overlay-opacity)), rgba(10, 15, 29, 0.97)), url('${data.bgUrl}')`;
            }
        } catch (e) {
            console.error('Error parsing stored customizations', e);
        }
    }
});
