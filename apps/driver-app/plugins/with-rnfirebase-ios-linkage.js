const { withPodfile } = require('@expo/config-plugins');

const LINKAGE = '  use_frameworks! :linkage => :dynamic';

/** Use the dynamic linkage required by Firebase's Swift Package Manager mode. */
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
