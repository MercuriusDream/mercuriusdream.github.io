import { getLanguage } from './utils.js';

let settingsTranslations = null;

export function setSettingsData(data) {
    settingsTranslations = data;
}

export function renderSettings() {
    const container = document.getElementById('settings-page');
    if (!container || !settingsTranslations) return;

    const currentLanguage = getLanguage(settingsTranslations);
    const texts = settingsTranslations[currentLanguage] || settingsTranslations['en'];

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
                        <div class="option-item ${getActiveClass('en')}" data-value="en">
                            <div class="option-radio"></div>
                            <span class="option-label">English</span>
                        </div>
                        <div class="option-item ${getActiveClass('ko-KR')}" data-value="ko-KR">
                            <div class="option-radio"></div>
                            <span class="option-label">한국어</span>
                        </div>
                        <div class="option-item ${getActiveClass('ja-JP')}" data-value="ja-JP">
                            <div class="option-radio"></div>
                            <span class="option-label">日本語</span>
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

    const optionGroup = container.querySelector('#lang-options');
    const options = optionGroup.querySelectorAll('.option-item');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const newLang = option.dataset.value;
            const currentLang = localStorage.getItem('language') || 'en';

            if (newLang === currentLang) return;

            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            localStorage.setItem('language', newLang);
            console.log(`Language changed to: ${newLang}`);

            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));
            renderSettings();
        });
    });
}

export function initSettings() {
    renderSettings();
}
