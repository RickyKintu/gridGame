import React from "react";
import { View, Text, TouchableOpacity, StyleSheet,ImageBackground } from "react-native";
import backgroundImage from "../assets/img/background.png"; // Replace with the path to your background image


const GamePage = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("QuickPlay")}
      >
        <Text style={styles.buttonText}>Quick Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TimeMode")}
      >
        <Text style={styles.buttonText}>Time Mode</Text>
      </TouchableOpacity>
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
    //backgroundColor: "#2c3e50",
  },
  button: {
    backgroundColor: "#D4AF37",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ecf0f1",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GamePage;
