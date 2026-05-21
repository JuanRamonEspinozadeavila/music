export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audio: string;
  type?: "song" | "podcast";
  cdo?: string;
  description?: string;
}