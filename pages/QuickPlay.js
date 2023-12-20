import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Grid from "../components/Grid";
import backgroundImage from "../assets/img/background4.gif"; // Replace with the path to your background image
import MuteButton from '../components/MuteButton'; // Update the path as needed


const GamePage = () => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <Grid/>
      <MuteButton />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  container: {
    //backgroundColor: "teal", // Background color //#2c3e50

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Cover the entire screen
    justifyContent: "center",
  },
});



export default GamePage;
