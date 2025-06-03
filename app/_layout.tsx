import PresentationModeContext from '@/components/PresentationModeContext';
import SanityVisualEditing from '@/components/SanityVisualEditing';
import TokenContext from '@/components/TokenContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getWebSession, isWeb } from '@/utils/preview';
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
  const session = isWeb() ? getWebSession() : null
  const [token, setToken] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [checkedSearchParams, setCheckedSearchParams] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    if (isWeb()) {
      const urlParams = new URLSearchParams(window.location.search);
      setIsPresentationMode(urlParams.get('mode') === 'presentation');
    }
    setCheckedSearchParams(true);
  }, []);
  

  useEffect(() => {
    const setContext = async () => {
      let token = undefined;
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
          body: JSON.stringify(session)
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

  if (!loaded || !tokenChecked || !checkedSearchParams) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <TokenContext.Provider value={token}>
    <PresentationModeContext.Provider value={isPresentationMode}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <SanityVisualEditing />
      </ThemeProvider>
      </PresentationModeContext.Provider>
    </TokenContext.Provider>
  );
}
