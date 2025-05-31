import { ThemedText } from '@/components/ThemedText';
import { BASE_URL } from '@/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';


export default function EnablePresentation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const validateAndEnablePreview = async () => {
      const { 'sanity-preview-secret': secret, 'sanity-preview-pathname': pathname = '/', 'sanity-preview-perspective': perspective } = params

      // TODO TALK TO CHRIS ABOUT IF THIS IS ALLOWED SINCE SECRET CAN BE SEEN BY USER (BUT TOKEN CAN'T) -- HOW LONG DOES SECRET LAST? 
      // I think it's fine because its behind login
      try {
        const response = await fetch(`${BASE_URL}/preview-mode/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret,
            pathname,
            perspective
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to validate preview mode');
        }

        const { redirectTo } = await response.json();
        
        
        router.replace(redirectTo);
      } catch (error) {
        console.error('Preview mode validation error:', error);
      }
    };

    validateAndEnablePreview()
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Validating preview link...</ThemedText>
      <ActivityIndicator />
    </View>
  );
}