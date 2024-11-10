const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    https: require.resolve("https-browserify"),
    crypto: require.resolve("crypto-browserify"),
    url: require.resolve("url/"),
    http: require.resolve("stream-http"),
    vm: require.resolve("vm-browserify"), // Added VM polyfill
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
