import React, { useEffect, useContext, useRef, useState } from "react";
import { Audio } from "expo-av";
import { MusicContext } from "../context/MusicContext";

const BackgroundMusic = () => {
  const { isMuted, currentSongIndex, playNextSong, songs, bgMusicVolume } =
    useContext(MusicContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sound = useRef(null);

  if (!sound.current) {
    sound.current = new Audio.Sound();
  }

  useEffect(() => {
    const loadAndPlay = async () => {
      try {
        if (isLoading) {
          console.log("A song is already loading");
          return;
        }

        setIsLoading(true);
        console.log("Loading song:", songs[currentSongIndex]);

        await sound.current.unloadAsync();
        await sound.current.loadAsync(songs[currentSongIndex]);
        await sound.current.setVolumeAsync(isMuted ? 0 : bgMusicVolume);
        await sound.current.playAsync();

        setIsLoaded(true);
        setIsLoading(false);

        sound.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish && isLoaded) {
            playNextSong();
          }
        });
      } catch (error) {
        console.error("Error loading or playing song", error);
        setIsLoading(false);
      }
    };

    loadAndPlay();

    return () => {
      sound.current.unloadAsync();
    };
  }, [currentSongIndex, isMuted, playNextSong, bgMusicVolume]);

  return null;
};

export default BackgroundMusic;
