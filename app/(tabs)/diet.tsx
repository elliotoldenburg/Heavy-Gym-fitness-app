import { View, Text, StyleSheet } from 'react-native';

export default function DietScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kostschema kommer snart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
});