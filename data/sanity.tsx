// sanity.js
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import { isWeb } from '@/utils/preview';
import { ClientPerspective, createClient } from '@sanity/client';
import { createQueryStore } from '@sanity/react-loader';


export const createSanityClient = (config: {token?: string, perspective?: ClientPerspective} = { perspective: 'published' }) => createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  apiVersion: '2025-05-30',
  ...config,
  stega: {
    enabled: true,
    studioUrl: SANITY_STUDIO_URL,
  },
})

const queryStore = isWeb() ? createQueryStore({ client: false, ssr: true }) : createQueryStore({ client: createSanityClient(), ssr:false })
const useLiveMode = isWeb() ? queryStore.useLiveMode : () => null
const useQuery = queryStore.useQuery

console.log('QUERY STORE', {useQuery, queryStore})

export { useLiveMode, useQuery };

