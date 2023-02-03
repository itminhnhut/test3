import * as React from 'react';
import { IconLoading } from 'src/components/common/Icons';
import NamiExchangeSvg from 'src/components/svg/NamiExchangeSvg';
import { getTradingViewTimezone } from 'src/redux/actions/utils';
import colors from '../../styles/colors';
import { widget } from '../TradingView/charting_library/charting_library.min';
import Datafeed from './api';
import DepthChart from './depth';
import TimeFrame from './timeFrame';
import styles from './tradingview.module.scss';
import { ChartMode } from 'redux/actions/const';
import { VndcFutureOrderType } from '../screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { isMobile } from 'react-device-detect';
import { debounce } from 'lodash';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const CONTAINER_ID = 'nami-tv';
const CHART_VERSION = '1.0.6';
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4
};
// eslint-disable-next-line func-names
const SignalSupportTimeframes = ['1', '5', '15', '60'];
export class TVChartContainer extends React.PureComponent {
    containerId = `${CONTAINER_ID}-${this.props.symbol}`;

    state = {
        // active: true,
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: 'price',
        interval: '60',
        studies: [],
        priceChartType: 1,
        fullscreen: false
        // chartCompareLoaded: true,
    };

    widget = null;
    drawnOrder = {};
    drawnSl = {};
    drawnTp = {};
    intervalSaveChart = null;
    timer = null;
    firstTime = true;
    oldOrdersList = [];
    drawnHighLowArrows = {};

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        this.initWidget(this.props.symbol);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.symbol !== prevProps.symbol || this.props.chartSize !== prevProps.chartSize) {
            this.widget.remove();
            this.oldOrdersList = [];
            this.initWidget(this.props.symbol, this.state.interval);
        }

        if (prevProps.theme !== this.props.theme) {
            const newTheme = this.props.theme === 'dark' ? 'Dark' : 'Light';
            if (this.state.chartStatus === ChartStatus.LOADED && newTheme !== this.theme && this.widget) {
                setTimeout(() => {
                    this.widget.changeTheme(newTheme);
                }, 100);
                const isDark = this.props.theme === 'dark';
                this.widget.applyOverrides(this.overrides(isDark));
                this.theme = newTheme;
                this.drawHighLowArrows();
            }
        }
        if (prevProps.ordersList !== this.props.ordersList && !this.firstTime) {
            this.rawOrders();
        }
    }

    componentWillUnmount() {
        if (this?.widget) {
            this.widget.remove();
            this.widget = null;
        }
        clearInterval(this.intervalSaveChart);
    }

    handleActiveTime = (value) => {
        if (this?.widget) {
            this.widget.setSymbol(this.props.symbol, value, () => {
                // const to = new Date().getTime() / 1000;
                // const from = to - 24 * 60 * 60 * getMultiValue(value);
                // this.widget
                //     .activeChart()
                //     .setVisibleRange(
                //         { from, to },
                //         { applyDefaultRightMargin: true },
                //     )
                //     .then(() => {});
            });
            this.setState({ interval: value });
        }
    };

    handleCreateStudy = (studyId) => {
        if (this?.widget) {
            this.widget
                .activeChart()
                .createStudy(studyId, false, false, undefined)
                .then((id) => {
                    this.timeFrame.current.syncStudies(studyId, id);
                });
        }
    };

    handleRemoveStudy = (id) => {
        if (this?.widget) {
            this.widget.activeChart().removeEntity(id, {
                disableUndo: true
            });
        }
    };

    handleRemoveAllStudies = () => {
        if (this?.widget) {
            this.widget.activeChart().removeAllShapes();
            this.widget.activeChart().removeAllStudies();
        }
    };

    handleOpenStudty = () => {
        if (this?.widget) {
            this.widget.chart().executeActionById('insertIndicator');
            // this.widget.subscribe('study',(study) =>{
            //     const listStudies = this.widget.chart().getAllStudies()
            //     console.log(listStudies)
            // })
            //
            // this.widget.unsubscribe('study',{})
        }
    };

    handleFullScreen = (flag) => {
        const el = document.querySelector('#spot_containter_chart');
        if (el) {
            el.classList[flag ? 'add' : 'remove']('!fixed', '!inset-0', '!w-screen', '!h-screen', '!translate-x-0', '!translate-y-0', '!z-[9999999999]');
        }
        this.setState({ fullscreen: flag });
    };

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
        if (data) {
            const high = data.reduce((prev, current) => (prev[2] > current[2] ? prev : current));
            const low = data.reduce((prev, current) => (prev[3] < current[3] ? prev : current));
            // const base = this.props.symbol.includes('VNDC') ? this.props.symbol.replace('VNDC', '') : this.props.symbol.replace('USDT', '')

            const isDark = this.props?.theme === 'dark';

            const highArrow = this.widget
                .chart()
                .createExecutionShape({ disableUndo: false })
                .setPrice(high[2])
                .setTime(high[0])
                .setDirection('sell')
                // .setText(formatPrice(high[2], this.props.exchangeConfig, base).toString())
                .setText(high[2].toString())
                // .setTooltip(formatPrice(high[2], this.props.exchangeConfig, base).toString())
                .setTooltip(high[2].toString())
                .setArrowColor(!isDark ? colors.darkBlue2 : colors.grey4)
                .setTextColor(!isDark ? colors.darkBlue2 : colors.grey4)
                .setArrowHeight(7);
            const lowArrow = this.widget
                .chart()
                .createExecutionShape({ disableUndo: false })
                .setPrice(low[3])
                .setTime(low[0])
                .setDirection('buy')
                // .setText(formatPrice(low[3], this.props.exchangeConfig, base).toString())
                .setText(low[3].toString())
                // .setTooltip(formatPrice(low[3], this.props.exchangeConfig, base).toString())
                .setTooltip(low[3].toString())
                .setArrowColor(!isDark ? colors.darkBlue2 : colors.grey4)
                .setTextColor(!isDark ? colors.darkBlue2 : colors.grey4)
                .setArrowHeight(7);

            this.drawnHighLowArrows = { highArrow, lowArrow };
        }
    }, 100);

    handleChangeChartType = (type) => {
        if (this?.widget) {
            this.widget.chart().setChartType(type);
            this.setState({ priceChartType: type });
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
                const symbol = this.props.symbol;
                const data = JSON.parse(savedChart);
                if (typeof data === 'object' && data[`chart_${symbol.toLowerCase()}`]) {
                    this.widget.load(data[`chart_${symbol.toLowerCase()}`]);
                }
            } catch (err) {
                console.error('Load chart error', err);
            }
        }
    };

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save((data) => {
                    let currentData = localStorage.getItem(this.getChartKey);
                    if (currentData) {
                        try {
                            currentData = JSON.parse(currentData);
                            if (typeof currentData !== 'object') {
                                currentData = null;
                            }
                        } catch (ignored) {
                            currentData = null;
                        }
                    }
                    if (!currentData) {
                        currentData = {
                            created_at: new Date()
                        };
                    }

                    const obj = {
                        updated_at: new Date(),
                        [`chart_${this.props.symbol.toLowerCase()}`]: data,
                        chart_all: data
                    };
                    localStorage.setItem(this.getChartKey, JSON.stringify(Object.assign(currentData, obj)));
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
        try {
            const color = this.getOrderType(order).startsWith('BUY') ? colors.teal : colors.red2;
            const colorSl = colors.red2;
            const colorTp = colors.teal;
            const line = this.widget
                .chart()
                .createOrderLine()
                .onModify(() => {})
                .setText(`${!isMobile ? '#' + this.getTicket(order) : ''} ${this.getOrderType(order)} ${order?.quantity}`)
                .setPrice(order?.open_price || order?.price)
                .setQuantity(null)
                .setTooltip(`${this.getOrderType(order)} ${order?.quantity} ${order?.symbol} at price ${order?.open_price}`)
                .setEditable(false)
                .setLineColor(color)
                .setBodyBorderColor(color)
                .setBodyTextColor(color)
                .setQuantityBackgroundColor(color)
                .setQuantityBorderColor(color)
                .setLineLength(120)
                .setBodyBackgroundColor('rgba(0,0,0,0)')
                .setBodyBorderColor('rgba(0,0,0,0)')
                .setCancelButtonBorderColor('rgb(255,0,0)')
                .setCancelButtonBackgroundColor('rgb(0,255,0)')
                .setCancelButtonIconColor('rgb(0,0,255)');
            line.setBodyFont(this.toNormalText(line));
            this.drawnOrder[displayingId] = line;
            if (order.sl > 0) {
                const lineSl = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`${!isMobile ? '#' + this.getTicket(order) : ''} sl ${order.sl}`)
                    .setPrice(order.sl)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorSl)
                    .setBodyTextColor(colorSl)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineStyle(1);
                lineSl.setBodyFont(this.toNormalText(lineSl));
                this.drawnSl[displayingId] = lineSl;
            }
            if (order.tp > 0) {
                const lineTp = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`${!isMobile ? '#' + this.getTicket(order) : ''} tp ${order.tp}`)
                    .setPrice(order.tp)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorTp)
                    .setBodyTextColor(colorTp)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineStyle(1);
                lineTp.setBodyFont(this.toNormalText(lineTp));
                this.drawnTp[displayingId] = lineTp;
            }
            return line;
        } catch (err) {
            // console.error('__ err', err);
        }
    }

    rawOrders = async () => {
        const _ordersList = this.props.ordersList?.filter((order) => order?.symbol === this.props.symbol);
        if (!_ordersList) return;
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
                this.newOrder(itemEdited.displaying_id, itemEdited);
                localStorage.removeItem('edited_id');
            }
        }
        const newDataOrders = _ordersList.filter(
            (order) =>
                (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) &&
                !this.oldOrdersList.find((id) => order.displaying_id === id)
        );
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
            });
        }
        this.oldOrdersList = this.props?.ordersList.map(
            (order) => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && order.displaying_id
        );
    };

    overrides = (isDark) => {
        return {
            'mainSeriesProperties.priceAxisProperties.autoScale': true,
            'scalesProperties.lineColor': isDark ? colors.dark.dark : colors.white,
            'scalesProperties.textColor': isDark ? colors.darkBlue5 : colors.primary,
            'scalesProperties.fontSize': 10,
            'paneProperties.background': isDark ? colors.dark.dark : colors.white,
            'paneProperties.vertGridProperties.color': isDark ? colors.dark.dark : colors.white,
            'paneProperties.horzGridProperties.color': isDark ? 'rgba(34, 41, 64, 0.5)' : colors.grey4
        };
    };

    initWidget = (symbol, interval) => {
        if (!symbol) return;
        const isDark = this.props.theme === 'dark';

        const datafeed = new Datafeed(this.props.mode || ChartMode.SPOT);
        const widgetOptions = {
            symbol,
            theme: this.props.theme === 'dark' ? 'Dark' : 'Light',
            datafeed,
            interval: this.props.interval,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: 'en',
            disabled_features: [
                'compare_symbol',
                'display_market_status',
                'go_to_date',
                'volume_force_overlay',
                'header_interval_dialog_button',
                'header_settings',
                'source_selection_markers',
                'header_symbol_search',
                'header_compare',
                'header_undo_redo',
                'symbol_info',
                'source_selection_markers',
                'popup_hints',
                'header_widget',
                'axis_pressed_mouse_move_scale'
            ],
            enabled_features: ['move_logo_to_main_pane', 'edit_buttons_in_legend', 'hide_left_toolbar_by_default'],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            // fullscreen: this.state.fullscreen,
            autosize: true,
            loading_screen: { backgroundColor: this.props.theme === 'dark' ? colors.dark : '#fff' },
            studies_overrides: {
                'volume.volume.color.1': colors.teal,
                'volume.volume.color.0': colors.red2,
                'volume.volume ma.color': colors.red2,
                'volume.volume ma.linewidth': 5,
                'volume.volume ma.visible': true
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                'scalesProperties.fontSize': 10,
                editorFontsList: ['Barlow', 'Sans'],
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
                volumePaneSize: 'small',
                'mainSeriesProperties.candleStyle.borderUpColor': colors.teal,
                'mainSeriesProperties.candleStyle.borderDownColor': colors.red2,
                'mainSeriesProperties.candleStyle.wickUpColor': colors.teal,
                'mainSeriesProperties.candleStyle.wickDownColor': colors.red2,
                'mainSeriesProperties.candleStyle.upColor': colors.teal,
                'mainSeriesProperties.candleStyle.downColor': colors.red2,
                'mainSeriesProperties.hollowCandleStyle.borderColor': colors.teal,
                'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red2
            },
            time_frames: [{ text: '1h', resolution: '60', description: '1h' }]
        };
        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {
            // Load saved chart
            this.loadSavedChart();
            this.handleActiveTime(60);
            this.widget.applyOverrides(this.overrides(isDark));
            this.setState({ chartStatus: ChartStatus.LOADED });
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.rawOrders();
                this.drawHighLowArrows();
                this.firstTime = false;
                this.widget
                    .chart()
                    .onVisibleRangeChanged()
                    .subscribe({}, () => {
                        this.drawHighLowArrows();
                    });
            }, 2000);
            setTimeout(() => {
                this.drawHighLowArrows();
                this.widget
                    .chart()
                    .onVisibleRangeChanged()
                    .subscribe({}, () => {
                        this.drawHighLowArrows();
                    });
            }, 1000);
            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(() => this.saveChart(), 5000);
        });
    };

    handleChartType = () => {
        const { chartType } = this.state;
        if (chartType === 'price') {
            return this.setState({ chartType: 'depth' });
        }
        return this.setState({ chartType: 'price' });
    };

    render() {
        const { chartType } = this.state;
        const { isPro } = this.props;

        return (
            <>
                <div className="relative flex flex-grow flex-col min-w-max chartWrapper h-full" id="chart-container">
                    <div
                        className={`absolute w-full h-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark flex justify-center items-center ${
                            this.state.chartStatus === ChartStatus.LOADED ? 'hidden' : ''
                        }`}
                    >
                        <Spiner isDark />
                    </div>
                    <div className={`w-full border-b border-gray-4 dark:border-divider-dark pt-6 pb-3 px-4 dragHandleArea ${isPro ? 'pl-6' : ''}`}>
                        {this.state.chartStatus === ChartStatus.LOADED && (
                            <TimeFrame
                                symbol={this.props.symbol}
                                handleActiveTime={this.handleActiveTime}
                                chartType={chartType}
                                widget={this.widget}
                                handleChartType={this.handleChartType}
                                ref={this.timeFrame}
                                handleCreateStudy={this.handleCreateStudy}
                                handleRemoveStudy={this.handleRemoveStudy}
                                handleRemoveAllStudies={this.handleRemoveAllStudies}
                                handleOpenStudty={this.handleOpenStudty}
                                handleChangeChartType={this.handleChangeChartType}
                                interval={this.state.interval}
                                studies={this.state.studies}
                                isOnSidebar={this.props.isOnSidebar}
                                t={this.t}
                                initTimeFrame={this.props.initTimeFrame}
                                extendsIndicators={this.props.extendsIndicators}
                                priceChartType={this.state.priceChartType}
                                clearExtendsIndicators={this.props.clearExtendsIndicators}
                                isVndcFutures={this.props.isVndcFutures}
                                reNewComponentKey={this.props.reNewComponentKey}
                                fullscreen={this.state.fullscreen}
                                handleFullScreen={this.handleFullScreen}
                            />
                        )}
                    </div>

                    <div id={this.containerId} className={`${styles.TVChartContainer} flex-grow h-full w-full  ${chartType === 'depth' && 'hidden'}`} />
                    {chartType === 'depth' && <DepthChart symbol={this.props.symbol} chartSize={this.props.chartSize} darkMode={this.props.theme === 'dark'} />}
                    <div className="cheat-watermark">
                        <NamiExchangeSvg color={this.props.theme === 'dark' ? colors.grey4 : colors.darkBlue4} />
                    </div>
                </div>
            </>
        );
    }
}

TVChartContainer.defaultProps = {
    symbol: 'BTCUSDT',
    interval: '1',
    containerId: 'tv_chart_container',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/library/trading_view/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    time_frames: [{ text: '1h', resolution: '60', description: '1h' }]
};
