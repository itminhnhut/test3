export const REWARD_TYPE = {
    PROMOTION: 'PROMOTION',
    TRADING: 'TRADING'
}

export const REWARD_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILBLE',
    AVAILABLE: 'AVAILABLE',
    COMING_SOON: 'COMING_SOON'
}

const TASK_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILBLE',
    READY: 'READY',
    COMING_SOON: 'COMING_SOON',
    PROGRESSING: 'PROGRESSING',
    COMPLETED: 'COMPLETED'
}

const TASK_PROPS_TYPE = {
    MULTISTEP: 'MULTISTEP',
    REACH_TARGET: 'REACH_TARGET'
}

const TASK_ACTIONS = {
    USER: {
        KYC: 'KYC',
        WITHDRAW: 'WITHDRAW',
        DEPOSIT: 'DEPOSIT',
        TRANSFER: 'TRANSFER',
    },
    TRADE: {
        SPOT: {
            BUY: 'BUY',
            SELL: 'SELL',
            SWAP: 'SWAP',
        },
        FUTURES: {
            BUY: 'BUY',
            SELL: 'SELL',
            COPY_TRADE: 'COPY_TRADE'
        }
    },
    EARN: {
        STAKE: 'STAKE',
        FARM: 'FARM',
    },
    CLAIM: 'CLAIM'
}

const CLAIM_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    AVAILABLE: 'AVAILABLE',
    CLAIMED: 'CLAIMED',
}

export default [
    {
        // ? Reward summary
        id: 'new_user_journey_2022',
        status: REWARD_STATUS.AVAILABLE,
        type: REWARD_TYPE.PROMOTION,
        start_at: '2021-12-31T17:00:00.000Z', // if status is COMING_SOON
        expired_at: '2021-12-31T17:00:00.000Z',

        // ? Constraints (query in cms)
        // constraints: [
        //     { id: [18, 888] },
        //     { region: ['vn-vi'] }
        // ],

        // ? Basic info
        icon_url: '/images/icon/ic_exchange.png',
        url_reference: 'https://nami.io/0510/new-user-journey',
        claimable_all: true,

        title: {
            en: 'New User Journey',
            vi: 'Bắt đầu hành trình mới của bạn'
        },
        notes: {
            vi: [
                'Chỉ dành cho <span class="text-dominant">người dùng Việt Nam</span>'
            ],
            en: [
                'For <span class="text-dominant">Vietnamese User</span> only'
            ]
        },
        description: {
            vi: [
                'Complete your new user journey to claim free token for each task.'
            ],
            en: [
                'Complete your new user journey to claim free token for each task.'
            ]
        },

        // ? Total reward
        total_reward: {
            assetId: 72,
            value: 4e5
        },

        // ? Tasks
        tasks: {
            total: 2,

            // !Task list
            task_list: [

                // !NOTE: Task KYC
                {
                    // Task summary
                    task_id: 'completed_kyc',
                    task_status: TASK_STATUS.READY,
                    start_at: '2021-12-31T17:00:00.000Z',
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: 'icon url',
                    task_title: {
                        vi: 'Hoàn thành xác minh danh tính',
                        en: 'Complete KYC Progress'
                    },
                    description: 'https://nami.io/0510/complete-kyc-progress',

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.MULTISTEP,
                        status: CLAIM_STATUS.AVAILABLE,
                        metadata: {
                            steps: [
                                { vi: 'Chưa bắt đầu', en: 'Not started' },
                                { vi: 'Đang chờ duyệt', en: 'Verifying' },
                                { vi: 'Hoàn tất', en: 'Finished' }
                            ],
                            current_step_index: 2,
                            actions: [TASK_ACTIONS.USER.KYC, TASK_ACTIONS.CLAIM],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 22,
                        value: 50
                    }
                },

                // !NOTE: Task Deposit 500,000 VNDC
                {
                    // Task summary
                    task_id: 'deposit_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: 'icon url',
                    task_title: {
                        vi: 'Nạp 500,000 VNDC',
                        en: 'Deposit 500,000 VNDC'
                    },
                    description: {
                        vi: 'Nạp VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Deposit VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        status: CLAIM_STATUS.AVAILABLE,
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 180000,
                            actions: [TASK_ACTIONS.USER.DEPOSIT, TASK_ACTIONS.CLAIM],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                }
            ]
        }
    },
    {
        // ? Reward summary
        id: 'new_user_journey_2022_clone',
        status: REWARD_STATUS.NOT_AVAILABLE,
        type: REWARD_TYPE.TRADING,
        start_at: '2021-12-31T17:00:00.000Z', // if status is COMING_SOON
        expired_at: '2021-12-31T17:00:00.000Z',

        // ? Constraints (query in cms)
        // constraints: [
        //     { id: [18, 888] },
        //     { region: ['vn-vi'] }
        // ],

        // ? Basic info
        icon_url: '/images/icon/ic_exchange.png',
        url_reference: 'https://nami.io/0510/new-user-journey',
        claimable_all: true,

        title: {
            en: 'New User Journey (II)',
            vi: 'Bắt đầu hành trình mới của bạn (II)'
        },
        notes: {
            vi: [
                'Chỉ dành cho <span class="text-dominant">người dùng Việt Nam</span>'
            ],
            en: [
                'For <span class="text-dominant">Vietnamese User</span> only'
            ]
        },
        description: {
            vi: [
                'Complete your new user journey to claim free token for each task.'
            ],
            en: [
                'Complete your new user journey to claim free token for each task.'
            ]
        },

        // ? Total reward
        total_reward: {
            assetId: 72,
            value: 4e5
        },

        // ? Tasks
        tasks: {
            total: 2,

            // !Task list
            task_list: [

                // !NOTE: Task KYC
                {
                    // Task summary
                    task_id: 'completed_kyc',
                    task_status: TASK_STATUS.READY,
                    start_at: '2021-12-31T17:00:00.000Z',
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: 'icon url',
                    task_title: {
                        vi: 'Hoàn thành xác minh danh tính',
                        en: 'Complete KYC Progress'
                    },
                    description: 'https://nami.io/0510/complete-kyc-progress',

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.MULTISTEP,
                        status: CLAIM_STATUS.AVAILABLE,
                        metadata: {
                            steps: [
                                { vi: 'Chưa bắt đầu', en: 'Not started' },
                                { vi: 'Đang chờ duyệt', en: 'Verifying' },
                                { vi: 'Hoàn tất', en: 'Finished' }
                            ],
                            current_step_index: 2,
                            actions: [TASK_ACTIONS.USER.KYC, TASK_ACTIONS.CLAIM],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 22,
                        value: 50
                    }
                },

                // !NOTE: Task Deposit 500,000 VNDC
                {
                    // Task summary
                    task_id: 'deposit_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: 'icon url',
                    task_title: {
                        vi: 'Nạp 500,000 VNDC',
                        en: 'Deposit 500,000 VNDC'
                    },
                    description: {
                        vi: 'Nạp VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Deposit VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        status: CLAIM_STATUS.AVAILABLE,
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 180000,
                            actions: [TASK_ACTIONS.USER.DEPOSIT, TASK_ACTIONS.CLAIM],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                }
            ]
        }
    }
]
