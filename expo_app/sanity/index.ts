// sanity.ts
import { createQueryStore } from '@sanity/react-loader';
import { createSanityClient } from './client';
import { SanityClient } from '@sanity/client';

const queryStore = createQueryStore({ client: createSanityClient(), ssr:false })
const useLiveMode = (options: { client: SanityClient }) => null
const useQuery = queryStore.useQuery

export { useLiveMode, useQuery };

