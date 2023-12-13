import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Grid from "../components/Grid";


const GamePage = () => {
  return (
    <View style={styles.container}>
      <Grid/>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#2c3e50", // Background color //#2c3e50

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



export default GamePage;
