import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        try {
          // Först kollar vi training_profiles för att se om användaren har fyllt i formuläret
          const { data: trainingProfile, error: trainingProfileError } = await supabase
            .from('training_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (trainingProfileError && trainingProfileError.code !== 'PGRST116') {
            console.error('Error checking training profile:', trainingProfileError);
            throw trainingProfileError;
          }

          // Om användaren har en training_profile, skicka dem direkt till huvudmenyn
          if (trainingProfile) {
            router.replace('/(tabs)');
          } else {
            // Om ingen training_profile finns, skicka till onboarding
            router.replace('/(auth)/onboarding/info');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          router.replace('/(auth)/onboarding/info');
        }
      } else if (event === 'SIGNED_OUT') {
        router.replace('/(auth)/welcome');
      }
    });
  }, [router]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}