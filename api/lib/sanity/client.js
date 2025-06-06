"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSanityClient = void 0;
const client_1 = require("@sanity/client");
const constants_1 = require("../constants");
const createSanityClient = (config = { perspective: 'published' }) => (0, client_1.createClient)({
    projectId: constants_1.SANITY_PROJECT_ID || '',
    dataset: constants_1.SANITY_DATASET || '',
    useCdn: true,
    apiVersion: '2025-05-30',
    ...config,
    stega: false
});
exports.createSanityClient = createSanityClient;
