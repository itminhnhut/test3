export const VndcFutureOrderType = {
    GroupStatus: {
        OPENING: 0,
        HISTORY: 1,
    },
    Status: {
        PENDING: 0,
        ACTIVE: 1,
        CLOSED: 2,
    },
    Side: {
        BUY: 'Buy',
        SELL: 'Sell',
    },
    Type: {
        MARKET: 'Market',
        LIMIT: 'Limit',
        STOP: 'Stop',
    },
    ReasonCloseCode: {
        NORMAL: 0,
        HIT_SL: 1,
        HIT_TP: 2,
        LIQUIDATE: 3,
        HIT_LIMIT_CLOSE: 4,
    },
    BitmexTransferError: {
        PROCESS_SUCCESSFULLY: 0,
        PLACE_ORDER_WITHOUT_SL_TP: 1, // Dat duoc lenh chinh nhung khong dat duoc lenh SL, TP
        ACTIVE_ORDER_ERROR: 2, // Lenh Stop hoac Limit duoc active nhung khong dat duoc SL, TP
        HIT_SL_TP_ERROR: 3, // Hit SL hoac TP nhung khong dong duoc lenh con lai
    },
    PromoteProgram: {
        NORMAL: 0,
        LUCKY_MONEY_2020: 1,
        AIRDROP_VNDC: 2,
    }
}








