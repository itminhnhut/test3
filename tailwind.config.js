// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

module.exports = {
    // future: {
    //     removeDeprecatedGapUtilities: true,
    //     purgeLayersByDefault: true,
    // },
    mode: 'jit',
    purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        fontFamily: {
            sans: ['Barlow', 'sans-serif'],
            serif: ['serif'],
        },
        fontSize: {
            'xxs': ['.625rem', { letterSpacing: '-0.01em', lineHeight: '1rem' }], // Outline 10px
            'xs': ['.75rem', { letterSpacing: '-0.01em', lineHeight: '1.125rem' }], // Caption 12px
            'sm': ['.875rem', { letterSpacing: '-0.01em', lineHeight: '1.3125rem' }], // Small text 14px
            'tiny': ['.875rem', { letterSpacing: '-0.01em', lineHeight: '1.3125rem' }], // 14px
            'base': ['1rem', { letterSpacing: '-0.01em', lineHeight: '1.5rem' }], // 16px
            'lg': ['1.125rem', { letterSpacing: '-0.01em', lineHeight: '1.75rem' }], // Body 2 18px
            'xl': ['1.3125rem', { letterSpacing: '-0.01em', lineHeight: '2rem' }], // Body 1, Heading 6 21px
            '2xl': ['1.5rem', { letterSpacing: '-0.01em', lineHeight: '2.25rem' }], // Heading 5 24px
            '3xl': ['1.75rem', { letterSpacing: '-0.01em', lineHeight: '2.5rem' }], // Heading 4 28px
            '4xl': ['2.25rem', { letterSpacing: '-0.01em', lineHeight: '3.5rem' }], // Heading 3 36px
            '5xl': ['2.5rem', { letterSpacing: '-0.01em', lineHeight: '3.5rem' }], // Heading 2 40px
            '6xl': ['4rem', { letterSpacing: '-0.01em', lineHeight: '4.5rem' }], // Heading 1 64px
            '5.5xl': ['3.5rem', { letterSpacing: '-0.01em', lineHeight: '4.25rem' }], // Heading 2 56px
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            background: {
                DEFAULT: '#fff',
                dark: '#223050',
            },
            bgContainer: {
                DEFAULT: '#fff',
                dark: '#223050',
            },
            textPrimaryColor: {
                DEFAULT: '#000',
                dark: '#fff',
            },
            textSecondaryColor: {
                DEFAULT: '#EFEFEF',
                dark: '#7B8CB2',
            },
            black: {
                DEFAULT: '#02083D',
                5: '#F7F6FD', // 9
                50: '#F8F7FA', // 8
                100: '#F6F9FC', // 7
                200: '#EEF2FA', // 6
                300: '#E1E2ED', // 5
                400: '#C5C6D2', // 4
                500: '#8B8C9B', // 3
                600: '#3e3b3b', // 2
                700: '#02083D', // 1,
                800: '#000000',
            },
            white: colors.white,
            blue: {
                DEFAULT: '#384562',
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#a7acb9',
                400: '#9198a8',
                500: '#7a8396',
                600: '#646e85',
                700: '#4e5973',
                800: '#384562',
                900: '#223050',
            },
            darkBlue: {
                DEFAULT: '#223050',
            },
            gray: { DEFAULT: '#8D9091', ...colors.gray },
            teal: {
                DEFAULT: '#00c8bc',
                5: '#03bdce17',
                50: '#b3efeb',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#00c8bc',
                700: '#00c8bc',
            },
            cyan: {
                DEFAULT: '#11EFE3',
                50: '#ecfeff',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#00c8bc',
                700: '#00c8bc',
                800: '#008c84',
                900: '#00645e',
            },
            yellow: {
                DEFAULT: '#FFD965',
                ...colors.amber,
            },
            green: {
                DEFAULT: '#22b02e',
                ...colors.green,
            },
            red: {
                DEFAULT: '#C5292A',
                ...colors.red,
            },
            pink: {
                DEFAULT: '#ff0065',
            },
            mint: {
                DEFAULT: '#09becf',
            },
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                'xl': '0.625rem',
                '3xl': '1.25rem',
            },
            borderColor: ['group-focus'],
            fontWeight: {
                bold: 600,
            },
        },
    },
    variants: {
        extend: {
            backgroundOpacity: ['active'],
            boxShadow: {
                lg: '',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/line-clamp'),
    ],
};
