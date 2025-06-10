import Loading from '@/components/Loading';
import SanityVisualEditing from '@/components/SanityVisualEditing';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/store/app';
import { buildValidationPayload, getWebSession, isPresentationPluginIframe } from '@/utils/preview';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const session = isPresentationPluginIframe() ? getWebSession() : null
  const { setToken } = useAppStore();
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    const setContext = async () => {
      let token = '';
      try {
        const secret = session?.secret || ''
        const pathname = session?.pathname || ''
        const perspective = session?.perspective || ''
      // If we have a session, we validate it to get a token and make the query authorized. 
      // If we have a session but it is not authorized, the hook will error.
      // If we don't have a session, the hook will make the query unauthorized (token will be undefined).
      if (secret && pathname && perspective && !checkedSession) {
        const result = await fetch('/api/validate', {
          method: 'POST',
          body: JSON.stringify(buildValidationPayload(session))
        })
        const body = await result.json();
        token = body.token;
        setToken(token)
      }


      } catch (e) {
        console.error(e)
        throw e
      } finally{
        setCheckedSession(true)
      }
    
    }
    setContext()
  }, [session])


  const tokenChecked = !session || session && checkedSession

  if (!loaded || !tokenChecked) {
    // I want to set up the initial state of the app before loading
    // any components, so I can use token, mode, etc.
    return <Loading/>;
  }

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movie/[movie_slug]" options={{ headerShown: false }} />
          <Stack.Screen name="person/[person_slug]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <SanityVisualEditing />
      </ThemeProvider>
  );
}
