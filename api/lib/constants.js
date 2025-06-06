"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL = exports.SANITY_STUDIO_URL = exports.SANITY_DATASET = exports.SANITY_PROJECT_ID = void 0;
exports.SANITY_PROJECT_ID = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
exports.SANITY_DATASET = process.env.EXPO_PUBLIC_SANITY_DATASET;
exports.SANITY_STUDIO_URL = process.env.EXPO_PUBLIC_SANITY_STUDIO_URL;
exports.BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8081';
