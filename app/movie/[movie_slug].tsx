import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/data/sanity';
import { Movie } from '@/types/sanity';
import { urlFor } from '@/utils/image_url';
import { isIframe } from '@/utils/preview';
import { sharedStyles, sharedStyles as styles } from '@/utils/styles';
import { PortableText } from '@portabletext/react-native';
import { createDataAttribute } from "@sanity/visual-editing";
import { Link, useLocalSearchParams } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

export default function MovieScreen() {
  const { movie_slug } = useLocalSearchParams();
  const query = groq`*[_type == "movie" && slug.current == $movie_slug][0] { 
    _id, 
    _type, 
    title, 
    slug { current }, 
    poster { ..., asset -> { url } },
    overview
  }`

  const { data } = useQuery<Movie>(query, { movie_slug })

  if (!data) {
    return <ThemedText>Loading...</ThemedText>
  }

  const { _id, _type, title, poster, overview } = data
  const attr = isIframe() ? createDataAttribute({
    id: _id,
    type: _type,
    path: 'poster'
  }) : ''


  return (
    <ParallaxScrollView
      headerImage={<Image source={{ uri: urlFor(poster).url() }} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      useTabBar={false}
    >
      <Link style={sharedStyles.link} href="/movies">Go Back</Link>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.elementContainer}>
        {overview && (
          <ThemedText type="default">
            <PortableText
              value={overview}
            />
          </ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

