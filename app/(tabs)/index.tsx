import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
      <ParallaxScrollView
        headerImage={<Image source={require('@/assets/images/camera.jpg')} style={styles.headerImage} />}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      >
        <ThemedView style={styles.titleContainer}>
          <Link href="/movies">Movies</Link>
          <Link href="/people">People</Link>
        </ThemedView>
      </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
