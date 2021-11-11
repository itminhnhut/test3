import { Listbox, Popover, Transition } from '@headlessui/react';
import {
    IconFullScreenChart,
    IconFullScreenChartDisable,
} from 'components/common/Icons';
import ChevronDown from 'components/svg/ChevronDown';
import find from 'lodash/find';
import * as React from 'react';
import { Component, Fragment } from 'react';
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
        const selectedTimeframeData = this.findTimeFrame(selectedTime);
        const isCommonTimeframe = find(
            CommonTimeframes,
            (e) => e.value === selectedTimeframeData?.value,
        );
        return (
            <div className="flex">
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
                                    <div className="overflow-hidden rounded-lg shadow-lg bg-white p-5">
                                        <div className="text-txtPrimary font-medium text-xs mb-4">
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
                                                                    ? 'border-teal text-teal'
                                                                    : 'border-gray-5 text-txtSecondary'
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
        const itemClass =
            'cursor-pointer text-xs font-medium py-1 px-2 mr-1 text-teal bg-teal bg-opacity-10 rounded-md';
        return (
            <div className="flex items-center">
                <span className={itemClass}>Original</span>
                <span className={itemClass}>TradingView</span>
                <span className={itemClass}>Depth</span>
                <button
                        type="button"
                        onClick={customChartFullscreen}
                        className="px-1"
                    >
                        {fullScreen ? (
                            <IconFullScreenChartDisable />
                        ) : (
                            <IconFullScreenChart />
                        )}
                    </button>
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
            <div
                className={`flex items-center justify-between w-full`}
            >
                {this._renderCommonTimeframes()}
                {this._renderChartMode()}
                
            </div>
        );
    }
}
