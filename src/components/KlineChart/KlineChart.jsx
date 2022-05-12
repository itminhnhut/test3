import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {init, dispose} from 'klinecharts'
import ms from 'ms';

import getDefaultOptions from './defaultStyleOptions'
import useDarkMode, {THEME_MODE} from "hooks/useDarkMode";
import {getData, calculateUpSizeBarData, socket} from "components/KlineChart/kline.service";
import NamiExchangeSvg from "components/svg/NamiExchangeSvg";
import colors from "styles/colors";
import {last} from "lodash";

const CHART_ID = 'k-line-chart'

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

let _lastBar;

function KLineChart({symbolInfo, resolution = ms('1m'), mainIndicator = '', subIndicator}) {
    // Chart
    let chartRef = useRef(null);
    const chart = useMemo(() => chartRef.current, [chartRef.current])

    const prevSymbolInfo = usePrevious(symbolInfo)
    const prevMainIndicator = usePrevious(mainIndicator)
    const prevSubIndicator = usePrevious(subIndicator)
    // Hooks
    const [themeMode] = useDarkMode()

    const _getData = useCallback(async (to, from) => {
        if (!from) {
            from = to - (chart.getWidth().content / chart.getDataSpace()) * resolution * 2
        }
        return getData({
            broker: symbolInfo.exchange,
            symbol: symbolInfo.symbol,
            from,
            to,
            resolution
        }).then(data => calculateUpSizeBarData(data, resolution))
    }, [resolution, chart])

    // Init setup
    useEffect(() => {
        chartRef.current = init(CHART_ID, getDefaultOptions())

        return () => {
            dispose(CHART_ID)
        }
    }, [])

    // Socket sub
    useEffect(() => {
        if (symbolInfo.exchange && symbolInfo.symbol) {
            const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'subscribe:recent_trade' : 'subscribe:futures:ticker';
            socket.emit(action, symbolInfo.symbol)
        }

        return () => {
            if (prevSymbolInfo) {
                const action = prevSymbolInfo.exchange === 'NAMI_SPOT' ? 'unsubscribe:recent_trade' : 'unsubscribe:futures:ticker';
                socket.emit(action, symbolInfo.symbol)
            }
        }

    }, [symbolInfo.exchange, symbolInfo.symbol])

    useEffect(() => {
        if (!chart || !symbolInfo) return

        chart.setDataSpace(10)
        chart.setPriceVolumePrecision(symbolInfo.pricePrecision, 0)
        chart.setOffsetRightSpace(80)

        _getData(Date.now().valueOf()).then(data => {
            chart.applyNewData(data)
            _lastBar = last(data)
        })

        const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'spot:recent_trade:add' : 'futures:ticker:update';

        socket.on(action, ({t: time, p: price, q: volume}) => {
            if (!_lastBar) return
            const timeRounded = Math.floor(time / resolution) * resolution
            let data = {
                ..._lastBar,
                low: Math.min(+price, _lastBar.low),
                high: Math.max(+price, _lastBar.high),
                volume: _lastBar.volume + parseInt(volume, 10),
                close: +price
            }
            if (timeRounded > _lastBar.timestamp) {
                // create a new candle, use last close as open **PERSONAL CHOICE**
                data = {
                    timestamp: timeRounded,
                    open: _lastBar.close,
                    high: _lastBar.close,
                    low: _lastBar.close,
                    close: data.price,
                    volume: data.volume,
                };
            }
            _lastBar = data
            chart.updateData(data)
        })
        return () => {
            socket.removeListener(action)
        }
    }, [chart, symbolInfo, resolution])

    // Update theme mode
    useEffect(() => {
        if (themeMode && chart) {
            chart.setStyleOptions(getDefaultOptions(themeMode))
        }
    }, [themeMode, chart])

    // Resolution
    useEffect(() => {
        if (!resolution || !chart) return

        _getData(Date.now().valueOf()).then(data => {
            _lastBar = last(data)
            chart.applyNewData(data)
        })

        chart.loadMore(function (timestamp) {
            _getData(timestamp).then(data => {
                chart.applyMoreData(data, true)
                if (!data.length) {
                    chart.loadMore(function () {
                    })
                }
            })
        })

    }, [resolution, chart])

    // Indicator
    useEffect(() => {
        if (!chart) return

        if (mainIndicator) {
            chart.createTechnicalIndicator(mainIndicator, false, {id: 'candle_pane'})
        }

        if (prevMainIndicator && prevMainIndicator !== mainIndicator) {
            chart.removeTechnicalIndicator('candle_pane', prevMainIndicator)
        }

    }, [chart, mainIndicator])

    useEffect(() => {
        if (!chart) return

        if (subIndicator) {
            chart.createTechnicalIndicator(subIndicator, false, {
                id: 'pane_' + subIndicator,
                height: chart.getHeight().candle_pane / 4
            })
        }

        if (prevSubIndicator && prevSubIndicator !== subIndicator) {
            chart.removeTechnicalIndicator('pane_' + prevSubIndicator, prevSubIndicator)
        }
    }, [chart, subIndicator])

    return (
        <div id={CHART_ID} className="kline-chart flex flex-1">
            <div className="cheat-watermark">
                <NamiExchangeSvg color={themeMode === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue4}/>
            </div>
        </div>
    )
}

export default React.memo(KLineChart, (prevProps, nextProps) => {
    return (prevProps?.symbolInfo?.symbol === nextProps?.symbolInfo?.symbol) &&
        (prevProps.mainIndicator === nextProps.mainIndicator) &&
        (prevProps.subIndicator === nextProps.subIndicator) &&
        (prevProps.resolution === nextProps.resolution)
})
