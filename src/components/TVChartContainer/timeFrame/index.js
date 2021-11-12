import { Listbox, Popover, Transition } from '@headlessui/react';
import {
    IconFullScreenChart,
    IconFullScreenChartDisable,
} from 'components/common/Icons';
import ChevronDown from 'components/svg/ChevronDown';
import Candles from 'components/svg/Candles';
import Activity from 'components/svg/Activity';
import find from 'lodash/find';
import * as React from 'react';
import { Component, Fragment } from 'react';
import colors from 'styles/colors';
import locale_vi from './locale_vi';

const ListTimeFrame = [
    { value: '1', text: '1m' },
    { value: '5', text: '5m' },
    { value: '15', text: '15m' },
    { value: '30', text: '30m' },
    { value: '60', text: '1h' },
    { value: '240', text: '4h' },
    { value: '1D', text: '1D' },
    { value: '1W', text: '1W' },
    { value: '1M', text: '1M' },
];

const BarsChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="24"
        height="24"
    >
        <g fill="none" stroke="currentColor" strokeLinecap="square">
            <path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20" />
        </g>
    </svg>
);
const CandleChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="24"
        height="24"
        fill="currentColor"
    >
        <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" />
        <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z" />
        <path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z" />
        <path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z" />
    </svg>
);
const AreaChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="24"
        height="24"
    >
        <path
            fill="currentColor"
            d="M11.982 16.689L17.192 12h3.033l4.149-4.668-.748-.664L19.776 11h-2.968l-4.79 4.311L9 12.293l-4.354 4.353.708.708L9 13.707z"
        />
    </svg>
);
const LineChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="24"
        height="24"
    >
        <path
            fill="currentColor"
            d="M11.982 16.689L17.192 12h3.033l4.149-4.668-.748-.664L19.776 11h-2.968l-4.79 4.311L9 12.293l-4.354 4.353.708.708L9 13.707z"
        />
    </svg>
);
const BaseLineChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="24"
        height="24"
    >
        <g fill="none" stroke="currentColor">
            <path strokeDasharray="1,1" d="M4 14.5h22" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 12.5l2-4 1 2 2-4 3 6"
            />
            <path strokeLinecap="round" d="M5.5 16.5l-1 2" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.5 16.5l2 4 2-4m2-4l1-2-1 2z"
            />
        </g>
    </svg>
);

const DefaultChartType = { type: 'Candle', value: 1, icon: CandleChart };
const ListChartType = [
    { type: 'Bar', value: 0, icon: BarsChart },
    { type: 'Candle', value: 1, icon: CandleChart },
    { type: 'Line', value: 2, icon: LineChart },
    { type: 'Area', value: 3, icon: AreaChart },
    { type: 'Base Line', value: 10, icon: BaseLineChart },
];

const fastIndicators = {
    primary: [
        {
            id: 'Moving Average Nami',
            alias: 'MA',
        },
        {
            id: 'Moving Average Exponential Nami',
            alias: 'EMA',
        },
        {
            id: 'Moving Average Weighted Nami',
            alias: 'WMA',
        },
        {
            id: 'Bollinger Bands Nami',
            alias: 'BOLL',
        },
        {
            id: 'VWAP Nami',
            alias: 'VWAP',
        },
    ],
    secondary: [
        {
            id: 'Volume',
            alias: 'VOL',
        },
        {
            id: 'MACD Nami',
            alias: 'MACD',
        },
        {
            id: 'Relative Strength Index',
            alias: 'RSI',
        },
        {
            id: 'On Balance Volume',
            alias: 'OBV',
        },
        {
            id: 'Commodity Channel Index',
            alias: 'CCI',
        },
        {
            id: 'Stochastic RSI',
            alias: 'StochRSI',
        },
        {
            id: 'Williams %R',
            alias: 'WR',
        },
        {
            id: 'Directional Movement',
            alias: 'DMI',
        },
        {
            id: 'Momentum',
            alias: 'MTM',
        },
        {
            id: 'Ease Of Movement',
            alias: 'EMV',
        },
    ],
};

export default class TimeFrame extends Component {
    state = {
        selectedTime: '60',
        activeStudiesMap: new Map(),
        search: '',
        openPopover: false,
    };

    constructor(props) {
        super(props);
        this.indicatorBtn = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        this.syncStudies();
        const { initTimeFrame } = this.props;

        this.updateTimeFrame(initTimeFrame);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            initTimeFrame,
            extendsIndicators,
            clearExtendsIndicators,
            handleRemoveAllStudies,
        } = this.props;
        if (initTimeFrame && initTimeFrame !== prevProps.initTimeFrame) {
            this.updateTimeFrame(this.props.initTimeFrame);
        }

        const extend =
            fastIndicators.primary.filter(
                (fastIndicator) => fastIndicator.alias === extendsIndicators,
            )?.[0] ||
            fastIndicators.secondary.filter(
                (fastIndicator) => fastIndicator.alias === extendsIndicators,
            )?.[0];

        if (extendsIndicators && extend) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ activeStudiesMap: new Map() }, () => {
                handleRemoveAllStudies();
                this.toggleFastStudy(extend.id);
            });
        }

        clearExtendsIndicators();
    }

    updateTimeFrame = (initTimeFrame) => {
        const { chartType, handleActiveTime } = this.props;

        if (chartType === 'price') {
            if (handleActiveTime && typeof handleActiveTime === 'function') {
                if (initTimeFrame.length > 0) {
                    let initTime = '60';
                    switch (initTimeFrame) {
                        case '1h': {
                            initTime = '60';
                            break;
                        }
                        case '4h': {
                            initTime = '240';
                            break;
                        }
                        case '1d': {
                            initTime = '1D';
                            break;
                        }
                        case '1w': {
                            initTime = '1W';
                            break;
                        }
                        default:
                            break;
                    }
                    this.setState({ selectedTime: initTime });
                    handleActiveTime(initTime);
                }
            }
        }
    };

    setActiveTime = (value) => {
        const { chartType, handleActiveTime } = this.props;

        if (chartType === 'price') {
            if (handleActiveTime && typeof handleActiveTime === 'function') {
                this.setState({ selectedTime: value });
                handleActiveTime(value);
            }
        }
    };

    setOpen = (open) => {
        this.setState({ openPopover: open });
    };

    toggleFastStudy = (studyId) => {
        const { handleCreateStudy, handleRemoveStudy } = this.props;
        const haveStudy = this.state.activeStudiesMap.get(studyId);
        if (haveStudy) {
            if (handleRemoveStudy && typeof handleRemoveStudy === 'function') {
                handleRemoveStudy(haveStudy);
            }
        } else {
            if (handleCreateStudy && typeof handleCreateStudy === 'function') {
                handleCreateStudy(studyId);
            }
        }
    };

    syncStudies = (studyId = '', id = '') => {
        if (studyId && id) {
            this.setState((prevState) => ({
                activeStudiesMap: prevState.activeStudiesMap.set(studyId, id),
            }));
        } else {
            const { widget } = this.props;
            this.setState({ activeStudiesMap: new Map() });
            const currentStudies = widget.activeChart().getAllStudies();
            currentStudies.forEach((e) => {
                this.setState((prevState) => ({
                    activeStudiesMap: prevState.activeStudiesMap.set(
                        e.name,
                        e.id,
                    ),
                }));
            });
        }
    };

    checkAcronym = (str = '', stringSearch = '') => {
        if (!stringSearch) return true;
        if (str) {
            const matches = str.match(/\b(\w)/g);
            if (
                matches
                    .join('')
                    .toLowerCase()
                    .includes(stringSearch.toLowerCase()) ||
                str.toLowerCase().includes(stringSearch.toLowerCase())
            ) {
                return true;
            }
        }
        return false;
    };

    findTimeFrame = (value) => {
        return find(ListTimeFrame, (e) => e.value === value) || {};
    };

    createStudy = (studyId) => {
        const { handleCreateStudy } = this.props;
        if (handleCreateStudy && typeof handleCreateStudy === 'function') {
            handleCreateStudy(studyId);
        }
    };

    _renderCommonTimeframes() {
        const CommonTimeframes = [
            { value: '15', text: '15m' },
            { value: '60', text: '1h' },
            { value: '240', text: '4h' },
            { value: '1D', text: '1D' },
            { value: '1W', text: '1W' },
        ];

        const { selectedTime } = this.state;
        const { priceChartType } = this.props;

        const selectedPriceChartType = find(ListChartType, (e) => e.value === priceChartType) || DefaultChartType;

        const selectedTimeframeData = this.findTimeFrame(selectedTime);
        const isCommonTimeframe = find(
            CommonTimeframes,
            (e) => e.value === selectedTimeframeData?.value,
        );
        return (
            <div className="flex items-center">
                {CommonTimeframes.map((item) => {
                    const { value, text } = item;
                    const isActive = value == selectedTime;
                    return (
                        <span
                            key={value}
                            onClick={() => this.setActiveTime(value)}
                            className={`cursor-pointer text-xs font-medium py-1 px-2 mr-1 rounded-md hover:text-teal ${
                                isActive
                                    ? 'bg-teal bg-opacity-10 text-teal'
                                    : 'text-txtSecondary'
                            }`}
                        >
                            {text}
                        </span>
                    );
                })}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`h-full flex items-center ${
                                    open ? '' : 'text-opacity-90'
                                } text-white group px-2`}
                            >
                                {!isCommonTimeframe && (
                                    <span className="cursor-pointer text-xs font-medium py-1 mr-1 text-teal">
                                        {selectedTimeframeData.text}
                                    </span>
                                )}
                                <ChevronDown
                                    className={`${
                                        open ? '' : 'text-opacity-70'
                                    } group-hover:text-opacity-80 transition ease-in-out duration-150`}
                                    aria-hidden="true"
                                />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10">
                                    <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkBlue-3 p-5">
                                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-xs mb-4">
                                            Select intervals
                                        </div>
                                        <div className="w-64 relative grid grid-cols-4 gap-2">
                                            {ListTimeFrame.map(
                                                (item, index) => {
                                                    const { value, text } =
                                                        item;
                                                    const isActive =
                                                        value === item;
                                                    return (
                                                        <div
                                                            onClick={() => this.setActiveTime(
                                                                value,
                                                            )}
                                                            key={index}
                                                            className={`cursor-pointer w-full h-5 border font-medium text-xs text-center rounded-sm hover:text-teal hover:border-teal-50 ${
                                                                isActive
                                                                    ? 'border-teal text-teal dark:border-teal dark:text-teal'
                                                                    : 'border-gray-5  text-txtSecondary dark:text-txtSecondary-dark dark:border-darkBlue-5'
                                                            }`}
                                                        >
                                                            {text}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`h-full flex items-center ${
                                    open ? '' : 'text-opacity-90'
                                } text-white group px-2`}
                            >
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {selectedPriceChartType.icon}
                                </span>

                                {/* <Candles
                                    className="mx-2 cursor-pointer"
                                    color={colors.darkBlue5}
                                    fill={colors.darkBlue5}
                                    size={20}
                                /> */}
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10">
                                    <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkBlue-3">
                                        <div className="w-32 relative">
                                            {ListChartType.map(
                                                (item, index) => {
                                                    const {
                                                        type,
                                                        value,
                                                        icon,
                                                    } = item;

                                                    const isActive = selectedPriceChartType.value === value;
                                                    return (
                                                        <div
                                                            onClick={() => this.props.handleChangeChartType(value)}
                                                            key={index}
                                                            className={
                                                                `h-8 px-2 flex content-start items-center cursor-pointer w-full font-medium text-xs text-center rounded-sm 
                                                                text-txtSecondary dark:text-txtSecondary-dark 
                                                                hover:text-teal 
                                                                dark:hover:text-teal
                                                                ${isActive ? 'bg-opacity-10 dark:bg-opacity-10 bg-teal text-teal dark:bg-teal dark:text-teal' : ''}
                                                                `
                                                            }
                                                        >
                                                            {icon}
                                                            <span className="ml-2">{type}</span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <Activity
                    className="mx-2 cursor-pointer"
                    color={colors.darkBlue5}
                    size={20}
                    onClick={() => this.props.handleOpenStudty()}
                />
            </div>
        );
    }

    _renderChartMode() {
        const {
            chartType,
            handleChartType,
            widget,
            isOnSidebar,
            customChartFullscreen,
            fullScreen,
        } = this.props;
        const itemClass = 'cursor-pointer text-xs font-medium py-1 px-2 mr-1 text-teal  rounded-md';
        const activeClass = 'bg-teal bg-opacity-10 text-teal';
        return (
            <div className="flex items-center">
                {/* <span className={`${itemClass} ${activeClass}`}>Original</span> */}
                <span onClick={chartType !== 'price' ? handleChartType : null} className={`${itemClass} ${chartType === 'price' ? activeClass : ''}`}>{this.t('common:price')}</span>
                <span onClick={chartType === 'price' ? handleChartType : null} className={`${itemClass} ${chartType === 'depth' ? activeClass : ''}`}>{this.t('common:depth')}</span>
                {/* <button
                    type="button"
                    onClick={customChartFullscreen}
                    className="px-1"
                >
                    {fullScreen ? (
                        <IconFullScreenChartDisable />
                    ) : (
                        <IconFullScreenChart />
                    )}
                </button> */}
            </div>
        );
    }

    render() {
        const {
            chartType,
            handleChartType,
            widget,
            isOnSidebar,
            customChartFullscreen,
            fullScreen,
        } = this.props;

        const { selectedTime } = this.state;
        const studiesList = widget?.getStudiesList() || [];
        const language = 'en';
        const indicators = studiesList.map((e) => ({
            id: e,
            label: language === 'vi' ? locale_vi[`${e}_study`] || e : e,
        }));

        return (
            <div className="flex items-center justify-between w-full bg-bgContainer dark:bg-bgContainer-dark">
                {this._renderCommonTimeframes()}
                {this._renderChartMode()}
            </div>
        );
    }
}
