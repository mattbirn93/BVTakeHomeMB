import React, {useState} from 'react';
import DetailedScreen from './src/layout/DetailScreenElements/DetailedScreenPage';
import SearchBarPage from './src/layout/SearchScreenElements/SearchBarPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen   name="Home" 
          component={SearchBarPage} 
          options={{ headerShown: false }} 
         />
        <Stack.Screen   name="Details" 
          component={DetailedScreen} 
          options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
