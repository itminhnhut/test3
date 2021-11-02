import io from 'socket.io-client';
import * as types from 'src/redux/actions/types';

import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import throttle from 'lodash/throttle';

let WS;
let lastPrice = 0;

const updateDepthChart = throttle((data) => {
    Emitter.emit(PublicSocketEvent.SPOT_DEPTH_UPDATE + 'depth', data);
}, 3000);
function initPublicSocket() {
    return dispatch => {
        WS = io(process.env.NEXT_PUBLIC_STREAM_SOCKET, {
            // transports: ['websocket'],
            transports: ['websocket'],
            upgrade: false,
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 500,
            reconnectionAttempts: Infinity,

        });
        WS.on('connect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: WS,
            });

            WS.on(PublicSocketEvent.SPOT_DEPTH_UPDATE, (data) => {
                console.log('__ check data', data);
                Emitter.emit(PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book', data);
                updateDepthChart(data);
            });

            WS.on(PublicSocketEvent.SPOT_TICKER_UPDATE, (data) => {
                console.log('__ check data', data);
                if (data?.p !== lastPrice) {
                    lastPrice = data?.p;
                    Emitter.emit(PublicSocketEvent.SPOT_TICKER_UPDATE, data);
                }
            });
        });
        WS.on('disconnect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: null,
            });
        });
    };
}

export default initPublicSocket;
