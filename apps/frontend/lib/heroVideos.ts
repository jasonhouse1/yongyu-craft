// Optional looping hero background video for a work.
//
// Matched by the asset-folder slug embedded in the work's coverImage path,
// which follows the convention `/images/works/<slug>/<file>`. Keep this list
// small and curated: a hero video is a bespoke ambient loop produced per work,
// not something every work should have.
const HERO_VIDEOS: Record<string, string> = {
  "lumiere-ring": "/videos/lumiere-hero.mp4",
};

/**
 * Returns the local hero background video for a work, or null when it has none.
 * @param coverImage the work's coverImage path (e.g. `/images/works/lumiere-ring/main.png`)
 */
export function heroVideoFor(coverImage?: string | null): string | null {
  if (!coverImage) return null;
  const slug = coverImage.match(/\/images\/works\/([^/]+)\//)?.[1];
  return slug ? HERO_VIDEOS[slug] ?? null : null;
}
