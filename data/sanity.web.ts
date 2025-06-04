// sanity.web.tsx
import { isPresentationPluginIframe } from '@/utils/preview';
import { createQueryStore } from '@sanity/react-loader';
import { createSanityClient } from './client';

const queryStore = isPresentationPluginIframe() ? createQueryStore({ client: false, ssr: true }) : createQueryStore({ client: createSanityClient(), ssr:false })
const useLiveMode = isPresentationPluginIframe() ? queryStore.useLiveMode : () => null
const useQuery = queryStore.useQuery

export { useLiveMode, useQuery };

