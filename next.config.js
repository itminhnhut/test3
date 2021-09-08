/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const { parsed: env } = require('dotenv').config();
const path = require('path');

const {
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
    SENTRY_VERSION,
    ANALYZE,
    BUILD_NUMBER,
} = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: ANALYZE === 'true',
});

process.env.SENTRY_DSN = SENTRY_DSN;

const basePath = '';

const { i18n } = require('./next-i18next.config');

module.exports = withPlugins([
    [withBundleAnalyzer],
    [withFonts],
],
{
    // productionBrowserSourceMaps: NODE_ENV === 'production',
    // generateBuildId: async () => {
    //     return BUILD_NUMBER;
    // },
    async headers() {
        return [
            {
                source: '/.well-known/apple-app-site-association',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/json; charset=utf-8',
                    },
                ],
            },
        ];
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    env: {
        // Make the COMMIT_SHA available to the client so that Sentry events can be
        // marked for the release they belong to. It may be undefined if running
        // outside of Vercel
        NEXT_PUBLIC_COMMIT_SHA: SENTRY_VERSION,
    },
    i18n,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: [
            'test.nami.exchange',
        ],
    },
});
