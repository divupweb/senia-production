/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const { execSync } = require('child_process');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const BASE_API_URL = process.env.BASE_API_URL;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const ROLLBAR_ACCESS_TOKEN = process.env.ROLLBAR_ACCESS_TOKEN;
const ROLLBAR_SERVER_TOKEN = process.env.ROLLBAR_SERVER_TOKEN;
const STAGE = process.env.STAGE || 'production';
const PUBLIC_PATH = process.env.PUBLIC_PATH || 'https://food.farm';
const stageIsProd = STAGE === 'production';
let version;
try {
  version = execSync('git rev-parse HEAD', { encoding: 'utf8' });
  console.log('Git version:', version); // eslint-disable-line no-console
} catch (err) {
  console.log('Error getting revision', err); // eslint-disable-line no-console
  process.exit(1);
}

const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false,
  STAGE: STAGE
});

module.exports = function (env) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: false,

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
      filename: '[name].[chunkhash].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].[chunkhash].chunk.js.map',

      /**
       * The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].[chunkhash].chunk.js'

    },

    module: {

      rules: [

        /*
         * Extract CSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader!postcss-loader'
          }),
          include: [helpers.root('src', 'styles')]
        },

        /*
         * Extract and compile SCSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader!postcss-loader!sass-loader'
          }),
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      new SourceMapDevToolPlugin({
        filename: '[file].map',
      }),


      /**
       * Webpack plugin to optimize a JavaScript file for faster initial load
       * by wrapping eagerly-invoked functions.
       *
       * See: https://github.com/vigneshshanmugam/optimize-js-plugin
       */

      // https://github.com/AngularClass/angular-starter/pull/1299
      // new OptimizeJsPlugin({
      //   sourceMap: true
      // }),

      /**
       * Plugin: ExtractTextPlugin
       * Description: Extracts imported CSS files into external stylesheet
       *
       * See: https://github.com/webpack/extract-text-webpack-plugin
       */
      new ExtractTextPlugin('[name].[contenthash].css'),

      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'BASE_API_URL': JSON.stringify(BASE_API_URL),
        'GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY),
        'ROLLBAR_ACCESS_TOKEN': JSON.stringify(ROLLBAR_ACCESS_TOKEN),
        'CODE_VERSION': JSON.stringify(version),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
          'STAGE': JSON.stringify(METADATA.STAGE),
        }
      }),

      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks.
       * Loaders are switched into minimizing mode.
       *
       * See: https://www.npmjs.com/package/uglifyjs-webpack-plugin
       */
      // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
      new UglifyJsPlugin({
        sourceMap: true,
        parallel: {
           cache: true,
           workers: 4
         },
         beautify: false, //prod
         output: {
           comments: false
         }, //prod
         mangle: {
           screw_ie8: true
         }, //prod
         compress: {
           screw_ie8: true,
           warnings: false,
           conditionals: true,
           unused: true,
           comparisons: true,
           sequences: true,
           dead_code: true,
           evaluate: true,
           if_return: true,
           join_vars: true,
           negate_iife: false // we need this for lazy v8
         },
      }),

      /**
       * Plugin: NormalModuleReplacementPlugin
       * Description: Replace resources that matches resourceRegExp with newResource
       *
       * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
       */

      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('config/empty.js')
      ),

      new NormalModuleReplacementPlugin(
        /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
        helpers.root('config/empty.js')
      ),


      // AoT
      // new NormalModuleReplacementPlugin(
      //   /@angular(\\|\/)upgrade/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /@angular(\\|\/)compiler/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /@angular(\\|\/)platform-browser-dynamic/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /dom(\\|\/)debug(\\|\/)ng_probe/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /dom(\\|\/)debug(\\|\/)by/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /src(\\|\/)debug(\\|\/)debug_node/,
      //   helpers.root('config/empty.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /src(\\|\/)debug(\\|\/)debug_renderer/,
      //   helpers.root('config/empty.js')
      // ),

      /**
       * Plugin: CompressionPlugin
       * Description: Prepares compressed versions of assets to serve
       * them with Content-Encoding
       *
       * See: https://github.com/webpack/compression-webpack-plugin
       */
      // new CompressionPlugin({
      //   regExp: /\.css$|\.html$|\.js$|\.map$/,
      //   threshold: 2 * 1024
      // }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {

          /**
           * Html loader advanced options
           *
           * See: https://github.com/webpack/html-loader#advanced-options
           */
          // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },

        }
      }),

      /**
       * Plugin: BundleAnalyzerPlugin
       * Description: Webpack plugin and CLI utility that represents
       * bundle content as convenient interactive zoomable treemap
       *
       * `npm run build:prod -- --env.analyze` to use
       *
       * See: https://github.com/th0r/webpack-bundle-analyzer
       */

       // https://github.com/thredup/rollbar-sourcemap-webpack-plugin
       new RollbarSourceMapPlugin({
         accessToken: ROLLBAR_SERVER_TOKEN,
         version: version,
         publicPath: PUBLIC_PATH
       })
    ],

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}