// SoundManager.js
import { Audio } from "expo-av";

class SoundManager {
  static async playSound(soundFile) {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();

      // Ensures the sound is unloaded after playing to free up resources
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound: ", error);
    }
  }

  static playBomb() {
    this.playSound(require("../assets/sound/bomb.mp3"));
  }

  static playFCBomb() {
    this.playSound(require("../assets/sound/you_stepped.wav"));
  }

  static playFCChest() {
    this.playSound(require("../assets/sound/how_did_you_2.wav"));
  }

  static playChest() {
    this.playSound(require("../assets/sound/chest.mp3"));
  }

  static playLastClick() {
    this.playSound(require("../assets/sound/lastclick.mp3"));
  }

  static playClick() {
    this.playSound(require("../assets/sound/click.mp3"));
  }

  static playFinished() {
    this.playSound(require("../assets/sound/finished.mp3"));
  }

  static playGameOver() {
    this.playSound(require("../assets/sound/gameover.mp3"));
  }

  static play3iar() {
    this.playSound(require("../assets/sound/3iar.mp3"));
  }

  // Add other sound methods as needed
}

export default SoundManager;
