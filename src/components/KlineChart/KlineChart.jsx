import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {init, dispose} from 'klinecharts'
import ms from 'ms';

import getDefaultOptions from './defaultStyleOptions'
import useDarkMode, {THEME_MODE} from "hooks/useDarkMode";
import {getData, calculateUpSizeBarData, socket, internalTimeFrame} from "components/KlineChart/kline.service";
import NamiExchangeSvg from "components/svg/NamiExchangeSvg";
import colors from "styles/colors";
import {clone, last} from "lodash";
import usePrevious from "hooks/usePrevious";
import {values} from "lodash/object";

const CHART_ID = 'k-line-chart'

let _lastBar;

// Chart instance
let chart;

function KLineChart({symbolInfo, resolution = ms('1m'), mainIndicator = '', subIndicator, candle, isResize}) {
    const prevMainIndicator = usePrevious(mainIndicator)
    const prevSubIndicator = usePrevious(subIndicator)
    const prevCandle = usePrevious(candle)
    // const ordersList = useSelector(state => state?.futures?.ordersList)
    // Hooks

    // TODO: check default theme not show x,y axis
    const [themeMode] = useDarkMode()

    useEffect(() => {
        chart = init(CHART_ID, getDefaultOptions(THEME_MODE.DARK))
    }, [])

    const _getData = useCallback(async (to, from) => {
        if (!symbolInfo?.symbol) return [];
        if (!from) {
            from = to - (chart.getWidth().content / chart.getDataSpace()) * resolution * 2
        }
        return getData({
            broker: symbolInfo.exchange,
            symbol: symbolInfo.symbol,
            from,
            to,
            resolution
        }).then(data => {
            if (values(internalTimeFrame).includes(resolution)) return data
            return calculateUpSizeBarData(data, resolution)
        }).catch(err => {
            console.error(err)
            return []
        })
    }, [resolution, symbolInfo])

    // Init setup
    useEffect(() => {
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
            if (symbolInfo) {
                const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'unsubscribe:recent_trade' : 'unsubscribe:futures:ticker';
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
                    close: price,
                    volume: data.volume,
                };
            }
            _lastBar = clone(data) // Need clone
            chart.updateData(data)
        })
        return () => {
            socket.removeListener(action)
        }
    }, [symbolInfo, resolution])

    // Update theme mode
    useEffect(() => {
        if (themeMode) {
            chart.setStyleOptions(getDefaultOptions(themeMode))
        }
    }, [themeMode])

    // Resolution
    useEffect(() => {
        if (!resolution || !chart) return

        _getData(Date.now().valueOf()).then(data => {
            _lastBar = last(data)
            chart.applyNewData(data)
        })

        chart.loadMore(function (timestamp) {
            _getData(timestamp - resolution).then(data => {
                chart.applyMoreData(data, true)
                if (Array.isArray(data) && !data.length) {
                    chart.loadMore(function () {
                    })
                }
            })
        })
    }, [resolution])

    // Indicator
    useEffect(() => {
        if (prevMainIndicator !== mainIndicator) {
            if (prevMainIndicator) {
                chart.removeTechnicalIndicator('candle_pane', prevMainIndicator)
            }
            if (mainIndicator) {
                chart.createTechnicalIndicator(mainIndicator, false, {id: 'candle_pane'})
            }
        }

    }, [mainIndicator])

    useEffect(() => {
        if (!chart) return
        if (prevSubIndicator !== subIndicator) {
            if (prevSubIndicator) {
                chart.removeTechnicalIndicator('pane_' + prevSubIndicator, prevSubIndicator)
            }

            if (subIndicator) {
                chart.createTechnicalIndicator(subIndicator, false, {
                    id: 'pane_' + subIndicator,
                    height: chart.getHeight().candle_pane / 4
                })
            }
        }
    }, [subIndicator])

    useEffect(() => {
        if (!chart) return
        if (prevCandle !== candle) {
            chart.setStyleOptions({
                candle: {
                    type: candle,
                },
            });
        }
    }, [candle])

    useEffect(() => {
        if (!chart) return
        chart.resize();
    }, [isResize])

    return (
        <div id={CHART_ID} className="kline-chart flex flex-1 h-full" style={{minHeight: 270}}>
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
        (prevProps.resolution === nextProps.resolution) &&
        (prevProps.candle === nextProps.candle) &&
        (prevProps.isResize === nextProps.isResize)
})
