import { renderAvatar } from './utils.js';

export function renderContacts(contacts, activeContactId, onSelectContact) {
    const list = document.getElementById('contact-list');

    // Check if we need a full re-render (empty list) or just an update
    if (list.children.length === 0) {
        list.innerHTML = contacts.map((contact, index) => `
            <div class="contact-item ${contact.id === activeContactId ? 'active' : ''} anim-slide-left"
                 data-id="${contact.id}" style="animation-delay: ${index * 0.05}s">
                <div class="contact-avatar">
                    ${renderAvatar(contact.avatar, contact.name)}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-preview">${contact.preview}</div>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', () => {
                onSelectContact(item.dataset.id);
            });
        });
    } else {
        // Just update the active class
        list.querySelectorAll('.contact-item').forEach(item => {
            if (item.dataset.id === activeContactId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

export function updateActiveContact(activeContactId) {
    document.querySelectorAll('.contact-item').forEach(item => {
        if (item.dataset.id === activeContactId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

export function renderMessages(contact, onChoice) {
    const container = document.getElementById('chat-messages');

    if (!contact) {
        container.innerHTML = '';
        return;
    }

    // Scroll to top
    container.scrollTop = 0;

    let html = '';
    let lastType = null;

    contact.messages.forEach((msg, idx) => {
        if (msg.type === 'received') {
            if (lastType !== 'received') {
                html += `
                    <div class="message-row">
                        <div class="message-avatar">
                            ${renderAvatar(contact.avatar, contact.name)}
                        </div>
                        <div class="message-content">
                            <div class="message-sender-name">${contact.name}</div>
                `;
            }
            html += `<div class="message-bubble received anim-fade">${msg.text}</div>`;

            const nextMsg = contact.messages[idx + 1];
            if (!nextMsg || nextMsg.type !== 'received') {
                html += `</div></div>`;
            }
        } else if (msg.type === 'sent') {
            html += `
                <div class="message-row sent">
                    <div class="message-bubble sent anim-fade">${msg.text}</div>
                </div>
            `;
        } else if (msg.type === 'choices') {
            html += `
            <div class="message-row sent">
                <div class="message-choices">
                    <div class="choice-header">
                        <div class="choice-header-point"></div>
                        <div class="choice-header-title">${msg.label || '답장하기'}</div>
                    </div>
                    <div class="choice-section-divider"></div>
                    ${msg.options.map((opt, optIdx) => {
                const variantClass = opt.variant === 'secondary' ? ' secondary' : '';
                if (opt.url) {
                    return `<a href="${opt.url}" target="_blank" rel="noopener noreferrer" class="choice-button${variantClass}">${opt.text}</a>`;
                } else {
                    return `<button class="choice-button${variantClass}" data-action="${opt.action}">${opt.text}</button>`;
                }
            }).join('')}
                </div>
            </div>
            `;
        }
        lastType = msg.type;
    });

    container.innerHTML = html;

    container.querySelectorAll('.choice-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onChoice(btn.dataset.action);
        });
    });
}
