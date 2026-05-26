"use client";

import { create } from "zustand";
import { Song } from "@/types/song";

interface PlayerStore {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;

  setQueue: (songs: Song[]) => void;
  setSong: (song: Song) => void;
  setIsPlaying: (value: boolean) => void;

  playNext: () => void;
  playRandom: () => void;

  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,

  setQueue: (songs) =>
    set({
      queue: songs,
    }),

  setSong: (song) =>
    set({
      currentSong: song,
      isPlaying: true,
    }),

  setIsPlaying: (value) =>
    set({
      isPlaying: value,
    }),

  playNext: () => {
    const { currentSong, queue } = get();

    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextSong =
      currentIndex >= 0 && currentIndex < queue.length - 1
        ? queue[currentIndex + 1]
        : queue[0];

    set({
      currentSong: nextSong,
      isPlaying: true,
    });
  },

  playRandom: () => {
    const { currentSong, queue } = get();

    if (queue.length === 0) return;

    const availableSongs = currentSong
      ? queue.filter((song) => song.id !== currentSong.id)
      : queue;

    const randomSong =
      availableSongs[Math.floor(Math.random() * availableSongs.length)] ||
      queue[0];

    set({
      currentSong: randomSong,
      isPlaying: true,
    });
  },

  togglePlay: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
    })),
}));