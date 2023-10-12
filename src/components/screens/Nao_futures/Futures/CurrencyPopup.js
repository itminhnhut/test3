import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import colors, { hover } from 'styles/colors';
import CheckBox from 'components/common/CheckBox';
import { getS3Url, formatCurrency, formatNumber, emitWebViewEvent } from 'redux/actions/utils';
import { fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { API_POST_CHANGE_FEES_CURRENCY_ORDER } from 'redux/actions/apis';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import Tooltip from 'components/common/Tooltip';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { PlusCircle } from 'react-feather';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import InfoOutlined from 'components/svg/InfoOutlined';

const CurrencyPopup = (props) => {
    const { visibleModalFees, dataRow, setVisibleModalFees, forceFetchOrder } = props;
    const [hoverItemsChose, setHoverItemsChose] = useState('');
    const [feesFor, setFees] = useState([]);
    const [checkBox, setCheckBox] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const avlbAsset = useSelector((state) => state.wallet?.NAO_FUTURES);
    const { t } = useTranslation();
    const [disabledButton, setdDisabledButton] = useState(false);
    const assetId = useRef(null);
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const [disableForAvailable, setDisableForAvailable] = useState(false);
    const currency = dataRow?.fee_metadata?.close_order?.currency ?? dataRow?.fee_metadata?.place_order?.currency;
    const alertContext = useContext(AlertContext);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const allowCurrency = useMemo(() => {
        const stable = fees.find((rs) => String(dataRow?.symbol).indexOf(rs.assetCode) !== -1);
        const exclude = [72, 22, 39, 86, currency];
        const feesFilter = fees.filter((rs) => !exclude.includes(rs.assetId));
        if (currency === stable.assetId) return feesFilter;
        return feesFilter.concat(stable ?? []);
    }, [currency]);

    useEffect(() => {
        if (dataRow) {
            const asset = fees.find((rs) => rs.assetId === currency);
            if (!asset) return;
            setHoverItemsChose(asset.assetCode);
            setFees([...[asset], ...allowCurrency]);
        }
    }, [dataRow, visibleModalFees, allowCurrency]);

    const handleDisableBTN = (availableAsset, _assetConfigs) => {
        setDisableForAvailable(formatNumber(availableAsset, _assetConfigs.assetDigit) === '0' ? true : false);
    };

    const onChangeCurrency = (item, assets, availableAsset) => {
        assetId.current = item.assetId;
        setHoverItemsChose(item.assetCode);
        handleDisableBTN(availableAsset, assets);
    };

    const onBuyToken = (item) => {};

    const renderAllCurrency = feesFor?.map((item, index) => {
        const _avlb = avlbAsset?.[item.assetId];
        const _assetConfigs = assetConfigs.find((e) => e.id === item.assetId);
        const availableAsset = Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0);
        return (
            <div className="w-full relative" key={index}>
                <div
                    onClick={() => onChangeCurrency(item, _assetConfigs, availableAsset)}
                    className={classnames('flex items-center justify-between w-full border bg-gray-13 dark:bg-dark-4 rounded-md px-4 py-[7px]', {
                        'border-teal': hoverItemsChose === item.assetCode,
                        'border-transparent': hoverItemsChose !== item.assetCode
                    })}
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9">
                            <img src={getS3Url(`/images/coins/64/${item.assetId}.png`)} />
                        </div>
                        <div className="flex flex-col space-y-[2px]">
                            <div className="flex items-center space-x-2">
                                <div className="leading-6 font-medium"> {item.assetCode} </div>
                                {item?.assetCode === 'NAO' && <img className="w-4 h-4" src={getS3Url(`/images/screen/futures/ic_star.png`)} />}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="leading-5 text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                    {t(`futures:mobile:adjust_margin:available`)} {formatNumber(availableAsset, _assetConfigs.assetDigit)}
                                </div>
                                {/* <PlusCircle onClick={() => onBuyToken(item)} size={12} color={colors.teal} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end flex-col text-center">
                        <div className="flex jutify-center items-center space-x-1">
                            <div
                                className={`${
                                    item.ratio !== '0.06%'
                                        ? 'text-txtSecondary dark:text-txtSecondary-dark text-center line-through text-xs'
                                        : 'text-base font-medium'
                                } leading-5`}
                            >
                                0.06%
                            </div>
                            {item.ratio !== '0.06%' && (
                                <div className={`${item?.assetCode === 'NAO' ? 'text-teal' : ''} leading-5 font-medium `}>{item.ratio}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const onClose = () => {
        setVisibleModalFees(false);
        if (forceFetchOrder) forceFetchOrder();
    };

    const HandleConfirmModal = async () => {
        setSubmitting(true);
        const { data, status } = await axios
            .put(API_POST_CHANGE_FEES_CURRENCY_ORDER, {
                displaying_id: dataRow?.displaying_id,
                currency_change: hoverItemsChose.toLowerCase(),
                set_default: checkBox
            })
            .catch((err) => {
                console.error(err);
                return {
                    data: {
                        status: err.message === 'Network Error' ? 'NETWORK_ERROR' : 'UNKNOWN'
                    }
                };
            });
        setSubmitting(false);

        if (data.status === 'ok') {
            const message = t(`futures:mobile:change_success`);
            alertContext.alert.show('success', t('common:success'), message, null, null, onClose());
        } else {
            const requestId = data?.data?.requestId && `(${data?.data?.requestId.substring(0, 8)})`;
            alertContext.alert.show('error', t('common:failed'), t(`error:futures:${data.status || 'UNKNOWN'}`), requestId);
        }
        onClose();
    };

    return (
        <Modal onusMode={true} isVisible={visibleModalFees} onBackdropCb={onClose} onusClassName="min-h-[334px]">
            <div className="w-full" style={{ color: colors.wildSand }}>
                <div className="flex items-center w-full">
                    <h4 className="text-lg leading-6 font-bold pr-[10px]">{t(`futures:mobile:trading_fees`)}</h4>
                    <div
                        className="flex items-center justify-center rounded-full
                        w-4 h-4 cursor-pointer text-txtSecondary dark:text-txtSecondary-dark"
                        data-tip=""
                        data-for="header-tooltip"
                        id="header-tooltip-id"
                    >
                        <InfoOutlined size={16} color="currentColor" />
                    </div>
                    <Tooltip
                        id="header-tooltip"
                        place="bottom"
                        effect="solid"
                        backgroundColor="bg-darkBlue-4"
                        className="!ml-[8.5rem] !mt-1 !p-2 !mr-4 !opacity-100 !rounded-lg after:!left-3"
                        overridePosition={(e) => ({
                            left: 0,
                            top: e.top
                        })}
                        arrowColor={isDark ? colors.dark[2] : colors.gray[15]}
                    >
                        <div className="font-medium text-xs leading-[18px] text-white dark:text-txtPrimary-dark">{t('futures:mobile:tooltip_popup')}</div>
                    </Tooltip>
                </div>
                <div className="pt-6 pb-4 w-full flex flex-col space-y-2">{renderAllCurrency}</div>
                <div className="flex items-center space-x-2 pb-6" onClick={() => setCheckBox(!checkBox)}>
                    <CheckBox onusMode={true} active={checkBox} boxContainerClassName="rounded-[2px]" />
                    <span className="whitespace-nowrap font-medium text-txtSecondary dark:text-txtSecondary-dark text-xs">
                        {t(`futures:mobile:set_as_default_trading_fee`)}
                    </span>
                </div>
                <Button
                    onusMode={true}
                    title={t(`futures:mobile:adjust_margin:confirm_btn`)}
                    componentType="button"
                    className={`!text-base !h-12 !font-semibold`}
                    type="primary"
                    disabled={disabledButton || submitting || disableForAvailable || currency === hoverItemsChose}
                    onClick={HandleConfirmModal}
                />
            </div>
        </Modal>
    );
};

export default CurrencyPopup;
