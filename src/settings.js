
const settingsTranslations = {
    English: {
        title: 'Settings',
        language: 'Language',
        disclaimers: 'Disclaimers'
    },
    Korean: {
        title: '설정',
        language: '언어',
        disclaimers: 'Disclaimers'
    },
    Japanese: {
        title: '設定',
        language: '言語',
        disclaimers: 'Disclaimers'
    }
};
export function renderSettings() {
    const container = document.getElementById('settings-page');
    if (!container) return;

    const currentLanguage = (window.location.search && new URLSearchParams(window.location.search).get('lang')) ? new URLSearchParams(window.location.search).get('lang') : localStorage.getItem('language') || 'English';
    const texts = settingsTranslations[currentLanguage] || settingsTranslations['English'];

    const getActiveClass = (lang) => currentLanguage === lang ? 'active' : '';

    container.innerHTML = `
        <div class="profile-header anim-slide-up" style="animation-delay: 0s">
            <div class="profile-name-large">${texts.title}</div>
        </div>

        <div class="profile-stats-container">
            <div class="profile-stats-card anim-slide-up" style="animation-delay: 0.1s">
                <div class="stats-header">
                    ${texts.language}
                </div>
                <div class="stat-row">
                    <div class="option-group" id="lang-options">
                        <div class="option-item ${getActiveClass('English')}" data-value="English">
                            <div class="option-radio"></div>
                            <span class="option-label">English</span>
                        </div>
                        <div class="option-item ${getActiveClass('Korean')}" data-value="Korean">
                            <div class="option-radio"></div>
                            <span class="option-label">Korean</span>
                        </div>
                        <div class="option-item ${getActiveClass('Japanese')}" data-value="Japanese">
                            <div class="option-radio"></div>
                            <span class="option-label">Japanese</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-stats-card anim-slide-up" style="animation-delay: 0.2s">
                <div class="stats-header">
                    ${texts.disclaimers}
                </div>
                <div class="stat-row">
                    <span class="stat-label">Inspired from Blue Archive by Nexon Games</span>
                </div>
            </div>
        </div>
    `;

    // Add Event Listeners for Radio Buttons
    const optionGroup = container.querySelector('#lang-options');
    const options = optionGroup.querySelectorAll('.option-item');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const newLang = option.dataset.value;
            const currentLang = localStorage.getItem('language') || 'English';

            if (newLang === currentLang) return;

            // Update UI
            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            localStorage.setItem('language', newLang);
            console.log(`Language changed to: ${newLang}`);

            // Dispatch event for other components (like bio)
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));

            // Re-render self to update texts
            renderSettings();
        });
    });
}

// Initialize settings (can be called on app load or first view)
export function initSettings() {
    renderSettings();
}
