import io from 'socket.io-client';
import * as types from 'src/redux/actions/types';

import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import throttle from 'lodash/throttle';

let WS
let lastPrice = 0
let futuresLastPrice = 0

const updateDepthChart = throttle((data) => {
    Emitter.emit(PublicSocketEvent.SPOT_DEPTH_UPDATE + 'depth', data)
}, 3000)

function initPublicSocket() {
    return (dispatch) => {
        WS = io(process.env.NEXT_PUBLIC_STREAM_SOCKET, {
            // transports: ['websocket'],
            transports: ['websocket'],
            upgrade: false,
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 500,
            reconnectionAttempts: Infinity,
        })
        WS.on('connect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: WS,
            })

            WS.on(PublicSocketEvent.SPOT_DEPTH_UPDATE, (data) => {
                Emitter.emit(
                    PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book',
                    data
                )
                updateDepthChart(data)
            })

            WS.on(PublicSocketEvent.SPOT_TICKER_UPDATE, (data) => {
                if (data?.p !== lastPrice) {
                    lastPrice = data?.p
                    Emitter.emit(PublicSocketEvent.SPOT_TICKER_UPDATE, data)
                }
            })

            WS.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, (data) => {
                futuresLastPrice = data?.c
                Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE, data)
            })

            // WS.on(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE, (data) => {
            //     Emitter.emit(
            //         PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + data.s,
            //         data
            //     )
            // })

            WS.on(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE, (data) => {
                Emitter.emit(
                    PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE + data.s,
                    data
                )
            })

            WS.on(PublicSocketEvent.FUTURES_DEPTH_UPDATE, (data) => {
                Emitter.emit(PublicSocketEvent.FUTURES_DEPTH_UPDATE, data)
            })
        })

        WS.on('disconnect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: null,
            })
        })
    }
}

export default initPublicSocket
