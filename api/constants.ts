module.exports = {
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  SANITY_DATASET: process.env.SANITY_DATASET,
  SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
  BASE_URL: process.env.BASE_URL || 'http://localhost:8081',
  PRIVATE_SANITY_VIEWER_TOKEN: process.env.PRIVATE_SANITY_VIEWER_TOKEN || ""
}