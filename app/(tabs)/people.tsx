import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createSanityClient } from '@/data/sanity';
import { getQueryOptions, getSession } from '@/utils/preview';

export default function PeopleScreen() {
  const [data, setData] = useState<{_id: string, name: string, slug: {current: string}, image: {asset: {url: string}}}[]>([]);

  useEffect(() => {
    const  fetchData = async () => {
      let token = undefined;
      const session = await getSession(); 
      if(session){
        const result = await fetch('/api/validate', {
          method: 'POST',
          body: JSON.stringify(session)
        })
        const body = await result.json();
        token = body.token;
      }

      const client = createSanityClient({token});
      const queryOptions = getQueryOptions(token);
      const data = await client.fetch(`*[_type == "person"]| order(title asc) { _id, name, slug { current }, image { asset -> { url } } } `, {}, queryOptions)
      setData(data)
    }

    fetchData();
  }, []);

  if(!data){
    return <ThemedText>Loading...</ThemedText>
  }
  const headerImage = data[0]?.image?.asset?.url

  return (
      <ParallaxScrollView
        headerImage={<Image source={{ uri: headerImage }} style={styles?.image} />}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">People:</ThemedText>
        </ThemedView>
        { data?.map((person: any) => (<ThemedText key={person.slug.current}>{person.name}</ThemedText>)) }    
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
  image: {
    width: '100%',
    height: '100%',
  },
});
