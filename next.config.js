/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};


module.exports = {
  env: {
    mapbox_key: process.env.mapbox_key,
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  },
};
