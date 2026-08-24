// Admin Password Store
let adminPassword = localStorage.getItem('ab_admin_password') || 'admin123';

// Updates site header content dynamically by ID
function updateSiteHeader(logoText, badgeText, headingText) {
    if (logoText) {
        const logoEl = document.getElementById('site-logo');
        if (logoEl) logoEl.innerText = logoText;
    }
    if (badgeText) {
        const badgeEl = document.getElementById('badge-pill');
        if (badgeEl) badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span> ${badgeText}`;
    }
    if (headingText) {
        const headingEl = document.getElementById('core-expertise-heading');
        if (headingEl) headingEl.innerText = headingText;
    }
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Admin Password Auth Modal Controls
function openAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('admin-auth-error').classList.add('hidden');
}

function closeAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function verifyAdminPassword() {
    const enteredPass = document.getElementById('admin-pass-input').value;
    if (enteredPass === adminPassword) {
        closeAdminAuthModal();
        openAdminPanel();
    } else {
        document.getElementById('admin-auth-error').classList.remove('hidden');
    }
}

// Admin Customization Panel Logic
function openAdminPanel() {
    const modal = document.getElementById('admin-panel-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    document.getElementById('edit-logo-text').value = document.getElementById('site-logo').innerText;
    document.getElementById('edit-badge-text').value = document.getElementById('badge-pill').innerText.trim();
    document.getElementById('edit-expertise-heading').value = document.getElementById('core-expertise-heading').innerText;
    document.getElementById('edit-about-bio').value = document.getElementById('about-bio-text').innerText;
    document.getElementById('edit-contact-email').value = document.getElementById('contact-email-link').innerText;
    document.getElementById('edit-linkedin-url').value = document.getElementById('linkedin-link').href;
    document.getElementById('edit-profile-photo').value = document.getElementById('profile-img').getAttribute('src');
}

function closeAdminPanel() {
    const modal = document.getElementById('admin-panel-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
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
        emailLink.innerText = newEmail;
        emailLink.href = `mailto:${newEmail}`;
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
    alert('Website customizations saved successfully!');
}

// DOM Event Listeners & Startup Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Handler
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light', !isDark);
            if (themeIcon) {
                themeIcon.className = isDark ? 'fa-solid fa-moon text-base' : 'fa-solid fa-sun text-base';
            }
            localStorage.setItem('ab_theme', isDark ? 'dark' : 'light');
        });
    }

    // Restore Saved Theme
    if (localStorage.getItem('ab_theme') === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-base';
    }

    // Mobile Menu Button Event
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }

    // Restore Saved Customizations
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
                emailLink.innerText = data.email;
                emailLink.href = `mailto:${data.email}`;
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

    // Formspree Contact Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Sending Inquiry...`;

            const data = new FormData(event.target);

            try {
                const response = await fetch(event.target.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.className = "p-4 rounded-xl text-center text-sm font-medium bg-emerald-500/10 text-brand-500 border border-brand-500/20";
                    formStatus.innerHTML = "<i class='fa-solid fa-circle-check'></i> Thank you! Your message has been sent successfully to Aliganyira Barnabus Joses.";
                    contactForm.reset();
                } else {
                    formStatus.className = "p-4 rounded-xl text-center text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20";
                    formStatus.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Problem submitting form. Please check network.";
                }
            } catch (error) {
                formStatus.className = "p-4 rounded-xl text-center text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20";
                formStatus.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Network error. Please try again.";
            } finally {
                formStatus.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message Directly`;
            }
        });
    }
});
