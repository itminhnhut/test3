// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

// Common colors
const commonColors = {
    transparent: 'transparent',

    darkBlue: '#223050',
    darkBlue1: '#00091F',
    darkBlue2: '#151D2F',
    darkBlue3: '#263459',
    darkBlue4: '#445271',
    darkBlue5: '#7B8CB2',

    gray1: '#718096',
    gray2: '#A0AEC0',
    gray3: '#CBD5E0',
    gray4: '#F2F4F6',

    white: 'white',
    teal: '#00C8BC',
    lightTeal: '#E2F6F5',
};

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
            'xxs': ['.625rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1rem',
            }], // Outline 10px
            'xs': ['.75rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.125rem',
            }], // Caption 12px
            'sm': ['.875rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.3125rem',
            }], // Small text 14px
            'tiny': ['.875rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.3125rem',
            }], // 14px
            'base': ['1rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.5rem',
            }], // 16px
            'lg': ['1.125rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.75rem',
            }], // Body 2 18px
            'xl': ['1.3125rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2rem',
            }], // Body 1, Heading 6 21px
            '2xl': ['1.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2.25rem',
            }], // Heading 5 24px
            '3xl': ['1.75rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2.5rem',
            }], // Heading 4 28px
            '4xl': ['2.25rem', {
                letterSpacing: '-0.01em',
                lineHeight: '3.5rem',
            }], // Heading 3 36px
            '5xl': ['2.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '3.5rem',
            }], // Heading 2 40px
            '6xl': ['4rem', {
                letterSpacing: '-0.01em',
                lineHeight: '4.5rem',
            }], // Heading 1 64px
            '5.5xl': ['3.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '4.25rem',
            }], // Heading 2 56px
        },
        // TODO split text, background
        colors: {
            dominant: commonColors.teal,
            transparent: 'transparent',
            current: 'currentColor',

            listItemSelected: { DEFAULT: commonColors.lightTeal, dark: commonColors.darkBlue3 },

            divider: { DEFAULT: commonColors.gray4, dark: commonColors.darkBlue3 },

            //--------------------------------------------
            black: { DEFAULT: '#02083D',
                5: '#F7F6FD', // 9
                50: '#F8F7FA', // 8
                100: '#F6F9FC', // 7
                200: '#EEF2FA', // 6
                300: '#E1E2ED', // 5
                400: '#C5C6D2', // 4
                500: '#8B8C9B', // 3
                600: '#3e3b3b', // 2
                700: '#02083D', // 1,
                800: '#000000' },
            white: colors.white,
            blue: { DEFAULT: '#384562',
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#a7acb9',
                400: '#9198a8',
                500: '#7a8396',
                600: '#646e85',
                700: '#4e5973',
                800: '#384562',
                900: '#223050' },
            darkBlue: { DEFAULT: '#223050',
                1: commonColors.darkBlue1,
                2: commonColors.darkBlue2,
                3: commonColors.darkBlue3,
                4: commonColors.darkBlue4,
                5: commonColors.darkBlue5 },
            gray: { DEFAULT: '#8D9091',
                ...colors.gray,
                1: commonColors.gray1,
                2: commonColors.gray2,
                3: commonColors.gray3,
                4: commonColors.gray4,
            },
            teal: { DEFAULT: '#00C8BC',
                5: '#03bdce17',
                50: '#b3efeb',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#00C8BC',
                700: '#00C8BC',
                lightTeal: '#E2F6F5',
            },
            green: { DEFAULT: '#22B02E' },
            yellow: { DEFAULT: '#FFD965' },
            red: { DEFAULT: '#E5544B', lightRed: '#E5544B19' },
            pink: { DEFAULT: '#E95F67' },
            mint: { DEFAULT: '#09becf' },
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            // borderRadius: {
            //     'xl': '0.625rem',
            //     '3xl': '1.25rem'
            // },
            borderColor: ['group-focus'],
            textColor: {
                txtPrimary: { DEFAULT: commonColors.darkBlue, dark: commonColors.gray4 },
                txtSemiPrimary: { DEFAULT: commonColors.gray2, dark: commonColors.darkBlue4 },
                txtSecondary: { DEFAULT: commonColors.gray1, dark: commonColors.darkBlue5 },

                txtBtnPrimary: { DEFAULT: commonColors.white, dark: commonColors.white },
                txtBtnSecondary: { DEFAULT: commonColors.teal, dark: commonColors.teal },
                txtTabInactive: { DEFAULT: commonColors.gray1, dark: commonColors.darkBlue5 },
                txtTabActive: { DEFAULT: commonColors.white, dark: commonColors.white },
            },
            backgroundColor: {
                bgTabInactive: { DEFAULT: commonColors.gray4, dark: commonColors.darkBlue3 },
                bgTabActive: commonColors.teal,
                bgPrimary: { DEFAULT: commonColors.white, dark: commonColors.darkBlue1 },
                bgSecondary: { DEFAULT: commonColors.gray4, dark: commonColors.darkBlue5 },
                bgContainer: { DEFAULT: '#fff', dark: commonColors.darkBlue1 },
                headerBg: { DEFAULT: 'rgba(0, 0, 0, 0.3)', dark: 'rgba(0, 0, 0, 0.3)' },
                homepageBg: { DEFAULT: '#f2f4f66e', dark: commonColors.darkBlue2 },
                bgBtnPrimary: { DEFAULT: commonColors.teal, dark: commonColors.teal },
                bgBtnSecondary: { DEFAULT: commonColors.gray4, dark: commonColors.darkBlue },
            },
            fontWeight: { bold: 600 },
        },
    },
    variants: {
    },
    plugins: [
        require('@tailwindcss/forms')({ strategy: 'class',
        }),
        require('@tailwindcss/line-clamp'),
    ],
};
