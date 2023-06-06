import ModalV2 from 'components/common/V2/ModalV2';
import { IconHelperV2 } from 'components/common/Icons.js';
import Tooltip from 'components/common/Tooltip';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useState } from 'react';
import { useCallback } from 'react';
import AssetLogo from 'components/wallet/AssetLogo';
import { BxsInfoCircle, CheckCircleIcon } from 'components/svg/SvgIcon';
import classnames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect } from 'react';
import { FEE_TABLE } from 'constants/constants';
import Axios from 'axios';
import { ApiStatus, TRADING_MODE } from 'redux/actions/const';
import { API_FEE_SETTING_NAO_FUTURE, API_SET_ASSET_AS_FEE, API_FEE_SETTING_NAMI_FUTURE } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { formatNumber } from 'redux/actions/utils';

const NAMI_NAO_TYPE = [
    {
        id: 0,
        name: 'VNDC',
        content: {
            vi: 'VNDC',
            en: 'VNDC'
        }
    },
    {
        id: 1,
        name: 'USDT',
        content: {
            vi: 'USDT',
            en: 'USDT'
        }
    }
];

const TRADING_FEE_SETTING = {
    SPOT: [
        {
            KEY: 'NAMI_SPOT',
            TOKEN_COIN_NAME: 'NAMI',
            NOTE: null,
            AVAILABILITY: '100,000,000',
            FEE: null
        },
        {
            KEY: 'DEFAULT_SPOT',
            TOKEN_COIN_NAME: 'DEFAULT',
            NOTE: null,
            AVAILABILITY: null,
            FEE: null
        }
    ],
    NAMI_FUTURE: {
        VNDC: [
            {
                KEY: 'NAMI_VNDC_NAMI_FUTURE',
                TOKEN_COIN_NAME: 'NAMI',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'VNDC_VNDC_NAMI_FUTURE',
                TOKEN_COIN_NAME: 'VNDC',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            }
        ],
        USDT: [
            {
                KEY: 'NAMI_USDT_NAMI_FUTURE',
                TOKEN_COIN_NAME: 'NAMI',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'USDT_USDT_NAMI_FUTURE',
                TOKEN_COIN_NAME: 'USDT',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            }
        ]
    },
    NAO_FUTURE: {
        VNDC: [
            {
                KEY: 'NAO_VNDC_NAO_FUTURE',
                TOKEN_COIN_NAME: 'NAO',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'NAMI_VNDC_NAO_FUTURE',
                TOKEN_COIN_NAME: 'NAMI',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'VNDC_VNDC_NAO_FUTURE',
                TOKEN_COIN_NAME: 'VNDC',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            }
        ],
        USDT: [
            {
                KEY: 'NAO_USDT_NAO_FUTURE',
                TOKEN_COIN_NAME: 'NAO',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'NAMI_USDT_NAO_FUTURE',
                TOKEN_COIN_NAME: 'NAMI',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            },
            {
                KEY: 'USDT_USDT_NAO_FUTURE',
                TOKEN_COIN_NAME: 'USDT',
                NOTE: null,
                AVAILABILITY: '100,000,000',
                FEE: null,
                LINE_THROUGH_DATA: null
            }
        ]
    }
};

const INITIAL_STATE = {
    isShowAlert: false,
    configTabIndex: 0,
    subConfigTabIndex: 0,
    selectedSpotConfig: null,
    spotConfigData: TRADING_FEE_SETTING.SPOT,
    isLoading: false,
    assetFee: null,
    originSelectedSpotConfig: null,
    isDisableSaveBtn: true,
    namiFutureConfigData: {
        VNDC: TRADING_FEE_SETTING.NAMI_FUTURE.VNDC,
        USDT: TRADING_FEE_SETTING.NAMI_FUTURE.USDT
    },
    naoFutureConfigData: {
        VNDC: TRADING_FEE_SETTING.NAO_FUTURE.VNDC,
        USDT: TRADING_FEE_SETTING.NAO_FUTURE.USDT
    },
    currentSelectedFutureConfig: {
        NAMI_VNDC: null,
        NAMI_USDT: null,
        NAO_VNDC: null,
        NAO_USDT: null
    },
    originSelectedFutureConfig: {
        NAMI_VNDC: null,
        NAMI_USDT: null,
        NAO_VNDC: null,
        NAO_USDT: null
    }
};

export default function FeeSettingModal({ configFeeTab, isVisible, onBackdropCb, vipLevel }) {
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();
    const isMobile = width < 768;
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const setSpotDataField = (data) => {
        if (data?.status === ApiStatus.SUCCESS && data?.data) {
            setState({
                assetFee: data?.data,
                originSelectedSpotConfig: data?.data?.feeCurrency === 1 ? 'NAMI_SPOT' : 'DEFAULT_SPOT',
                selectedSpotConfig: data?.data?.feeCurrency === 1 ? 'NAMI_SPOT' : 'DEFAULT_SPOT',
                isDisableSaveBtn: true
            });
        }
    };

    const setFutureDataField = (data, futureType = 'NAMI', marginAsset = 'VNDC') => {
        if (data?.status === ApiStatus.SUCCESS && data?.data && data?.data?.accepted_assets && data?.data?.user_setting) {
            let initedFutureFeeData = null;
            if (futureType === 'NAMI') {
                initedFutureFeeData = [...state.namiFutureConfigData[marginAsset]];
            } else {
                initedFutureFeeData = [...state.naoFutureConfigData[marginAsset]];
            }
            initedFutureFeeData.map((item) => {
                const findedAsset = data.data.accepted_assets.find((assetItem) => assetItem.asset.toUpperCase() === item.TOKEN_COIN_NAME);
                if (findedAsset?.mode === 'normal' && findedAsset?.fee_ratio) {
                    item.FEE = formatNumber(findedAsset.fee_ratio * 100, 5, 5);
                } else if (findedAsset?.mode === 'discount' && findedAsset?.fee_ratio && findedAsset?.discount_fee_ratio) {
                    item.FEE = formatNumber(findedAsset.discount_fee_ratio * 100, 5, 5);
                    item.LINE_THROUGH_DATA = formatNumber(findedAsset.fee_ratio * 100, 5, 5);
                }
                return item;
            });
            const updatedSelected = { ...state.originSelectedFutureConfig };
            updatedSelected[`${futureType}_${marginAsset}`] = data.data.user_setting.toUpperCase();
            setState({
                [`${futureType.toLowerCase()}FutureConfigData`]: {
                    ...state[`${futureType.toLowerCase()}FutureConfigData`],
                    [marginAsset]: [...initedFutureFeeData]
                },
                currentSelectedFutureConfig: { ...updatedSelected },
                originSelectedFutureConfig: { ...updatedSelected }
            });
        }
    };

    const handleSpotConfigRequest = async (action = 'get', currency, cb) => {
        setState({ isLoading: true });
        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_SET_ASSET_AS_FEE);
                if (cb) cb(data);
            } else if (action === 'set' && !isNaN(currency)) {
                const { data } = await Axios.post(API_SET_ASSET_AS_FEE, { currency });
                if (cb) cb(data);
            }
        } catch (e) {
            console.log('🚀 ~ file: FeeSettingModal.js:248 ~ handleSpotConfigRequest ~ e:', e);
        } finally {
            setState({ isLoading: false });
        }
    };

    const handleFutureConfigRequest = async (action = 'get', futureType = 'NAMI', marginAsset = 'VNDC', asset = 'vndc', cb) => {
        setState({ isLoading: true });
        let API_FEE_SETTING_FUTURE = null;
        if (futureType === 'NAMI') {
            API_FEE_SETTING_FUTURE = API_FEE_SETTING_NAMI_FUTURE;
        } else {
            API_FEE_SETTING_FUTURE = API_FEE_SETTING_NAO_FUTURE;
        }
        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_FEE_SETTING_FUTURE + `?marginAsset=${marginAsset}`);
                if (cb) cb(data, futureType, marginAsset);
            }

            if (action === 'set' && asset && marginAsset) {
                const { data } = await Axios.post(API_FEE_SETTING_FUTURE, {
                    asset,
                    marginAsset
                });
                if (cb) cb(data);
            }
        } catch (e) {
            console.log('🚀 ~ file: FeeSettingModal.js:270 ~ handleNamiFutureConfigRequest ~ e:', e);
        } finally {
            setState({ isLoading: false });
        }
    };

    const handleOnclickSaveConfig = async () => {
        if (state.configTabIndex === 0) {
            let currencyData = null;
            if (state.selectedSpotConfig === 'NAMI_SPOT') {
                currencyData = 1;
            } else if (state.selectedSpotConfig === 'DEFAULT_SPOT') {
                currencyData = 0;
            }
            if (currencyData !== null) {
                await handleSpotConfigRequest('set', currencyData, async (data) => {
                    if (data) {
                        await handleSpotConfigRequest('get', null, (data) => {
                            if (data) {
                                setSpotDataField(data);
                            }
                        });
                        setState({ isShowAlert: false, originSelectedSpotConfig: currencyData === 1 ? 'NAMI_SPOT' : 'DEFAULT_SPOT' });
                    }
                });
            }
        } else if (state.configTabIndex === 1) {
            const marginAssetKey = getSelectedFutureConfigKey();
            await handleFutureConfigRequest(
                'set',
                'NAMI',
                NAMI_NAO_TYPE[state.subConfigTabIndex].name,
                state.currentSelectedFutureConfig[marginAssetKey].toLowerCase(),
                async (data) => {
                    if (data?.status === ApiStatus.SUCCESS && data?.data?.user_setting) {
                        await handleFutureConfigRequest('get', 'NAMI', NAMI_NAO_TYPE[state.subConfigTabIndex].name, null, (data, futureType, marginAsset) => {
                            if ((data, futureType, marginAsset)) setFutureDataField(data, futureType, marginAsset);
                        });
                        setState({ isShowAlert: false });
                    }
                }
            );
        } else if (state.configTabIndex === 2) {
            const marginAssetKey = getSelectedFutureConfigKey();
            await handleFutureConfigRequest(
                'set',
                'NAO',
                NAMI_NAO_TYPE[state.subConfigTabIndex].name,
                state.currentSelectedFutureConfig[marginAssetKey].toLowerCase(),
                async (data) => {
                    if (data?.status === ApiStatus.SUCCESS && data?.data?.user_setting) {
                        await handleFutureConfigRequest('get', 'NAO', NAMI_NAO_TYPE[state.subConfigTabIndex].name, null, (data, futureType, marginAsset) => {
                            if ((data, futureType, marginAsset)) setFutureDataField(data, futureType, marginAsset);
                        });
                        setState({ isShowAlert: false });
                    }
                }
            );
        }
    };

    const getSelectedFutureConfigKey = () => {
        const marginAssetKey = state.configTabIndex === 1 ? 'NAMI' : 'NAO';
        const selectedKey = `${marginAssetKey}_${NAMI_NAO_TYPE[state.subConfigTabIndex].name}`;
        return selectedKey;
    };

    useEffect(() => {
        setState({
            selectedSpotConfig: state.originSelectedSpotConfig,
            currentSelectedFutureConfig: { ...state.originSelectedFutureConfig }
        });
        if (state.configTabIndex === 0) {
            handleSpotConfigRequest('get', null, (data) => {
                if (data) {
                    setSpotDataField(data);
                }
            });
        } else if (state.configTabIndex === 1) {
            handleFutureConfigRequest('get', 'NAMI', NAMI_NAO_TYPE[state.subConfigTabIndex].name, null, (data, futureType, marginAsset) => {
                if (data && futureType && marginAsset) setFutureDataField(data, futureType, marginAsset);
            });
        } else if (state.configTabIndex === 2) {
            handleFutureConfigRequest('get', 'NAO', NAMI_NAO_TYPE[state.subConfigTabIndex].name, null, (data, futureType, marginAsset) => {
                if (data && futureType && marginAsset) setFutureDataField(data, futureType, marginAsset);
            });
        }
    }, [state.subConfigTabIndex, state.configTabIndex, isVisible]);

    useEffect(() => {
        if (state.isLoading === true) {
            setState({ isDisableSaveBtn: true });
        } else {
            if (state.configTabIndex === 0) {
                if (state.originSelectedSpotConfig) {
                    setState({ isDisableSaveBtn: state.selectedSpotConfig === state.originSelectedSpotConfig });
                }
            } else if (state.configTabIndex === 1 || state.configTabIndex === 2) {
                const marginAssetKey = getSelectedFutureConfigKey();
                if (state.originSelectedFutureConfig[marginAssetKey]) {
                    const check = state.currentSelectedFutureConfig[marginAssetKey] === state.originSelectedFutureConfig[marginAssetKey];
                    setState({ isDisableSaveBtn: check });
                }
            }
        }
    }, [state.currentSelectedFutureConfig, state.selectedSpotConfig]);

    useEffect(() => {
        if (state.assetFee) {
            const updatedArray = state.spotConfigData.map((item) => {
                const noteText = null;
                const fee = null;
                if (item.KEY === 'NAMI_SPOT' && state.assetFee.promoteSpot) {
                    noteText = `${
                        language === LANGUAGE_TAG.VI
                            ? `Giảm ${formatNumber(state.assetFee.promoteSpot * 100, 5)}%`
                            : `${formatNumber(state.assetFee.promoteSpot * 100, 5)}% discount`
                    }`;
                    fee = FEE_TABLE[vipLevel]?.maker_taker_deducted;
                } else {
                    noteText = `VIP ${vipLevel || 0}`;
                    fee = FEE_TABLE[vipLevel]?.maker_taker;
                }
                return { ...item, NOTE: noteText, FEE: fee };
            });
            setState({ spotConfigData: updatedArray });
        }
    }, [state.assetFee, vipLevel]);

    const handleOnClickFeeAsset = (originSelectedKey, assetName) => {
        const selectedAssetData = { ...state.currentSelectedFutureConfig };
        selectedAssetData[originSelectedKey] = assetName;
        setState({ currentSelectedFutureConfig: selectedAssetData });
    };

    const renderConfigFeeTab = useCallback(() => {
        return (
            <Tabs tab={state.configTabIndex} className="md:space-x-6">
                {configFeeTab.map((tab) => (
                    <TabItem
                        key={`trading_fee_Tab__${tab.dataIndex}`}
                        value={tab.index}
                        className={`!text-left !px-0 ${isMobile && '!mr-6 !w-auto !text-sm'}`}
                        onClick={() => setState({ configTabIndex: tab.index })}
                    >
                        {tab.localized ? t(tab.localized, { action: 'Exchange' }) : tab.title}
                    </TabItem>
                ))}
            </Tabs>
        );
    }, [state.configTabIndex, configFeeTab, isMobile]);

    const rendeSpotFeeConfig = useCallback(() => {
        const dataForRender = state.spotConfigData;
        return dataForRender.map((item) => (
            <div
                key={item.KEY}
                className={`bg-white dark:bg-listItemSelected-dark max-w-[524px] py-4 px-3 md:!p-6 rounded-xl flex justify-between items-center ${
                    item.FEE && item.KEY === state.selectedSpotConfig && 'border-[1px] border-teal'
                }`}
                onClick={() => setState({ selectedSpotConfig: item.KEY })}
            >
                <div>
                    <div className="flex font-semibold whitespace-nowrap">
                        {item.KEY !== 'DEFAULT_SPOT' && (
                            <div className="mr-2">
                                <AssetLogo assetCode={item.TOKEN_COIN_NAME} size={isMobile ? 16 : 20} />
                            </div>
                        )}
                        <div className="md:text-base text-xs">
                            {item.KEY !== 'DEFAULT_SPOT' ? item.TOKEN_COIN_NAME : t('fee-structure:default')}&nbsp;
                            {item.NOTE && <span className="text-teal">({item.NOTE})</span>}
                        </div>
                    </div>
                    {item.AVAILABILITY && (
                        <span className="mt-2 text-txtSecondary dark:text-txtSecondary-dark text-xs md:!text-sm whitespace-nowrap">
                            {t('fee-structure:available')} {item.AVAILABILITY}
                        </span>
                    )}
                </div>
                <div className="flex gap-3 md:!gap-[18px] items-center">
                    <div>
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:!text-sm text-right">Maker/Taker</div>
                        <span className={`mt-2 font-semibold text-right text-xs md:!text-base whitespace-nowrap`}>{item.FEE ? item.FEE : '-'}</span>
                    </div>
                    {item.FEE && (
                        <>
                            {item.KEY === state.selectedSpotConfig ? (
                                <CheckCircleIcon color="#47cc85" size={isMobile ? 16 : 20} />
                            ) : (
                                <div className="w-[16px] h-[16px] md:!w-[20px] md:!h-[20px] border-[#3e4351] border-[2px] rounded-full"></div>
                            )}
                        </>
                    )}
                </div>
            </div>
        ));
    }, [state.subConfigTabIndex, state.selectedSpotConfig, state.spotConfigData, isMobile]);

    const renderFutureFeeConfig = useCallback(() => {
        const dataForRender = [];
        if (state.configTabIndex === 1) {
            dataForRender = state.namiFutureConfigData[NAMI_NAO_TYPE[state.subConfigTabIndex].name];
        } else if (state.configTabIndex === 2) {
            dataForRender = state.naoFutureConfigData[NAMI_NAO_TYPE[state.subConfigTabIndex].name];
        }
        const originSelectedKey = getSelectedFutureConfigKey();
        return dataForRender.map((item) => (
            <div
                className={`bg-white dark:bg-listItemSelected-dark max-w-[524px] py-4 px-3 md:p-6 rounded-xl flex 
                justify-between items-center ${
                    item.FEE && state.currentSelectedFutureConfig[originSelectedKey] === item.TOKEN_COIN_NAME && 'border-[1px] border-teal'
                }`}
                key={item.KEY}
                onClick={() => handleOnClickFeeAsset(originSelectedKey, item.TOKEN_COIN_NAME)}
            >
                <div>
                    <div className="flex font-semibold">
                        <div className="mr-2">
                            <AssetLogo assetCode={item.TOKEN_COIN_NAME} size={isMobile ? 16 : 20} />
                        </div>
                        <div className="md:text-base text-xs whitespace-nowrap">{item.TOKEN_COIN_NAME}</div>
                    </div>
                    <span className="mt-2 text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm whitespace-nowrap">
                        {t('fee-structure:available')} {item.AVAILABILITY}
                    </span>
                </div>
                <div className="flex gap-3 md:!gap-[18px] items-center">
                    <div>
                        {item.LINE_THROUGH_DATA && (
                            <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm text-right line-through">
                                {item.LINE_THROUGH_DATA}
                            </div>
                        )}
                        <span className="mt-2 font-semibold text-right md:text-base text-xs whitespace-nowrap">{item.FEE ? item.FEE : '-'}</span>
                    </div>
                    {item.FEE && (
                        <>
                            {state.currentSelectedFutureConfig[originSelectedKey] === item.TOKEN_COIN_NAME ? (
                                <CheckCircleIcon color="#47cc85" size={isMobile ? 16 : 20} />
                            ) : (
                                <div className="w-[16px] h-[16px] md:!w-[20px] md:!h-[20px] border-[#3e4351] border-[2px] rounded-full"></div>
                            )}
                        </>
                    )}
                </div>
            </div>
        ));
    }, [state.subConfigTabIndex, state.configTabIndex, state.namiFutureConfigData, state.naoFutureConfigData, state.currentSelectedFutureConfig]);

    let feeConfigRenderData;
    if (state.configTabIndex === 0) {
        feeConfigRenderData = rendeSpotFeeConfig();
    } else {
        feeConfigRenderData = renderFutureFeeConfig();
    }

    return (
        <>
            <ModalV2 isMobile={isMobile} isVisible={isVisible} onBackdropCb={onBackdropCb} className="!max-w-[588px]">
                <div>
                    <div>
                        <Tooltip id={'setting_modal_tooltip'} place="top" effect="solid" isV3></Tooltip>
                        <div className="text-xl mb:!text-3xl font-semibold flex gap-2 items-center">
                            <span>{t('fee-structure:setting_modal_title')}</span>
                            <div data-for={'setting_modal_tooltip'} data-tip={t('fee-structure:setting_modal_title_tooltip')}>
                                <IconHelperV2
                                    size={16}
                                    color={currentTheme === THEME_MODE.DARK ? '#e2e8f0' : '#1e1e1e'}
                                    symbolColor={currentTheme === THEME_MODE.DARK ? '#1e1e1e' : '#e2e8f0'}
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">
                            <span>{t('fee-structure:setting_modal_description')}</span>
                        </div>
                    </div>
                    <div className="md:mt-8 mt-6">
                        <div className="border-b-[1px] border-divider dark:border-divider-dark">{renderConfigFeeTab()}</div>
                    </div>
                    {state.configTabIndex === 1 || state.configTabIndex === 2 ? (
                        <div className="pt-6 flex items-center justify-between">
                            <TokenTypes
                                type={state.subConfigTabIndex}
                                setType={(index) => {
                                    setState({ subConfigTabIndex: index });
                                }}
                                types={[...NAMI_NAO_TYPE]}
                                lang={language}
                            />
                        </div>
                    ) : null}
                    <div className={`flex flex-col gap-3 md:gap-4 ${state.configTabIndex === 0 ? 'md:mt-8 mt-6' : 'mt-6'}`}>{feeConfigRenderData}</div>
                    <div className="mt-8 md:!mt-10">
                        <ButtonV2 disabled={state.isDisableSaveBtn} onClick={() => setState({ isShowAlert: true })}>
                            {t('fee-structure:save_setting')}
                        </ButtonV2>
                    </div>
                </div>
            </ModalV2>
            <ModalV2 className="!max-w-[488px]" isVisible={state.isShowAlert} onBackdropCb={() => setState({ isShowAlert: false })} isMobile={isMobile}>
                <div className="flex flex-col items-center">
                    {<BxsInfoCircle size={80} color="#47cc85" />}
                    <div className="px-2 mt-6 mb-4 font-semibold text-xl md:text-2xl text-txtPrimary dark:text-gray-4 text-center">
                        {t('fee-structure:change_confirmation')}
                    </div>
                    <div className="mt-4 space-y-3 w-full">
                        <Button loading={state.isLoading} onClick={() => handleOnclickSaveConfig()}>
                            <span>{t('fee-structure:save_setting')}</span>
                        </Button>
                    </div>
                    <div className="mt-3 space-y-3 w-full">
                        <Button variants="secondary" onClick={() => setState({ isShowAlert: false })}>
                            {' '}
                            <span>{t('fee-structure:leave')}</span>
                        </Button>
                    </div>
                </div>
            </ModalV2>
        </>
    );
}

const TokenTypes = ({ type, setType, types, lang, className }) => {
    return (
        <div className={classnames('flex items-center space-x-2 md:space-x-3 h-9 sm:h-12 font-normal text-sm overflow-auto no-scrollbar', className)}>
            {types.map((e) => (
                <div
                    key={e.id}
                    className={classnames(
                        `${
                            type !== e.id && 'text-txtTextBtn-tonal_dark'
                        } flex items-center h-full flex-auto justify-center px-4 text-sm sm:text-base rounded-[800px] border-[1px] cursor-pointer whitespace-nowrap`,
                        {
                            'border-teal bg-teal bg-opacity-10 text-teal font-semibold': e.id === type,
                            'border-divider dark:border-divider-dark': e.id !== type
                        }
                    )}
                    onClick={() => setType(e.id)}
                >
                    {e?.content[lang]}
                </div>
            ))}
        </div>
    );
};
