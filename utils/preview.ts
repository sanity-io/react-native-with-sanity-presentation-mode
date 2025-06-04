// app/sanity/preview.ts
import { SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import type { FilteredResponseQueryOptions } from "@sanity/client";
import { createDataAttribute } from '@sanity/visual-editing';
import { OptimisticReducerAction } from '@sanity/visual-editing/react';
import { Platform } from 'react-native';

const isWeb = () => Platform.OS === 'web'

const isPresentationPluginIframe = () => {
  if(isWeb()) {
    if( globalThis.self !== globalThis.top){
      return true
    }
    return false
  }
  return false;
}

const getWebSession = () => {
  if (!isWeb()) {
    return null
  }
  const string = sessionStorage.getItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`);
  return string ? JSON.parse(string) : null
}

const setWebSession = async (object: { secret: string, pathname: string, perspective: string }) => {
  if (!isWeb()) {
    return null
  }
  try {
    await sessionStorage.setItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`, JSON.stringify(object));
  } catch (e) {
    console.error('setSession error::', e)
  }
};

const destroyWebSession = async () => {
  if (!isWeb()) {
    return null
  }
  try {
    await sessionStorage.removeItem(`${SANITY_PROJECT_ID}_PREVIEW_STORAGE_KEY`);
  } catch (e) {
    console.error('destroySession error::', e)
  }
}

const getClientOptions = (token: string | undefined): FilteredResponseQueryOptions => {
  return !!token
    ? {
      perspective: "drafts",
      stega: {
        enabled: true,
        studioUrl: SANITY_STUDIO_URL,
      },
      token,
    }
    : {
      perspective: "published",
      stega: false,
    }
}

const createDataAttributeWebOnly = (options: {id: string, type: string, path: string}) => {
  return isPresentationPluginIframe() ? createDataAttribute(options) : ''
}

export { destroyWebSession, getClientOptions, getWebSession, isPresentationPluginIframe, isWeb, createDataAttributeWebOnly, setWebSession };

