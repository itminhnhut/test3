import { getTradingViewTimezone } from 'actions/utils';
import { IconLoading } from 'components/common/Icons';
// import { widget } from 'public/library/trading_view/charting_library';
import * as React from 'react';
import { widget } from '../TradingView/charting_library/charting_library.min';
import Datafeed from './api';
import styles from './tradingview.module.scss';
import colors from '../../styles/colors'
import { getS3Url } from 'redux/actions/utils'
import NamiExchangeSvg from 'components/svg/NamiExchangeSvg'

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

const CONTAINER_ID = 'nami-tv';
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.symbol !== prevProps.symbol || this.props.chartSize !== prevProps.chartSize) {
            if (this.widget && this.state.chartStatus === ChartStatus.LOADED) {
                this.widget.setSymbol(this.props.symbol, this.state.interval, () => {
                    this.widget.applyOverrides({
                        'mainSeriesProperties.priceAxisProperties.autoScale': true,
                    });
                });
            } else {
                this.initWidget(this.props.symbol, this.state.interval);
            }
        }

        if (prevProps.theme !== this.props.theme) {
            const newTheme = this.props.theme === "dark" ? 'Dark' : 'Light';
            if (this.state.chartStatus === ChartStatus.LOADED && newTheme !== this.theme && this.widget) {
                this.widget.changeTheme(newTheme);
                this.widget.applyOverrides(
                    {
                        'paneProperties.background': newTheme === 'Dark' ? colors.darkBlue1 : colors.white,
                        'paneProperties.vertGridProperties.color': this.props.theme === "dark" ? colors.darkBlue3 : colors.grey4,
                        'paneProperties.horzGridProperties.color': this.props.theme === "dark" ? colors.darkBlue3 : colors.grey4,
                    })
                this.theme = newTheme;
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
        return `nami-tv__${CHART_VERSION}`;
    }

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save(data => {
                    // console.log('__ check save chart', data);
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
            theme: this.props.theme === 'dark' ? 'Dark' : 'Light',
            datafeed: Datafeed,
            interval: this.props.interval,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
                'use_localstorage_for_settings',
                'header_symbol_search',
                'symbol_search_hot_key',
                'header_settings',
                'control_bar',
                'timeframes_toolbar',
                'header_compare',
                'header_undo_redo',
                'compare_symbol',
                'border_around_the_chart',
                'header_screenshot',
                'volume_force_overlay',
            ],
            enabled_features: [
                'move_logo_to_main_pane',
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
            loading_screen: { backgroundColor: '#fff' },
            studies_overrides: {
                'volume.volume.color.0': colors.teal,
                'volume.volume.color.1': colors.red2,
                'volume.volume ma.color': colors.red2,
                'volume.volume ma.linewidth': 5,
                'volume.volume ma.visible': true,
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                'scalesProperties.fontSize': 10,
                'mainSeriesProperties.candleStyle.borderUpColor': colors.teal,
                'mainSeriesProperties.candleStyle.borderDownColor': colors.red2,
                'mainSeriesProperties.candleStyle.wickUpColor': colors.teal,
                'mainSeriesProperties.candleStyle.wickDownColor': colors.red2,
                'mainSeriesProperties.candleStyle.upColor': colors.teal,
                'mainSeriesProperties.candleStyle.downColor': colors.red2,
                'mainSeriesProperties.hollowCandleStyle.borderColor': colors.teal,
                'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red2,
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
                'volumePaneSize': 'small',
            },
            time_frames: [
                { text: '1m', resolution: '1', description: '1m' },
            ],
        };
        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);

        this.widget.onChartReady(() => {
            this.widget.applyOverrides({
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
                'paneProperties.background': this.props.theme === "dark" ? colors.darkBlue1 : '#ffffff',
                'paneProperties.vertGridProperties.color': this.props.theme === "dark" ? colors.darkBlue3 : colors.grey4,
                'paneProperties.horzGridProperties.color': this.props.theme === "dark" ? colors.darkBlue3 : colors.grey4,
            });
            this.setState({ chartStatus: ChartStatus.LOADED });
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
    }

    render() {
        const { chartType } = this.state;

        return (
            <>

                <div className="relative flex flex-grow flex-col min-w-max chartWrapper h-full" id="chart-container">
                    <div className={`absolute w-full h-full bg-bgContainer dark:bg-bgContainer-dark z-10 flex justify-center items-center ${this.state.chartStatus === ChartStatus.LOADED ? 'hidden' : ''}`}>
                        <IconLoading color="#09becf" />
                    </div>
                    <div
                        id={this.containerId}
                        className={`${styles.TVChartContainer} flex-grow h-full w-full  ${chartType === 'depth' && 'hidden'}`}
                    />
                    <div className="cheat-watermark">
                        <NamiExchangeSvg color={this.props.theme === 'dark' ? colors.grey4 : colors.darkBlue4}/>
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
    // libraryPath: '/library/trading_view/charting_library/',
    libraryPath: '/library/trading_view/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    time_frames: [
        { text: '1m', resolution: '1', description: '1m' },
    ],
    studies_overrides: {
        'volume.volume.color.0': '#03BBCC',
        'volume.volume.color.1': '#ff0065',
        'volume.volume ma.color': '#ff0065',
        'volume.volume ma.linewidth': 5,
        'volume.volume ma.visible': true,
        'bollinger bands.median.color': '#33FF88',
        'bollinger bands.upper.linewidth': 7,
    },
};
