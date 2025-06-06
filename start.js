const concurrently = require('concurrently');

const { result } = concurrently(
  [
    { command: 'pnpm --filter api start', name: 'API', prefixColor: 'pink', raw: false },
    { command: 'pnpm --filter expo start', name: 'API', prefixColor: 'green', raw: true },   
  ]
)
result.then(() => console.log('CONCURRENTLY SUCCESS'), (e) => console.log('CONCURRENTLY FAILURE', e));