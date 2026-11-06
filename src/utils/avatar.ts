// Vector SVG Initials Avatar generator for restaurant staff (replaces external human photos)
export function createStaffAvatar(
  initials: string,
  gradientStart: string,
  gradientEnd: string,
  accentColor: string = '#ffffff'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="grad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}"/>
      <stop offset="100%" stop-color="${gradientEnd}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="64" fill="url(#grad-${initials})"/>
  <circle cx="64" cy="64" r="56" fill="none" stroke="${accentColor}" stroke-width="2" stroke-opacity="0.25"/>
  <text x="64" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="${accentColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="1.5">${initials}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const STAFF_AVATARS: Record<string, string> = {
  'EMP-101': createStaffAvatar('AW', '#15803d', '#14532d', '#ffffff'), // Alexander Wright - Forest Emerald
  'EMP-102': createStaffAvatar('MV', '#1d4ed8', '#1e3a8a', '#ffffff'), // Marcus Vance - Royal Sapphire
  'EMP-103': createStaffAvatar('JM', '#0f766e', '#134e4a', '#ffffff'), // Julian Montgomery - Veranda Teal
  'EMP-104': createStaffAvatar('CL', '#7e22ce', '#581c87', '#ffffff'), // Christian Laurent - VIP Violet
  'EMP-105': createStaffAvatar('ER', '#be185d', '#831843', '#ffffff'), // Elena Rostova - Wine Berry
  'EMP-106': createStaffAvatar('LB', '#374151', '#1f2937', '#ffffff'), // Lucas Bennett - Charcoal Slate
  'EMP-107': createStaffAvatar('DS', '#b45309', '#78350f', '#ffffff'), // Dominic Sterling - Expediter Bronze
  'EMP-108': createStaffAvatar('SC', '#e11d48', '#9f1239', '#ffffff'), // Sophia Chen - Crimson Rose
  'EMP-109': createStaffAvatar('OH', '#475569', '#334155', '#ffffff'), // Oliver Hayes - Steel Slate
  'EMP-110': createStaffAvatar('GS', '#0284c7', '#0369a1', '#ffffff'), // Gabriel Silva - Ocean Azure
  'MGR-001': createStaffAvatar('AP', '#0f172a', '#1e293b', '#facc15'), // Arthur Pendelton (GM) - Obsidian & Gold
}
