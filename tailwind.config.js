// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');
const colors2 = require('./src/styles/colors');
// Common colors
const commonColors = {
    ...colors2
};

module.exports = {
    // future: {
    //     removeDeprecatedGapUtilities: true,
    //     purgeLayersByDefault: true,
    // },
    mode: 'jit',
    purge: ['./src/pages/**/**/*.{js,ts,jsx,tsx}', './src/components/**/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true
        },
        backgroundSize: {
            auto: 'auto',
            cover: 'cover',
            contain: 'contain',
            '100%': '100%'
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900
        },
        fontFamily: {
            sans: ['Barlow', 'sans-serif'],
            serif: ['serif'],
            inter: ['Inter', 'sans-serif'],
            'SF-Pro': ['SF-Pro']
        },
        fontSize: {
            xxs: [
                '.625rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1rem'
                }
            ], // Outline 10px
            xs: [
                '.75rem',
                {
                    lineHeight: '1.125rem'
                }
            ], // Caption 12px
            sm: [
                '.875rem',
                {
                    lineHeight: '1.25rem'
                }
            ], // Small text 14px
            tiny: [
                '.875rem',
                {
                    lineHeight: '1.3125rem'
                }
            ], // 14px
            base: [
                '1rem',
                {
                    lineHeight: '1.5rem'
                }
            ], // 16px
            lg: [
                '1.125rem',
                {
                    lineHeight: '1.75rem'
                }
            ], // Body 2 18px
            xl: [
                '1.25rem',
                {
                    lineHeight: '1.75rem'
                }
            ], // Body 1, Heading 6 21px
            '2xl': [
                '1.5rem',
                {
                    lineHeight: '1.875rem'
                }
            ], // Heading 5 24px
            '3xl': [
                '1.75rem',
                {
                    lineHeight: '2.25rem'
                }
            ], // Heading 4 28px
            '4xl': [
                '2rem',
                {
                    lineHeight: '2.375rem',
                },
            ], //32px
            '5xl': [
                '2.25rem',
                {
                    lineHeight: '3rem',
                },
            ], //36px
            '6xl': [
                '2.75rem',
                {
                    lineHeight: '3.625rem',
                },
            ], //44px
        },
        // TODO split text, background
        colors: {
            dominant: commonColors.teal,
            transparent: 'transparent',
            current: 'currentColor',

            listItemSelected: {
                DEFAULT: commonColors.lightTeal,
                dark: commonColors.darkBlue3
            },

            shadow: '#0c0e14',
            divider: {
                DEFAULT: commonColors.divider.DEFAULT,
                dark: commonColors.divider.dark
            },

            hover: {
                ...commonColors.hover,
                DEFAULT: commonColors.hover.DEFAULT,
                dark: commonColors.hover.dark
            },

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
                900: '#223050',
                crayola: '#1e77eb'
            },
            darkBlue: {
                DEFAULT: commonColors.darkBlue,
                1: commonColors.darkBlue1,
                2: commonColors.darkBlue2,
                3: commonColors.darkBlue3,
                4: commonColors.darkBlue4,
                5: commonColors.darkBlue5,
                6: commonColors.darkBlue6,
                '5a': 'rgba(123, 140, 178, 0.8)'
            },
            gray: {
                DEFAULT: '#8D9091',
                ...colors.gray,
                ...commonColors.gray
            },
            teal: {
                DEFAULT: commonColors.teal,
                5: '#03bdce17',
                50: '#b3efeb',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#00C8BC',
                700: '#00C8BC',
                800: '#52EAD1',
                900: '#33FFDD',
                1000: '#80FFEA',
                1100: '#B3FFF2',
                1200: '#D9FFF8',
                lightTeal: '#E2F6F5',
                opacity: 'rgba(0, 200, 188, 0.5)',
                opacitier: 'rgba(0, 200, 188, 0.1)'
            },
            green: {
                DEFAULT: '#22B02E',
                opacity: 'rgba(34, 176, 46, 0.18)',
                border_light: 'rgba(126, 229, 174, 0.1)',
                ...commonColors.green
            },
            purple: {
                ...commonColors.purple
            },
            yellow: {
                DEFAULT: '#FFD965',
                100: '#FFC632',
                ...commonColors.yellow
            },
            red: {
                DEFAULT: commonColors.red2,
                lightRed: '#E5544B19',
                ...commonColors.red
            },
            pink: { DEFAULT: '#E5544B' },
            mint: { DEFAULT: '#00C8BC' },

            onus: {
                DEFAULT: commonColors.onus.bg,
                1: commonColors.onus.bg2,
                2: commonColors.onus.bg3,
                ...commonColors.onus
            },
            nao: {
                DEFAULT: commonColors.nao.bg,
                ...commonColors.nao
            },
            dark: {
                ...commonColors.dark,
                DEFAULT: commonColors.dark.dark
            }
        },
        extend: {
            screens: {
                '2xl': '2160px',
                xxl: '1440px',
                v3: '1216px',
                nao: '1160px',
                mb: '820px',
                xxs: '360px',
                xsm: '320px',
                xs: '319px'
            },
            spacing: {
                128: '32rem',
                144: '36rem'
            },
            // borderRadius: {
            //     'xl': '0.625rem',
            //     '3xl': '1.25rem'
            // },
            borderColor: ['group-focus'],
            placeholderColor: {
                txtSecondary: {
                    DEFAULT: commonColors.gray[1],
                    dark: commonColors.darkBlue5
                }
            },
            textColor: {
                txtPrimary: {
                    DEFAULT: commonColors.darkBlue,
                    dark: commonColors.gray[4]
                },
                txtSemiPrimary: {
                    DEFAULT: commonColors.gray[2],
                    dark: commonColors.darkBlue4
                },
                txtSecondary: {
                    DEFAULT: commonColors.gray[1],
                    dark: commonColors.darkBlue5
                },

                txtBtnPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.white
                },
                txtBtnSecondary: {
                    DEFAULT: commonColors.teal,
                    dark: commonColors.teal
                },
                txtTabInactive: {
                    DEFAULT: commonColors.gray[1],
                    dark: commonColors.darkBlue5
                },
                txtTabActive: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.white
                },
                onus: {
                    DEFAULT: commonColors.onus.white,
                    secondary: commonColors.onus.grey
                },
                txtDarkBlue: {
                    DEFAULT: commonColors.darkBlue5
                },
                txtTextBtn: {
                    DEFAULT: '#30bf73',
                    pressed: '#19a65b',
                    disabled: '#b5c0c9',
                    dark: '#47cc85',
                    dark_pressed: '#19a65b',
                    dark_disabled: '#454c5c',
                    tonal: '#8593a6',
                    tonal_dark: '#8694b2'
                },
                txtDisabled: {
                    DEFAULT: '#b5c0c9',
                    dark: '#3e4351'
                },
                txtTabHover: {
                    DEFAULT: '#1e1e1e',
                    dark: '#acbde5'
                }
            },
            backgroundColor: {
                bgTabInactive: {
                    DEFAULT: commonColors.gray[4],
                    dark: commonColors.darkBlue3
                },
                bgTabActive: commonColors.teal,
                bgSegmentInactive: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.dark.dark
                },
                bgSegmentActive: {
                    DEFAULT: commonColors.gray[10],
                    dark: commonColors.dark[2]
                },
                bgPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.dark.dark
                },
                bgSecondary: {
                    DEFAULT: commonColors.gray[4],
                    dark: commonColors.darkBlue5
                },
                bgContainer: {
                    DEFAULT: '#fff',
                    dark: commonColors.darkBlue3
                },
                bgSpotContainer: {
                    DEFAULT: '#fff',
                    dark: commonColors.dark.dark
                },
                headerBg: {
                    DEFAULT: 'rgba(0, 0, 0, 0.3)',
                    dark: 'rgba(0, 0, 0, 0.3)'
                },
                homepageBg: {
                    DEFAULT: '#f2f4f66e',
                    dark: commonColors.darkBlue2
                },
                bgBtnPrimary: {
                    DEFAULT: commonColors.teal,
                    dark: commonColors.teal
                },
                bgBtnSecondary: {
                    DEFAULT: commonColors.gray[4],
                    dark: commonColors.darkBlue
                },
                bgInput: {
                    DEFAULT: commonColors.gray[10],
                    dark: commonColors.darkBlue3
                },
                bgHover: {
                    DEFAULT: 'rgba(245, 245, 245, 0.5)',
                    dark: 'rgba(38, 52, 89, 0.3)'
                },
                bgCondition: {
                    DEFAULT: 'rgba(255, 247, 235, 0.2)',
                    dark: 'rgba(255, 247, 235, 0.2)'
                },
                bgButtonDisabled: {
                    DEFAULT: '#ebedf3',
                    dark: commonColors.dark[2]
                },
                bgNaoStart: 'rgba(9, 61, 209, 0.5)',
                bgBtnV2: {
                    // Filled button light mode: https://app.zeplin.io/project/634cdbdac32a57166e77de3c/screen/63abbb11c737c2054d136381
                    DEFAULT: '#30bf73',
                    pressed: '#19a65b',
                    disabled: '#b5c0c9',
                    // Filled button dark mode
                    dark: '#47cc85',
                    dark_pressed: '#19a65b',
                    dark_disabled: '#454c5c',
                    // Fill tonal button light mode
                    tonal: '#ebeced',
                    tonal_pressed: '#ddddde',
                    tonal_disabled: '#ebeced',
                    tonal_loading: '#ebeced',
                    // Fill tonal button dark mode
                    tonal_dark: '#1c232e',
                    tonal_dark_pressed: '#262b34',
                    tonal_dark_disabled: '#1c232e',
                    tonal_dark_loading: '#1c232e'
                }
            },
            backgroundImage: {
                rank: "url('/images/contest/bg_rank.png')",
                'rank-header': 'linear-gradient(101.26deg, rgba(9, 61, 209, 0.5) -5.29%, rgba(73, 232, 213, 0.5) 113.82%)',
                'rank-line': 'linear-gradient(99.4deg, rgba(73, 232, 213, 0) -5.31%, #093DD1 37.56%, rgba(73, 232, 213, 0) 85.14%)',
                'namiv2-linear': "url('/images/screen/wallet/overview_background.png')",
                'namiv2-linear-dark': "url('/images/screen/wallet/overview_background_dark.png')",
                'gradient-button-dark':
                    'linear-gradient(95deg, rgba(62, 166, 111, 0.49) -2%, rgba(55, 220, 131, 0.54) 26%, rgba(50, 222, 133, 0.66) 37%, rgba(40, 226, 137, 0.7) 50%, rgba(48, 220, 137, 0.7) 61%, rgba(57, 212, 138, 0.63) 71%, rgba(60, 210, 134, 0.37) 86%, rgba(63, 207, 130, 0.15) 101%)',
                'gradient-button':
                    'linear-gradient(285.88deg, rgba(98, 255, 104, 0.24) 6.52%, rgba(50, 244, 110, 0.59) 38.97%, rgba(45, 225, 96, 0.53) 65.02%, #3BE29C 91.4%)',
                'gradient-button-hover-dark': 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)',
                'gradient-button-hover': `linear-gradient(0deg, ${commonColors.teal} 100%, ${commonColors.teal} 100%)`,
                'refferal-v2-banner': "url('/images/reference/background_desktop_2.png')",
                'tx-history-detail': "url('/images/screen/transaction-history/detail_bg-light.png')",
                'tx-history-detail-dark': "url('/images/screen/transaction-history/detail_bg-dark.png')",
                'progress-gradient': `linear-gradient(101.26deg,${commonColors.lightTeal} -5.29%,${commonColors.teal} 100%)`,
                'nao-corner': "url('/images/nao/bg-corner-light.webp')",
                'nao-corner-mb': "url('/images/nao/bg-corner-light-mb.webp')",
                'nao-corner-dark': "url('/images/nao/bg-corner.webp')",
                'nao-corner-mb-dark': "url('/images/nao/bg-corner-mb.webp')",
            },
            backgroundSize: {
                auto: 'auto',
                cover: 'cover',
                contain: 'contain',
                inherit: 'inherit',
                initial: 'initial',
                revert: 'revert',
                unset: 'unset',
                full: '100% 100%',
            },
            dropShadow: {
                common: '0px 15px 30px rgba(0, 0, 0, 0.03)',
                onlyLight: '0px 7px 23px rgba(0, 0, 0, 0.05)',
                onlyDark: '0px 7px 23px rgba(245, 245, 245, 0.05)'
            },
            boxShadow: {
                onlyLight: '0px 7px 23px rgba(0, 0, 0, 0.05)',
                features: '0px 10px 30px rgba(89, 111, 153, 0.05)',
                mobile: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)',
                order_detail: '0px -4px 30px rgba(0, 0, 0, 0.08)',
                nao: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                funding: '0px -4px 10px rgba(0, 0, 0, 0.05)',
                rank_id: '0px 0.204414px 0.204414px rgba(0, 0, 0, 0.25)',
                ref: '0 4px 15px 0 rgba(0, 0, 0, 0.15)',
                popover: '0 -4px 20px 0 rgba(31, 47, 70, 0.1)',
                card_light: '0 6px 20px 0 rgba(31, 47, 70, 0.1)'
            },
            cursor: {
                grabbing: 'grabbing'
            },
            transitionProperty: {
                height: 'height'
            },
            fill: {
                fillPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.dark.dark,
                },
                fillSecondary: {
                    DEFAULT: commonColors.gray[12],
                    dark: commonColors.dark[2],
                },
            },
        }
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            display: ['group-hover'],
            visibility: ['group-hover'],
            cursor: ['grabbing']
        }
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class'
        }),
        require('@tailwindcss/line-clamp')
    ]
};
