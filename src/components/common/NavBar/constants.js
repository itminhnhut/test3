import { getV1Url } from 'redux/actions/utils';
import { PATHS } from 'constants/paths';
import { KYC_STATUS } from 'redux/actions/const';

export const DESKTOP_NAV_HEIGHT = 80;

export const MOBILE_NAV_HEIGHT = 64;

export const SPOTLIGHT = {
    // key: 0,
    // title: 'Spotlight',
    // localized: 'spotlight',
    // isNew: true,
    // url: '/',
    // child_lv1: []
};

export const NAV_DATA = [
    {
        key: 0,
        title: 'Market',
        localized: 'market',
        isNew: false,
        url: '/market',
        child_lv1: []
    },
    {
        key: 1,
        title: 'Product',
        localized: 'product',
        // hide: true,
        isNew: true,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Spot',
                localized: 'spot',
                isNew: false,
                url: '/trade',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Futures',
                localized: 'futures',
                isNew: false,
                url: '/futures',
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

            // {
            //     key: 2,
            //     title: 'Launchpad',
            //     localized: 'launchpad',
            //     isNew: false,
            //     url: 'https://launchpad.nami.exchange/',
            //     child_lv1: []
            // },
            // {
            //     key: 3,
            //     title: 'Copy Trade',
            //     localized: 'copytrade',
            //     isNew: false,
            //     url: '/',
            //     child_lv2: [],
            // },
            {
                key: 6,
                title: 'Referral',
                localized: 'referral',
                isNew: false,
                url: '/reference',
                child_lv2: []
            }
            // {
            //     key: 4,
            //     title: 'Staking',
            //     localized: 'staking',
            //     isNew: false,
            //     url: getV1Url('/staking'),
            //     child_lv2: [],
            // },
            // {
            //     key: 5,
            //     title: 'Farming',
            //     localized: 'farming',
            //     isNew: false,
            //     url: getV1Url('/farming'),
            //     child_lv2: [],
            // },
        ]
    },
    {
        key: 8,
        title: 'Trade',
        localized: 'trade',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Swap',
                localized: 'swap',
                isNew: false,
                url: '/swap',
                child_lv2: []
            },
            // {
            //     key: 1,
            //     title: 'Transfer',
            //     localized: 'transfer',
            //     isNew: false,
            //     url: '/',
            //     child_lv2: []
            // }
            {
                key: 7,
                title: 'Classic',
                localized: 'classic',
                isNew: false,
                url: '/trade',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Advance',
                localized: 'advance',
                isNew: false,
                url: '/trade/BTC-USDT?layout=pro',
                child_lv2: []
            }
        ]
    },
    {
        key: 3,
        title: 'Nami.Today',
        localized: 'today',
        isNew: false,
        url: 'https://nami.today/',
        child_lv1: []
    },
    {
        key: 4,
        title: 'Support Center',
        localized: 'support_center',
        isNew: false,
        url: '/support',
        child_lv1: []
    }
];

export const MOBILE_NAV_DATA = [
    // {
    //     key: 10,
    //     title: 'Profile',
    //     localized: 'user.user',
    //     isNew: false,
    //     url: PATHS.ACCOUNT,
    //     child_lv1: [
    //         {
    //             key: 0,
    //             title: 'APIManagement',
    //             localized: 'api_mng',
    //             // hide: true,
    //             isNew: true,
    //             url: getV1Url('/settings/api-management'),
    //             child_lv1: []
    //         }
    //     ]
    // },
    {
        key: 'daily_reward',
        title: 'daily_reward',
        localized: 'user.daily_reward',
        isNew: true,
        url: '/luckydraw/nami?web=true',
        child_lv1: []
    },
    {
        key: 1,
        title: 'Market',
        localized: 'market',
        isNew: false,
        url: '/market',
        child_lv1: []
    },
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
                url: '/trade',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Futures',
                localized: 'futures',
                isNew: false,
                url: '/futures',
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
            // {
            //     key: 2,
            //     title: 'Launchpad',
            //     localized: 'launchpad',
            //     isNew: true,
            //     url: 'https://launchpad.nami.exchange/',
            //     child_lv1: []
            // },
            // {
            //     key: 3,
            //     title: 'Copy Trade',
            //     localized: 'copytrade',
            //     isNew: false,
            //     url: '/',
            //     child_lv2: []
            // },
            // {
            //     key: 5,
            //     title: 'Futures Mobile',
            //     localized: 'mobile_futures',
            //     isNew: false,
            //     url: 'https://test.nami.exchange/mobile/futures',
            //     child_lv2: []
            // },
            // {
            //     key: 5,
            //     title: 'Farming',
            //     localized: 'farming',
            //     isNew: false,
            //     url: 'https://nami.exchange/farming',
            //     child_lv2: [],
            // },
            {
                key: 6,
                title: 'Referral',
                localized: 'referral',
                isNew: false,
                url: '/reference',
                child_lv2: []
            }
        ]
    },
    {
        key: 8,
        title: 'Trade',
        localized: 'trade',
        isNew: false,
        url: '/',
        child_lv1: [
            {
                key: 0,
                title: 'Swap',
                localized: 'swap',
                isNew: false,
                url: '/swap',
                child_lv2: []
            },
            {
                key: 7,
                title: 'Classic',
                localized: 'classic',
                isNew: false,
                url: '/trade',
                child_lv2: []
            },
            {
                key: 1,
                title: 'Advance',
                localized: 'advance',
                isNew: false,
                url: '/trade/BTC-USDT?layout=pro',
                child_lv2: []
            }
        ]
    },

    ,
    {
        key: 7,
        title: 'Nami.Today',
        localized: 'today',
        isNew: false,
        url: 'https://nami.today/',
        child_lv1: []
    },
    {
        key: 2,
        title: 'Support Center',
        localized: 'support_center',
        isNew: false,
        url: '/support',
        child_lv1: []
    },
    // {
    //     key: 3,
    //     title: 'Explained',
    //     localized: 'explained',
    //     isNew: false,
    //     url: 'https://explained.nami.exchange/',
    //     child_lv1: []
    // },
    // {
    //     key: 4,
    //     title: 'Fee',
    //     localized: 'fee',
    //     isNew: false,
    //     url: 'https://nami.exchange/fee-schedule',
    //     child_lv1: []
    // },
    {
        key: 6,
        title: 'Support',
        localized: 'support',
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
                key: 2,
                title: 'Overview',
                localized: 'overview_wallet',
                isNew: false,
                url: PATHS.WALLET.OVERVIEW,
                child_lv2: []
            },
            {
                key: 0,
                title: 'Spot Wallet',
                localized: 'spot_wallet',
                isNew: false,
                url: PATHS.WALLET.EXCHANGE.DEFAULT,
                child_lv2: []
            },
            {
                key: 1,
                title: 'Futures Wallet',
                localized: 'futures_wallet',
                isNew: false,
                url: PATHS.WALLET.FUTURES,
                child_lv2: []
            }
            // {
            //     key: 2,
            //     title: 'Staking Wallet',
            //     localized: 'staking_wallet',
            //     isNew: false,
            //     url: PATHS.WALLET.STAKING,
            //     child_lv2: [],
            // },
            // {
            //     key: 3,
            //     title: 'Farming Wallet',
            //     localized: 'farming_wallet',
            //     isNew: false,
            //     url: PATHS.WALLET.FARMING,
            //     child_lv2: [],
            // },
        ]
    }
    // {
    //     key: 'spotlight',
    //     title: 'Spotlight',
    //     localized: 'spotlight',
    //     isNew: false,
    //     url: '/',
    //     child_lv1: []
    // }
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
];

export const USER_CP = [
    {
        key: 0,
        title: 'Profile',
        localized: 'profile',
        // hide: true,
        isNew: true,
        url: PATHS.ACCOUNT.PROFILE,
        child_lv1: []
    },
    {
        key: 5,
        title: 'payment_method',
        localized: 'payment_method',
        // hide: true,
        isNew: true,
        url: PATHS.ACCOUNT?.PAYMENT_METHOD || '/',
        child_lv1: []
    },
    {
        key: 4,
        title: 'Referral',
        localized: 'referral',
        // hide: true,
        isNew: true,
        url: '/reference',
        child_lv1: []
    },
    {
        key: 3,
        title: 'partner',
        localized: 'partner',
        isPartner: true,
        // hide: true,
        isNew: true,
        url: PATHS?.PARNER_WITHDRAW_DEPOSIT?.DEFAULT || '',
        child_lv1: []
    },
    {
        key: 6,
        title: 'daily_reward',
        localized: 'daily_reward',
        isNew: true,
        url: '/luckydraw/nami?web=true',
        child_lv1: []
    }
    // {
    //     key: 1,
    //     title: 'Security',
    //     localized: 'security',
    //     hide: true,
    //     isNew: true,
    //     url: '/',
    //     child_lv1: []
    // },
    // {
    //     key: 2,
    //     title: 'Identify',
    //     localized: 'identify',
    //     hide: true,
    //     isNew: true,
    //     url: '/',
    //     child_lv1: []
    // },

    // {
    //     key: 3,
    //     title: 'RewardCenter',
    //     localized: 'reward_center',
    //     hide: true,
    //     isNew: true,
    //     url: '/account/reward-center',
    //     child_lv1: []
    // },
    // {
    //     key: 5,
    //     title: 'TaskCenter',
    //     localized: 'task_center',
    //     hide: true,
    //     isNew: true,
    //     url: '/',
    //     child_lv1: []
    // }
    // {
    //     key: 6,
    //     title: 'APIManagement',
    //     localized: 'api_mng',
    //     // hide: true,
    //     isNew: true,
    //     url: getV1Url('/settings/api-management'),
    //     child_lv1: []
    // }
];
