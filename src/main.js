import { renderContacts, updateActiveContact, renderMessages } from './chats.js';
import { toggleSidebar, switchView } from './ui.js';
import { loadData } from './data.js';
import { initSettings, setSettingsData } from './settings.js';
import { renderUserProfile } from './bio.js';
import { getLanguage } from './utils.js';

const MOBILE_BREAKPOINT = 768;
let activeContactId = 'About';
let contacts = [];
let bioData = null;
let currentLanguage;

function getLocalizedProfile() {
    if (!bioData) return null;
    return { ...bioData.common, ...(bioData[currentLanguage]) };
}

function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function updateMobileReturnButton() {
    const returnBtn = document.getElementById('mobile-return-btn');
    const sidebar = document.getElementById('sidebar');
    if (!returnBtn || !sidebar) return;

    if (isMobile()) {
        returnBtn.style.display = sidebar.classList.contains('open') ? 'none' : 'flex';
    } else {
        returnBtn.style.display = 'none';
    }
}

function handleSelectContact(id, fromChoice = false) {
    activeContactId = id;
    updateActiveContact(activeContactId);
    renderMessages(contacts.find(c => c.id === activeContactId), handleChoice);

    // Only close sidebar on mobile if NOT coming from a choice button
    if (isMobile() && !fromChoice) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
        updateMobileReturnButton();
    }
}

function handleChoice(action) {
    console.log('Choice selected:', action);

    // Check if the action corresponds to a contact ID
    const targetContact = contacts.find(c => c.id === action);
    if (targetContact) {
        handleSelectContact(action, true); // Pass true to indicate this is from a choice
    } else {
        console.warn('No contact found for action:', action);
    }
}

function setupEventListeners() {
    const menuBtn = document.querySelector('.header-menu-button');
    const returnBtn = document.getElementById('mobile-return-btn');
    const iconUser = document.getElementById('icon-user');
    const iconMessage = document.getElementById('icon-message');
    const iconSetting = document.getElementById('icon-setting');
    const chatArea = document.querySelector('.chat-area');

    if (menuBtn) menuBtn.onclick = toggleSidebar;

    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('open');
            updateMobileReturnButton();
        });
    }

    if (chatArea) {
        chatArea.addEventListener('click', () => {
            if (isMobile()) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && !sidebar.classList.contains('open')) {
                    sidebar.classList.add('open');
                    updateMobileReturnButton();
                }
            }
        });
    }

    if (iconUser) {
        iconUser.addEventListener('click', () => {
            if (bioData) renderUserProfile(getLocalizedProfile());
            switchView('user', isMobile());
        });
    }

    if (iconMessage) {
        iconMessage.addEventListener('click', () => {
            switchView('chat', isMobile());
            updateMobileReturnButton();
        });
    }

    if (iconSetting) {
        iconSetting.addEventListener('click', () => {
            initSettings();
            switchView('setting', isMobile());
        });
    }

    window.addEventListener('resize', updateMobileReturnButton);

    document.addEventListener('languageChanged', (e) => {
        currentLanguage = e.detail.language;
        if (bioData) renderUserProfile(getLocalizedProfile());
    });
}

async function init() {
    try {
        const data = await loadData();
        contacts = data.contacts;
        bioData = data.bioData;
        setSettingsData(data.settingsData);
        currentLanguage = getLanguage(data.settingsData);
        try {
            localStorage.setItem('language', currentLanguage);
        } catch (e) {}
    } catch (error) {
        console.error('Error loading data:', error);
        return;
    }

    // Set initial view to user profile
    document.body.classList.add('user-view-active');

    if (bioData) renderUserProfile(getLocalizedProfile());

    renderContacts(contacts, activeContactId, handleSelectContact);
    renderMessages(contacts.find(c => c.id === activeContactId), handleChoice);

    initSettings();
    setupEventListeners();
    updateMobileReturnButton();
}

document.addEventListener('DOMContentLoaded', init);
