import * as React from 'react';
import { Component, Fragment } from 'react';
import { IconFullScreenChart, IconFullScreenChartDisable, IconIndicator, IconSearch } from 'components/common/Icons';
import { Listbox, Popover, Transition } from '@headlessui/react';
import find from 'lodash/find';
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
        }, {
            id: 'Moving Average Exponential Nami',
            alias: 'EMA',
        }, {
            id: 'Moving Average Weighted Nami',
            alias: 'WMA',
        }, {
            id: 'Bollinger Bands Nami',
            alias: 'BOLL',
        }, {
            id: 'VWAP Nami',
            alias: 'VWAP',
        }],
    secondary: [
        {
            id: 'Volume',
            alias: 'VOL',
        }, {
            id: 'MACD Nami',
            alias: 'MACD',
        }, {
            id: 'Relative Strength Index',
            alias: 'RSI',
        }, {
            id: 'On Balance Volume',
            alias: 'OBV',
        }, {
            id: 'Commodity Channel Index',
            alias: 'CCI',
        }, {
            id: 'Stochastic RSI',
            alias: 'StochRSI',
        }, {
            id: 'Williams %R',
            alias: 'WR',
        }, {
            id: 'Directional Movement',
            alias: 'DMI',
        }, {
            id: 'Momentum',
            alias: 'MTM',
        }, {
            id: 'Ease Of Movement',
            alias: 'EMV',
        }],
};

export default class TimeFrame extends Component {
    state = ({
        selectedTime: '60',
        activeStudiesMap: new Map(),
        search: '',
        openPopover: false,
    })

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
        const { initTimeFrame, extendsIndicators, clearExtendsIndicators, handleRemoveAllStudies } = this.props;
        if (initTimeFrame && (initTimeFrame !== prevProps.initTimeFrame)) {
            this.updateTimeFrame(this.props.initTimeFrame);
        }

        const extend = fastIndicators.primary.filter(fastIndicator => fastIndicator.alias === extendsIndicators)?.[0] || fastIndicators.secondary.filter(fastIndicator => fastIndicator.alias === extendsIndicators)?.[0];

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
    }

    setActiveTime = (value) => {
        const { chartType, handleActiveTime } = this.props;

        if (chartType === 'price') {
            if (handleActiveTime && typeof handleActiveTime === 'function') {
                this.setState({ selectedTime: value });
                handleActiveTime(value);
            }
        }
    }

    setOpen = (open) => {
        this.setState({ openPopover: open });
    }

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
    }

    syncStudies = (studyId = '', id = '') => {
        if (studyId && id) {
            this.setState(prevState => ({ activeStudiesMap: prevState.activeStudiesMap.set(studyId, id) }));
        } else {
            const { widget } = this.props;
            this.setState({ activeStudiesMap: new Map() });
            const currentStudies = widget.activeChart().getAllStudies();
            currentStudies.forEach(e => {
                this.setState(prevState => ({ activeStudiesMap: prevState.activeStudiesMap.set(e.name, e.id) }));
            });
        }
    }

    checkAcronym = (str = '', stringSearch = '') => {
        if (!stringSearch) return true;
        if (str) {
            const matches = str.match(/\b(\w)/g);
            if (matches.join('').toLowerCase().includes(stringSearch.toLowerCase()) || str.toLowerCase().includes(stringSearch.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    findTimeFrame = (value) => {
        return find(ListTimeFrame, e => e.value === value) || {};
    }

    createStudy = (studyId) => {
        const { handleCreateStudy } = this.props;
        if (handleCreateStudy && typeof handleCreateStudy === 'function') {
            handleCreateStudy(studyId);
        }
    }

    render() {
        const { chartType, handleChartType, widget, isOnSidebar, customChartFullscreen, fullScreen } = this.props;

        const { selectedTime } = this.state;
        const studiesList = widget?.getStudiesList() || [];
        const language = widget?.getLanguage();
        const indicators = studiesList.map(e => (
            {
                id: e,
                label: language === 'vi' ? (locale_vi[`${e}_study`] || e) : e,
            }
        ));

        return (
            <div className={`pl-3 ${fullScreen ? '' : 'mt-4'} flex items-center justify-between w-full`}>
                <div className="chart-header flex items-center">
                    {chartType === 'price' && (
                        <>
                            <span className="text-black-500 text-xs mr-3 min-w-max">
                                {this.t('common:timeframe')}
                            </span>
                            <div className={`${fullScreen ? '!hidden' : (isOnSidebar ? '!block !visible' : '')} block visible 2xl:invisible 2xl:hidden`}>
                                <Listbox
                                    value={selectedTime}
                                    onChange={this.setActiveTime}
                                >
                                    {({ open }) => (
                                        <>
                                            <div className="relative z-50">
                                                <Listbox.Button
                                                    className="relative w-full text-left cursor-pointer focus:outline-none sm:text-sm border border-black-200 rounded px-[0.75rem] py-[0.25rem] h-[30px]"
                                                >
                                                    <div className="text-xs text-black-500 font-medium">
                                                        <span className="w-[100px]">
                                                            {this.findTimeFrame(selectedTime).text}
                                                        </span>
                                                        <svg
                                                            className="ml-1.5 inline"
                                                            width="8"
                                                            height="5"
                                                            viewBox="0 0 8 5"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M1.31208 0C0.43606 0 -0.0165491 1.04647 0.583372 1.68483L3.22245 4.49301C3.6201 4.91614 4.29333 4.91276 4.68671 4.48565L7.27316 1.67747C7.8634 1.03664 7.40884 0 6.53761 0H1.31208Z"
                                                                fill="#8B8C9B"
                                                            />
                                                        </svg>
                                                    </div>
                                                </Listbox.Button>

                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options
                                                        static
                                                        className="absolute z-10 mt-1 w-32 bg-white border border-black-200 rounded transform  shadow-lg outline-none"
                                                    >
                                                        {ListTimeFrame.map((item, index) => (
                                                            <Listbox.Option
                                                                key={index}
                                                                className={({ selected, active }) => `${selected ? 'font-medium text-teal' : 'text-black-500'} text-sm  cursor-pointer hover:text-teal py-1 text-center hover:bg-gray-100 px-4`}
                                                                value={item.value}
                                                            >
                                                                {({ selected, active }) => item.text}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                            <div className={`${fullScreen ? '!block !visible' : (isOnSidebar ? '!invisible !hidden' : '')} invisible hidden 2xl:block 2xl:visible`}>
                                <div
                                    className="btn-group btn-group-sm"
                                    role="group"
                                >
                                    {
                                        ListTimeFrame.map((item, index) => {
                                            const { value, text } = item;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className={`btn btn-outline-secondary !text-xs ${selectedTime === value ? 'active' : ''}`}
                                                    onClick={() => this.setActiveTime(value)}
                                                >
                                                    {text}
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <button
                                            type="button"
                                            className="btn-group btn-group-sm ml-2"
                                            onClick={() => this.setState({ openPopover: true })}
                                        >
                                            <Popover.Button
                                                className={`btn btn-outline-secondary !text-xs h-[28px] focus:h-[28px] flex items-center ${open && this.state.openPopover ? 'active' : ''}`}
                                            >
                                                <IconIndicator />
                                                {this.t('common:indicators')}
                                            </Popover.Button>
                                        </button>
                                        <Transition
                                            show={open && this.state.openPopover}
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel static className="absolute z-[3] transform w-screen max-w-xs rounded border border-black-200 left-0 top-10 bg-white shadow-lg text-sm max-w-[585px]">
                                                <div className="flex">
                                                    <div className="panel-left w-[218px] p-6 border-0 border-r border-black-200">
                                                        <div className="mb-6">
                                                            <div className="text-sm font-medium mb-5">
                                                                {this.t('common:main')}
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {fastIndicators.primary.map((indicator, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`${this.state.activeStudiesMap.get(indicator.id) ? 'text-teal' : 'text-black-500'} hover:cursor-pointer hover:text-teal text-xs font-medium select-none`}
                                                                        onClick={() => this.toggleFastStudy(indicator.id)}
                                                                    >
                                                                        {indicator.alias}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium mb-5">
                                                                {this.t('common:sub')}
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {fastIndicators.secondary.map((indicator, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`${this.state.activeStudiesMap.get(indicator.id) ? 'text-teal' : 'text-black-500'} hover:cursor-pointer hover:text-teal text-xs font-medium select-none`}
                                                                        onClick={() => this.toggleFastStudy(indicator.id)}
                                                                    >
                                                                        {indicator.alias}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="panel-right w-[365px]">
                                                        <div className="p-6">
                                                            <div className="text-sm font-medium mb-5">
                                                                {this.t('common:indicators')}
                                                            </div>
                                                            <div className="form-group">
                                                                <div className="input-group">
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        type="text"
                                                                        placeholder={this.t('common:search')}
                                                                        onChange={(e) => this.setState({ search: e.target.value })}
                                                                    />
                                                                    <div
                                                                        className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                                                                    >
                                                                        <span className="input-group-text text-black-500">
                                                                            <IconSearch />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="max-h-[300px] overflow-y-auto">
                                                            {indicators.filter((indicator) => this.checkAcronym(indicator.id, this.state.search) || this.checkAcronym(indicator.label, this.state.search)).map((indicator, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="px-6 py-1.5 hover:bg-black-5 hover:text-black text-black-600 cursor-pointer flex items-center justify-between"
                                                                    onClick={() => this.createStudy(indicator.id)}
                                                                >
                                                                    <div className="truncate">{indicator.label}</div>
                                                                    <div className="ml-3">
                                                                        {/* {this.state.activeStudiesMap.get(indicator.id) && 'active'} */}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </>
                    )}
                </div>
                <div className="flex items-center">
                    <button type="button" onClick={customChartFullscreen} className="border border-[#EEF2FA] rounded p-[6px]">
                        {fullScreen ? <IconFullScreenChartDisable /> : <IconFullScreenChart />}
                    </button>
                    <div className={fullScreen ? 'hidden' : 'btn-group btn-group-sm ml-3'} role="group" aria-label="Large button group">
                        <button
                            type="button"
                            className={`btn btn-outline-secondary !text-xs ${chartType === 'price' ? 'active' : ''}`}
                            onClick={chartType !== 'price' ? handleChartType : null}
                        >{this.t('common:price')}
                        </button>
                        <button
                            type="button"
                            className={`btn btn-outline-secondary !text-xs ${chartType !== 'price' ? 'active' : ''}`}
                            onClick={chartType === 'price' ? handleChartType : null}
                        >{this.t('common:depth')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
