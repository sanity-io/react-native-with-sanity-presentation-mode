// sanity.ts
import { createQueryStore } from '@sanity/react-loader';
import { createSanityClient } from './client';

const queryStore = createQueryStore({ client: createSanityClient(), ssr:false })
const useLiveMode = () => null
const useQuery = queryStore.useQuery

export { useLiveMode, useQuery };

