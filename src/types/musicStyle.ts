export const MUSIC_STYLE_OPTIONS = [
  "Rock",
  "Metal",
  "Punk",
  "Indie",
  "Alternativo",
  "Pop Rock",
  "Hard Rock",
  "Rock en Español",
  "Blues",
  "Jazz",
  "Folk",
  "Electrónica",
  "Hip Hop",
  "Reggae",
] as const;

export type MusicStyle = (typeof MUSIC_STYLE_OPTIONS)[number];