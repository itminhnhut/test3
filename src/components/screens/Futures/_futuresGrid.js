import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';

export const futuresGridKey = {
    favoritePair: 'favoritePair',
    pairDetail: 'pairDetail',
    chart: 'chart',
    orderBook: 'orderBook',
    recentTrades: 'recentTrades',
    tradeRecord: 'tradeRecord',
    placeOrder: 'placeOrder',
    marginRatio: 'marginRatio',
    title: 'title',
    orderDetail: 'orderDetail',
    logs: 'logs'
};

export const futuresLayoutKey = {
    favoritePair: 'isShowFavorites',
    pairDetail: 'isShowPairDetail',
    chart: 'isShowChart',
    tradeRecord: 'isShowOpenOrders',
    placeOrder: 'isShowPlaceOrder',
    marginRatio: 'isShowAssets'
};

export const getLayoutFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem(LOCAL_STORAGE_KEY.FuturesGridLayouts)) || {};
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key];
};

export const setLayoutToLS = (key, value) => {
    if (global.localStorage) {
        let localStorage = global.localStorage.getItem(LOCAL_STORAGE_KEY.FuturesGridLayouts);
        if (localStorage) {
            localStorage = JSON.parse(localStorage);
            localStorage[key] = value;
            global.localStorage.setItem(LOCAL_STORAGE_KEY.FuturesGridLayouts, JSON.stringify(localStorage));
        } else {
            global.localStorage.setItem(
                LOCAL_STORAGE_KEY.FuturesGridLayouts,
                JSON.stringify({
                    [key]: value
                })
            );
        }
    }
};

const layoutDefault = {
    [futuresGridKey.favoritePair]: {
        i: futuresGridKey.favoritePair,
        h: 2.5,
        minH: 2.5,
        maxH: 2.5,
        minW: 3,
        x: 0,
        y: 0,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: true
    },
    [futuresGridKey.pairDetail]: {
        i: futuresGridKey.pairDetail,
        h: 3.5,
        minH: 3.5,
        maxH: 3.5,
        minW: 4,
        x: 0,
        y: 2.5,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: true
    },
    [futuresGridKey.chart]: {
        i: futuresGridKey.chart,
        x: 0,
        y: 6,
        h: 23,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: true
    },
    [futuresGridKey.tradeRecord]: {
        i: futuresGridKey.tradeRecord,
        x: 0,
        y: 29,
        h: 15,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: false
    },
    [futuresGridKey.placeOrder]: {
        i: futuresGridKey.placeOrder,
        y: 0,
        h: 29,
        minH: 5,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: true
    },
    [futuresGridKey.marginRatio]: {
        i: futuresGridKey.marginRatio,
        y: 29,
        minH: 5,
        moved: false,
        static: false,
        isDraggable: true,
        isResizable: true
    }
};

const COLS = {
    md: 12,
    lg: 14,
    xl: 16,
    '2xl': 18
};

export default {
    cols: COLS,
    breakpoints: {
        md: BREAK_POINTS.md,
        lg: BREAK_POINTS.lg,
        xl: BREAK_POINTS.xl,
        '2xl': BREAK_POINTS['2xl']
    },
    layoutsVndc: {
        lg: [
            {
                ...layoutDefault[futuresGridKey.favoritePair],
                w: 10
            },
            {
                ...layoutDefault[futuresGridKey.pairDetail],
                w: 10
            },
            {
                ...layoutDefault[futuresGridKey.chart],
                w: 10,
                minH: 12,
                minW: 5
            },
            {
                ...layoutDefault[futuresGridKey.tradeRecord],
                w: 10,
                h: 15,
                minW: 10,
                minH: 15,
                isResizable: true
            },
            {
                ...layoutDefault[futuresGridKey.placeOrder],
                x: 10,
                w: COLS.lg - 10,
                minW: COLS.lg - 10
            },
            {
                ...layoutDefault[futuresGridKey.marginRatio],
                x: 10,
                w: COLS.lg - 10,
                minW: 2,
                h: 15
            }
        ],
        xl: [
            {
                ...layoutDefault[futuresGridKey.favoritePair],
                w: 12
            },
            {
                ...layoutDefault[futuresGridKey.pairDetail],
                w: 12
            },
            {
                ...layoutDefault[futuresGridKey.chart],
                w: 12,
                minW: 6,
                minH: 14
            },
            {
                ...layoutDefault[futuresGridKey.tradeRecord],
                w: 12,
                h: 15,
                minW: 12,
                minH: 15,
                isResizable: true
            },
            {
                ...layoutDefault[futuresGridKey.placeOrder],
                x: 12,
                w: COLS['xl'] - 12,
                minW: COLS['xl'] - 12
            },
            {
                ...layoutDefault[futuresGridKey.marginRatio],
                x: 12,
                w: COLS['xl'] - 12,
                minW: 2,
                h: 15
            }
        ],
        '2xl': [
            {
                ...layoutDefault[futuresGridKey.favoritePair],
                w: 14
            },
            {
                ...layoutDefault[futuresGridKey.pairDetail],
                w: 14
            },
            {
                ...layoutDefault[futuresGridKey.chart],
                w: 14,
                minW: 7,
                minH: 16
            },
            {
                ...layoutDefault[futuresGridKey.tradeRecord],
                w: 14,
                h: 24,
                minW: 14,
                minH: 24,
                isResizable: true
            },
            {
                ...layoutDefault[futuresGridKey.placeOrder],
                w: COLS['2xl'] - 14,
                minW: COLS['2xl'] - 14,
                x: 14
            },
            {
                ...layoutDefault[futuresGridKey.marginRatio],
                x: 14,
                w: COLS['2xl'] - 14,
                minW: 2,
                h: 24
            }
        ]
    },
    layoutsDetail: {
        md: [
            {
                w: 12,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.title,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 7,
                h: 4,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 7,
                h: 26,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 12,
                h: 15,
                x: 0,
                y: 5,
                i: futuresGridKey.logs,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 5,
                h: 26,
                x: 97,
                y: 3,
                i: futuresGridKey.orderDetail,
                minW: 4,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        lg: [
            {
                w: 14,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.title,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 9,
                h: 4,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 9,
                h: 26,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 14,
                h: 14,
                x: 0,
                y: 5,
                i: futuresGridKey.logs,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 5,
                h: 26,
                x: 9,
                y: 3,
                i: futuresGridKey.orderDetail,
                minW: 4,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        xl: [
            {
                w: 16,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.title,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 11,
                h: 4,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 11,
                h: 26,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 16,
                h: 13,
                x: 0,
                y: 5,
                i: futuresGridKey.logs,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 5,
                h: 26,
                x: 11,
                y: 3,
                i: futuresGridKey.orderDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        '2xl': [
            {
                w: 18,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.title,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 13,
                h: 4,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 13,
                h: 26,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 18,
                h: 12,
                x: 0,
                y: 32,
                i: futuresGridKey.logs,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 5,
                h: 29,
                x: 13,
                y: 3,
                i: futuresGridKey.orderDetail,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ]
    }
};
