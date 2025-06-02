import SanityPreviewParams from '@/app/types/preview';
import { ThemedText } from '@/components/ThemedText';
import { BASE_URL } from '@/constants';
import { setSession } from '@/utils/preview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function EnablePresentation() {
  const router = useRouter();
  const params = useLocalSearchParams() as SanityPreviewParams;

  useEffect(() => {
    const validateAndEnablePreview = async () => {
      const { 'sanity-preview-secret': secret = '', 'sanity-preview-pathname': pathname = '/', 'sanity-preview-perspective': perspective = 'published' } = params

      try {
        // If you host your service outside of expo, replace BASE_URL with the domain for that lambda, GCP function, etc.
        const response = await fetch(`${BASE_URL}/api/validate`, {
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

        const responseBody = await response.json();
        await setSession({secret, pathname, perspective})        
        router.push(responseBody.redirectTo);
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