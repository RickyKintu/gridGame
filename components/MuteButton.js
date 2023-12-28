// MuteButton.js
import React, { useContext } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { MusicContext } from "../context/MusicContext";

const MuteButton = () => {
  const { isMuted, setIsMuted, playNextSong } = useContext(MusicContext);

  return (
    <TouchableOpacity
      style={styles.muteButton}
      onPress={() => setIsMuted(!isMuted)}
      onLongPress={playNextSong} // Handle long press
    >
      <Image
        source={
          isMuted
            ? require("../assets/img/sound.png")
            : require("../assets/img/sound.png")
        }
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  muteButton: {
    position: "absolute",
    bottom: 50, // Adjust position as needed
    right: 10, // Adjust position as needed
    zIndex: 1000,
  },
  icon: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
  },
});

export default MuteButton;
