const API_PREFIX = `/api/v1/`;
const API_V2_PREFIX = `/api/v2/`;
const API_V3_PREFIX = `/api/v3/`;
const BLOG_API_PREFIX = `${process.env.NEXT_PUBLIC_BLOG_API_URL}/ghost/api/v3/content`;

export const getBlogApi = (apiEndpoint, params) => {
    if (!apiEndpoint) return '';
    return `${BLOG_API_PREFIX}/${apiEndpoint}/?key=${process.env.NEXT_PUBLIC_BLOG_API_CONTENT_KEY}${params || ''}`;
};

export const API_REGISTER = API_PREFIX + 'user/register';
export const API_LOGIN = API_PREFIX + 'user/login';
export const API_LOGIN_SSO = '/login/nami';
export const API_LOG_OUT = `${process.env.NEXT_PUBLIC_APP_URL}/logout`;
export const API_GET_ME = API_PREFIX + 'user/me';
export const API_GET_VIP = API_PREFIX + 'user/vip';
export const API_GET_LOGIN_LOG = API_PREFIX + 'user/login_log';
export const USER_DEVICES = API_PREFIX + 'user/devices';
export const USER_REVOKE_DEVICE = API_PREFIX + 'user/devices/revoke';
export const SET_USER_AVATAR = API_PREFIX + 'user/set_avatar';
export const USER_AVATAR_PRESET = API_PREFIX + 'user/avatar_preset';

export const API_GET_USER_AVATAR_PRESET = API_V3_PREFIX + 'users/avatar-preset';

export const API_REFRESH_TOKEN = API_PREFIX + 'web/refresh_token';

export const API_GET_FAVORITE = API_PREFIX + 'symbols/favorite';

export const API_GET_OVERVIEW_STATISTIC = API_PREFIX + 'overview/statistic';

export const API_GET_ASSET_CONFIG = API_V3_PREFIX + 'asset/config';
export const API_GET_USER_WALLET = API_PREFIX + 'user/wallet';
export const API_GET_USER_BALANCE = API_PREFIX + 'user/balance';
export const API_GET_USER_BALANCE_V2 = API_PREFIX + 'user/balance_v2';
export const API_GET_ALL_USER_WALLET = API_PREFIX + 'user/all_wallet';
export const API_GET_SOCKETIO_AUTH_KEY = API_PREFIX + 'user/auth-key';
export const API_GET_EXCHANGE_CONFIG = API_V3_PREFIX + 'spot/config';
export const GET_SPOT_FEE_CONFIG = API_V3_PREFIX + 'spot/fee_config';

// Market
export const API_GET_MARKET_WATCH = API_V3_PREFIX + 'spot/market_watch';
export const API_GET_ORDER_BOOK = API_V3_PREFIX + 'spot/depth';
export const API_GET_RECENT_TRADE = API_V3_PREFIX + 'spot/recent_trade';
export const API_GET_HISTORY_ORDER = API_V3_PREFIX + 'spot/history';
export const API_GET_HISTORY_TRADE = API_V3_PREFIX + 'spot/trade';
export const API_GET_OPEN_ORDER = API_V3_PREFIX + 'spot/open';
export const API_GET_TRENDING = API_V3_PREFIX + 'spot/trend';
export const API_GET_USD_RATE = API_V3_PREFIX + 'spot/asset_value';

export const API_USER_SYMBOL_LIST = API_PREFIX + 'user/symbol_list';

// Wallet
export const API_GET_WALLET_CONFIG = API_PREFIX + 'wallet/token_config';
export const API_WITHDRAW = API_V2_PREFIX + 'token/withdraw_asset';
export const API_GET_WITHDRAW_HISTORY = API_PREFIX + 'token/withdraw_history';
export const API_REVEAL_DEPOSIT_TOKEN_ADDRESS = API_V3_PREFIX + 'payment/deposit_address';
export const POST_WALLET_TRANSFER = API_PREFIX + 'wallet/transfer';
export const API_PUSH_ORDER_BINANCE = API_PREFIX + 'request_check_deposit_binance'; // post => data: { currency }
export const API_SET_ASSET_AS_FEE = API_PREFIX + 'user/set_fee_currency';
export const API_GET_WALLET_TRANSACTION_HISTORY = API_V3_PREFIX + 'wallet/history/transaction';
export const API_GET_WALLET_TRANSFER_HISTORY = API_V3_PREFIX + 'wallet/history/transaction/transfer_history';
export const API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY = API_V3_PREFIX + 'wallet/history/category';

// Payment
export const API_GET_PAYMENT_CONFIG = API_V3_PREFIX + 'payment/config';
export const API_WITHDRAW_v3 = API_V3_PREFIX + 'payment/withdraw';
export const API_GET_DEPWDL_HISTORY = API_V3_PREFIX + 'payment/deposit_withdraw_history';
export const API_WITHDRAW_V4 = API_V3_PREFIX + 'payment/withdraw_v4';
export const API_DEFAULT_BANK_USER = API_V3_PREFIX + 'payment/default_user_bank_accounts';
export const API_GET_USER_BANK_LIST = API_V3_PREFIX + 'payment/user_bank_accounts';
export const API_GET_BANK_ACCOUNT_NAME = API_V3_PREFIX + 'payment/bank_account_name';
export const API_GET_BANK_AVAILABLE = API_V3_PREFIX + 'payment/available_banks';
export const API_ADD_USER_BANK_ACCOUNT = API_PREFIX + 'deposit/add_user_bank_account';

// Futures
export const API_GET_FUTURES_MARKET_WATCH = API_V3_PREFIX + 'futures/ticker';
export const API_GET_FUTURES_DEPTH = API_V3_PREFIX + 'futures/depth';
export const API_GET_FUTURE_FEE_CONFIGS = API_PREFIX + 'futures/fee-config';
export const API_GET_FUTURES_CONFIGS = API_V3_PREFIX + 'futures/config';
export const API_GET_FUTURES_MARK_PRICE = API_V3_PREFIX + 'futures/mark_price';
export const API_GET_FUTURES_RECENT_TRADES = API_V3_PREFIX + 'futures/recent_trade';
export const API_GET_FUTURES_USER_SETTINGS = API_V3_PREFIX + 'futures/userSetting';
export const API_SET_FUTURES_MARGIN_MODE = API_V3_PREFIX + 'futures/marginType';
export const API_SET_FUTURES_POSITION_MODE = API_V3_PREFIX + 'futures/positionSide';
export const API_FUTURES_LEVERAGE = API_V3_PREFIX + 'futures/leverage';
export const API_FUTURES_PLACE_ORDER = API_V3_PREFIX + 'futures/order';
export const API_GET_FUTURES_POSITION_ORDERS = API_V3_PREFIX + 'futures/position';
export const API_GET_FUTURES_OPEN_ORDERS = API_V3_PREFIX + 'futures/openOrders';
export const API_FUTURES_CANCEL_OPEN_ORDERS = API_V3_PREFIX + 'futures/order';

export const API_GET_VNDC_FUTURES_HISTORY_ORDERS = API_V3_PREFIX + 'futures/vndc-order-histories';
export const API_VNDC_FUTURES_CHANGE_MARGIN = API_V3_PREFIX + 'futures/vndc/edit-margin';
export const API_GET_VNDC_FUTURES_TRANSACTION_HISTORIES = API_V3_PREFIX + 'futures/vndc/transactions';
export const API_POST_CHANGE_FEES_CURRENCY_ORDER = API_V3_PREFIX + 'futures/vndc/change-fee-currency';
export const API_GET_ALL_ORDERS_BY_CONDTION = API_V3_PREFIX + 'futures/vndc/find-all-by-condition';
export const API_CLOSE_ALL_ORDERS_BY_CONDTION = API_V3_PREFIX + 'futures/vndc/close-all-by-condition';

export const API_DCA_ORDER = API_V3_PREFIX + 'futures/vndc/dca-order';
export const API_PARTIAL_CLOSE_ORDER = API_V3_PREFIX + 'futures/vndc/partialcloseorderv2';

// Swap
export const SWAP_ESTIMATE_PRICE = API_V3_PREFIX + 'swap/estimate_price';
export const API_GET_SWAP_HISTORY = API_V3_PREFIX + 'swap/history';

// Staking
export const API_STAKING_SUMMARY = API_PREFIX + 'earn/stake/summary';
export const GET_STAKING_CONFIG = API_PREFIX + 'earn/list?type=1';
export const API_GET_STAKING_ORDER = API_PREFIX + 'earn/order_history?type=1';
export const API_STAKING_CANCEL_EARNING = API_PREFIX + 'earn/stake/cancel';

// Farming
export const API_FARMING_SUMMARY = API_PREFIX + 'earn/farm/summary';
export const GET_FARMING_CONFIG = API_PREFIX + 'earn/list?type=3';
export const API_GET_FARMING_ORDER = API_PREFIX + 'earn/order_history?type=3';
export const API_FARMING_CANCEL_EARNING = API_PREFIX + 'earn/farm/cancel';

// Coinbase
export const API_SET_USER_AVATAR = API_PREFIX + 'user/set_avatar';

//NOTE Notification
export const API_MARK_NOTIFICATIONS_READ = API_V3_PREFIX + 'notifications/mark-read';
export const API_GET_NOTIFICATIONS = API_V3_PREFIX + 'notifications/';
export const API_GET_NOTIFICATIONS_UNREAD_COUNT = API_PREFIX + 'notifications/count_unread';

export const API_WATCH_LIST = API_PREFIX + 'market/watch_list';
export const API_METRIC_VIEW = API_V3_PREFIX + 'spot/view';
export const API_GET_REFERENCE_CURRENCY = API_V3_PREFIX + 'spot/reference_currency';
export const API_CATEGORY_AVATAR_LIST = API_PREFIX + 'market/watch_list_avatar';

export const API_KYC_COUNTRY_LIST = API_PREFIX + 'country';

export const API_KYC_STATUS = API_PREFIX + 'kyc/status';
export const API_KYC_INFORMATION = API_PREFIX + 'kyc/information';
export const API_KYC_BANK_INFORMATION = API_PREFIX + 'kyc/bank';
export const API_KYC_IMAGES = API_PREFIX + 'kyc/documents';
export const API_KYC_SUBMIT = API_PREFIX + 'kyc/submit';

export const API_TRADING_HISTORY = API_PREFIX + 'transaction/history';
export const API_TRADING_HISTORY_CATEGORY = API_PREFIX + 'transaction/category';
export const API_TRADING_HISTORY_DETAIL = API_PREFIX + 'transaction/detail';

export const API_BROKER_INCOME = API_PREFIX + 'commission/income_history';
export const API_BROKER_USER = API_PREFIX + 'commission/users';
export const API_BROKER_CHART_DATA = API_PREFIX + 'commission/chart_data';
export const API_BROKER_USER_ANALYTICS = API_PREFIX + 'commission/user_analytic';

export const API_PROFILE_NAME = API_PREFIX + 'user/name';
export const API_PROFILE_PHONE = API_PREFIX + 'user/phone';
export const API_PROFILE_PASSWORD = API_PREFIX + 'user/password';
export const API_CHECK_PASS = API_PREFIX + 'checkpass/send';
export const API_CHECK_PASS_AUTH = API_PREFIX + 'checkpass/authorize';
export const API_GET_AVATAR_LIST = API_PREFIX + 'user/avatars';
export const API_PROFILE_AVATAR = API_PREFIX + 'user/avatar';
export const API_PROFILE_EMAIL = API_PREFIX + 'user/email';
export const API_PROFILE_USERNAME = API_PREFIX + 'user/username';

export const API_2FA_GENERATE_SECRET = API_PREFIX + 'totp/new';
export const API_2FA_CHECK_PASS = API_PREFIX + 'totp/set';

export const API_DEPOSIT_CONFIG = API_PREFIX + 'deposit/config';
export const API_ONBOARDING_QUESTION = API_PREFIX + 'onboarding/status';
export const API_ONBOARDING_QUESTION_SUBMIT = API_PREFIX + 'onboarding/questionnaire/answer';
export const API_ONBOARDING_OPEN_BOX = API_PREFIX + 'promo/open_box/claim';
export const API_ONBOARDING_PROMOTION_STATUS = API_PREFIX + 'promo/open_box/status';

export const API_PROMOTION_1VIDB = API_PREFIX + 'promo/airdrop_1vidb/status';
export const API_PROMOTION_1VIDB_CLAIM = API_PREFIX + 'promo/airdrop_1vidb/claim';

export const API_USER_REFERRAL = API_PREFIX + 'user/ref_of';

export const API_SIGNAL_ASSET_NOTIFICATION = API_PREFIX + 'signal/notification';

export const API_WITHDRAW_ONCHAIN = API_PREFIX + 'deposit/withdraw';

export const API_IEO_PROJECTS = API_PREFIX + 'ieo/projects';

export const API_MEMBERSHIP_STAKE_ATS = API_PREFIX + 'membership/stake';
export const API_MEMBERSHIP_UNSTAKE_ATS = API_PREFIX + 'membership/unstake';
export const API_MEMBERSHIP_TRADING_HISTORY = API_PREFIX + 'membership/history';

export const API_EARNING_POOLS = API_PREFIX + 'earning/pools';
export const API_EARNING_POOL_DEPOSIT = API_PREFIX + 'earning/pool/charge';
export const API_EARNING_POOL_WITHDRAW = API_PREFIX + 'earning/pool/withdraw';

// Mission
export const API_GET_MISSION = API_PREFIX + 'reward_center/mission';
export const API_CLAIM_MISSION_REWARD = API_PREFIX + 'reward_center/claim';

// Support center
export const API_GET_ALL_BLOG_POSTS = getBlogApi('posts');
export const API_GET_ALL_BLOG_TAGS = getBlogApi('tags');

export const API_GET_TRADE_HISTORY = API_V3_PREFIX + 'futures/userTrades';
export const API_GET_TRANSACTION_HISTORY = API_V3_PREFIX + 'futures/income';

export const API_GET_FUTURES_ORDER = API_V3_PREFIX + 'futures/vndc/order';
export const API_CLOSE_ALL_ORDER = API_V3_PREFIX + 'futures/vndc/close-all-by-condition';
export const API_ORDER_DETAIL = API_V3_PREFIX + 'futures/vndc/order-detail';
export const API_UPDATE_FUTURES_SYMBOL_VIEW = API_V3_PREFIX + 'futures/view';
export const API_GET_FUTURES_ORDER_HISTORY = API_V3_PREFIX + 'futures/vndc/history_order';
export const API_GET_FUNDING_RATE_HISTORY = API_V3_PREFIX + 'futures/get-funding-rate-history';

export const DIRECT_WITHDRAW_VNDC = API_PREFIX + 'vndc/direct_withdraw_vndc';
export const DIRECT_WITHDRAW_ONUS = API_PREFIX + 'vndc/direct_withdraw_onus';
export const API_AUTH_USER_OTP = (service) => `${API_PREFIX}authenticated/${service}`;

export const API_FUTURES_CAMPAIGN_STATUS = API_PREFIX + 'futures_campaign/onboarding/status';
export const API_FUTURES_CAMPAIGN_ATTEND = API_PREFIX + 'futures_campaign/onboarding/attend';
export const API_FUTURES_CAMPAIGN_WITHDRAW_STATUS = API_PREFIX + 'futures_campaign/onboarding/withdrawStatus';

//NAO token
export const API_NAO_DASHBOARD_STATISTIC = API_V3_PREFIX + 'nao-dashboard/statistic';
//POOL
export const API_POOL_INFO = API_V3_PREFIX + 'pool/info';
export const API_POOL_AMM = API_V3_PREFIX + 'pool/amm-analytic';
export const API_POOL_USER_INFO = API_V3_PREFIX + 'pool/user-info';
export const API_POOL_STAKE = API_V3_PREFIX + 'pool/place-stake';
export const API_POOL_UN_STAKE = API_V3_PREFIX + 'pool/un-stake';
export const API_POOL_SHARE_HISTORIES = API_V3_PREFIX + 'pool/share-revenue-histories';
export const API_POOL_USER_SHARE_HISTORIES = API_V3_PREFIX + 'pool/user-share-revenue-histories';
export const API_POOL_STAKE_ORDER = API_V3_PREFIX + 'pool/stake-orders';

export const API_CONTEST_GET_RANK_MEMBERS_PNL = API_PREFIX + 'event/futures-contest/rank-member-pnl';
export const API_CONTEST_GET_RANK_MEMBERS_VOLUME = API_PREFIX + 'event/futures-contest/rank-member-volume';
export const API_CONTEST_GET_USER_DETAIL = API_PREFIX + 'event/futures-contest/user-info';

export const API_CONTEST_GET_RANK_GROUP_PNL = API_PREFIX + 'event/futures-contest/group-pnl';
export const API_CONTEST_GET_RANK_GROUP_VOLUME = API_PREFIX + 'event/futures-contest/group-volume';
export const API_CONTEST_GET_GROUP_DETAIL = API_PREFIX + 'event/futures-contest/group-detail';

export const API_CONTEST_CHECK_MEMBER = API_PREFIX + 'event/futures-contest/check-user';
export const API_CONTEST_UPLOAD = API_PREFIX + 'event/futures-contest/avatar';
export const API_CONTEST_CREATE_GROUP = API_PREFIX + 'event/futures-contest/group';
export const API_CONTEST_GET_GROUP_MEMBER = API_PREFIX + 'event/futures-contest/group-members';
export const API_CONTEST_CANCEL_INVITE = API_PREFIX + 'event/futures-contest/cancel-invite';
export const API_CONTEST_GET_INVITES = API_PREFIX + 'event/futures-contest/invites';
export const API_CONTEST_SEND_INVITE = API_PREFIX + 'event/futures-contest/send-invite';
export const API_CONTEST_LAST_TIME_SCAN = API_PREFIX + 'event/futures-contest/last-time-scan';

export const API_CONTEST_NAO_YEAR_SUMMARY_STATISTIC = API_PREFIX + 'event/futures-year-end-reward/statistic';
export const API_CONTEST_NAO_YEAR_SUMMARY_PNL = API_PREFIX + 'event/futures-year-end-reward/rank-pnl';
export const API_CONTEST_NAO_YEAR_SUMMARY_VOLUME = API_PREFIX + 'event/futures-year-end-reward/rank-volume';
export const API_CONTEST_NAO_YEAR_SUMMARY_ORDER = API_PREFIX + 'event/futures-year-end-reward/rank-order';
export const API_CONTEST_NAO_SPECIAL_RANK = API_PREFIX + 'event/futures-contest/special-rank';

export const API_CONTEST_GET_INVITATIONS = API_PREFIX + 'event/futures-contest/invites';
export const API_CONTEST_POST_ACCEPT_INVITATION = API_PREFIX + 'event/futures-contest/process-invite';

export const API_CONTEST_GET_MASTER_GROUP_PNL = API_PREFIX + 'event/futures-contest/group-master-pnl';

//VOTE
export const API_USER_VOTE = API_V3_PREFIX + 'nao-dashboard/user-vote';
export const API_USER_POOL = API_V3_PREFIX + 'nao-dashboard/user-vote/getuserpool';

//Luckydraw
export const API_GET_TICKETS = API_PREFIX + 'futures_reward/tickets';
export const API_GET_TICKET_DETAIL = API_PREFIX + 'futures_reward/ticket-detail';
export const API_CLAIM_TICKET = API_PREFIX + 'futures_reward/claim';

//reference
export const API_REFERRAL_FRIENDS_LIST = API_PREFIX + 'user/all_referred_users';
export const API_REFERRAL_DASHBOARD = API_PREFIX + 'user/commission_dashboard';
export const API_REFERRAL_COMMISSION_LOG = API_PREFIX + 'user/commission_log';

//setting futures
export const API_GET_FUTURES_SETTING = API_PREFIX + 'futures/setting';

//portfolio
export const API_PORTFOLIO_OVERVIEW = API_V3_PREFIX + 'portfolio/futures/overview';
export const API_PORTFOLIO_ACCOUNT = API_V3_PREFIX + 'portfolio/futures/account';
export const API_PORTFOLIO_SUMMARY = API_V3_PREFIX + 'portfolio/futures/summary';

// new referral
export const API_NEW_REFERRAL_CONFIG = API_V3_PREFIX + 'users/referral/commission-config';
export const API_NEW_REFERRAL = API_V3_PREFIX + 'users/referral';
export const API_NEW_REFERRAL_ADD_REF = API_V3_PREFIX + 'users/referral';
export const API_NEW_REFERRAL_OVERVIEW = API_V3_PREFIX + 'users/referral/profile';
export const API_NEW_REFERRAL_NEW_COMMISSIONS = API_V3_PREFIX + 'users/referral/new-commission-history';
export const API_NEW_REFERRAL_NEW_FRIENDS = API_V3_PREFIX + 'users/referral/new-friends';
export const API_NEW_REFERRAL_FRIENDS_BY_REF = API_V3_PREFIX + 'users/referral/:code/friends'; // .replace(':code', realCode)
export const API_NEW_REFERRAL_SET_DEFAULT = API_V3_PREFIX + 'users/referral/:code/set-default'; // .replace(':code', realCode)
export const API_NEW_REFERRAL_EDIT_NOTE = API_V3_PREFIX + 'users/referral/:code/change-note'; // .replace(':code', realCode)
export const API_NEW_REFERRAL_STATISTIC = API_V3_PREFIX + 'users/referral/chart';
export const API_NEW_REFERRAL_CREATE_INVITE = API_V3_PREFIX + 'users/referral/invite';
export const API_NEW_REFERRAL_CHECK_REF = API_V3_PREFIX + 'users/referral/check-duplicate';
export const API_PARTNER_REGISTER = API_V3_PREFIX + 'users/partner';
export const API_CHECK_REFERRAL = API_V3_PREFIX + 'users/referral/is-exist';

//referal
// export const API_GET_LIST_FRIENDS = API_V3_PREFIX + 'users/referral/friends'; V1
export const API_GET_LIST_FRIENDS = API_V3_PREFIX + 'users/referral/friends-v2';
export const API_GET_COMMISSON_HISTORY = API_V3_PREFIX + 'users/referral/commission-history';
export const API_GET_REFERRAL_FRIENDS_BY_CODE = API_V3_PREFIX + 'users/referral/:code/friends-detail';

// convert small balance to Nami
export const API_GET_NAMI_RATE = API_V3_PREFIX + 'convert/nami_asset_value';
export const API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE = API_V3_PREFIX + 'convert/nami_pre_order';
export const API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE = API_V3_PREFIX + 'convert/nami_confirm_order';

// withdraw-deposit Partner
export const API_GET_PARTNERS = API_V3_PREFIX + 'dw_partner/partner';
export const API_GET_DEFAULT_PARTNER = API_V3_PREFIX + 'dw_partner/default_partner';
export const API_GET_PARTNER_BANKS = API_V3_PREFIX + 'payment/partner_bank_accounts';
export const API_GET_HISTORY_DW_PARTNERS = API_V3_PREFIX + 'dw_partner/partner_order';
export const API_GET_OPENING_ORDER = API_V3_PREFIX + 'dw_partner/partner_order_opening';
export const API_GET_ORDER_PRICE = API_V3_PREFIX + 'dw_partner/partner_order_price';
export const API_GET_PARTNER_PROFILE = API_V3_PREFIX + 'dw_partner/partner_detail';
export const API_GET_USER_BANK_ACCOUNT = API_V3_PREFIX + 'payment/user_bank_accounts';
export const API_GET_ORDER_DETAILS = API_V3_PREFIX + 'dw_partner/partner_order_detail';
export const API_CREATE_ORDER = API_V3_PREFIX + 'dw_partner/partner_order_v4';
export const API_SET_USER_BANK_ACCOUNT = API_V3_PREFIX + 'payment/default_user_bank_accounts';
export const API_SET_PARTNER_ORDER_CONFIG = API_V3_PREFIX + 'dw_partner/partner_order_config';
export const API_MARK_PARTNER_ORDER = API_V3_PREFIX + 'dw_partner/mark_partner_order';
export const API_APPROVE_PARTNER_ORDER = API_V3_PREFIX + 'dw_partner/approve_partner_order';

export const API_REJECT_PARTNER_ORDER = API_V3_PREFIX + 'dw_partner/reject_partner_order';
export const API_UPLOAD_IMAGE_S3 = API_PREFIX + 'partner/disputed_upload';
export const API_UPLOAD_IMAGE_SERVER_DW = API_V3_PREFIX + 'dw_partner/partner_order_upload';
export const API_CHECK_LIMIT_WITHDRAW = API_V3_PREFIX + 'spot/partner_order_limit';
