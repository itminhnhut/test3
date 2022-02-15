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
        global.localStorage.setItem(
            LOCAL_STORAGE_KEY.FuturesGridLayouts,
            JSON.stringify({
                [key]: value,
            })
        )
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
                i: futuresGridKey.favoritePair,
                w: 7,
                h: 1,
                x: 0,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.pairDetail,
                w: 7,
                h: 2,
                x: 0,
                y: 1,
                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.chart,
                w: 7,
                h: 12,
                x: 0,
                y: 3,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.orderBook,
                w: 3,
                h: 9,
                x: 7,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.recentTrades,
                w: 3,
                h: 6,
                x: 7,
                y: 9,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.tradeRecord,
                w: 10,
                h: 6,
                x: 0,
                y: 15,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.placeOrder,
                w: 4,
                h: 24,
                x: 10,
                y: 0,
                minW: 4,
                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.marginRatio,
                w: 4,
                h: 6,
                x: 10,
                y: 15,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
        ],
        xl: [
            {
                i: futuresGridKey.favoritePair,
                w: 10,
                h: 1,
                x: 0,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.pairDetail,
                w: 10,
                h: 2,
                x: 0,
                y: 1,
                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.chart,
                w: 10,
                h: 11,
                x: 0,
                y: 3,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.orderBook,
                w: 3,
                h: 9,
                x: 10,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.recentTrades,
                w: 3,
                h: 5,
                x: 10,
                y: 9,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.tradeRecord,
                w: 13,
                h: 7,
                x: 0,
                y: 14,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.placeOrder,
                w: 3,
                h: 14,
                x: 13,
                y: 0,

                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.marginRatio,
                w: 3,
                h: 7,
                x: 13,
                y: 14,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
        ],
        '2xl': [
            {
                i: futuresGridKey.favoritePair,
                w: 12,
                h: 1,
                x: 0,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.pairDetail,
                w: 12,
                h: 2,
                x: 0,
                y: 1,
                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.chart,
                w: 12,
                h: 13,
                x: 0,
                y: 3,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.orderBook,
                w: 3,
                h: 9,
                x: 12,
                y: 0,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.recentTrades,
                w: 3,
                h: 7,
                x: 12,
                y: 9,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.tradeRecord,
                w: 15,
                h: 7,
                x: 0,
                y: 16,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
            {
                i: futuresGridKey.placeOrder,
                w: 3,
                h: 16,
                x: 15,
                y: 0,

                isDraggable: true,
                isResizable: true,
                isDroppable: false,
            },
            {
                i: futuresGridKey.marginRatio,
                w: 3,
                h: 7,
                x: 15,
                y: 16,
                isDraggable: true,
                isResizable: true,
                isDroppable: true,
            },
        ],
    },
}
