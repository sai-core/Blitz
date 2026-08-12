// ---------------------------------------------------------------------
// ACTOR THUMBNAIL FALLBACKS
// ---------------------------------------------------------------------
// Jab kisi video ka "Thumbnail URL" khali chhoda jaye, homepage/player
// yahan actor ke naam se uski photo dhoondhega aur use bana dega default
// thumbnail. Key hamesha lowercase me likho (matching case-insensitive hai).
//
// Naya actor add karna ho:
//  1) Uski photo GitHub repo me upload karo (e.g. "actors/salman.jpg")
//  2) Uska raw URL yahan neeche add kar do:
//     https://raw.githubusercontent.com/<username>/<repo>/main/actors/<file>.jpg
// ---------------------------------------------------------------------

window.ACTOR_THUMBS = {
  "Savannah bond": "https://cdn.myrx.pw/uploads/2026/08/12/19a0a91975e0458db6a1aac604c910e0.jpg",
  "lasirena69": "https://cdn.myrx.pw/uploads/2026/08/12/f12a3125f261489ea6fff0c1945e56e8.jpg",
  "nia bleu": "https://cdn.myrx.pw/uploads/2026/08/12/b6c9f11200f147de9551539e335256f0.jpg"
  // "actor name": "image url",
};

// Case-insensitive lookup helper used by index.html / admin.html / player.html
window.getActorThumb = function (actor) {
  if (!actor) return '';
  const key = String(actor).trim().toLowerCase();
  return window.ACTOR_THUMBS[key] || '';
};

