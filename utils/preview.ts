// app/sanity/preview.ts

import { SANITY_PROJECT_ID } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FilteredResponseQueryOptions } from "@sanity/client";
import { Platform } from 'react-native';

const getStorageHandler = () => {
  if (Platform.OS === 'web') {
    return sessionStorage;
  } else {
    return AsyncStorage;
  }
}

const getWebOnlySession = () => {
  return sessionStorage.getItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`);
}

const getSession = async () => {
    try {
        const value = await getStorageHandler().getItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error('getSession error::', e)
    }
}

const setSession = async (object: {secret: string, pathname: string, perspective: string}) => {
    try {    
      await getStorageHandler().setItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`, JSON.stringify(object));
    } catch (e) {
        console.error('setSession error::', e)
    }
  };

const destroySession = async () => {
  try {
      await getStorageHandler().removeItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`);
  } catch (e) {
      console.error('destroySession error::', e)
  }
}

function getQueryOptions(token: string | undefined): FilteredResponseQueryOptions {
  return !!token
      ? {
          perspective: "previewDrafts",
          stega: true,
          token,
        }
      : {
          perspective: "published",
          stega: false,
        }
}

export { destroySession, getQueryOptions, getSession, getWebOnlySession, setSession };

