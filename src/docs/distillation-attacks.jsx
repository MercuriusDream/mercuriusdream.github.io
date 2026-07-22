import { bySlug } from './meta';

// A single screenshot, presented as-is — the image is the whole writing.
// No transcript, no tool blocks, no model named in the chrome; the picture
// speaks for itself. Lightweight metadata (title/blurb/accent/…) lives in
// ./meta.

const doc = {
  ...bySlug['distillation-attacks'],

  image: {
    src: '/writings/distillation-attacks.png',
    alt: `Screenshot of a chat with a frontier model. The user asks "What's your name?"; the model replies "I'm Kimi, an AI assistant developed by Moonshot AI. How can I help you today?"`,
    align: 'left', // 'center' to opt out of the default left alignment
  },
};

export default doc;
