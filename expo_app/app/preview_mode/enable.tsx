import { ThemedText } from '@/components/ThemedText';
import { API_BASE_URL } from '@/constants';
import { buildValidationPayload, isPresentationPluginIframe, setWebSession } from '@/utils/preview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

type SanityPreviewParams = {
  'sanity-preview-secret'?: string;
  'sanity-preview-pathname'?: string;
  'sanity-preview-perspective'?: string;
} 

export default function EnablePresentation() {
  const router = useRouter();
  const params = useLocalSearchParams() as SanityPreviewParams;

  useEffect(() => {
    const validateAndEnablePreview = async () => {
      if(!isPresentationPluginIframe()) {
        return null
      }
      const { 'sanity-preview-secret': secret = '', 'sanity-preview-pathname': pathname = '/', 'sanity-preview-perspective': perspective = 'published' } = params
      try {
        // If you deploy your service using something besides a hosted Expo API Route, replace BASE_URL with the domain for that lambda, GCP function, etc.
        const response = await fetch(`${API_BASE_URL}/api/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildValidationPayload({secret, pathname, perspective})),
        });

        if (!response.ok) {
          throw new Error('Failed to validate preview mode');
        }

        const responseBody = await response.json();
        setWebSession({secret, pathname, perspective})        

        router.push(responseBody.redirectTo);
      } catch (error) {
        throw new Error('Unauthorized');
      }
    };

    validateAndEnablePreview()
  }, []);
  
  if(!isPresentationPluginIframe()) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Preview mode is not supported in this environment (must be in the Sanity Studio)</ThemedText>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Validating preview link...</ThemedText>
      <ActivityIndicator />
    </View>
  );
}