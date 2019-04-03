/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
module.exports = {
  link: [
    /** <link> tags for 'apple-touch-icon' (AKA Web Clips). **/
    /** <link> tags for android web app icons **/
    { rel: 'icon', type: 'image/ico', sizes: '32x32', href: '/assets/favicon.ico' },
    /** <link> tags for a Web App Manifest **/
    { rel: 'manifest', href: '/assets/manifest.json' }
  ],
  meta: [
    { name: 'msapplication-TileColor', content: '#00bcd4' },
    { name: 'msapplication-TileImage', content: '/assets/favicon.ico', '=content': true },
    { name: 'theme-color', content: '#00bcd4' },
    { property: "og:title", content: "Food Farm" },
    { property: "og:description", content: "Eat with Food.Farm. Corporate food – with a personal touch" },
    { property: "og:image", content: "/assets/images/logo-gray.svg" }
  ]
};
