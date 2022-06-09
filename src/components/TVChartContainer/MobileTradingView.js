import * as React from 'react';
import {IconLoading} from 'components/common/Icons';
import NamiExchangeSvg from 'components/svg/NamiExchangeSvg';
import {formatNumber, getTradingViewTimezone} from 'redux/actions/utils';
import colors from '../../styles/colors';
import {widget} from '../TradingView/charting_library/charting_library.min';
import Datafeed from './api';
// import TimeFrame from './timeFrame';
import {ChartMode} from 'redux/actions/const';
import {VndcFutureOrderType} from '../screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import {isMobile} from 'react-device-detect';
import ChartOptions from "components/TVChartContainer/ChartOptions";
import classNames from "classnames";
import IndicatorBars, {mainIndicators, subIndicators} from "components/TVChartContainer/IndicatorBars";
import {find} from "lodash";

const CONTAINER_ID = "nami-mobile-tv";
const CHART_VERSION = "1.0.6";
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4,
};

export default class MobileTradingView extends React.PureComponent {
    state = {
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: "price",
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
    intervalSaveChart = null;
    timer = null;
    firstTime = true;
    oldOrdersList = [];

    containerId = `${this.props.containerId || CONTAINER_ID}-${this.props.symbol}`;

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }



    componentDidMount() {
        this.initWidget(this.props.symbol);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.symbol !== prevProps.symbol ||
            this.props.chartSize !== prevProps.chartSize
        ) {
            this.widget.remove();
            this.oldOrdersList = [];
            this.initWidget(this.props.symbol, this.state.interval);
        }

        if (prevProps.theme !== this.props.theme) {
            const newTheme = this.props.theme === "dark" ? "Dark" : "Light";
            if (
                this.state.chartStatus === ChartStatus.LOADED &&
                newTheme !== this.theme &&
                this.widget
            ) {
                this.widget.changeTheme(newTheme);
                const isDark = this.props.theme === "dark";
                this.widget.applyOverrides({
                    "scalesProperties.lineColor": isDark ? "#202C4C" : "#F2F4F6",
                    'paneProperties.background': isDark ? colors.onus : colors.white,
                    "paneProperties.vertGridProperties.color": isDark ? colors.onus : colors.grey4,
                    "paneProperties.horzGridProperties.color": isDark ? colors.onus : colors.grey4,
                });
                this.theme = newTheme;
            }
        }
        if ((prevProps.ordersList !== this.props.ordersList) && this.props.isVndcFutures && !this.firstTime) {
            this.rawOrders();
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
            this.widget.setSymbol(this.props.symbol, value, () => {
            });
            this.setState({interval: value});
        }
    };

    handleChangeChartType = (type) => {
        if (this?.widget) {
            this.widget.chart().setChartType(type);
            this.setState({priceChartType: type});
        }
    };

    handleChangeIndicator = (type) => (value) => {
        const indicatorStateKey = type === 'main' ? 'mainIndicator' : 'subIndicator';
        const studyId = this.state[indicatorStateKey]?.id
        if (studyId) {
            this.widget.activeChart().removeEntity(studyId)
        }
        if (value) {
            this.widget.activeChart().createStudy(value, false, false, undefined, (id) => {
                this.setState({
                    ...this.state,
                    [indicatorStateKey]: {id, name: value}
                })
            })
        } else {
            this.setState({...this.state, [indicatorStateKey]: null})
        }
    }

    // eslint-disable-next-line class-methods-use-this
    get getChartKey() {
        return `nami-tv__${CHART_VERSION}`;
    }

    loadSavedChart = () => {
        // Load saved chart
        let savedChart = localStorage.getItem(this.getChartKey);
        if (savedChart) {
            try {
                const symbol = this.props.symbol
                const data = JSON.parse(savedChart);
                if (typeof data === 'object' && data[`chart_${symbol.toLowerCase()}`]) {
                    this.widget.load(data[`chart_${symbol.toLowerCase()}`]);
                }
            } catch (err) {
                console.error('Load chart error', err);
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save((data) => {
                    let currentData = localStorage.getItem(this.getChartKey);
                    if (currentData) {
                        try {
                            currentData = JSON.parse(currentData);
                            if (typeof currentData !== "object") {
                                currentData = null;
                            }
                        } catch (ignored) {
                            currentData = null;
                        }
                    }
                    if (!currentData) {
                        currentData = {
                            created_at: new Date(),
                        };
                    }

                    const obj = {
                        updated_at: new Date(),
                        [`chart_${this.props.symbol.toLowerCase()}`]: data,
                        chart_all: data,
                    };
                    localStorage.setItem(
                        this.getChartKey,
                        JSON.stringify(Object.assign(currentData, obj))
                    );
                });
            }
        } catch (err) {
            console.error("Save chart error", err);
        }
    };

    getOrderType = (order) => {
        const orderType = order.status === VndcFutureOrderType.ACTIVE ? '' : order.type;
        return `${order.side} ${orderType}`.toUpperCase();
    };

    getTicket = ({displaying_id: displayingId}) => {
        return displayingId;
    }

    toNormalText(line) {
        if (!line) return null;
        const font = line.getBodyFont();
        const rex = /(.+)(\s+)(\dpt)(\s+)(.+)/;
        return font.replace(rex, 'normal$2$3$4$5');
    }

    async newOrder(displayingId, order) {
        try {
            const color = this.getOrderType(order).startsWith('BUY') ? colors.teal : colors.red2;
            const colorSl = colors.red2;
            const colorTp = colors.teal;
            const line = this.widget.chart().createOrderLine().onModify(() => {
            }).setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} ${this.getOrderType(order)} ${formatNumber(order?.order_value)} (VNDC)`).setPrice(order?.open_price || order?.price).setQuantity(null).setTooltip(
                `${this.getOrderType(order)} ${order?.quantity} ${order?.symbol} at price ${order?.order_value} (VNDC)`).setEditable(false).setLineColor(color).setBodyBorderColor(color).setBodyTextColor(color).setQuantityBackgroundColor(color).setQuantityBorderColor(color).setLineLength(120).setBodyBackgroundColor('rgba(0,0,0,0)').setBodyBorderColor('rgba(0,0,0,0)').setCancelButtonBorderColor('rgb(255,0,0)').setCancelButtonBackgroundColor('rgb(0,255,0)').setCancelButtonIconColor('rgb(0,0,255)');
            line.setBodyFont(this.toNormalText(line));
            this.drawnOrder[displayingId] = line;
            if (order.sl > 0) {
                const lineSl = this.widget.chart().createOrderLine().setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} SL`).setPrice(order.sl).setQuantity(null).setEditable(false).setLineColor(colorSl).setBodyTextColor(colorSl).setBodyBackgroundColor('rgba(0,0,0,0)').setBodyBorderColor('rgba(0,0,0,0)').setLineLength(100).setLineStyle(1);
                lineSl.setBodyFont(this.toNormalText(lineSl));
                this.drawnSl[displayingId] = lineSl;
            }
            if (order.tp > 0) {
                const lineTp = this.widget.chart().createOrderLine().setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} TP`).setPrice(order.tp).setQuantity(null).setEditable(false).setLineColor(colorTp).setBodyTextColor(colorTp).setBodyBackgroundColor('rgba(0,0,0,0)').setBodyBorderColor('rgba(0,0,0,0)').setLineLength(100).setLineStyle(1);
                lineTp.setBodyFont(this.toNormalText(lineTp));
                this.drawnTp[displayingId] = lineTp;
            }
            return line;
        } catch (err) {
            // console.error('__ err', err);
        }
    }

    rawOrders = async () => {
        const _ordersList = this.props.ordersList.filter(order => order?.symbol === this.props.symbol);
        const edited = localStorage.getItem('edited_id');
        if (edited) {
            const itemEdited = _ordersList.find(order => String(order?.displaying_id) === edited)
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
                this.newOrder(itemEdited.displaying_id, itemEdited);
                localStorage.removeItem('edited_id');
            }
        }
        const newDataOrders = _ordersList.filter(order => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && !this.oldOrdersList.find(id => order.displaying_id === id));
        if (newDataOrders.length > 0) {
            newDataOrders.forEach((order) => {
                this.newOrder(order.displaying_id, order);
            })
        } else {
            const removeOrders = this.oldOrdersList.filter(id => !_ordersList.find(order => order.displaying_id === id));
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
            })
        }
        this.oldOrdersList = this.props?.ordersList.map(order => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && order.displaying_id)
    };

    initWidget = (symbol, interval) => {
        if (!symbol) return;

        const datafeed = new Datafeed(this.props.mode || ChartMode.SPOT)
        const widgetOptions = {
            symbol,
            datafeed,
            theme: 'Dark',
            interval,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: "en",
            disabled_features: [
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
                'left_toolbar',
                'volume_force_overlay',
                'use_localstorage_for_settings',

                "compare_symbol",
                "display_market_status",
                "go_to_date",
                "source_selection_markers",
                "popup_hints",
                "header_widget",
                "axis_pressed_mouse_move_scale",
            ],
            enabled_features: [
                "move_logo_to_main_pane",
                "edit_buttons_in_legend",
            ],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: true,
            loading_screen: {backgroundColor: this.props.theme === "dark" ? colors.onus : "#fff",},
            studies_overrides: {
                "volume.volume.color.0": colors.teal,
                "volume.volume.color.1": colors.red2,
                "volume.volume ma.color": colors.red2,
                "volume.volume ma.linewidth": 5,
                "volume.volume ma.visible": true,
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                "scalesProperties.fontSize": 10,

                editorFontsList: ["Barlow", "Sans"],

                "mainSeriesProperties.candleStyle.borderUpColor": colors.teal,
                "mainSeriesProperties.candleStyle.borderDownColor": colors.red2,
                "mainSeriesProperties.candleStyle.wickUpColor": colors.teal,
                "mainSeriesProperties.candleStyle.wickDownColor": colors.red2,
                "mainSeriesProperties.candleStyle.upColor": colors.teal,
                "mainSeriesProperties.candleStyle.downColor": colors.red2,
                "mainSeriesProperties.hollowCandleStyle.borderColor":
                colors.teal,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor":
                colors.red2,
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                "volumePaneSize": "tiny"
            },
            custom_css_url: '/library/trading_view/custom_mobile_chart.css'
        };
        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {

            // Load saved chart
            this.loadSavedChart()
            this.syncIndicators()
            this.widget.applyOverrides({
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                "scalesProperties.lineColor": "#202C4C",
                'paneProperties.background': colors.onus,
                "paneProperties.vertGridProperties.color": colors.onus,
                "paneProperties.horzGridProperties.color": colors.onus,
            });
            this.setState({chartStatus: ChartStatus.LOADED});
            if (this.props.isVndcFutures) {
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.rawOrders();
                    this.firstTime = false;
                }, 2000);
            }
            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(this.saveChart, 5000);
        });
    };

    syncIndicators = () => {
        const currentStudies = this.widget.activeChart().getAllStudies();
        this.setState({
            ...this.state,
            mainIndicator: find(currentStudies, s => !!find(mainIndicators, {value: s.name})),
            subIndicator: find(currentStudies, s => !!find(subIndicators, {value: s.name})),
        })
    }

    render() {
        return (
            <>
                <div
                    className="relative flex flex-grow flex-col h-full bg-onus"
                    id="chart-container"
                >
                    <div
                        className={classNames(`absolute w-full h-full bg-bgSpotContainer dark:bg-onus flex justify-center items-center`, {
                            "hidden": this.state.chartStatus === ChartStatus.LOADED
                        })}
                    >
                        <IconLoading color="#00C8BC"/>
                    </div>
                    <div className="w-full border-b border-gray-4 dark:border-darkBlue-3 py-1 px-1 dragHandleArea">
                        <ChartOptions
                            pair={this.props.symbol}
                            pairConfig={this.props.pairConfig}
                            isVndcFutures={true}
                            resolution={this.state.interval}
                            setResolution={this.handleActiveTime}
                            isFullScreen={this.props.fullScreen}
                            chartType={this.state.priceChartType}
                            setChartType={this.handleChangeChartType}
                            showSymbol={this.props.showSymbol}
                            showIconGuide={this.props.showIconGuide}
                        />
                    </div>
                    <div
                        id={this.containerId}
                        className={`h-full`}
                    />
                    <div>
                        {
                            this.state.chartStatus === ChartStatus.LOADED &&
                            <IndicatorBars
                                setMainIndicator={this.handleChangeIndicator('main')}
                                setSubIndicator={this.handleChangeIndicator('sub')}
                                mainIndicator={this.state.mainIndicator?.name}
                                subIndicator={this.state.subIndicator?.name}
                                setCollapse={this.props.setCollapse}
                                collapse={this.props.collapse}
                            />
                        }
                    </div>
                    <div className="!w-32 cheat-watermark">
                        <NamiExchangeSvg color={colors.grey4}/>
                    </div>
                </div>
            </>
        );
    }
}

MobileTradingView.defaultProps = {
    symbol: "BTCUSDT",
    interval: "1",
    containerId: "nami-mobile-tv",
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/library/trading_view/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    showSymbol: true,
    showIconGuide: true,
    autosize: true,
    studies_overrides: {
        "volume.volume.color.0": "#03BBCC",
        "volume.volume.color.1": "#ff0065",
        "volume.volume ma.color": "#ff0065",
        "volume.volume ma.linewidth": 5,
        "volume.volume ma.visible": true,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7,
    },
};
