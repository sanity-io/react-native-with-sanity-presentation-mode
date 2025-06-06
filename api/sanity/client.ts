
import { ClientPerspective, createClient } from "@sanity/client"
import { SANITY_DATASET, SANITY_PROJECT_ID } from "../constants";

export const createSanityClient = (config: {token?: string, perspective?: ClientPerspective} = { perspective: 'published' }) => createClient({
    projectId: SANITY_PROJECT_ID || '',
    dataset: SANITY_DATASET || '',
    useCdn: true,
    apiVersion: '2025-05-30',
    ...config,
    stega: false
  })