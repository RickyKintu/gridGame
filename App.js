import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import SettingsPage from "./pages/SettingsPage";
import QuickPlay from "./pages/QuickPlay";
import BackgroundMusic from "./components/BackgroundMusic";
import { MusicProvider } from "./context/MusicContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartPage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="StartPage" component={StartPage} />
          <Stack.Screen name="GamePage" component={GamePage} />
          <Stack.Screen name="SettingsPage" component={SettingsPage} />
          <Stack.Screen name="QuickPlay" component={QuickPlay} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <MusicProvider>
      <BackgroundMusic />
      <AppNavigator />
    </MusicProvider>
  );
};

export default App;
