import groq from 'groq';
import { Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/data/sanity';
import { documentPageStyles as styles } from '@/utils/styles';

type Person = {name: string, slug: {current: string}, image: {asset: {url: string}}}

export default function PeopleScreen() {
  const query = groq`*[_type == "person"]| order(title asc) { _id, name, slug { current }, image { asset -> { url } } } `
  const {data} = useQuery<Person[]>(query)

  if (!data) {
    return <ThemedText>Loading...</ThemedText>
  }


  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/actors.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">People:</ThemedText>
      </ThemedView>
      {data?.map((person: any) => {
        return (<ThemedView key={person.slug.current} style={styles.elementContainer}>
          <Image source={{ uri: person.image?.asset?.url }} style={styles.image} />
          <ThemedText type="default">{person.name}</ThemedText>
        </ThemedView>)
      })}
    </ParallaxScrollView>
    
  );
}

