import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import SettingsPage from './pages/SettingsPage';
import QuickPlay from './pages/QuickPlay';
import BackgroundMusic from './components/BackgroundMusic';
import { MusicProvider, MusicContext } from './context/MusicContext';
import MuteButton from './components/MuteButton'; // Update the path as needed


const Stack = createStackNavigator();

const App = () => {
  return (
    <MusicProvider>
      <BackgroundMusic />
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="StartPage" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StartPage" component={StartPage} />
            <Stack.Screen name="GamePage" component={GamePage} />
            <Stack.Screen name="SettingsPage" component={SettingsPage} />
            <Stack.Screen name="QuickPlay" component={QuickPlay} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </MusicProvider>
  );
};



export default App;
