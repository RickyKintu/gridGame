import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Current song index

  const songs = [
    require("../assets/sound/bg_medival.mp3"),
    require("../assets/sound/bg_scheming.mp3"),
    require("../assets/sound/bg_sneaky.mp3"),
    require("../assets/sound/bg_treasure.mp3"),
    // ... other songs
  ];

  useEffect(() => {
    const loadMuteState = async () => {
      const muteState = await AsyncStorage.getItem("MUTE_STATE");
      if (muteState !== null) {
        setIsMuted(muteState === "true");
      }
    };

    loadMuteState();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("MUTE_STATE", isMuted.toString());
  }, [isMuted]);

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => {
      // Calculate the next index. If at the end of the array, loop back to 0.
      const nextIndex = (prevIndex + 1) % songs.length;
      return nextIndex;
    });
  };

  return (
    <MusicContext.Provider
      value={{ isMuted, setIsMuted, playNextSong, currentSongIndex, songs }}
    >
      {children}
    </MusicContext.Provider>
  );
};
