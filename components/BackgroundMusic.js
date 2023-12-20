import React, { useEffect, useContext, useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { MusicContext } from '../context/MusicContext';

const songs = [
  require('../assets/sound/bg_medival.mp3'),
  require('../assets/sound/bg_scheming.mp3'),
  require('../assets/sound/bg_sneaky.mp3'),
  require('../assets/sound/bg_treasure.mp3'),
  // Add more songs here
];

let currentSongIndex = 0;

const BackgroundMusic = () => {
  const { isMuted } = useContext(MusicContext);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state true
  const sound = useRef(new Audio.Sound()).current;

  const loadAndPlay = async () => {
    try {
      await sound.loadAsync(songs[currentSongIndex]);
      await sound.playAsync();
    } catch (error) {
      console.error("Error loading or playing song", error);
    }
  };

  const playNextSong = async () => {
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0; // Reset to the first song
    }

    try {
      await sound.stopAsync(); // Stop the sound before loading the next one
      await loadAndPlay();

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          currentSongIndex++;
          playNextSong();
        }
      });
    } catch (error) {
      console.error("Error loading or playing song", error);
    }
  };

  useEffect(() => {
    loadAndPlay().then(() => {
      setIsLoading(false); // Set loading state to false after successfully loading and playing
    });

    return () => {
      if (sound) {
        sound.stopAsync(); // Stop the sound when the component is unmounted
        sound.unloadAsync(); // Unload the sound when the component is unmounted
      }
    };
  }, []);

  useEffect(() => {
    if (sound && !isLoading) {
      if (isMuted) {
        sound.setVolumeAsync(0);
      } else {
        sound.setVolumeAsync(1);
      }
    }
  }, [isMuted, isLoading]);

  if (isLoading) {
    return null; // Render nothing while loading
  }

  return null;
};

export default BackgroundMusic;
