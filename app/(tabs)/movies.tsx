import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createSanityClient } from '@/data/sanity';

export default function HomeScreen() {
  const [data, setData] = useState<{title: string, poster: {asset: {url: string}}}[]>([]);

  useEffect(() => {
    const  fetchData = async () => {
      const client = createSanityClient({});
      const data = await client.fetch(`*[_type == "movie"]| order(title asc) { _id, title, poster { asset -> { url } } } `)
      setData(data)
    }

    fetchData();
  }, []);

  if(!data){
    return <ThemedText>Loading...</ThemedText>
  }
  const headerImage = data[0]?.poster?.asset?.url

  return (
    // <SafeAreaView>
      <ParallaxScrollView
        headerImage={<Image source={{ uri: headerImage }} style={styles?.poster} />}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Movies:</ThemedText>
        </ThemedView>
        { data?.map((movie: any) => (<ThemedText key={movie._id}>{movie.title}</ThemedText>)) }    

      </ParallaxScrollView>
    // </SafeAreaView>
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
  poster: {
    width: '100%',
    height: '100%',
  },
});
