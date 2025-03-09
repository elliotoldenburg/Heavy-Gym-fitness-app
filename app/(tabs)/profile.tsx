import { View, Text, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Logga ut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
  },
  signOutButton: {
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});