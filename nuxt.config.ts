// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {enabled: true},
  ssr: false,
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-lodash",
    "@nuxt/eslint",
    "@nuxt/icon",
    "nuxt-vuefire",
    "nuxt-mapbox",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    services: {
      firestore: true,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
    // appCheck: {
    //   debug: process.env.NODE_ENV !== "production",
    //   isTokenAutoRefreshEnabled: true,
    //   provider: "ReCaptchaV3",
    //   key: "6LcWFtcqAAAAAK2sbcVGv1lNSZAVoX-HpAuQn0ce",
    // },
  },
  colorMode: {
    classPrefix: "",
    classSuffix: "",
  },
  // routeRules: {
  //   "/login": { ssr: false },
  // },
  mapbox: {
    accessToken: "pk.eyJ1IjoiZnJvc3Q4eXRlcyIsImEiOiJjbTMwZWM4emUwaXNhMmpxcGMydXV6MWF2In0.NedNyfVIxBrS2skQAfMxsQ",
  },
});
