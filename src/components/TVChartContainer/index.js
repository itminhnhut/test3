import * as React from 'react';
import { widget } from 'public/static/charting_library';
import { getTradingViewTimezone } from 'actions/utils';

import {
    BOLLNami,
    EMANami,
    MANami,
    MACDNami,
    VWAPNami,
    WMANami,
} from 'src/components/TVChartContainer/studies';
import SymbolDetail from 'components/trade/SymbolDetail';
import styles from './tradingview.module.scss';
import Datafeed from './api';
import TimeFrame from './timeFrame';
import DepthChart from './depth';

function getLanguageFromURL() {
    // const regex = new RegExp('[\\?&]lang=([^&#]*)');
    // const results = regex.exec(window.location.search);
    // return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    const { pathname } = window.location;
    if (pathname.includes('/en/')) {
        return 'en';
    }
    return 'vi';
}

function getMultiValue(time) {
    switch (time) {
        case '1':
            return 0.2;
        case '5':
            return 0.625;
        case '15':
            return 0.875;
        case '30':
            return 0.875;
        case '60':
            return 3;
        case '240':
            return 7;
        case '1D':
            return 60;
        case '1W':
            return 180;
        case '1M':
            return 365 * 3;
        default:
            return 3;
    }
}

const CONTAINER_ID = 'attlas-chart';
const CHART_VERSION = '1.0.6';
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4,
};
// eslint-disable-next-line func-names

export class TVChartContainer extends React.PureComponent {
    containerId = `${CONTAINER_ID}-${this.props.symbol}`;

    state = {
        // active: true,
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: 'price',
        interval: '60',
        studies: [],
        // chartCompareLoaded: true,
    };

    tvWidget = null;

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        this.initWidget(this.props.symbol);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props.symbol !== prevProps.symbol) {
    //         this.initWidget(this.props.symbol);
    //     }
    // }

    // setChartSymbol = (symbol) => {
    //     if (this.widget && this.state.chartStatus === ChartStatus.LOADED) {
    //         this.widget.remove();
    //         this.setState({ chartStatus: ChartStatus.NOT_LOADED });
    //         this.initWidget(symbol);
    //     }
    // };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.symbol !== prevProps.symbol || this.props.chartSize !== prevProps.chartSize) {
            if (this.widget && this.state.chartStatus === ChartStatus.LOADED) {
                // this.widget.remove();
                // this.setState({ chartStatus: ChartStatus.NOT_LOADED });
                // this.initWidget(this.props.symbol, this.state.interval);
                this.widget.setSymbol(this.props.symbol, this.state.interval, () => {
                    this.widget.applyOverrides({
                        'mainSeriesProperties.priceAxisProperties.autoScale': true,
                    });
                });
            } else {
                this.initWidget(this.props.symbol, this.state.interval);
            }
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
                const to = new Date().getTime() / 1000;
                const from = to - 24 * 60 * 60 * getMultiValue(value);
                this.widget
                    .activeChart()
                    .setVisibleRange(
                        { from, to },
                        { applyDefaultRightMargin: true })
                    .then(() => {});
            });
            this.setState({ interval: value });
        }
    }

    handleCreateStudy = (studyId) => {
        if (this?.widget) {
            this.widget.activeChart().createStudy(studyId, false, false)
                .then(id => {
                    this.timeFrame.current.syncStudies(studyId, id);
                });
        }
    }

    handleRemoveStudy = (id) => {
        if (this?.widget) {
            this.widget.activeChart().removeEntity(id, {
                disableUndo: true,
            });
        }
    }

    handleRemoveAllStudies = () => {
        if (this?.widget) {
            this.widget.activeChart().removeAllShapes();
            this.widget.activeChart().removeAllStudies();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    get getChartKey() {
        return `attlas-chart__${CHART_VERSION}`;
    }

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save(data => {
                    let currentData = localStorage.getItem(this.getChartKey);
                    if (currentData) {
                        try {
                            currentData = JSON.parse(currentData);
                            if (typeof currentData !== 'object') currentData = null;
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
                        'chart_all': data,
                    };
                    localStorage.setItem(this.getChartKey, JSON.stringify(Object.assign(currentData, obj)));
                });
            }
        } catch (err) {
            console.error('Save chart error', err);
        }
    }

    initWidget = (symbol, interval) => {
        if (!symbol) return;
        const widgetOptions = {
            symbol,
            datafeed: Datafeed,
            interval: this.props.interval,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
                'compare_symbol',
                'display_market_status',
                'go_to_date',
                'volume_force_overlay',
                'header_interval_dialog_button',
                'header_settings',
                // 'timeframes_toolbar',
                'source_selection_markers',
                'header_symbol_search',
                'header_compare',
                'header_undo_redo',
                'symbol_info',
                'source_selection_markers',
                'popup_hints',
                'header_widget',
                'axis_pressed_mouse_move_scale',
                // 'main_series_scale_menu',
                // 'show_chart_property_page'
                // 'context_menus',
            ],
            enabled_features: [
                'edit_buttons_in_legend',
                // 'use_localstorage_for_settings',
                // 'study_templates'
            ],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: true,
            studies_overrides: this.props.studiesOverrides,
            timezone: getTradingViewTimezone(),
            overrides: {
                'mainSeriesProperties.candleStyle.upColor': '#12B886',
                'mainSeriesProperties.candleStyle.downColor': '#FA5252',
                'mainSeriesProperties.hollowCandleStyle.borderColor': '#12B886',
                'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#FA5252',
                'volumePaneSize': 'small',
                'scalesProperties.fontSize': 11,
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
            },
            custom_indicators_getter(PineJS) {
                return Promise.resolve([
                    MANami(PineJS),
                    EMANami(PineJS),
                    WMANami(PineJS),
                    BOLLNami(PineJS),
                    VWAPNami(PineJS),
                    MACDNami(PineJS),
                ]);
            },
            time_frames: [],
        };
        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {
            // Load saved data
            const savedChart = localStorage.getItem(this.getChartKey);
            // console.log('__ saved chart data', savedChart);
            if (savedChart) {
                try {
                    const data = JSON.parse(savedChart);
                    if (typeof data === 'object' && data[`chart_${symbol.toLowerCase()}`]) {
                    // if (typeof data === 'object' && data.chart_all) {
                        this.widget.load(data[`chart_${symbol.toLowerCase()}`]);
                    } else {
                        this.handleCreateStudy('Moving Average Exponential Nami');
                    }
                } catch (err) {
                    console.error('Load chart error', err);
                }
            } else {
                this.handleCreateStudy('Moving Average Exponential Nami');
            }
            this.widget.applyOverrides({
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
            });

            this.setState({ chartStatus: ChartStatus.LOADED });
            // setTimeout(this.drawOrderAfterChartLoaded, 1000)

            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(() => this.saveChart(), 5000);

            this.widget.subscribe('study_event', (studyId, eventType) => {
                if (eventType === 'remove') {
                    this.timeFrame.current.syncStudies();
                }
            });

            this.widget.subscribe('study', (studyId, eventType) => {
                this.saveChart();
            });

            this.widget.subscribe('mouse_down', () => {
                this.timeFrame?.current?.setOpen(false);
            });

            this.widget.setSymbol(this.props.symbol, this.state.interval, () => {
                const to = new Date().getTime() / 1000;
                const from = to - 24 * 60 * 60 * getMultiValue(this.state.interval);

                this.widget
                    .activeChart()
                    .setVisibleRange(
                        { from, to },
                        { applyDefaultRightMargin: true });
            });
        });
    };

    handleChartType = () => {
        const { chartType } = this.state;
        if (chartType === 'price') {
            return this.setState({ chartType: 'depth' });
        }
        return this.setState({ chartType: 'price' });
    }

    render() {
        const { chartType } = this.state;
        return (
            <>
                <div className={`${this.props.fullScreen ? 'flex items-center py-6 -mb-4' : ''}`}>
                    <SymbolDetail
                        symbol={this.props.symbol}
                        isOnSidebar={this.props.isOnSidebar}
                        changeSymbolList={this.props.changeSymbolList}
                        watchList={this.props.watchList}
                        favorite={this.props.favorite}
                        parentCallback={this.props.parentCallback}
                        fullScreen={this.props.fullScreen}
                    />
                    <div className="w-full">
                        {
                            this.state.chartStatus === ChartStatus.LOADED ? <TimeFrame
                                handleActiveTime={this.handleActiveTime}
                                chartType={chartType}
                                widget={this.widget}
                                handleChartType={this.handleChartType}
                                ref={this.timeFrame}
                                handleCreateStudy={this.handleCreateStudy}
                                handleRemoveStudy={this.handleRemoveStudy}
                                handleRemoveAllStudies={this.handleRemoveAllStudies}
                                interval={this.state.interval}
                                studies={this.state.studies}
                                isOnSidebar={this.props.isOnSidebar}
                                t={this.t}
                                initTimeFrame={this.props.initTimeFrame}
                                extendsIndicators={this.props.extendsIndicators}
                                clearExtendsIndicators={this.props.clearExtendsIndicators}
                                customChartFullscreen={this.props.customChartFullscreen}
                                fullScreen={this.props.fullScreen}
                            /> : (
                                <div className="h-[46px]" />
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-grow flex-col min-w-max chartWrapper h-full" id="chart-container">
                    <div
                        id={this.containerId}
                        className={`${styles.TVChartContainer} flex-grow h-full w-full  ${chartType === 'depth' && 'hidden'}`}
                    />
                    {chartType === 'depth' && <DepthChart symbol={this.props.symbol} chartSize={this.props.chartSize} />}
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
    libraryPath: '/static/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    time_frames: [
        { text: '1m', resolution: '1', description: '1m' },
    ],
    studiesOverrides: {},
};
