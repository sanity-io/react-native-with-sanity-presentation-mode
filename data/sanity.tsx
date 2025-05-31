// sanity.js
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import { createClient } from '@sanity/client';

export const createSanityClient = (config: {token?: string}) => createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true,
  apiVersion: '2025-05-30',
  ...config,
  stega: {
    studioUrl: SANITY_STUDIO_URL,
  },
})
