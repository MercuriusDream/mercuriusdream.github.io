import { renderUserProfile } from './bio.js';

export async function loadData() {
    const bioResponse = await fetch('./data/bio.json');
    if (!bioResponse.ok) throw new Error('Failed to load bio');
    const bioData = await bioResponse.json();

    const chatsResponse = await fetch('./data/chats.json');
    if (!chatsResponse.ok) throw new Error('Failed to load chats list');
    const chatList = await chatsResponse.json();

    const chatPromises = chatList.map(item => fetch(item.src).then(res => res.json()));
    const contacts = await Promise.all(chatPromises);

    return { contacts, bioData };
}
