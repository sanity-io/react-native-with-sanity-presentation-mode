const concurrently = require('concurrently');

const { result } = concurrently(
  [
    { command: 'pnpm --filter vercel_api start', name: 'API', prefixColor: 'pink', raw: false },
    { command: 'pnpm --filter expo_app start', name: 'API', prefixColor: 'green', raw: true },   
  ]
)
result.then(() => null, (e) => console.log('CONCURRENTLY FAILURE', e));