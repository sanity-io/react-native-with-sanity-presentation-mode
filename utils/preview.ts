// app/sanity/preview.ts

import { PREVIEW_STORAGE_KEY, SANITY_PROJECT_ID, SANITY_VIEWER_TOKEN } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FilteredResponseQueryOptions } from "@sanity/client";



const getSession = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(PREVIEW_STORAGE_KEY);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error('getSession error::', e)
    }
}

const setSession = async (sessionSecret: string) => {
    try {    
      await AsyncStorage.setItem(PREVIEW_STORAGE_KEY, sessionSecret);
    } catch (e) {
      // saving error
      console.error('setSession error::', e)
    }
  };

  const destroySession = async () => {
    try {
        await AsyncStorage.removeItem(PREVIEW_STORAGE_KEY);
    } catch (e) {
        console.error('destroySession error::', e)
    }
  }



async function previewContext(
  headers: Headers
): Promise<{ preview: boolean; options: FilteredResponseQueryOptions }> {
    const sessionKey = headers.get("Cookie") || '';

  const previewSession = await getSession(sessionKey);
  const preview =
    previewSession.get("projectId") === SANITY_PROJECT_ID;

  return {
    preview,
    options: preview
      ? {
          perspective: "previewDrafts",
          stega: true,
          token: SANITY_VIEWER_TOKEN,
        }
      : {
          perspective: "published",
          stega: false,
        },
  };
}

export { destroySession, getSession, previewContext, setSession };

