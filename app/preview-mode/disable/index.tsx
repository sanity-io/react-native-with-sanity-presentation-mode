import { ThemedText } from "@/components/ThemedText";
import { destroySession } from "@/utils/preview";
import {useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';

// This helper component is currently unused, but is included for reference -- if you use it,
// update the routing logic to something more robust than just "go to home page".
export default function DisablePresentation() {
    const router = useRouter();
    useEffect(() => {
      const disablePreview = async () => {
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