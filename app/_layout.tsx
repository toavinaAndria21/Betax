import { Stack } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {

  return (
  <UserProvider>
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>;
    <Toast/>
  </UserProvider>
  )
}
