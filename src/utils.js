
export function renderAvatar(avatar, name) {
    return avatar
        ? `<img src="${avatar}" alt="${name}">`
        : name.charAt(0);
}

export function formatText(text) {
    return text.replace(/\n/g, ' <br class="mobile-break">');
}
