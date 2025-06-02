import SanityPreviewParams from '@/app/types/preview';
import { ThemedText } from "@/components/ThemedText";
import { destroySession } from "@/utils/preview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';


export default function DisablePresentation() {
    const router = useRouter();
    const params = useLocalSearchParams() as SanityPreviewParams;


    useEffect(() => {
      const disablePreview = async () => {
        console.log('EXITING PREVIEW MODE', {params})
        await destroySession()
        router.replace('/')
      };
  
      disablePreview()
    }, []);
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Exiting preview mode...</ThemedText>
        <ActivityIndicator />
      </View>
    );
  };