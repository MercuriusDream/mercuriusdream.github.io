
export function renderAvatar(avatar, name) {
    return avatar
        ? `<img src="${avatar}" alt="${name}">`
        : name.charAt(0);
}

export function formatText(text) {
    return text.replace(/\n/g, ' <br class="mobile-break">');
}

export function getLanguage(languages) {
    const langParam = URLSearchParams(window.location.search).get('lang');
    if (langParam in languages) return langParam;

    try {
        const storedLanguage = localStorage.getItem('language')
        if (storedLanguage in languages) return storedLanguage;
    } catch (e) { }

    let userAgentLanguage = navigator.language;
    if (userAgentLanguage in languages) return userAgentLanguage;
    for (let iterLang of navigator.languages) {
        if (iterLang in languages) return iterLang;
        if (iterLang.startsWith('en-')) return 'en';
    }
    return 'en';
}
