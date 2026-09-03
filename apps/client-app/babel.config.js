// Plugin order is load-bearing:
//   1. Unistyles rewrites StyleSheet.create calls — it has to see them first.
//   2. react-native-worklets (Reanimated 4's worklet compiler) must be LAST.
const path = require('path');

// Both paths are absolute on purpose. A bare 'src' is matched as a path
// fragment, which also catches node_modules/react-native-unistyles/src — the
// plugin then rewrites the library's own `react-native` imports to point at
// itself, and every wrapped component resolves to undefined at runtime.
const appSource = path.resolve(__dirname, 'src');
const designSystem = path.resolve(__dirname, '../../libs/ui-native/src');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-unistyles/plugin',
        {
          root: path.resolve(__dirname, 'app'),
          // The design system's own files are processed by path. It is NOT
          // listed in autoProcessImports: that option is for packages that
          // re-export raw React Native components, and applying it to
          // components that already style themselves wraps them as host
          // elements, which breaks their hooks.
          autoProcessPaths: [appSource, designSystem],
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
