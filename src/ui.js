
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

export function switchView(mode, isMobile) {
    const userInfoPage = document.getElementById('user-info-page');
    const settingsPage = document.getElementById('settings-page');
    const sidebar = document.getElementById('sidebar');
    const chatArea = document.querySelector('.chat-area');

    // Icons
    const iconUser = document.getElementById('icon-user');
    const iconMessage = document.getElementById('icon-message');
    const iconSetting = document.getElementById('icon-setting');

    // Reset all icons
    if (iconUser) iconUser.classList.remove('active');
    if (iconMessage) iconMessage.classList.remove('active');
    if (iconSetting) iconSetting.classList.remove('active');

    // Hide all main views first
    if (userInfoPage) userInfoPage.style.display = 'none';
    if (settingsPage) settingsPage.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (chatArea) chatArea.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';

    if (mode === 'user') {
        document.body.classList.add('user-view-active');
        if (iconUser) iconUser.classList.add('active');

        if (userInfoPage) {
            userInfoPage.style.display = 'flex';
            userInfoPage.scrollTop = 0;
        }
    } else if (mode === 'setting') {
        document.body.classList.add('user-view-active');
        if (iconSetting) iconSetting.classList.add('active');

        if (settingsPage) {
            settingsPage.style.display = 'flex';
            settingsPage.scrollTop = 0;
        }
    } else {
        // Chat mode
        document.body.classList.remove('user-view-active');
        if (iconMessage) iconMessage.classList.add('active');

        if (sidebar) sidebar.style.display = '';
        if (chatArea) chatArea.style.display = '';

        // Always open contacts list on mobile when switching to chat view
        if (isMobile && sidebar) {
            sidebar.classList.add('open');
        }
    }
}
