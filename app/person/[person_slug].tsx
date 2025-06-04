import { Link, useLocalSearchParams } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/data/sanity';
import { Person } from '@/types/sanity';
import { urlFor } from '@/utils/image_url';
import { isIframe } from '@/utils/preview';
import { sharedStyles, sharedStyles as styles } from '@/utils/styles';
import { createDataAttribute } from "@sanity/visual-editing";

export default function PersonScreen() {
  const { person_slug } = useLocalSearchParams();
  const query = groq`*[_type == "person" && slug.current == $person_slug][0] {
    _id,
    _type,
    name,
    slug { current },
    image { ..., asset -> { url } },
    bio
  }`

  const { data } = useQuery<Person>(query, { person_slug })

  if (!data) {
    return <ThemedText>Loading...</ThemedText>
  }

  const { _id, _type, name, image, bio } = data
  const attr = isIframe() ? createDataAttribute({
    id: _id,
    type: _type,
    path: 'image'
  }) : ''

  return (
    <ParallaxScrollView
      headerImage={<Image
        source={require('@/assets/images/actors.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <Link style={sharedStyles.link} href="/people">Go Back</Link>
      <ThemedView style={styles.centeredFlexContainer}>
        {image && <Image
          // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
          dataSet={{ sanity: attr.toString() }}
          source={{ uri: urlFor(image).url() }} style={{ height: 300, width: 300 }} />}
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{name}</ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

