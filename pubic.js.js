// Replace this string with your custom Formspree endpoint ID (e.g., "https://formspree.io/f/xbjnqweo")
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID";

document.addEventListener('DOMContentLoaded', () => {
  fetchContent();

  // Admin Panel Drawer Toggle
  const adminDrawer = document.getElementById('adminDrawer');
  document.getElementById('toggleAdminBtn').addEventListener('click', () => adminDrawer.classList.toggle('open'));
  document.getElementById('closeAdminBtn').addEventListener('click', () => adminDrawer.classList.remove('open'));

  // Bind Realtime Customizer Controls
  bindRealtimeControls();

  // Form Submission
  document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
  document.getElementById('saveContentBtn').addEventListener('click', saveContentToBackend);
});

// 1. Fetch State from API
async function fetchContent() {
  try {
    const res = await fetch('/api/content');
    const data = await res.json();
    applyState(data);
  } catch (err) {
    console.error('Could not load content from API:', err);
  }
}

// 2. Apply typography variables and DOM content
function applyState(data) {
  const { typography, content } = data;

  // Set CSS Variables
  document.documentElement.style.setProperty('--font-family', typography.fontFamily);
  document.documentElement.style.setProperty('--text-color', typography.textColor);
  document.documentElement.style.setProperty('--heading-color', typography.headingColor);
  document.documentElement.style.setProperty('--font-size-base', typography.fontSize + 'px');
  document.documentElement.style.setProperty('--letter-spacing', typography.letterSpacing + 'px');
  document.documentElement.style.setProperty('--hero-bg-url', `url('${content.bgImageUrl}')`);

  // Populate Website Elements
  document.getElementById('displayHeroHeading').textContent = content.heroHeading;
  document.getElementById('displayHeroSubheading').textContent = content.heroSubheading;
  document.getElementById('displayAboutText').textContent = content.aboutText;

  // Populate Admin Inputs
  document.getElementById('inputFontFamily').value = typography.fontFamily;
  document.getElementById('inputTextColor').value = typography.textColor;
  document.getElementById('inputHeadingColor').value = typography.headingColor;
  document.getElementById('inputFontSize').value = typography.fontSize;
  document.getElementById('fontSizeVal').textContent = typography.fontSize + 'px';
  document.getElementById('inputLetterSpacing').value = typography.letterSpacing;
  document.getElementById('letterSpacingVal').textContent = typography.letterSpacing + 'px';

  document.getElementById('inputBgUrl').value = content.bgImageUrl;
  document.getElementById('inputHeroHeading').value = content.heroHeading;
  document.getElementById('inputHeroSubheading').value = content.heroSubheading;
  document.getElementById('inputAboutText').value = content.aboutText;
}

// 3. Realtime Visual Preview
function bindRealtimeControls() {
  document.getElementById('inputFontFamily').addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--font-family', e.target.value);
  });
  document.getElementById('inputTextColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--text-color', e.target.value);
  });
  document.getElementById('inputHeadingColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--heading-color', e.target.value);
  });
  document.getElementById('inputFontSize').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--font-size-base', e.target.value + 'px');
    document.getElementById('fontSizeVal').textContent = e.target.value + 'px';
  });
  document.getElementById('inputLetterSpacing').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--letter-spacing', e.target.value + 'px');
    document.getElementById('letterSpacingVal').textContent = e.target.value + 'px';
  });
  document.getElementById('inputBgUrl').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--hero-bg-url', `url('${e.target.value}')`);
  });
  document.getElementById('inputHeroHeading').addEventListener('input', (e) => {
    document.getElementById('displayHeroHeading').textContent = e.target.value;
  });
  document.getElementById('inputHeroSubheading').addEventListener('input', (e) => {
    document.getElementById('displayHeroSubheading').textContent = e.target.value;
  });
  document.getElementById('inputAboutText').addEventListener('input', (e) => {
    document.getElementById('displayAboutText').textContent = e.target.value;
  });
}

// 4. Save Changes back to Node backend
async function saveContentToBackend() {
  const updatedData = {
    typography: {
      fontFamily: document.getElementById('inputFontFamily').value,
      textColor: document.getElementById('inputTextColor').value,
      headingColor: document.getElementById('inputHeadingColor').value,
      fontSize: document.getElementById('inputFontSize').value,
      letterSpacing: document.getElementById('inputLetterSpacing').value
    },
    content: {
      heroHeading: document.getElementById('inputHeroHeading').value,
      heroSubheading: document.getElementById('inputHeroSubheading').value,
      bgImageUrl: document.getElementById('inputBgUrl').value,
      aboutText: document.getElementById('inputAboutText').value
    }
  };

  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      alert('Portfolio content and styling saved successfully!');
    } else {
      alert('Failed to save content.');
    }
  } catch (err) {
    console.error('Error saving:', err);
  }
}

// 5. Direct-to-Inbox Email Form via Formspree
async function handleContactSubmit(e) {
  e.preventDefault();
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  submitBtn.disabled = true;
  statusDiv.style.color = '#00f2fe';
  statusDiv.textContent = 'Transmitting inquiry...';

  const formData = new FormData(e.target);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusDiv.style.color = '#4bae4f';
      statusDiv.textContent = 'Message transmitted successfully! Check your inbox.';
      e.target.reset();
    } else {
      statusDiv.style.color = '#f44336';
      statusDiv.textContent = 'Failed to transmit message. Please verify Formspree endpoint ID.';
    }
  } catch (error) {
    statusDiv.style.color = '#f44336';
    statusDiv.textContent = 'Network error occurred.';
  } finally {
    submitBtn.disabled = false;
  }
}