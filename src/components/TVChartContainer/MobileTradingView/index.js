import * as React from 'react';
import { IconLoading } from 'components/common/Icons';
import { getTradingViewTimezone, getS3Url, formatFundingRate, emitWebViewEvent, encodeUrlFromApp } from 'redux/actions/utils';
import Countdown from 'react-countdown-now';
import colors from '../../../styles/colors';
import { widget } from '../../TradingView/charting_library/charting_library.min';
import Datafeed from '../api';
import { ChartMode } from 'redux/actions/const';
import { VndcFutureOrderType } from '../../screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import ChartOptions from 'components/TVChartContainer/MobileTradingView/ChartOptions';
import classNames from 'classnames';
import IndicatorBars, { mainIndicators, subIndicators } from 'components/TVChartContainer/MobileTradingView/IndicatorBars';
import { find, set } from 'lodash';
import Modal from 'components/common/ReModal';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import Tooltip from 'components/common/Tooltip';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const CONTAINER_ID = 'nami-mobile-tv';
const CHART_VERSION = '1.0.9';
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4
};
import { formatPrice } from 'src/redux/actions/utils';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useContext } from 'react';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';

export class MobileTradingView extends React.PureComponent {
    state = {
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: 'price',
        interval: this.props.initTimeFrame,
        studies: [],
        priceChartType: 1,
        mainIndicator: null,
        subIndicator: null
    };

    tvWidget = null;
    drawnOrder = {};
    drawnSl = {};
    drawnTp = {};
    drawnProfit = {};
    intervalSaveChart = null;
    timer = null;
    firstTime = true;
    oldOrdersList = [];
    drawnHighLowArrows = {};

    containerId = `${this.props.containerId || CONTAINER_ID}-${this.props.symbol}`;
    isDark = this.props.theme === 'dark';
    chartBg = this.isDark ? colors.dark.dark : colors.white;

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        if (this.props?.refChart) this.props?.refChart(this);
        this.initWidget(this.props.symbol, this.props.fullChart);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.symbol !== prevProps.symbol || this.props.chartSize !== prevProps.chartSize) {
            this.widget.remove();
            this.oldOrdersList = [];
            this.initWidget(this.props.symbol);
        }

        if (prevProps.theme !== this.props.theme) {
            const newTheme = this.isDark ? 'Dark' : 'Light';
            if (this.state.chartStatus === ChartStatus.LOADED && newTheme !== this.theme && this.widget) {
                this.widget.changeTheme(newTheme);
                this.widget.applyOverrides({
                    'scalesProperties.lineColor': '#202C4C',
                    'paneProperties.background': this.chartBg,
                    'paneProperties.vertGridProperties.color': this.chartBg,
                    'paneProperties.horzGridProperties.color': this.chartBg
                });
                this.theme = newTheme;
            }
        }

        if (prevProps.initTimeFrame !== this.props.initTimeFrame) {
            this.handleActiveTime(this.props.initTimeFrame);
        }

        if (prevProps.ordersList !== this.props.ordersList && !this.firstTime && this.props?.isShowSlTPLine) {
            this.rawOrders();
        }
        if (prevProps?.isShowSlTPLine !== this.props?.isShowSlTPLine && !this.firstTime) {
            if (this.props?.isShowSlTPLine) {
                this.rawOrders();
            } else {
                this.oldOrdersList = [];
                Object.keys(this.drawnOrder).map((line) => {
                    this.drawnOrder[line].remove();
                    delete this.drawnOrder[line];
                });

                Object.keys(this.drawnSl).map((line) => {
                    this.drawnSl[line].remove();
                    delete this.drawnSl[line];
                });

                Object.keys(this.drawnTp).map((line) => {
                    this.drawnTp[line].remove();
                    delete this.drawnTp[line];
                });
            }
        }
        if (prevProps.fullChart !== this.props.fullChart) {
            this.initWidget(this.props.symbol, this.props.fullChart);
        }
    }

    componentWillUnmount() {
        if (this.tvWidget !== null) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
        clearInterval(this.intervalSaveChart);
    }

    handleActiveTime = (value) => {
        if (this?.widget) {
            this.widget.setSymbol(this.props.symbol, value, () => {});
            this.setState({ interval: value });
        }
    };

    handleChangeChartType = (type) => {
        if (this?.widget) {
            this.widget.chart().setChartType(type);
            this.setState({ priceChartType: type });
        }
    };

    createIndicator = (name, input, cb) => {
        if (input) {
            let ids = [];
            input.forEach((item, idx) => {
                this.widget.activeChart().createStudy(name, false, false, item, (id) => {
                    ids.push(id);
                    if (idx === input.length - 1) cb(ids);
                });
            });
        } else {
            this.widget.activeChart().createStudy(name, false, false, undefined, cb);
        }
    };

    handleChangeIndicator = (type) => (value, item) => {
        const indicatorStateKey = type === 'main' ? 'mainIndicator' : 'subIndicator';
        const studyName = this.state[indicatorStateKey]?.name;
        if (studyName) {
            const currentStudies = this.widget.activeChart().getAllStudies();
            const dataFilter = currentStudies.filter((rs) => rs.name === studyName);
            if (Array.isArray(dataFilter) && dataFilter.length > 1) {
                dataFilter.forEach((item) => {
                    this.widget.activeChart().removeEntity(item.id);
                });
            } else {
                this.widget.activeChart().removeEntity(this.state[indicatorStateKey]?.id);
            }
        }
        if (value) {
            this.createIndicator(value, item?.input, (id) => {
                this.setState({
                    ...this.state,
                    [indicatorStateKey]: {
                        name: value,
                        id
                    }
                });
            });
        } else {
            this.setState({
                ...this.state,
                [indicatorStateKey]: null
            });
        }
    };

    // eslint-disable-next-line class-methods-use-this
    get getChartKey() {
        return `nami-tv__${CHART_VERSION}`;
    }

    loadSavedChart = () => {
        // Load saved chart
        let savedChart = localStorage.getItem(this.getChartKey);
        if (savedChart) {
            try {
                const data = JSON.parse(savedChart);
                set(data, 'charts[0].panes[0].sources[0].state.symbol', this.props.symbol);
                this.widget.load(data);
            } catch (err) {
                localStorage.removeItem(this.getChartKey);
                console.error('Load chart error', err);
            }
        }

        // Sync resolution to local component state
        setTimeout(() => {
            const interval = this.widget.activeChart().resolution();
            this.setState({
                ...this.state,
                interval,
                priceChartType: this.widget.activeChart().chartType()
            });
            if (this.props.onIntervalChange) {
                this.props.onIntervalChange(interval);
            }
        }, 0);
    };

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save((data) => {
                    let currentData = JSON.parse(localStorage.getItem(this.getChartKey) || '{}');
                    localStorage.setItem(this.getChartKey, JSON.stringify(Object.assign(currentData, data)));
                });
            }
        } catch (err) {
            console.error('Save chart error', err);
        }
    };

    getOrderType = (order) => {
        const orderType = order.status === VndcFutureOrderType.ACTIVE ? '' : order.type;
        return `${order.side} ${orderType}`.toUpperCase();
    };

    getTicket = ({ displaying_id: displayingId }) => {
        return displayingId;
    };

    toNormalText(line) {
        if (!line) return null;
        const font = line.getBodyFont();
        const rex = /(.+)(\s+)(\dpt)(\s+)(.+)/;
        return font.replace(rex, 'normal$2$3$4$5');
    }

    async newOrder(displayingId, order) {
        const isMatched = !(order.status === 0 || (order.status === 2 && order.openPrice == null));
        try {
            const color = this.getOrderType(order).startsWith('BUY') ? colors.green[2] : colors.red[2];
            const colorSl = colors.red[2];
            const colorTp = colors.green[2];
            const line = this.widget
                .chart()
                .createOrderLine()
                .setText(`# ${this.getTicket(order)} ${this.getOrderType(order)}`)
                .setPrice(order?.open_price || order?.price)
                .setQuantity(null)
                .setEditable(false)
                .setLineColor(color)
                .setBodyTextColor('rgb(255,255,255)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityTextColor('rgb(0, 0, 0)')
                .setLineLength(120)
                .setLineWidth(2)
                .setBodyBackgroundColor(color)
                .setBodyBorderColor(color)
                .setCancelButtonBorderColor('rgb(255,0,0)')
                .setCancelButtonBackgroundColor('rgb(0,255,0)')
                .setCancelButtonIconColor('rgb(0,0,255)');
            line.setBodyFont(this.toNormalText(line));
            this.drawnOrder[displayingId] = line;
            if (order.sl > 0) {
                const lineSl = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`# ${displayingId} SL`)
                    .setPrice(order.sl)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorSl)
                    .setBodyTextColor(colorSl)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineWidth(1)
                    .setLineStyle(0);
                lineSl.setBodyFont(this.toNormalText(lineSl));
                this.drawnSl[displayingId] = lineSl;
            }
            if (order.tp > 0) {
                const lineTp = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`# ${displayingId} TP`)
                    .setPrice(order.tp)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorTp)
                    .setBodyTextColor(colorTp)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineWidth(1)
                    .setLineStyle(0);
                lineTp.setBodyFont(this.toNormalText(lineTp));
                this.drawnTp[displayingId] = lineTp;
            }

            if (this.props.renderProfit) {
                const color = order.profit > 0 ? colors.green[2] : colors.red[2];

                if (order.close_price != null && (order.profit != null || order.profitToDraw != null)) {
                    const lineProfit = this.widget
                        .chart()
                        .createOrderLine()
                        .setText(`# ${displayingId} Profit: ${order.profit.toFixed(4)}`)
                        .setQuantity(null)
                        .setPrice(order.close_price)
                        .setEditable(false)
                        .setLineColor(color)
                        .setBodyTextColor('rgba(255,255,255,1)')
                        .setQuantityBackgroundColor('rgba(0,0,0,0)')
                        .setQuantityBorderColor('rgba(0,0,0,0)')
                        .setQuantityTextColor('rgb(0, 0, 0)')
                        .setLineLength(120)
                        .setBodyBackgroundColor('rgb(187,187,187)')
                        .setBodyBorderColor('rgb(187,187,187)')
                        .setCancelButtonBorderColor('rgb(255,0,0)')
                        .setCancelButtonBackgroundColor('rgb(0,255,0)')
                        .setLineWidth(2)
                        .setLineStyle(0)
                        .setCancelButtonIconColor('rgb(0,0,255)');
                    this.drawnProfit[displayingId] = lineProfit;
                    lineProfit.setBodyFont(this.toNormalText(lineProfit));
                }
            }

            return line;
        } catch (err) {
            console.error('__ err', err);
        }
    }

    rawOrders = async () => {
        const _ordersList = this.props.ordersList.filter((order) => order?.symbol === this.props.symbol);
        const edited = localStorage.getItem('edited_id');
        if (edited) {
            const itemEdited = _ordersList.find((order) => String(order?.displaying_id) === edited);
            if (itemEdited) {
                if (this.drawnOrder.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnOrder[itemEdited?.displaying_id].remove();
                    delete this.drawnOrder[itemEdited?.displaying_id];
                }
                if (this.drawnSl.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnSl[itemEdited?.displaying_id].remove();
                    delete this.drawnSl[itemEdited?.displaying_id];
                }
                if (this.drawnTp.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnTp[itemEdited?.displaying_id].remove();
                    delete this.drawnTp[itemEdited?.displaying_id];
                }
                if (this.drawnProfit.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnProfit[itemEdited?.displaying_id].remove();
                    delete this.drawnProfit[itemEdited?.displaying_id];
                }
                this.newOrder(itemEdited.displaying_id, itemEdited);
                localStorage.removeItem('edited_id');
            }
        }
        const newDataOrders = _ordersList.filter((order) => {
            if (this.props.renderProfit) return true;
            return (
                (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) &&
                !this.oldOrdersList.find((id) => order.displaying_id === id)
            );
        });
        if (newDataOrders.length > 0) {
            newDataOrders.forEach((order) => {
                this.newOrder(order.displaying_id, order);
            });
        } else {
            const removeOrders = this.oldOrdersList.filter((id) => !_ordersList.find((order) => order.displaying_id === id));
            removeOrders.forEach((id) => {
                if (this.drawnOrder.hasOwnProperty(id)) {
                    this.drawnOrder[id].remove();
                    delete this.drawnOrder[id];
                }
                if (this.drawnSl.hasOwnProperty(id)) {
                    this.drawnSl[id].remove();
                    delete this.drawnSl[id];
                }
                if (this.drawnTp.hasOwnProperty(id)) {
                    this.drawnTp[id].remove();
                    delete this.drawnTp[id];
                }
                if (this.drawnProfit.hasOwnProperty(id)) {
                    this.drawnProfit[id].remove();
                    delete this.drawnProfit[id];
                }
            });
        }
        this.oldOrdersList = this.props?.ordersList.map(
            (order) => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && order.displaying_id
        );
    };

    initWidget = (symbol, isFullChart = false) => {
        if (!symbol) return;

        const datafeed = new Datafeed(this.props.mode || ChartMode.SPOT, true);
        const _disabled_features = [
            'legend_context_menu',
            'symbol_search_hot_key',
            'legend_widget',
            'timeframes_toolbar',
            'study_templates',
            'header_saveload',
            'caption_buttons_text_if_possible',
            'context_menus',
            'symbol_info', // Header
            'header_widget_dom_node',
            'header_symbol_search',
            'symbol_search_hot_key',
            'header_interval_dialog_button',
            'show_interval_dialog_on_key_press',
            'header_settings',
            'header_compare',
            'header_undo_redo',
            'header_screenshot',
            'header_fullscreen_button',
            'main_series_scale_menu',
            // 'left_toolbar',
            'volume_force_overlay',
            'use_localstorage_for_settings',
            'compare_symbol',
            'display_market_status',
            'go_to_date',
            'source_selection_markers',
            'popup_hints',
            'header_widget',
            'axis_pressed_mouse_move_scale'
        ];
        if (!isFullChart) {
            _disabled_features.push('left_toolbar');
        }
        const newTheme = this.isDark ? 'Dark' : 'Light';
        const widgetOptions = {
            symbol,
            datafeed,
            theme: newTheme,
            interval: this.props.initTimeFrame,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: 'en',
            disabled_features: _disabled_features,
            enabled_features: ['move_logo_to_main_pane', 'edit_buttons_in_legend'],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: true,
            loading_screen: { backgroundColor: this.chartBg },
            studies_overrides: {
                'volume.volume.color.0': colors.red[2],
                'volume.volume.color.1': colors.green[2],
                'volume.volume ma.color': colors.red[2],
                'volume.volume ma.linewidth': 5,
                'volume.volume ma.visible': true,
                'bollinger bands.median.color': '#33FF88',
                'bollinger bands.upper.color': '#00ffff',
                'bollinger bands.lower.color': '#f263f3',
                'moving average exponential.plot.color': '#00C8BC',
                'moving average.plot.color': '#00ffff',
                'macd.histogram.color': '#00ffff',
                'macd.macd.color': '#e9a55d',
                'macd.signal.color': '#f263f3',
                'relative strength index.plot.color': '#00ffff',

                'moving average.plot.linewidth': 3,

                'moving average exponential.plot.linewidth': 3,

                'bollinger bands.median.linewidth': 2,
                'bollinger bands.upper.linewidth': 2,
                'bollinger bands.lower.linewidth': 2,

                'macd.signal.linewidth': 2,
                'macd.macd.linewidth': 2,

                'relative strength index.plot.linewidth': 2
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                'scalesProperties.fontSize': 10,
                editorFontsList: ['Inter', 'Sans'],
                volumePaneSize: 'tiny'
            },
            custom_css_url: '/library/trading_view/customized_mobile_chart.css?version=5.0.2'
        };

        // Clear to solve config when load saved chart
        if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);

        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {
            // Load saved chart
            this.loadSavedChart();
            this.syncIndicators();
            this.widget.applyOverrides({
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
                'scalesProperties.lineColor': this.chartBg,
                'scalesProperties.textColor': this.isDark ? colors.gray[7] : colors.gray[1],
                'paneProperties.background': this.chartBg,
                'paneProperties.vertGridProperties.color': this.chartBg,
                'paneProperties.horzGridProperties.color': this.isDark ? colors.divider.dark : colors.divider.DEFAULT,

                'mainSeriesProperties.candleStyle.borderUpColor': colors.green[2],
                'mainSeriesProperties.candleStyle.borderDownColor': colors.red[2],
                'mainSeriesProperties.candleStyle.wickUpColor': colors.green[2],
                'mainSeriesProperties.candleStyle.wickDownColor': colors.red[2],
                'mainSeriesProperties.candleStyle.upColor': colors.green[2],
                'mainSeriesProperties.candleStyle.downColor': colors.red[2],
                'mainSeriesProperties.hollowCandleStyle.borderColor': colors.green[2],
                'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red[2],

                volumePaneSize: 'tiny'
            });
            this.setState({ chartStatus: ChartStatus.LOADED });
            // if (this.props.isVndcFutures) {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.props?.isShowSlTPLine) this.rawOrders();
                this.drawHighLowArrows();
                this.firstTime = false;
                this.widget
                    .chart()
                    .onVisibleRangeChanged()
                    .subscribe({}, () => {
                        this.drawHighLowArrows();
                    });
            }, 2000);
            // }
            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(this.saveChart, 5000);
        });
    };

    drawHighLowArrows = debounce(async () => {
        this.drawnHighLowArrows?.highArrow?.remove();
        this.drawnHighLowArrows?.lowArrow?.remove();
        delete this.drawnHighLowArrows?.highArrow;
        delete this.drawnHighLowArrows?.lowArrow;

        const { from, to } = this.widget.chart().getVisibleRange();
        const { data } = await this.widget.chart().exportData({
            from,
            to
        });
        if (data && data.length) {
            const high = data.reduce((prev, current) => (prev[2] > current[2] ? prev : current));
            const low = data.reduce((prev, current) => (prev[3] < current[3] ? prev : current));
            const base = this.props.symbol.includes('VNDC') ? this.props.symbol.replace('VNDC', '') : this.props.symbol.replace('USDT', '');
            const highArrow = this.widget
                .chart()
                .createExecutionShape({ disableUndo: false })
                .setPrice(high[2])
                .setTime(high[0])
                .setDirection('sell')
                .setText(formatPrice(high[2], this.props.exchangeConfig, base).toString())
                .setTooltip(formatPrice(high[2], this.props.exchangeConfig, base).toString())
                .setArrowColor('rgb(187,187,187)')
                .setTextColor(this.isDark ? colors.gray[7] : colors.gray[1])
                .setArrowHeight(7);
            const lowArrow = this.widget
                .chart()
                .createExecutionShape({ disableUndo: false })
                .setPrice(low[3])
                .setTime(low[0])
                .setDirection('buy')
                .setText(formatPrice(low[3], this.props.exchangeConfig, base).toString())
                .setTooltip(formatPrice(low[3], this.props.exchangeConfig, base).toString())
                .setArrowColor('rgb(187,187,187)')
                .setTextColor(this.isDark ? colors.gray[7] : colors.gray[1])
                .setArrowHeight(7);

            this.drawnHighLowArrows = { highArrow, lowArrow };
        }
    }, 100);

    getInterval(resolution) {
        if (resolution.includes('D') || resolution.includes('W') || resolution.includes('M')) {
            return '1d';
        }
        if (resolution.includes('S')) {
            return '1m';
        }
        // minutes and hour
        if (+resolution < 60) {
            return '1m';
        }
        return '1h';
    }

    syncIndicators = () => {
        const currentStudies = this.widget.activeChart().getAllStudies();
        this.setState({
            ...this.state,
            mainIndicator: find(currentStudies, (s) => !!find(mainIndicators, { value: s.name })),
            subIndicator: find(currentStudies, (s) => !!find(subIndicators, { value: s.name }))
        });
    };

    handleOpenIndicatorModal = () => {
        if (this?.widget) {
            this.widget.chart().executeActionById('insertIndicator');
        }
    };

    resetComponent = () => {
        localStorage.removeItem(this.getChartKey);
        if (this.props.reNewComponentKey) this.props.reNewComponentKey();
    };

    setFullChart = (data) => {
        if (this.props.setFullChart) this.props.setFullChart(data);
    };

    render() {
        return (
            <>
                <div className="relative flex flex-grow flex-col h-full bg-bgPrimary dark:bg-bgPrimary-dark" id="chart-container">
                    <div
                        className={classNames(`absolute w-full h-full flex justify-center items-center`, {
                            hidden: this.state.chartStatus === ChartStatus.LOADED
                        })}
                    >
                        <IconLoading color={colors.green[2]} />
                    </div>
                    {this.props.showTimeFrame && (
                        <div className="w-full border-b border-divider/70 dark:border-divider-dark py-2 dragHandleArea z-10">
                            <ChartOptions
                                pair={this.props.symbol}
                                pairConfig={this.props.pairConfig}
                                isVndcFutures={this.props.isVndcFutures}
                                resolution={this.state.interval}
                                setResolution={this.handleActiveTime}
                                isFullScreen={this.props.isFullScreen}
                                chartType={this.state.priceChartType}
                                setChartType={this.handleChangeChartType}
                                showSymbol={this.props.showSymbol}
                                showIconGuide={this.props.showIconGuide}
                                resetComponent={this.resetComponent}
                                fullChart={this.props.fullChart}
                                setFullChart={this.setFullChart}
                                handleOpenIndicatorModal={this.handleOpenIndicatorModal}
                            />
                        </div>
                    )}
                    <div id={this.containerId} className={`h-full pr-2 ${this.props.classNameChart}`} style={this.props.styleChart} />
                    <div>
                        {this.state.chartStatus === ChartStatus.LOADED && (
                            <IndicatorBars
                                handleOpenIndicatorModal={this.handleOpenIndicatorModal}
                                setMainIndicator={this.handleChangeIndicator('main')}
                                setSubIndicator={this.handleChangeIndicator('sub')}
                                mainIndicator={this.state.mainIndicator?.name}
                                subIndicator={this.state.subIndicator?.name}
                                resetComponent={this.resetComponent}
                                fullChart={this.props.fullChart}
                                setFullChart={this.setFullChart}
                                isDetail={this.props.isDetail}
                            />
                        )}
                    </div>
                    {!this.props.isDetail && <Funding symbol={this.props.symbol} />}
                    {/*<div className="!w-32 cheat-watermark">*/}
                    {/*    <NamiExchangeSvg color={colors.gray[4]}/>*/}
                    {/*</div>*/}
                </div>
            </>
        );
    }
}

const Funding = ({ symbol }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = React.useState(false);
    const timesync = useSelector((state) => state.utils.timesync);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const context = useContext(AlertContext);

    useEffect(() => {
        const localKey = `notShowFundingWarning:${symbol}`;
        const notShowFundingWarning = localStorage.getItem(localKey);
        if (notShowFundingWarning?.length) {
            if (Number(notShowFundingWarning) >= Date.now()) {
                return;
            } else {
                localStorage.removeItem(localKey);
            }
        }
        const showWarningRate = Math.abs(marketWatch?.[symbol]?.fundingRate * 100) >= 0.5;
        const showWarningTime = (marketWatch?.[symbol]?.fundingTime - Date.now()) / 60000 <= 15;

        const showWarning = showWarningRate && showWarningTime;
        if (showWarning) {
            context.alert.show(
                'warning',
                t('futures:funding_history_tab:funding_warning'),
                t('futures:funding_history_tab:funding_warning_content'),
                null,
                () => {
                    localStorage.setItem(localKey, (Date.now() + 900000).toString());
                },
                null,
                {
                    hideCloseButton: true,
                    confirmTitle: t('futures:funding_history_tab:funding_warning_accept'),
                    textClassname: '!text-left overflow-y-auto !max-h-[300px] yes-scrollbar',
                    noUseOutside: true
                }
            );
        }
    }, [symbol]);

    useEffect(() => {
        const localKey = `notShowNetworkError`;
        const notShowNetworkError = localStorage.getItem(localKey);
        if (notShowNetworkError?.length) {
            if (Number(notShowNetworkError) >= Date.now()) {
                return;
            } else {
                localStorage.removeItem(localKey);
            }
        }

        const showWarning = true;
        if (showWarning) {
            context.alert.show(
                'warning',
                t('futures:funding_history_tab:funding_warning'),
                t('futures:funding_history_tab:network_warning_content'),
                null,
                () => {
                    localStorage.setItem(localKey, (Date.now() + 12 * 60 * 60 * 1000).toString());
                },
                null,
                {
                    hideCloseButton: true,
                    confirmTitle: t('futures:funding_history_tab:funding_warning_accept'),
                    textClassname: '!text-left overflow-y-auto !max-h-[300px] yes-scrollbar',
                    noUseOutside: true
                }
            );
        }
    }, []);

    return (
        <>
            {showModal && <ModalFundingRate onClose={() => setShowModal(false)} t={t} symbol={symbol} />}
            <div className="flex items-center px-4 pt-3 pb-4 space-x-6 border-b-4 border-divider/70 dark:border-divider-dark/50">
                <div className="w-full flex items-center justify-between space-x-2 text-xs">
                    <div className="flex items-center space-x-1" onClick={() => setShowModal(true)}>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">Funding:</span>
                        <div>
                            <QuestionMarkIcon size={12} color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" />
                        </div>
                    </div>
                    <div>{formatFundingRate(marketWatch[symbol]?.fundingRate * 100)}</div>
                </div>
                <div className="w-full flex items-center justify-between space-x-2 text-xs">
                    <div className="flex items-center space-x-1" data-tip={t('common:countdown_tooltip')} data-for="tooltip-countdown">
                        <Tooltip
                            id={'tooltip-countdown'}
                            place="top"
                            effect="solid"
                            backgroundColor={colors.darkBlue4}
                            className={`!opacity-100 max-w-[300px] !rounded-lg`}
                            isV3
                            overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
                                const d = document.documentElement;
                                left = Math.min(d.clientWidth - 16 - node.clientWidth, left);
                                top = Math.min(d.clientHeight - node.clientHeight, top);
                                left = Math.max(0, left);
                                top = Math.max(0, top);
                                return { top, left };
                            }}
                        />
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:countdown')}:</span>
                        <div className="w-3 h-3">
                            <QuestionMarkIcon size={12} color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" />
                        </div>
                    </div>
                    <div>
                        <Countdown
                            now={() => (timesync ? timesync.now() : Date.now())}
                            date={marketWatch[symbol]?.fundingTime}
                            renderer={({ hours, minutes, seconds }) => {
                                return (
                                    <span>
                                        {hours}:{minutes}:{seconds}
                                    </span>
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const ModalFundingRate = ({ onClose, t, symbol }) => {
    const router = useRouter();
    const [currentTheme] = useDarkMode();

    const onRedirect = () => {
        router.push(`/${router.locale}/futures/funding-history?theme=${currentTheme}&source=app&symbol=${symbol}`);
        // const uri = `/futures/funding-history?theme=${currentTheme}&source=app&symbol=${symbol}&head=false&title=${t('futures:funding_history')}`;
        // emitWebViewEvent(encodeUrlFromApp(uri));
        // if (onClose) onClose();
    };

    const onDetail = () => {
        // const uri =
        //     router.locale === 'en'
        //         ? `/support/faq/noti-en-announcement/apply-funding-rates-on-nami-futures-and-nao-futures`
        //         : `/vi/support/faq/noti-vi-thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures`;
        // emitWebViewEvent(encodeUrlFromApp(uri + `?theme=${currentTheme}&source=app&head=false&title=Nami FAQ`));
        // if (onClose) onClose();
        const url =
            router.locale === 'en'
                ? '/support/faq/noti-en-announcement/apply-funding-rates-on-nami-futures-and-nao-futures'
                : '/vi/support/faq/noti-vi-thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures';
        router.push(url + `?theme=${currentTheme}&source=app&alb=true`);
    };

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}>
            <div className="text-2xl font-semibold text-center">{t('futures:funding_rate')}</div>
            <div className="text-sm pt-4 text-center text-txtSecondary dark:text-txtSecondary-dark">
                {t('futures:funding_rate_des')}{' '}
                <span onClick={onDetail} className="text-teal font-semibold">
                    {t('common:read_more')}
                </span>
            </div>
            <div className="flex items-center space-x-4 pt-8 text-center">
                <div onClick={onClose} className="w-full font-semibold bg-gray-12 dark:bg-dark-2 text-gray-15 dark:text-gray-7 rounded-md px-2 py-3">
                    {t('common:close')}
                </div>
                <div onClick={onRedirect} className="w-full font-semibold bg-bgBtnPrimary text-txtBtnPrimary rounded-md px-2 py-3">
                    {t('futures:funding_history')}
                </div>
            </div>
        </Modal>
    );
};

MobileTradingView.defaultProps = {
    symbol: 'BTCUSDT',
    interval: '1',
    containerId: 'nami-mobile-tv',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/library/trading_view/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    isFullScreen: false,
    showSymbol: true,
    showIconGuide: true,
    autosize: true,
    showTimeFrame: true,
    renderProfit: false,
    ordersList: [],
    studies_overrides: {
        'volume.volume.color.0': colors.green[2],
        'volume.volume.color.1': colors.red[2],
        'volume.volume ma.color': colors.red[2],
        'volume.volume ma.linewidth': 5,
        'volume.volume ma.visible': true,
        'bollinger bands.median.color': '#33FF88',
        'bollinger bands.upper.linewidth': 7
    }
};
