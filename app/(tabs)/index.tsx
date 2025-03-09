import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, TrendingUp } from 'lucide-react-native';
import { Link } from 'expo-router';

const programs = [
  {
    id: 'muscle-building',
    title: 'Muscle Building Pro',
    description: 'Optimerat program för maximal muskeltillväxt',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2940&auto=format&fit=crop',
    tag: 'Bygg Muskelmassa',
    daysPerWeek: 4,
    level: 'Medel-Avancerad',
  },
  {
    id: 'strength',
    title: 'Power & Styrka',
    description: 'Fokus på grundövningar och progressiv överbelastning',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop',
    tag: 'Öka Styrka',
    daysPerWeek: 3,
    level: 'Alla nivåer',
  },
  {
    id: 'fat-loss',
    title: 'Lean Transformation',
    description: 'Effektiv fettförbränning med bibehållen muskelmassa',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2940&auto=format&fit=crop',
    tag: 'Viktminskning',
    daysPerWeek: 5,
    level: 'Nybörjare-Medel',
  },
];

export default function TrainingScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/images/heavygymlogga_optimized.webp')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Välj ditt träningsprogram</Text>

        <View style={styles.programsContainer}>
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/program/${program.id}`}
              asChild
            >
              <Pressable style={({ pressed }) => [
                styles.programCard,
                pressed && styles.programCardPressed,
              ]}>
                <Image
                  source={{ uri: program.image }}
                  style={styles.programImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.gradient}
                />
                
                <View style={styles.cardContent}>
                  <View style={styles.tagContainer}>
                    <TrendingUp size={16} color="#009dff" />
                    <Text style={styles.tag}>{program.tag}</Text>
                  </View>

                  <Text style={styles.programTitle}>{program.title}</Text>
                  <Text style={styles.programDescription}>{program.description}</Text>

                  <View style={styles.programMetaContainer}>
                    <View style={styles.metaItem}>
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.metaText}>{program.daysPerWeek}x / vecka</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={16} color="#FFFFFF" />
                      <Text style={styles.metaText}>{program.level}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
  },
  logo: {
    width: 180,
    height: 56,
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  programsContainer: {
    gap: 24,
  },
  programCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'scale(1.02)',
        },
      },
      default: {
        elevation: 4,
      },
    }),
  },
  programCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  programImage: {
    width: '100%',
    height: 200,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,157,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,157,255,0.3)',
  },
  tag: {
    color: '#009dff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  programTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  programMetaContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});