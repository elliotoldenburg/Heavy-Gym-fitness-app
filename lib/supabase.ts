import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  onboarding_completed: boolean;
  updated_at: string;
};

export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .single();

    if (error) throw error;
    return profile?.onboarding_completed || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function updateOnboardingStatus(completed: boolean): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Kunde inte hämta användarinformation');
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: completed })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Kunde inte uppdatera onboarding-status');
    }
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    throw error;
  }
}