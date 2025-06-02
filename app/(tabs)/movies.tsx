import groq from 'groq';
import { Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import { useSanityHooks } from '@/hooks/useSanityHooks';
import { urlFor } from '@/utils/image_url';
import { documentPageStyles as styles } from '@/utils/styles';
// import { createDataAttribute } from '@sanity/visual-editing/react';
import { useQuery } from '@/data/sanity';
import { Movie } from '../types/documents';

export default function MoviesScreen() {
  const query = groq`*[_type == "movie"]| order(title asc) { _id, _type, _key, title, slug { current }, poster { asset -> { url } } } `
  const {data} = useQuery<Movie[]>(query)

  if (!data) {
    return <ThemedText>Loading...</ThemedText>
  }

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/movies.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Movies:</ThemedText>
      </ThemedView>
      {data?.map((movie: any) => {

          const {_id, _type, _key, title, slug, poster} = movie
          // const attr = createDataAttribute({ 
          //   id: _id,
          //   type: _type,
          //   path: 'movies'
          // })



          return (<ThemedView key={slug.current} style={styles.elementContainer}>
            <Image 
            // data-sanity={attr(`movies[_key=="${_key}"]`).toString()}
            // src={urlFor(poster).url() } style={styles.image} />
            source={{uri: urlFor(poster).url() }} style={styles.image} />
            <ThemedText type="default">{title}</ThemedText>
          </ThemedView>)
        }
      )}
    </ParallaxScrollView>

  );
}

