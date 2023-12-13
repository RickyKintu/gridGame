// StartPage.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const StartPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50", // Background color //#2c3e50
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ecf0f1", // Text color
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#3498db", // Button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: "green", // Button color
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
