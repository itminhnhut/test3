// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors')

const _m = {
    base: '#00C8BC',
    bg: '#eeeeee',
    lightThemeBg: '#FCFCFC',
    componentBackground: 'white',
    bgLow: '#f8f8f8',
    bgItem: 'white',
    primary: '#223050',
    semiPrimary: '#616161',
    secondaryLight: '#aba7a7',
    secondary: '#808080',
    red1: '#c91442',
    orange: '#ffa600',

    priceUp: '#00DCC9',
    priceDown: '#E5544B',
    eco: '#baff6f',
    teal: '#00C8BC',
    lightTeal: '#E2F6F5',
    exchange: '#00DCC9',
    ecoShade: {
        darker1: '#AAE865',
        darker2: '#99D15B'
    },

    // Components
    wildSand: '#F6F6F6',
    white: '#ffff',
    iceberg: '#E2F6F5',
    listItemTapColor: '#d8d7dc',
    red2: '#E5544B',
    lightRed2: 'rgba(229, 84, 75, 0.1)',

    transparent: 'transparent',

    darkBlue: '#223050',
    darkBlue1: '#00091F',
    darkBlue2: '#151D2F',
    darkBlue3: '#263459',
    darkBlue4: '#445271',
    darkBlue5: '#7B8CB2',

    grey1: '#718096',
    grey2: '#A0AEC0',
    grey3: '#CBD5E0',
    grey4: '#F2F4F6',

    green: '#22B02E',
    red: '#C5292A',
    yellow: '#FFD965',
    navy: '#191489',
    marina: '#A6D4FF',
    blue: '#2D9CDB'
}

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
            center: true
        },
        fontFamily: {
            sans: ['Barlow', 'sans-serif'],
            serif: ['serif']
        },
        fontSize: {
            'xxs': ['.625rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1rem'
            }], // Outline 10px
            'xs': ['.75rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.125rem'
            }], // Caption 12px
            'sm': ['.875rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.3125rem'
            }], // Small text 14px
            'tiny': ['.875rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.3125rem'
            }], // 14px
            'base': ['1rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.5rem'
            }], // 16px
            'lg': ['1.125rem', {
                letterSpacing: '-0.01em',
                lineHeight: '1.75rem'
            }], // Body 2 18px
            'xl': ['1.3125rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2rem'
            }], // Body 1, Heading 6 21px
            '2xl': ['1.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2.25rem'
            }], // Heading 5 24px
            '3xl': ['1.75rem', {
                letterSpacing: '-0.01em',
                lineHeight: '2.5rem'
            }], // Heading 4 28px
            '4xl': ['2.25rem', {
                letterSpacing: '-0.01em',
                lineHeight: '3.5rem'
            }], // Heading 3 36px
            '5xl': ['2.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '3.5rem'
            }], // Heading 2 40px
            '6xl': ['4rem', {
                letterSpacing: '-0.01em',
                lineHeight: '4.5rem'
            }], // Heading 1 64px
            '5.5xl': ['3.5rem', {
                letterSpacing: '-0.01em',
                lineHeight: '4.25rem'
            }] // Heading 2 56px
        },
        colors: {
            dominant: _m.teal,
            transparent: 'transparent',
            current: 'currentColor',
            background: {
                DEFAULT: _m.white,
                dark: _m.darkBlue1
            },
            backgroundSecondary: {
                DEFAULT: _m.grey4,
                dark: _m.darkBlue2
            },
            bgContainer: {
                DEFAULT: '#fff',
                dark: '#223050'
            },
            headerBg: {
                DEFAULT: 'rgba(0, 0, 0, 0.3)',
                dark: 'rgba(0, 0, 0, 0.3)'
            },
            homepageBg: {
                DEFAULT: '#f2f4f66e',
                dark: _m.darkBlue2,
            },
            listItemSelected: {
                DEFAULT: _m.lightTeal,
                dark: _m.darkBlue3
            },
            textPrimary: {
                DEFAULT: _m.darkBlue,
                dark: _m.grey4
            },
            textSemiPrimary: {
                DEFAULT: _m.grey2,
                dark: _m.darkBlue4
            },
            textSecondary: {
                DEFAULT: _m.grey1,
                dark: _m.darkBlue5
            },
            btnPrimary: {
                DEFAULT: _m.teal,
                dark: _m.teal
            },
            btnSecondary: {
                DEFAULT: _m.grey4,
                dark: _m.darkBlue,
            },
            btnTxtPrimary: {
              DEFAULT: _m.white,
              dark: _m.white,
            },
            btnTxtSecondary: {
              DEFAULT: _m.teal,
              dark: _m.teal
            },
            textTabLabelInactive: {
              DEFAULT: _m.grey1,
              dark: _m.darkBlue5
            },
            textTabLabelActive: {
              DEFAULT: _m.white,
              dark: _m.white
            },
            bgTabInactive: {
                DEFAULT: _m.grey4,
                dark: _m.darkBlue3
            },
            bgTabActive: _m.teal,
            divider: {
                DEFAULT: _m.grey4,
                dark: _m.darkBlue3
            },
            get: { ..._m },

            //--------------------------------------------
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
                800: '#000000'
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
                900: '#223050'
            },
            darkBlue: {
                DEFAULT: '#223050'
            },
            gray: { DEFAULT: '#8D9091', ...colors.gray },
            teal: {
                DEFAULT: '#09becf',
                5: '#03bdce17',
                50: '#b3efeb',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#09becf',
                700: '#09becf'
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
                900: '#00645e'
            },
            green: {
                DEFAULT: '#22b02e',
                ...colors.green
            },
            yellow: {
                DEFAULT: '#FFD965',
                ...colors.amber
            },
            red: {
                DEFAULT: '#C5292A',
                ...colors.red
            },
            pink: {
                DEFAULT: '#E95F67'
            },
            mint: {
                DEFAULT: '#09becf'
            }
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem'
            },
            borderRadius: {
                'xl': '0.625rem',
                '3xl': '1.25rem'
            },
            borderColor: ['group-focus'],
            fontWeight: {
                bold: 600
            }
        }
    },
    variants: {
        extend: {
            backgroundOpacity: ['active'],
            boxShadow: {
                lg: ''
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class'
        }),
        require('@tailwindcss/line-clamp')
    ]
}
