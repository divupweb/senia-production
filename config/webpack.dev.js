/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const STAGE = process.env.STAGE || 'development';
const HMR = helpers.hasProcessFlag('hot');
const BASE_API_URL = process.env.BASE_API_URL || 'http://localhost:9292/api/v1';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBA1q2dgnMqHDOs_Kj9-pssxrXTx46oHmw';
const ROLLBAR_ACCESS_TOKEN = process.env.ROLLBAR_ACCESS_TOKEN;
const FACEBOOK_ANALYTICS_KEY = '423047758135156'
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR,
  STAGE: STAGE
});



const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    // devtool: 'cheap-module-source-map',
    devtool: 'source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[file].map',

      /** The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      library: 'ac_[name]',
      libraryTarget: 'var',
    },

    module: {

      rules: [
       {
         test: /\.ts$/,
         use: [
           {
             loader: 'tslint-loader',
             options: {
               configFile: 'tslint.json'
             }
           }
         ],
         exclude: [/\.(spec|e2e)\.ts$/]
       },

        /*
         * css loader support for *.css files (styles directory only)
         * Loads external css styles into the DOM, supports HMR
         *
         */
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /*
         * sass loader support for *.scss files (styles directory only)
         * Loads external sass styles into the DOM, supports HMR
         *
         */
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    plugins: [

      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'BASE_API_URL': JSON.stringify(BASE_API_URL),
        'GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY),
        'ROLLBAR_ACCESS_TOKEN': JSON.stringify(ROLLBAR_ACCESS_TOKEN),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
          'STAGE': JSON.stringify(METADATA.STAGE),
        }
      }),

      new DllBundlesPlugin({
        bundles: {
          polyfills: [
            'core-js',
            {
              name: 'zone.js',
              path: 'zone.js/dist/zone.js'
            },
            {
              name: 'zone.js',
              path: 'zone.js/dist/long-stack-trace-zone.js'
            },
          ],
          vendor: [
            '@angular/animations',
            '@angular/core',
            '@angular/common',
            '@angular/forms',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router',
            '@angularclass/hmr',
            'rxjs',
            '@ngx-translate/core',
            'moment',
            'lodash',
            'faye',
            'rollbar',
            'ng2-bootstrap',
            'ng2-toasty'
          ]
        },
        dllDir: helpers.root('dll'),
        webpackConfig: webpackMergeDll(commonConfig({env: ENV}), {
          devtool: 'source-map',
          plugins: []
        })
      }),

      /**
       * Plugin: AddAssetHtmlPlugin
       * Description: Adds the given JS or CSS file to the files
       * Webpack knows about, and put it into the list of assets
       * html-webpack-plugin injects into the generated html.
       *
       * See: https://github.com/SimenB/add-asset-html-webpack-plugin
       */
      new AddAssetHtmlPlugin([
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
      ]),

      /**
       * Plugin: NamedModulesPlugin (experimental)
       * Description: Uses file names as module name.
       *
       * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
       */
      // new NamedModulesPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {

        }
      }),

    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}