import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [bgMusicVolume, setBgMusicVolume] = useState(1);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [voicesVolume, setVoicesVolume] = useState(1);

  // Flag to indicate if initial loading from AsyncStorage is done
  const initialLoadComplete = useRef(false);

  const songs = [
    require("../assets/sound/bg_medival.mp3"),
    require("../assets/sound/bg_scheming.mp3"),
    require("../assets/sound/bg_sneaky.mp3"),
    require("../assets/sound/bg_treasure.mp3"),
    // ... other songs
  ];

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const muteState = await AsyncStorage.getItem("MUTE_STATE");
        const storedBgMusicVolume = await AsyncStorage.getItem(
          "BG_MUSIC_VOLUME"
        );
        const storedSfxVolume = await AsyncStorage.getItem("SFX_VOLUME");
        const storedVoicesVolume = await AsyncStorage.getItem("VOICES_VOLUME");

        if (muteState !== null) setIsMuted(muteState === "true");
        if (storedBgMusicVolume !== null)
          setBgMusicVolume(JSON.parse(storedBgMusicVolume));
        if (storedSfxVolume !== null) setSfxVolume(JSON.parse(storedSfxVolume));
        if (storedVoicesVolume !== null)
          setVoicesVolume(JSON.parse(storedVoicesVolume));

        initialLoadComplete.current = true; // Mark initial load as complete
      } catch (error) {
        console.error("Error loading settings", error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  useEffect(() => {
    const saveSettings = async () => {
      try {
        if (initialLoadComplete.current) {
          await AsyncStorage.setItem("MUTE_STATE", isMuted.toString());
          await AsyncStorage.setItem(
            "BG_MUSIC_VOLUME",
            JSON.stringify(bgMusicVolume)
          );
          await AsyncStorage.setItem("SFX_VOLUME", JSON.stringify(sfxVolume));
          await AsyncStorage.setItem(
            "VOICES_VOLUME",
            JSON.stringify(voicesVolume)
          );
        }
      } catch (error) {
        console.error("Error saving settings", error);
      }
    };

    saveSettings();
  }, [isMuted, bgMusicVolume, sfxVolume, voicesVolume]);

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  return (
    <MusicContext.Provider
      value={{
        isMuted,
        setIsMuted,
        playNextSong,
        currentSongIndex,
        songs,
        bgMusicVolume,
        setBgMusicVolume,
        sfxVolume,
        setSfxVolume,
        voicesVolume,
        setVoicesVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
