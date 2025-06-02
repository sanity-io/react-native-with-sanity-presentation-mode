// sanity.js
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import { ClientPerspective, createClient } from '@sanity/client';
import { createQueryStore } from "@sanity/react-loader";


export const createSanityClient = (config: {token?: string, perspective?: ClientPerspective} = { perspective: 'published' }) => createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true,
  apiVersion: '2025-05-30',
  ...config,
  stega: {
    enabled: true,
    studioUrl: SANITY_STUDIO_URL,
  },
})

const client = createSanityClient({token: "", perspective: "drafts"})
const queryStore = createQueryStore({ client, ssr: false })
const useQuery = queryStore.useQuery
const useLiveMode = queryStore.useLiveMode

export { client, useLiveMode, useQuery };

