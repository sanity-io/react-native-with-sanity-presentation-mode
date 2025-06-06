const { createClient } = require("@sanity/client");
const { SANITY_DATASET, SANITY_PROJECT_ID, PRIVATE_SANITY_VIEWER_TOKEN } = require("../constants");

const sanityClient = createClient({
    projectId: SANITY_PROJECT_ID || '',
    dataset: SANITY_DATASET || '',
    useCdn: true,
    apiVersion: '2025-05-30',
    token: PRIVATE_SANITY_VIEWER_TOKEN,
    stega: false
  })

module.exports = {
  sanityClient
}