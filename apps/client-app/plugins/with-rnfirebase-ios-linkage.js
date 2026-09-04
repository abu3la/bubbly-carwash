const { withPodfile } = require('@expo/config-plugins');

const LINKAGE = '  use_frameworks! :linkage => :dynamic';

/**
 * Recent React Native Firebase releases resolve Firebase through Swift Package
 * Manager. Firebase requires dynamic frameworks in that mode, so declare the
 * linkage before Expo autolinks native modules.
 */
module.exports = function withRnFirebaseIosLinkage(config) {
  return withPodfile(config, (nextConfig) => {
    if (!nextConfig.modResults.contents.includes(LINKAGE.trim())) {
      nextConfig.modResults.contents = nextConfig.modResults.contents.replace(
        /(target ['"][^'"]+['"] do)/,
        `$1\n${LINKAGE}`,
      );
    }
    return nextConfig;
  });
};
