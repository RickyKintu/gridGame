import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { MusicContext } from "../context/MusicContext";
import SoundManager from "../managers/SoundManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SoundSettings = () => {
  const {
    bgMusicVolume,
    setBgMusicVolume,
    sfxVolume,
    setSfxVolume,
    voicesVolume,
    setVoicesVolume,
  } = useContext(MusicContext);

  function roundToOneDecimal(number) {
    return Math.round(number * 10) / 10;
  }

  const handleBgMusicVolumeChange = async (value) => {
    const formattedValue = roundToOneDecimal(value);
    setBgMusicVolume(formattedValue);
    console.log("BGM volume: ", formattedValue);
  };

  const handleSfxVolumeChange = async (value) => {
    const formattedValue = roundToOneDecimal(value);
    setSfxVolume(formattedValue);
    console.log("SFX volume: ", formattedValue);
    SoundManager.playBomb(formattedValue);
  };

  const handleVoicesVolumeChange = async (value) => {
    const formattedValue = roundToOneDecimal(value);
    setVoicesVolume(formattedValue);
    console.log("Voices volume: ", formattedValue);
    SoundManager.play3iar(formattedValue);
  };

  return (
    <View style={styles.container}>
      <Text>Background Music Volume</Text>
      <Slider
        value={bgMusicVolume}
        onValueChange={(value) => handleBgMusicVolumeChange(value)}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />

      <Text>Sound Effects Volume</Text>
      <Slider
        value={sfxVolume}
        onValueChange={(value) => handleSfxVolumeChange(value)}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />

      <Text>Voice Volume</Text>
      <Slider
        value={voicesVolume}
        onValueChange={(value) => handleVoicesVolumeChange(value)}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles for your container
  },
  // Other styles
});

export default SoundSettings;
