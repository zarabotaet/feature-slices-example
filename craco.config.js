const sassResourcesLoader = require('craco-sass-resources-loader');
const reactHotReloadPlugin = require('craco-plugin-react-hot-reload');
const CracoLinariaPlugin = require('craco-linaria');

module.exports = {
  style: {
    sass: {
      loaderOptions: (sassLoaderOptions, { env }) => ({
        ...sassLoaderOptions,
        prependData: `$env: ${env};`,
      }),
    },
  },
  plugins: [
    {
      plugin: CracoLinariaPlugin,
      options: { ignore: /^(?!.*(src[\\\/]admin))/ },
    },
    {
      plugin: sassResourcesLoader,
      options: {
        resources: [
          './src/assets/styles/_variables.scss',
          './src/assets/styles/_mixins.scss',
        ],
      },
    },
    {
      plugin: reactHotReloadPlugin,
    },
  ],
};
