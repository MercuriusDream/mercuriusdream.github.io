import { bySlug } from './meta';

// A short, raw personal note — just prose, no model transcript, no images.
// The body is the writing. Lightweight metadata (title/blurb/accent/…) lives
// in ./meta.

const doc = {
  ...bySlug['exhausted'],

  transcript: `I don't even know why I'm even writing this but I just feel so exhausted. Kinda like no one sees me or everyone ignores me version but kinda grounded but idk`,
};

export default doc;