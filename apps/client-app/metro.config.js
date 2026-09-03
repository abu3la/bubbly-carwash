// Monorepo-aware Metro config. Expo detects workspaces, but being explicit
// keeps resolution stable with pnpm's hoisted layout.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// The whole graph must share ONE copy of these. pnpm auto-installs peer deps,
// which can leave a second react-native inside a workspace lib — and two
// react-natives mean two Animated modules, only one of which has the renderer
// attached. The other crashes with "Cannot read property 'default' of
// undefined" the instant an Animated.View mounts. Blocking the nested copies
// makes resolution walk up to the single hoisted one at the workspace root.
const SINGLETONS = ['react', 'react-native', 'react-native-svg', 'react-native-safe-area-context'];
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : [config.resolver.blockList]
  ).filter(Boolean),
  new RegExp(
    `${escapeForRegExp(path.join(workspaceRoot, 'libs'))}[/\\\\][^/\\\\]+[/\\\\]node_modules[/\\\\](${SINGLETONS.join('|')})[/\\\\].*`,
  ),
];

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// react-native-unistyles ships its exports map with an `import` condition
// (lib/module) listed before the `react-native` one (src). Metro matches
// `import` first, while the Unistyles Babel plugin rewrites component imports
// to literal `src/...` paths — so the bundle ends up with two copies of the
// library and two registries, only one of which is ever configured. Dropping
// `import` makes every path resolve to the same `src` build.
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
