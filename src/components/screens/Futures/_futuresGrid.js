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

export default {
    cols: {
        md: 12,
        lg: 14,
        xl: 16,
        '2xl': 18
    },
    breakpoints: {
        md: BREAK_POINTS.md,
        lg: BREAK_POINTS.lg,
        xl: BREAK_POINTS.xl,
        '2xl': BREAK_POINTS['2xl']
    },
    layoutsVndc: {
        md: [
            {
                w: 8,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 8,
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
                w: 8,
                h: 29,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 8,
                h: 15,
                x: 0,
                y: 5,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 39,
                x: 9,
                y: 0,
                i: futuresGridKey.placeOrder,
                minW: 4,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 13,
                x: 9,
                y: 32,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        lg: [
            {
                w: 10,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 10,
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
                w: 10,
                h: 32,
                x: 0,
                y: 5,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 10,
                h: 14,
                x: 0,
                y: 5,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 39,
                x: 10,
                y: 0,
                i: futuresGridKey.placeOrder,
                minW: 4,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 12,
                x: 10,
                y: 32,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        xl: [
            {
                w: 12,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 12,
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
                w: 12,
                h: 33,
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
                h: 13,
                x: 0,
                y: 5,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 40,
                x: 15,
                y: 0,
                i: futuresGridKey.placeOrder,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 13,
                x: 15,
                y: 40,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            }
        ],
        '2xl': [
            {
                w: 14,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 14,
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
                w: 14,
                h: 32,
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
                h: 12,
                x: 0,
                y: 5,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 39,
                x: 15,
                y: 0,
                i: futuresGridKey.placeOrder,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
            },
            {
                w: 4,
                h: 12,
                x: 34,
                y: 39,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: false,
                isResizable: false
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
