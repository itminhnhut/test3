// REDUX ACTION TYPES
export const SINGLE_API = 'SINGLE_API'
export const SET_USER = 'SET_USER'
export const SET_LOADING_USER = 'SET_LOADING_USER'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_USER_SOCKET = 'SET_USER_SOCKET'
export const SET_PUBLIC_SOCKET = 'SET_PUBLIC_SOCKET'
export const SET_SOCKET_AUTHORIZE_STATUS = 'SET_SOCKET_AUTHORIZE_STATUS'

export const UPDATE_WALLET = 'UPDATE_WALLET'
export const UPDATE_ALL_WALLET = 'UPDATE_ALL_WALLET'
export const UPDATE_DEPOSIT_HISTORY = 'UPDATE_DEPOSIT_HISTORY'

export const SET_EXCHANGE_CONFIG = 'SET_EXCHANGE_CONFIG'
export const SET_ASSET_CONFIG = 'SET_ASSET_CONFIG'
export const SET_SPOT_SELECTED_ORDER = 'SET_SPOT_SELECTED_ORDER'
export const SET_SPOT_SYMBOL_TICKER = 'SET_SPOT_SYMBOL_TICKER'
export const SET_PAYMENT_CONFIG = 'SET_PAYMENT_CONFIG'

export const SET_QUOTE_ASSET = 'SET_QUOTE_ASSET'

export const SET_THEME = 'SET_THEME'
export const SET_TRANSFER_MODAL = 'SET_TRANSFER_MODAL'

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const SET_NOTIFICATION = 'SET_NOTIFICATION'
export const SET_NOTIFICATION_UNREAD_COUNT = 'SET_NOTIFICATION_UNREAD_COUNT'
export const ADD_NOTIFICATION_UNREAD_COUNT = 'ADD_NOTIFICATION_UNREAD_COUNT'
export const NOTIFICATION_MARK_ALL_AS_READ = 'NOTIFICATION_MARK_ALL_AS_READ'
export const SET_PROFILE_MODAL_SHOWING = 'SET_PROFILE_MODAL_SHOWING'

export const GET_KYC_COUNTRY_REQUEST = 'GET_KYC_COUNTRY_REQUEST'
export const GET_KYC_COUNTRY_SUCCESS = 'GET_KYC_COUNTRY_SUCCESS'
export const GET_KYC_COUNTRY_FAILURE = 'GET_KYC_COUNTRY_FAILURE'

export const GET_KYC_STATUS_REQUEST = 'GET_KYC_STATUS_REQUEST'
export const GET_KYC_STATUS_SUCCESS = 'GET_KYC_STATUS_SUCCESS'
export const GET_KYC_STATUS_FAILURE = 'GET_KYC_STATUS_FAILURE'

export const SET_KYC_INFORMATION_REQUEST = 'SET_KYC_INFORMATION_REQUEST'
export const SET_KYC_INFORMATION_SUCCESS = 'SET_KYC_INFORMATION_SUCCESS'
export const SET_KYC_INFORMATION_FAILURE = 'SET_KYC_INFORMATION_FAILURE'

export const SET_KYC_BANK_REQUEST = 'SET_KYC_BANK_REQUEST'
export const SET_KYC_BANK_SUCCESS = 'SET_KYC_BANK_SUCCESS'
export const SET_KYC_BANK_FAILURE = 'SET_KYC_BANK_FAILURE'

export const SET_KYC_IMAGE_REQUEST = 'SET_KYC_IMAGE_REQUEST'
export const SET_KYC_IMAGE_FRONT_SUCCESS = 'SET_KYC_IMAGE_FRONT_SUCCESS'
export const SET_KYC_IMAGE_BACK_SUCCESS = 'SET_KYC_IMAGE_BACK_SUCCESS'
export const SET_KYC_IMAGE_PASSPORT_SUCCESS = 'SET_KYC_IMAGE_PASSPORT_SUCCESS'
export const SET_KYC_IMAGE_SELFIE_SUCCESS = 'SET_KYC_IMAGE_SELFIE_SUCCESS'
export const SET_KYC_IMAGE_FAILURE = 'SET_KYC_IMAGE_FAILURE'

export const SUBMIT_KYC_REQUEST = 'SUBMIT_KYC_REQUEST'
export const SUBMIT_KYC_SUCCESS = 'SUBMIT_KYC_SUCCESS'
export const SUBMIT_KYC_FAILURE = 'SUBMIT_KYC_FAILURE'

export const UPDATE_PROFILE_NAME_REQUEST = 'UPDATE_PROFILE_NAME_REQUEST'
export const UPDATE_PROFILE_NAME_SUCCESS = 'UPDATE_PROFILE_NAME_SUCCESS'
export const UPDATE_PROFILE_NAME_FAILURE = 'UPDATE_PROFILE_NAME_FAILURE'

export const GET_PROFILE_PHONE_CHECK_PASS_ID_REQUEST =
    'GET_PROFILE_PHONE_CHECK_PASS_ID_REQUEST'
export const GET_PROFILE_PHONE_CHECK_PASS_ID_SUCCESS =
    'GET_PROFILE_PHONE_CHECK_PASS_ID_SUCCESS'
export const GET_PROFILE_PHONE_CHECK_PASS_ID_FAILURE =
    'GET_PROFILE_PHONE_CHECK_PASS_ID_FAILURE'

export const GET_PROFILE_PASSWORD_CHECK_PASS_ID_REQUEST =
    'GET_PROFILE_PASSWORD_CHECK_PASS_ID_REQUEST'
export const GET_PROFILE_PASSWORD_CHECK_PASS_ID_SUCCESS =
    'GET_PROFILE_PASSWORD_CHECK_PASS_ID_SUCCESS'
export const GET_PROFILE_PASSWORD_CHECK_PASS_ID_FAILURE =
    'GET_PROFILE_PASSWORD_CHECK_PASS_ID_FAILURE'

export const GET_PROFILE_CHECK_PASS_CODE_REQUEST =
    'GET_PROFILE_CHECK_PASS_CODE_REQUEST'
export const GET_PROFILE_CHECK_PASS_CODE_SUCCESS =
    'GET_PROFILE_CHECK_PASS_CODE_SUCCESS'
export const GET_PROFILE_CHECK_PASS_CODE_FAILURE =
    'GET_PROFILE_CHECK_PASS_CODE_FAILURE'

export const VERIFY_CHECK_PASS_CODE_REQUEST = 'VERIFY_CHECK_PASS_CODE_REQUEST'
export const VERIFY_CHECK_PASS_CODE_SUCCESS = 'VERIFY_CHECK_PASS_CODE_SUCCESS'
export const VERIFY_CHECK_PASS_CODE_FAILURE = 'VERIFY_CHECK_PASS_CODE_FAILURE'

export const UPDATE_PROFILE_PHONE_REQUEST = 'UPDATE_PROFILE_PHONE_REQUEST'
export const UPDATE_PROFILE_PHONE_SUCCESS = 'UPDATE_PROFILE_PHONE_SUCCESS'
export const UPDATE_PROFILE_PHONE_FAILURE = 'UPDATE_PROFILE_PHONE_FAILURE'

export const UPDATE_PROFILE_PASSWORD_REQUEST = 'UPDATE_PROFILE_PASSWORD_REQUEST'
export const UPDATE_PROFILE_PASSWORD_SUCCESS = 'UPDATE_PROFILE_PASSWORD_SUCCESS'
export const UPDATE_PROFILE_PASSWORD_FAILURE = 'UPDATE_PROFILE_PASSWORD_FAILURE'

export const GET_AVATAR_LIST_REQUEST = 'GET_AVATAR_LIST_REQUEST'
export const GET_AVATAR_LIST_SUCCESS = 'GET_AVATAR_LIST_SUCCESS'
export const GET_AVATAR_LIST_FAILURE = 'GET_AVATAR_LIST_FAILURE'

export const SET_PROFILE_AVATAR_REQUEST = 'SET_PROFILE_AVATAR_REQUEST'
export const SET_PROFILE_AVATAR_SUCCESS = 'SET_PROFILE_AVATAR_SUCCESS'
export const SET_PROFILE_AVATAR_FAILURE = 'SET_PROFILE_AVATAR_FAILURE'

export const GENERATE_2_FA_REQUEST = 'GENERATE_2_FA_REQUEST'
export const GENERATE_2_FA_SUCCESS = 'GENERATE_2_FA_SUCCESS'
export const GENERATE_2_FA_FAILURE = 'GENERATE_2_FA_FAILURE'

export const GET_2FA_CHECK_PASS_ID_REQUEST = 'GET_2FA_CHECK_PASS_ID_REQUEST'
export const GET_2FA_CHECK_PASS_ID_SUCCESS = 'GET_2FA_CHECK_PASS_ID_SUCCESS'
export const GET_2FA_CHECK_PASS_ID_FAILURE = 'GET_2FA_CHECK_PASS_ID_FAILURE'

export const ENABLE_2FA_REQUEST = 'ENABLE_2FA_REQUEST'
export const ENABLE_2FA_SUCCESS = 'ENABLE_2FA_SUCCESS'
export const ENABLE_2FA_FAILURE = 'ENABLE_2FA_FAILURE'

export const GET_PROFILE_EMAIL_CHECK_PASS_ID_REQUEST =
    'GET_PROFILE_EMAIL_CHECK_PASS_ID_REQUEST'
export const GET_PROFILE_EMAIL_CHECK_PASS_ID_SUCCESS =
    'GET_PROFILE_EMAIL_CHECK_PASS_ID_SUCCESS'
export const GET_PROFILE_EMAIL_CHECK_PASS_ID_FAILURE =
    'GET_PROFILE_EMAIL_CHECK_PASS_ID_FAILURE'

export const UPDATE_PROFILE_EMAIL_REQUEST = 'UPDATE_PROFILE_EMAIL_REQUEST'
export const UPDATE_PROFILE_EMAIL_SUCCESS = 'UPDATE_PROFILE_EMAIL_SUCCESS'
export const UPDATE_PROFILE_EMAIL_FAILURE = 'UPDATE_PROFILE_EMAIL_FAILURE'

export const UPDATE_PROFILE_USERNAME_REQUEST = 'UPDATE_PROFILE_USERNAME_REQUEST'
export const UPDATE_PROFILE_USERNAME_SUCCESS = 'UPDATE_PROFILE_USERNAME_SUCCESS'
export const UPDATE_PROFILE_USERNAME_FAILURE = 'UPDATE_PROFILE_USERNAME_FAILURE'

export const GET_ONBOARDING_QUESTIONS_REQUEST =
    'GET_ONBOARDING_QUESTIONS_REQUEST'
export const GET_ONBOARDING_QUESTIONS_SUCCESS =
    'GET_ONBOARDING_QUESTIONS_SUCCESS'
export const GET_ONBOARDING_QUESTIONS_FAILURE =
    'GET_ONBOARDING_QUESTIONS_FAILURE'

export const SUBMIT_ONBOARDING_QUESTIONS_REQUEST =
    'SUBMIT_ONBOARDING_QUESTIONS_REQUEST'
export const SUBMIT_ONBOARDING_QUESTIONS_SUCCESS =
    'SUBMIT_ONBOARDING_QUESTIONS_SUCCESS'
export const SUBMIT_ONBOARDING_QUESTIONS_FAILURE =
    'SUBMIT_ONBOARDING_QUESTIONS_FAILURE'

export const OPEN_ONBOARDING_CASE_REQUEST = 'OPEN_ONBOARDING_CASE_REQUEST'
export const OPEN_ONBOARDING_CASE_SUCCESS = 'OPEN_ONBOARDING_CASE_SUCCESS'
export const OPEN_ONBOARDING_CASE_FAILURE = 'OPEN_ONBOARDING_CASE_FAILURE'

export const GET_ONBOARDING_PROMOTION_STATUS_REQUEST =
    'GET_ONBOARDING_PROMOTION_STATUS_REQUEST'
export const GET_ONBOARDING_PROMOTION_STATUS_SUCCESS =
    'GET_ONBOARDING_PROMOTION_STATUS_SUCCESS'
export const GET_ONBOARDING_PROMOTION_STATUS_FAILURE =
    'GET_ONBOARDING_PROMOTION_STATUS_FAILURE'

export const GET_USER_REFERRAL_REQUEST = 'GET_USER_REFERRAL_REQUEST'
export const GET_USER_REFERRAL_SUCCESS = 'GET_USER_REFERRAL_SUCCESS'
export const GET_USER_REFERRAL_FAILURE = 'GET_USER_REFERRAL_FAILURE'

export const SET_USER_REFERRAL_REQUEST = 'SET_USER_REFERRAL_REQUEST'
export const SET_USER_REFERRAL_SUCCESS = 'SET_USER_REFERRAL_SUCCESS'
export const SET_USER_REFERRAL_FAILURE = 'SET_USER_REFERRAL_FAILURE'

export const GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_REQUEST =
    'GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_REQUEST'
export const GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_SUCCESS =
    'GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_SUCCESS'
export const GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_FAILURE =
    'GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_FAILURE'

export const WITHDRAW_ONCHAIN_REQUEST = 'WITHDRAW_ONCHAIN_REQUEST'
export const WITHDRAW_ONCHAIN_SUCCESS = 'WITHDRAW_ONCHAIN_SUCCESS'
export const WITHDRAW_ONCHAIN_FAILURE = 'WITHDRAW_ONCHAIN_FAILURE'

export const GET_IEO_PROJECTS_REQUEST = 'GET_IEO_PROJECTS_REQUEST'
export const GET_IEO_PROJECTS_SUCCESS = 'GET_IEO_PROJECTS_SUCCESS'
export const GET_IEO_PROJECTS_FAILURE = 'GET_IEO_PROJECTS_FAILURE'

export const GET_IEO_PROJECTS_DETAIL_REQUEST = 'GET_IEO_PROJECTS_DETAIL_REQUEST'
export const GET_IEO_PROJECTS_DETAIL_SUCCESS = 'GET_IEO_PROJECTS_DETAIL_SUCCESS'
export const GET_IEO_PROJECTS_DETAIL_FAILURE = 'GET_IEO_PROJECTS_DETAIL_FAILURE'

export const MEMBERSHIP_STAKE_ATS_REQUEST = 'MEMBERSHIP_STAKE_ATS_REQUEST'
export const MEMBERSHIP_STAKE_ATS_SUCCESS = 'MEMBERSHIP_STAKE_ATS_SUCCESS'
export const MEMBERSHIP_STAKE_ATS_FAILURE = 'MEMBERSHIP_STAKE_ATS_FAILURE'

export const MEMBERSHIP_UNSTAKE_ATS_REQUEST = 'MEMBERSHIP_UNSTAKE_ATS_REQUEST'
export const MEMBERSHIP_UNSTAKE_ATS_SUCCESS = 'MEMBERSHIP_UNSTAKE_ATS_SUCCESS'
export const MEMBERSHIP_UNSTAKE_ATS_FAILURE = 'MEMBERSHIP_UNSTAKE_ATS_FAILURE'

export const BUY_IEO_TOKEN_REQUEST = 'BUY_IEO_TOKEN_REQUEST'
export const BUY_IEO_TOKEN_SUCCESS = 'BUY_IEO_TOKEN_SUCCESS'
export const BUY_IEO_TOKEN_FAILURE = 'BUY_IEO_TOKEN_FAILURE'

export const GET_EARNING_POOLS_REQUEST = 'GET_EARNING_POOLS_REQUEST'
export const GET_EARNING_POOLS_SUCCESS = 'GET_EARNING_POOLS_SUCCESS'
export const GET_EARNING_POOLS_FAILURE = 'GET_EARNING_POOLS_FAILURE'

export const GET_EARNING_POOL_REQUEST = 'GET_EARNING_POOL_REQUEST'
export const GET_EARNING_POOL_SUCCESS = 'GET_EARNING_POOL_SUCCESS'
export const GET_EARNING_POOL_FAILURE = 'GET_EARNING_POOL_FAILURE'

export const DEPOSIT_EARNING_POOL_REQUEST = 'DEPOSIT_EARNING_POOL_REQUEST'
export const DEPOSIT_EARNING_POOL_SUCCESS = 'DEPOSIT_EARNING_POOL_SUCCESS'
export const DEPOSIT_EARNING_POOL_FAILURE = 'DEPOSIT_EARNING_POOL_FAILURE'

export const WITHDRAW_EARNING_POOL_REQUEST = 'WITHDRAW_EARNING_POOL_REQUEST'
export const WITHDRAW_EARNING_POOL_SUCCESS = 'WITHDRAW_EARNING_POOL_SUCCESS'
export const WITHDRAW_EARNING_POOL_FAILURE = 'WITHDRAW_EARNING_POOL_FAILURE'
