import axios from 'axios';
import ms from 'ms';
import io from 'socket.io-client';
import colors from '../../styles/colors';

const PRICE_URL = process.env.NEXT_PUBLIC_PRICE_API_URL;

export const internalTimeFrame = {
    '1m': ms('1m'),
    '1h': ms('1h'),
    '1d': ms('1d'),
};

export const listTimeFrame = [
    { value: ms('1m'), text: '1m' },
    { value: ms('5m'), text: '5m' },
    { value: ms('15m'), text: '15m' },
    { value: ms('30m'), text: '30m' },
    { value: ms('1h'), text: '1h' },
    { value: ms('4h'), text: '4h' },
    { value: ms('1d'), text: '1D' },
    { value: ms('7d'), text: '1W' },
    { value: ms('30d'), text: '1M' },
];

const getInternalTimeFrame = (timeMs) => {
    if (timeMs >= internalTimeFrame['1m'] && timeMs < internalTimeFrame['1h']) {
        return '1m';
    }
    if (timeMs >= internalTimeFrame['1h'] && timeMs < internalTimeFrame['1d']) {
        return '1h';
    }
    return '1d';
};

export async function getData({ broker, symbol, from, to, resolution }) {
    const url = `${PRICE_URL}/api/v1/chart/history`;
    const { data } = await axios.get(url, {
        params: {
            broker,
            symbol,
            from: Math.floor(from / 1000),
            to: Math.ceil(to / 1000),
            resolution: getInternalTimeFrame(resolution),
        },
    }).catch(err => {
        console.error(err);
        return [];
    });

    if (!data) return [];

    // [ time, open, high, low, close, volume]
    return data.map(i => ({
        timestamp: i[0] * 1000,
        open: i[1],
        high: i[2],
        low: i[3],
        close: i[4],
        volume: i[5],
    }));
}

// Correct for upsize only (not equal case)!
export function calculateUpSizeBarData(data, resolution) {
    if (!data || !data.length) return [];
    let last;
    const newData = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (last) {
            last.close = element.close;
            last.high = Math.max(last.high || -Infinity, element.high);
            last.low = Math.min(last.low || Infinity, element.low);
            last.volume += element.volume;
        }

        if (element.timestamp % resolution === 0) {
            if (last) {
                newData.push(last);
            }
            last = { ...element, open: element.close };
        }
    }
    return newData;
}

const socket_url = process.env.NEXT_PUBLIC_STREAM_SOCKET;
export const socket = io(socket_url, {
    transports: ['websocket'],
    upgrade: false,
    path: '/ws',
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 500,
    reconnectionAttempts: Infinity,
});


export const shapeTemplateTP = ({
    name: 'tp',
    totalStep: 2,
    checkEventCoordinateOnShape: ({ key, type, dataSource, eventCoordinate }) => {
    },
    createShapeDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) => {
        return [
            {
                type: 'polygon',
                isDraw: true,
                isCheck: false,
                styles: { stroke: { color: colors.teal, style: 'dashed' } },
                dataSource: [
                    [
                        {
                            x: 0,
                            y: coordinates[0].y
                        },
                        {
                            x: viewport.width,
                            y: coordinates[0].y
                        },
                    ],
                ]
            },
            {
                type: 'text',
                isDraw: true,
                isCheck: false,
                styles: {
                    color: colors.teal,
                    offset: [-2, 2],
                    size: 16, weight: 600
                },
                dataSource: [{
                    x: 0,
                    y: coordinates[0].y,
                    text: points[0].text
                }]
            },
        ]
    },
})

export const shapeTemplateSL = ({
    name: 'sl',
    totalStep: 2,
    checkEventCoordinateOnShape: ({ key, type, dataSource, eventCoordinate }) => {
    },
    createShapeDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) => {
        return [
            {
                type: 'line',
                isDraw: true,
                isCheck: false,
                styles: { style: 'fill', color: colors.red },
                dataSource: [
                    [
                        {
                            x: 0,
                            y: coordinates[0].y
                        },
                        {
                            x: viewport.width,
                            y: coordinates[0].y
                        },
                    ],
                ]
            },
            {
                type: 'text',
                isDraw: true,
                isCheck: false,
                styles: {
                    color: colors.red,
                    offset: [-2, 2],
                    size: 16, weight: 600
                },
                dataSource: [{
                    x: 0,
                    y: coordinates[0].y,
                    text: points[0].text
                }]
            },
        ]
    },
})