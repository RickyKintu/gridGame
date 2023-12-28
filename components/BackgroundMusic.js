import React, { useEffect, useContext, useRef, useState } from "react";
import { Audio } from "expo-av";
import { MusicContext } from "../context/MusicContext";

const BackgroundMusic = () => {
  const { isMuted, currentSongIndex, playNextSong, songs } =
    useContext(MusicContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state to track loading status
  const sound = useRef(null);

  if (!sound.current) {
    sound.current = new Audio.Sound();
  }

  useEffect(() => {
    const loadAndPlay = async () => {
      try {
        // Check if already loading
        if (isLoading || isMuted) {
          console.log("A song is already loading or sound is muted");
          return;
        }

        setIsLoading(true); // Set loading state
        console.log("Loading song:", songs[currentSongIndex]);

        await sound.current.unloadAsync();
        await sound.current.loadAsync(songs[currentSongIndex]);
        await sound.current.setVolumeAsync(isMuted ? 0 : 1);
        await sound.current.playAsync();

        setIsLoaded(true);
        setIsLoading(false); // Reset loading state

        sound.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish && isLoaded) {
            playNextSong();
          }
        });
      } catch (error) {
        console.error("Error loading or playing song", error);
        setIsLoading(false); // Reset loading state in case of error
      }
    };

    loadAndPlay();

    return () => {
      sound.current.unloadAsync();
    };
  }, [currentSongIndex, isMuted, playNextSong]);

  return null;
};

export default BackgroundMusic;
