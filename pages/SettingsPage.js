import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SettingsPage = () => {
  return (
    <View style={styles.container}>
      <Text>This is the Settings Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsPage;
