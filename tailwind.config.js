// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

// Common colors
const commonColors = {
    transparent: 'transparent',

    darkBlue: '#223050',
    darkBlue1: '#00091F',
    darkBlue2: '#151D2F',
    darkBlue3: '#141921',
    darkBlue4: '#445271',
    darkBlue5: '#8694b2',
    darkBlue6: '#2e333d',

    dark: {
        dark: '#0c0e14',
        1: '#2e333d',
        2: '#1c232e',
        3: '#1f2f46'
    },

    gray1: '#718096',
    gray2: '#A0AEC0',
    gray3: '#CBD5E0',
    gray4: '#e2e8f0',
    gray5: '#EDF1F6',
    gray6: '#E2E8F0',
    gray7: '#8694b2',
    gray8: '#262e40',
    gray9: '#8593a6',

    white: 'white',
    teal: '#47cc85',
    lightTeal: '#E2F6F5',

    red2: '#f93636',

    green1: '#7ee5ae',

    onus: {
        bg: '#1B222D',
        bg2: '#36445A',
        bg3: '#243042',
        bgModal: '#243042',
        bgModal2: '#1e1e1e',
        bgModal3: '#090D17',
        base: '#0068FF',
        green: '#0DB787',
        red: '#DC1F4E',
        line: '#2B3247',
        input: '#243042',
        input2: '#36445A',
        white: '#F6F6F6',
        textPrimary: '#F6F6F6',
        grey: '#8492A7',
        grey2: '#445571',
        textSecondary: '#8492A7',
        orange: '#FF9F1A'
    },
    nao: {
        bg: '#619095',
        bg2: '#12182B',
        bg3: '#192138',
        bg4: '#202E42',
        text: '#B9CCFF',
        text2: '#A6BFE6',
        grey: '#7686B1',
        grey2: '#7586AD',
        grey3: 'rgba(97, 144, 149, 0.15)',
        white: '#F6F6F6',
        blue: '#27CEE0',
        blue2: '#093DD1',
        blue3: '#99C3FF',
        green: '#49E8D5',
        green2: '#0DB787',
        yellow: '#F3BA2F',
        line: '#1C2644',
        border: '#4AEDFF',
        border2: '#18223E',
        bgModal: '#161D32',
        bgModal2: '#00030D',
        bgShadow: '#000921',
        red: '#DC1F4E',
        tooltip: '#0E1D32',
        nami: '#0E1113'
    }
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
                    letterSpacing: '-0.01em',
                    lineHeight: '1.125rem'
                }
            ], // Caption 12px
            sm: [
                '.875rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.25rem'
                }
            ], // Small text 14px
            tiny: [
                '.875rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.3125rem'
                }
            ], // 14px
            base: [
                '1rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.5rem'
                }
            ], // 16px
            lg: [
                '1.125rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.75rem'
                }
            ], // Body 2 18px
            xl: [
                '1.25rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.75rem'
                }
            ], // Body 1, Heading 6 21px
            '2xl': [
                '1.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '2.25rem'
                }
            ], // Heading 5 24px
            '3xl': [
                '1.75rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '2.5rem'
                }
            ], // Heading 4 28px
            '4xl': [
                '2.25rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '3.5rem'
                }
            ], // Heading 3 36px
            '5xl': [
                '2.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '3.5rem'
                }
            ], // Heading 2 40px
            '6xl': [
                '4rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '4.5rem'
                }
            ], // Heading 1 64px
            '5.5xl': [
                '3.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '4.25rem'
                }
            ] // Heading 2 56px
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
                DEFAULT: commonColors.gray4,
                dark: '#222940'
            },

            hover: {
                DEFAULT: '#262b34',
                dark: '#262b34'
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
                DEFAULT: '#223050',
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
                1: commonColors.gray1,
                2: commonColors.gray2,
                3: commonColors.gray3,
                4: commonColors.gray4,
                5: commonColors.gray5,
                6: commonColors.gray6,
                7: commonColors.gray7,
                8: commonColors.gray8,
                9: commonColors.gray9
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
                1: commonColors.green1
            },
            yellow: {
                DEFAULT: '#FFD965',
                100: '#FFC632'
            },
            red: {
                DEFAULT: commonColors.red2,
                lightRed: '#E5544B19'
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
                    DEFAULT: commonColors.gray1,
                    dark: commonColors.darkBlue5
                }
            },
            textColor: {
                txtPrimary: {
                    DEFAULT: commonColors.darkBlue,
                    dark: commonColors.gray4
                },
                txtSemiPrimary: {
                    DEFAULT: commonColors.gray2,
                    dark: commonColors.darkBlue4
                },
                txtSecondary: {
                    DEFAULT: commonColors.gray1,
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
                    DEFAULT: commonColors.gray1,
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
                    dark_disabled: '#454c5c'
                },
                txtDisabled: {
                    DEFAULT: '#3e4351',
                    dark: '#3e4351'
                },
                txtTabHover: {
                    DEFAULT: '#acbde5',
                    dark: '#acbde5'
                }
            },
            backgroundColor: {
                bgTabInactive: {
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue3
                },
                bgTabActive: commonColors.teal,
                bgPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.dark.dark
                },
                bgSecondary: {
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue5
                },
                bgContainer: {
                    DEFAULT: '#fff',
                    dark: commonColors.darkBlue2
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
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue
                },
                bgInput: {
                    DEFAULT: commonColors.gray5,
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
                    DEFAULT: '#30bf73',
                    pressed: '#19a65b',
                    disabled: '#b5c0c9',
                    dark: '#47cc85',
                    dark_pressed: '#19a65b',
                    dark_disabled: '#454c5c'
                }
            },
            backgroundImage: {
                rank: "url('/images/contest/bg_rank.png')",
                'rank-header': 'linear-gradient(101.26deg, rgba(9, 61, 209, 0.5) -5.29%, rgba(73, 232, 213, 0.5) 113.82%)',
                'rank-line': 'linear-gradient(99.4deg, rgba(73, 232, 213, 0) -5.31%, #093DD1 37.56%, rgba(73, 232, 213, 0) 85.14%)',
                dark: commonColors.darkBlue3,
                'namiv2-linear': "url('/images/screen/wallet/overview_background.png')"
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
                popover: '0 -4px 20px 0 rgba(31, 47, 70, 0.1)'
            },
            cursor: {
                grabbing: 'grabbing'
            },
            transitionProperty: {
                height: 'height'
            }
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
