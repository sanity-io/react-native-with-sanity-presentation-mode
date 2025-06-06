const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);


const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  events: path.resolve(__dirname, 'node_modules/events'),
  crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
  'node:crypto': path.resolve(__dirname, 'node_modules/crypto-browserify'),
  stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
  process: path.resolve(__dirname, 'node_modules/process/browser'),
  buffer: path.resolve(__dirname, 'node_modules/buffer'),
};

module.exports = config;