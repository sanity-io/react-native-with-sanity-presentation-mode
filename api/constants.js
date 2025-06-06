import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ path: process.env.VERCEL_URL.startsWith('localhost') ? '.env.local' : '.env' });

export const SANITY_PROJECT_ID = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID; 
export const SANITY_DATASET = process.env.EXPO_PUBLIC_SANITY_DATASET;
export const SANITY_STUDIO_URL = process.env.EXPO_PUBLIC_SANITY_STUDIO_URL;
export const WEB_APP_BASE_URL = process.env.EXPO_PUBLIC_WEB_APP_BASE_URL || 'http://localhost:8081';

console.log({SANITY_PROJECT_ID, SANITY_DATASET, SANITY_STUDIO_URL, WEB_APP_BASE_URL});