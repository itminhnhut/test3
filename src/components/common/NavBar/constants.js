export const DESKTOP_NAV_HEIGHT = 74

export const MOBILE_NAV_HEIGHT = 58

export const NAV_DATA = [
    {
        key: 0,
        title: 'Market',
        localized: 'market',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 1,
        title: 'Swap',
        localized: 'swap',
        isNew: true,
        url: '/swap',
        child_lv1: []
    },
    {
        key: 2,
        title: 'Exchange',
        localized: 'exchange',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 3,
        title: 'Futures',
        localized: 'futures',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 4,
        title: 'Finance',
        localized: 'finance',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Staking',
                localized: 'staking',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Farming',
                localized: 'farming',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 2,
                title: 'Loan',
                localized: 'loan',
                isNew: false,
                url: '/',
                child_lv2: []
            },
        ]
    },
    {
        key: 5,
        title: 'Launchpad',
        localized: 'launchpad',
        isNew: true,
        url: '/',
        child_lv1: []
    },
    {
        key: 7,
        title: 'Product',
        localized: 'product',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Explained',
                localized: 'explained',
                isNew: false,
                url: '/',
                child_lv2: []
            }
        ]
    },
    {
        key: 6,
        title: 'More',
        localized: 'more',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Lorem ipsum',
                localized: 'lorem',
                isNew: false,
                url: '/',
                child_lv2: [
                    {
                        key: 0,
                        title: 'Lorem ipsum nonstop',
                        localized: 'loremnonstop',
                        isNew: false,
                        url: '/',
                        child_lv3: []
                    },
                    // ...
                ]
            }
        ]
    },
]


export const MOBILE_NAV_DATA = [
    {
        key: 0,
        title: 'Nami Product',
        localized: 'product',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Spot',
                localized: 'spot',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Futures',
                localized: 'futures',
                isNew: false,
                url: '/',
                child_lv1: []
            },
            {
                key: 7,
                title: 'Swap',
                localized: 'swap',
                isNew: false,
                url: '/swap',
                child_lv2: []
            },
            {
                key: 2,
                title: 'Launchpad',
                localized: 'launchpad',
                isNew: true,
                url: '/',
                child_lv1: []
            },
            {
                key: 3,
                title: 'Copy Trade',
                localized: 'copytrade',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 4,
                title: 'Staking',
                localized: 'staking',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 5,
                title: 'Farming',
                localized: 'farming',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 6,
                title: 'Referral',
                localized: 'referral',
                isNew: false,
                url: '/',
                child_lv2: []
            },
        ]
    },
    {
        key: 1,
        title: 'Market',
        localized: 'market',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 2,
        title: 'Blog',
        localized: 'blog',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 3,
        title: 'Explained',
        localized: 'explained',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 4,
        title: 'Fee',
        localized: 'fee',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 5,
        title: 'Wallet',
        localized: 'wallet',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Spot Wallet',
                localized: 'spot_wallet',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Futures Wallet',
                localized: 'futures_wallet',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 2,
                title: 'Staking Wallet',
                localized: 'staking_wallet',
                isNew: false,
                url: '/',
                child_lv2: []
            },
            {
                key: 3,
                title: 'Farming Wallet',
                localized: 'farming_wallet',
                isNew: false,
                url: '/',
                child_lv2: []
            },
        ]
    },
    {
        key: 6,
        title: 'Support',
        localized: 'support',
        isNew: false,
        url: '/',
        child_lv1: []
    },
    {
        key: 'spotlight',
        title: 'Spotlight',
        localized: 'spotlight',
        isNew: false,
        url: '/',
        child_lv1: []
    }
    // {
    //     key: 6,
    //     title: 'More',
    //     localized: 'more',
    //     isNew: false,
    //     url: '/',
    //     child_lv1: [
    //         {
    //             key: 0,
    //             title: 'Lorem ipsum',
    //             localized: 'lorem',
    //             isNew: false,
    //             url: '/',
    //             child_lv2: [
    //                 {
    //                     key: 0,
    //                     title: 'Lorem ipsum nonstop',
    //                     localized: 'loremnonstop',
    //                     isNew: false,
    //                     url: '/',
    //                     child_lv3: []
    //                 },
    //                 // ...
    //             ]
    //         }
    //     ]
    // },
]
