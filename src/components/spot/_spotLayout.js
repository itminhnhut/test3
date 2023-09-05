export const spotGridKey = {
    SYMBOL_DETAIL: 'symbolDetail',
    CHART: 'chart',
    ORDER_FORM: 'placeOrderForm',
    ORDER_BOOK: 'orderbook',
    SYMBOL_LIST: 'symbolList',
    TRADES: 'trades',
    ORDER_LIST: 'orderList'
};

export const spotSettingKey = {
    CHART: 'isShowChart',
    SYMBOL_DETAIL: 'isShowSymbolDetail',
    ORDER_FORM: 'isShowPlaceOrderForm',
    ORDER_BOOK: 'isShowOrderBook',
    SYMBOL_LIST: 'isShowSymbolList',
    TRADES: 'isShowTrades',
    ORDER_LIST: 'isShowOrderList'
};


export const initSpotSetting = {
    [spotSettingKey.CHART]: true,
    [spotSettingKey.SYMBOL_DETAIL]: true,
    [spotSettingKey.ORDER_BOOK]: true,
    [spotSettingKey.TRADES]: true,
    [spotSettingKey.SYMBOL_LIST]: true,
    [spotSettingKey.ORDER_LIST]: true,
    [spotSettingKey.ORDER_FORM]: true
};

export const layoutSimple = [
    {
        i: spotGridKey.SYMBOL_DETAIL,
        x: 0,
        y: 0,
        w: 12.5,
        h: 4,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.ORDER_BOOK,
        x: 0,
        y: 4,
        w: 3.5,
        h: 39,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.CHART,
        x: 3.5,
        y: 4,
        w: 9,
        h: 21,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.ORDER_FORM,
        x: 3.5,
        y: 6,
        w: 9,
        h: 18,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.SYMBOL_LIST,
        x: 12.5,
        y: 0,
        w: 3.5,
        h: 20,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.TRADES,
        x: 12.5,
        y: 17,
        w: 3.5,
        h: 23,
        minW: 10,
        isDraggable: false,
        isResizable: false
    },
    {
        i: spotGridKey.ORDER_LIST,
        x: 0,
        y: 26,
        w: 30,
        h: 34,
        isDraggable: false,
        isResizable: false
    }
];

export const layoutPro = [
    {
        i: spotGridKey.SYMBOL_DETAIL,
        x: 0,
        y: 0,
        w: 9,
        minW: 4,
        h: 4,
        minH: 4,
        maxH: 4,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    },
    {
        i: spotGridKey.CHART,
        x: 0,
        y: 4,
        h: 24,
        minH: 14,
        w: 9,
        minW: 5,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    },
    {
        i: spotGridKey.ORDER_LIST,
        x: 0,
        y: 26,
        w: 9,
        minW: 9,
        minH: 20,
        h: 26,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    },
    {
        i: spotGridKey.ORDER_BOOK,
        x: 9,
        y: 0,
        w: 3.5,
        h: 28,
        minW: 3,
        minH: 12,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    },
    {
        i: spotGridKey.TRADES,
        x: 9,
        y: 17,
        w: 3.5,
        minW: 3,
        minH: 12,
        h: 26,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    },
    {
        i: spotGridKey.ORDER_FORM,
        x: 13,
        y: 0,
        w: 3.5,
        minW: 2.5,
        minH: 12,
        h: 54,
        isDraggable: true,
        isResizable: true,
        isDroppable: false
    }
];
