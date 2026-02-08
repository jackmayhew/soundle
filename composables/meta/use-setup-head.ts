import { SITE_URL } from '~/constants/app/config'

/**
 * Set up the global `<head>` metadata.
 * Use Fathom Analytics script and sets default meta tags for SEO and social sharing.
 */
export function setupHead() {
  useHead({
    script: [
      { 'defer': true, 'data-site': 'IKOMTPKK', 'src': 'https://cdn.usefathom.com/script.js' },
    ],
    meta: [
      { name: 'description', content: 'A daily audio puzzle. Can you guess the sound?' },
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      // open graph / facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Soundle' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: 'Soundle' },
      { property: 'og:description', content: 'A daily audio puzzle. Can you guess the sound?' },
      { property: 'og:image', content: `${SITE_URL}/images/meta/og.png` },
      // twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: SITE_URL },
      { name: 'twitter:site', content: '@yourtwitterhandle' },
      { name: 'twitter:title', content: 'Soundle' },
      { name: 'twitter:description', content: 'A daily audio puzzle. Can you guess the sound?' },
      { name: 'twitter:image', content: `${SITE_URL}/images/meta/twitter.png` },
      // ios pwa
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Soundle' },
    ],
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      { rel: 'apple-touch-icon', href: '/images/ray.jpg' },
      // favicons
      { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
      { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
      { rel: 'canonical', href: SITE_URL },
      // other
      { rel: 'robots', href: '/robots.txt' },
      { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },
    ],
  })
}
