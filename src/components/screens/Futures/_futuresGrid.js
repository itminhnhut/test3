import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants'

export const futuresGridKey = {
    favoritePair: 'favoritePair',
    pairDetail: 'pairDetail',
    chart: 'chart',
    orderBook: 'orderBook',
    recentTrades: 'recentTrades',
    tradeRecord: 'tradeRecord',
    placeOrder: 'placeOrder',
    marginRatio: 'marginRatio',
}

export const getLayoutFromLS = (key) => {
    let ls = {}
    if (global.localStorage) {
        try {
            ls =
                JSON.parse(
                    global.localStorage.getItem(
                        LOCAL_STORAGE_KEY.FuturesGridLayouts
                    )
                ) || {}
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key]
}

export const setLayoutToLS = (key, value) => {
    if (global.localStorage) {
        let localStorage = global.localStorage.getItem(
            LOCAL_STORAGE_KEY.FuturesGridLayouts
        )
        if (localStorage) {
            localStorage = JSON.parse(localStorage);
            localStorage[key] = value;
            global.localStorage.setItem(
                LOCAL_STORAGE_KEY.FuturesGridLayouts,
                JSON.stringify(localStorage)
            )
        } else {
            global.localStorage.setItem(
                LOCAL_STORAGE_KEY.FuturesGridLayouts,
                JSON.stringify({
                    [key]: value
                })
            )
        }
    }
}

export default {
    cols: {
        lg: 14,
        xl: 16,
        '2xl': 18,
    },
    breakpoints: {
        lg: BREAK_POINTS.lg,
        xl: BREAK_POINTS.xl,
        '2xl': BREAK_POINTS['2xl'],
    },
    layouts: {
        lg: [
            {
                w: 14,
                h: 2,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 14,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 10,
                h: 16,
                x: 0,
                y: 3,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 5,
                h: 13,
                x: 5,
                y: 19,
                i: futuresGridKey.orderBook,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 5,
                h: 13,
                x: 0,
                y: 19,
                i: futuresGridKey.recentTrades,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 10,
                h: 13,
                x: 0,
                y: 32,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 29,
                x: 10,
                y: 3,
                i: futuresGridKey.placeOrder,
                minW: 4,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 13,
                x: 10,
                y: 32,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
        ],
        xl: [
            {
                w: 14,
                h: 2,
                x: 0,
                y: 0,
                i: futuresGridKey.favoritePair,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 8,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 8,
                h: 29,
                x: 0,
                y: 3,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 21,
                x: 8,
                y: 0,
                i: futuresGridKey.orderBook,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 11,
                x: 8,
                y: 21,
                i: futuresGridKey.recentTrades,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 12,
                h: 11,
                x: 0,
                y: 32,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 32,
                x: 12,
                y: 0,
                i: futuresGridKey.placeOrder,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 4,
                h: 11,
                x: 12,
                y: 32,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
        ],
        '2xl': [
            {
                h: 2,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                w: 12,
                x: 0,
                y: 0,
            },
            {
                w: 12,
                h: 3,
                x: 0,
                y: 0,
                i: futuresGridKey.pairDetail,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 12,
                h: 26,
                x: 0,
                y: 3,
                i: futuresGridKey.chart,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 3,
                h: 19,
                x: 12,
                y: 0,
                i: futuresGridKey.orderBook,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 3,
                h: 10,
                x: 12,
                y: 19,
                i: futuresGridKey.recentTrades,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 15,
                h: 13,
                x: 0,
                y: 29,
                i: futuresGridKey.tradeRecord,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 3,
                h: 29,
                x: 15,
                y: 0,
                i: futuresGridKey.placeOrder,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
            {
                w: 3,
                h: 13,
                x: 15,
                y: 29,
                i: futuresGridKey.marginRatio,
                moved: false,
                static: false,
                isDraggable: true,
                isResizable: true,
            },
        ],
    },
}
