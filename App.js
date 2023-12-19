// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import SettingsPage from "./pages/SettingsPage";
import QuickPlay from "./pages/QuickPlay";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartPage"
      screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartPage" component={StartPage} />
        <Stack.Screen name="GamePage" component={GamePage} />
        <Stack.Screen name="SettingsPage" component={SettingsPage} />
        <Stack.Screen name="QuickPlay" component={QuickPlay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
