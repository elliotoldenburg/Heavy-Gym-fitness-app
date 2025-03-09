import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../lib/supabase';
import { updateOnboardingStatus } from '../../../lib/supabase';
import { ChevronDown } from 'lucide-react-native';
import Constants from 'expo-constants';

type FormData = {
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  trainingGoal: string;
  experienceLevel: string;
  equipmentAccess: string;
  injuries: string;
};

const TRAINING_GOALS = [
  'Bygga muskelmassa',
  'Bygga styrka',
  'Gå ner i vikt och bevara muskler',
];

const EXPERIENCE_LEVELS = [
  'Nybörjare (0-6 månader träning)',
  'Medel (6 månader - 2 år träning)',
  'Avancerad (2+ år träning)',
];

const EQUIPMENT_ACCESS = ['Gym', 'Hemmaträning'];
const GENDERS = ['Man', 'Kvinna', 'Annat'];

export default function OnboardingForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    trainingGoal: '',
    experienceLevel: '',
    equipmentAccess: '',
    injuries: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const validateForm = () => {
    const requiredFields = [
      'fullName',
      'age',
      'gender',
      'height',
      'weight',
      'trainingGoal',
      'experienceLevel',
      'equipmentAccess',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        setError(`Vänligen fyll i alla obligatoriska fält`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Kunde inte verifiera din session');
      }

      if (!sessionData.session?.user?.id) {
        throw new Error('Ingen användare hittad');
      }

      const userId = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email;

      // Save to Supabase
      const { error: profileError } = await supabase
        .from('training_profiles')
        .insert([{
          user_id: userId,
          full_name: formData.fullName,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          training_goal: formData.trainingGoal,
          experience_level: formData.experienceLevel,
          equipment_access: formData.equipmentAccess,
          injuries: formData.injuries || null,
        }]);

      if (profileError) {
        console.error('Profile Error:', profileError);
        throw new Error('Kunde inte spara träningsprofilen');
      }

      // Send to Make webhook
      const webhookUrl = process.env.EXPO_PUBLIC_MAKE_WEBHOOK_URL;
      if (webhookUrl) {
        const webhookData = {
          userId,
          email: userEmail,
          ...formData,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        if (!response.ok) {
          throw new Error('Kunde inte skicka data till webhook');
        }
      }

      // Update onboarding status
      await updateOnboardingStatus(true);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err?.message || 'Ett fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (
    field: keyof FormData,
    options: string[],
    placeholder: string
  ) => (
    <View style={styles.dropdownContainer}>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text style={[styles.input, !formData[field] && styles.placeholder]}>
          {formData[field] || placeholder}
        </Text>
        <ChevronDown
          size={20}
          color="#FFFFFF"
          style={[
            styles.dropdownIcon,
            showDropdown === field && styles.dropdownIconActive,
          ]}
        />
      </Pressable>
      {showDropdown === field && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                setFormData({ ...formData, [field]: option });
                setShowDropdown(null);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['rgba(0,157,255,0.1)', 'rgba(0,0,0,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Dina träningsuppgifter</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fullständigt namn</Text>
            <TextInput
              style={styles.textInput}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Ditt namn"
              placeholderTextColor="#808080"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Ålder</Text>
              <TextInput
                style={styles.textInput}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })}
                keyboardType="numeric"
                placeholder="År"
                placeholderTextColor="#808080"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Kön</Text>
              {renderDropdown('gender', GENDERS, 'Välj kön')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Längd</Text>
              <TextInput
                style={styles.textInput}
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text.replace(/[^0-9]/g, '') })}
                keyboardType="numeric"
                placeholder="cm"
                placeholderTextColor="#808080"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Vikt</Text>
              <TextInput
                style={styles.textInput}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text.replace(/[^0-9]/g, '') })}
                keyboardType="numeric"
                placeholder="kg"
                placeholderTextColor="#808080"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Träningsmål</Text>
            {renderDropdown('trainingGoal', TRAINING_GOALS, 'Välj träningsmål')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Träningsvana</Text>
            {renderDropdown('experienceLevel', EXPERIENCE_LEVELS, 'Välj träningsvana')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tillgång till utrustning</Text>
            {renderDropdown('equipmentAccess', EQUIPMENT_ACCESS, 'Välj utrustning')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Eventuella skador (valfritt)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.injuries}
              onChangeText={(text) => setFormData({ ...formData, injuries: text })}
              placeholder="T.ex. knäproblem, kan inte göra djupa böj"
              placeholderTextColor="#808080"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            loading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>FORTSÄTT</Text>
          )}
          <LinearGradient
            colors={['rgba(0,157,255,0.2)', 'transparent']}
            style={styles.buttonGlow}
            pointerEvents="none"
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  textInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginTop: 8,
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    padding: 16,
  },
  placeholder: {
    color: '#808080',
  },
  errorText: {
    color: '#FF4444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#009dff',
    paddingVertical: 18,
    borderRadius: 12,
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
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
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