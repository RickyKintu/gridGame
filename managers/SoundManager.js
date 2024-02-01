// SoundManager.js
import { Audio } from "expo-av";

class SoundManager {
  static bgMusicVolume = 1;
  static sfxVolume = 1;
  static voicesVolume = 1;

  static updateVolumes({ bgMusic, sfx, voices }) {
    this.bgMusicVolume = bgMusic;
    this.sfxVolume = sfx;
    this.voicesVolume = voices;
  }

  static currentSound = null; // Reference to the currently playing sound

  static async playSound(soundFile, volume = 1) {
    // Choose the volume based on soundType
    //const volume = this[soundType + "Volume"];

    console.log("volume: ", volume);
    //console.log("Sound Type:", soundType);

    try {
      // Unload previous sound if any
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
      }

      // Create and load new sound
      const { sound } = await Audio.Sound.createAsync(soundFile);
      this.currentSound = sound; // Update current sound reference
      await sound.setVolumeAsync(volume);
      await sound.playAsync();

      // Ensures the sound is unloaded after playing to free up resources
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          this.currentSound = null; // Reset current sound reference
        }
      });
    } catch (error) {
      console.error("Error playing sound: ", error);
    }
  }

  static setVolume(volume) {
    if (this.currentSound) {
      this.currentSound.setVolumeAsync(volume);
    }
  }

  static playBomb(volume) {
    this.playSound(require("../assets/sound/bomb.mp3"), volume);
  }

  static playFCBomb(volume) {
    this.playSound(require("../assets/sound/you_stepped.wav"), volume);
  }

  static playFCChest(volume) {
    this.playSound(require("../assets/sound/how_did_you_2.wav"), volume);
  }

  static playChest(volume) {
    this.playSound(require("../assets/sound/chest.mp3"), volume);
  }

  static playLastClick(volume) {
    this.playSound(require("../assets/sound/lastclick.mp3"), volume);
  }

  static playClick(volume) {
    this.playSound(require("../assets/sound/click.mp3"), volume);
  }

  static playFinished(volume) {
    this.playSound(require("../assets/sound/finished.mp3"), volume);
  }

  static playGameOver(volume) {
    this.playSound(require("../assets/sound/gameover.mp3"), volume);
  }

  static play3iar(volume) {
    this.playSound(require("../assets/sound/3iar.mp3"), volume);
  }

  // Add other sound methods as needed
}

export default SoundManager;
