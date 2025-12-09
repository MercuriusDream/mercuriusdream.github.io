import { formatText } from './utils.js';

export function renderUserProfile(userProfile) {
    const container = document.getElementById('user-info-page');
    if (!container) return;

    container.innerHTML = `
        <div class="profile-header anim-slide-up" style="animation-delay: 0s">
            <div class="profile-avatar-large">
                <img src="${userProfile.avatar}" alt="${userProfile.name}">
            </div>
            <div class="profile-name-large">${userProfile.name}</div>
            <div class="profile-box">
                <div class="profile-status">${userProfile.status}</div>
                <div class="profile-birthdate">🎂 ${userProfile.birthdate}</div>
            </div>
            ${userProfile.socialLinks ? `
            <div class="social-links">
                ${userProfile.socialLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${link.label}">
                        <i class="${link.icon}"></i>
                    </a>
                `).join('')}
            </div>
            ` : ''}
        </div>

        <div class="profile-stats-container">
            ${userProfile.statsCards.map((card, i) => `
                <div class="profile-stats-card anim-slide-up" style="animation-delay: ${0.1 + (i * 0.1)}s">
                    <div class="stats-header">
                        ${card.title}
                    </div>
                    ${card.stats.map(stat => `
                        <div class="stat-row">
                            <span class="stat-label">${formatText(stat.label)}</span>
                            <span class="stat-value">${formatText(stat.value)}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>

        ${userProfile.bonusCard ? `
        <div class="profile-bonus-card anim-slide-up" style="animation-delay: 0.3s">
             <div class="stats-header">
                ${userProfile.bonusCard.title}
            </div>
            <div class="bonus-list">
                ${userProfile.bonusCard.items.map(item => `
                    <div class="bonus-item">
                        <img src="${item.image}" alt="Bonus Target">
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}
        <a class="profile-easter-egg anim-slide-up" href="https://www.youtube.com/watch?v=qbDVCZvLE3k" style="animation-delay: 0.4s"><div>으헤~</div></a>
    `;
}
