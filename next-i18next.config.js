/** @type {import('next-i18next').UserConfig} */
const i18n = {
    locales: ['vi', 'en'],
    defaultLocale: 'en',
    keySeparator: '.',
    localeDetection: false,
    // only open on dev
    // reloadOnPrerender: true,
};

module.exports = { i18n };
