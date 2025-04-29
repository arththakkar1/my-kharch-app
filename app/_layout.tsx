import React from 'react';
import { Slot } from 'expo-router'
import '@/global.css'
import { StatusBar } from 'react-native';
import {useFonts} from 'expo-font'
import GlobalProvider from '@/context/GlobalProvider';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    "Poppins-Light": require("@/assets/fonts/Poppins/Poppins-Light.ttf"),
    'Sora-SemiBold':require('@/assets/fonts/Sora/static/Sora-SemiBold.ttf')
  });
  return (
    
    <AppProvider>
      <GlobalProvider>
        <StatusBar hidden={true} />
        <Slot  />
      </GlobalProvider>
    </AppProvider>
    
  )
}