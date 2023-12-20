import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";
import logoImage from "../assets/img/logo.png"; // Replace with the actual path to your logo image
import backgroundImage from "../assets/img/background.png"; // Replace with the path to your background image

const StartPage = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={logoImage} style={styles.logo} />

        {/* Existing Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Chest hunter!</Text>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => navigation.navigate("GamePage")}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SettingsPage")}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Cover the entire screen
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)", // Semi-transparent background color
  },
  logo: {
    width: 150, // Adjust the width and height as needed
    height: 150,
    resizeMode: "contain", // Ensure the logo maintains its aspect ratio
    marginBottom: 20, // Add spacing between the logo and other content
  },
  content: {
    alignItems: "center", // Center the existing content
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#D4AF37", // Text color
    marginBottom: 30,
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  button: {
    backgroundColor: "#D4AF37", // Button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: "#D4AF37", // Button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ecf0f1", // Text color
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StartPage;
