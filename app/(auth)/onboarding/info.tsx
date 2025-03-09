import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';

export default function OnboardingInfo() {
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/form');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,157,255,0.1)', 'rgba(0,0,0,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/heavygymlogga_optimized.webp')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Anpassad träning för maximala resultat
        </Text>

        <Text style={styles.description}>
          För att ge dig ett program anpassat efter dina mål behöver vi veta lite mer om dig. 
          Ditt namn, längd, vikt och träningsbakgrund hjälper oss att välja rätt träningsplan 
          – och se till att du får de bästa resultaten.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Check size={24} color="#009dff" style={styles.checkIcon} />
            <Text style={styles.benefitText}>
              Personligt träningsprogram baserat på dina mål
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Check size={24} color="#009dff" style={styles.checkIcon} />
            <Text style={styles.benefitText}>
              Spara dina framsteg & få smarta rekommendationer
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <Check size={24} color="#009dff" style={styles.checkIcon} />
            <Text style={styles.benefitText}>
              Gör varje pass effektivare med data-driven coaching
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>FORTSÄTT</Text>
          <LinearGradient
            colors={['rgba(0,157,255,0.2)', 'transparent']}
            style={styles.buttonGlow}
            pointerEvents="none"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 64,
    marginBottom: 48,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 40,
    maxWidth: 320,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 360,
    opacity: 0.9,
  },
  benefitsContainer: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 48,
    gap: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkIcon: {
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 8px rgba(0,157,255,0.5))',
      },
    }),
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#009dff',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'scale(1.02)',
        },
      },
    }),
  },
  continueButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200%',
    opacity: 0.5,
  },
});