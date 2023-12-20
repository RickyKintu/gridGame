import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  // Load the mute state from AsyncStorage when the app starts
  useEffect(() => {
    const loadMuteState = async () => {
      const muteState = await AsyncStorage.getItem('MUTE_STATE');
      console.log(muteState)
      if (muteState !== null) {
        setIsMuted(muteState === 'true');
      }
    };

    loadMuteState();
  }, []);

  // Save the mute state to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('MUTE_STATE', isMuted.toString());
    console.log("set sync to: " + isMuted)
  }, [isMuted]);

  return (
    <MusicContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </MusicContext.Provider>
  );
};
