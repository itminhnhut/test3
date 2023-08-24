import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SwitchV2 from 'components/common/V2/SwitchV2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import ModalEditDWConfig from './ModalEditDWConfig';
import { editPartnerConfig } from 'redux/actions/withdrawDeposit';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import classNames from 'classnames';
import { API_CONFIG_AUTO_SUGGEST_PARTNER, API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from '../constants';
import FetchApi from 'utils/fetch-api';
import { useTranslation } from 'next-i18next';
import Tooltip from 'components/common/Tooltip';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import camelCase from 'lodash/camelCase';

const ProfileSetting = ({ partner, t, loadingPartner, setPartner }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        side: null,
        assetId: null
    });

    const [rate, setRate] = useState({
        [SIDE.BUY]: {
            72: null,
            39: null,
            22: null
        },
        [SIDE.SELL]: {
            72: null,
            39: null,
            22: null
        }
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const [rateUsdtSell, rateUsdtBuy] = await Promise.allSettled([
                    FetchApi({ url: API_GET_ORDER_PRICE, params: { assetId: 22, side: SIDE.SELL } }),
                    FetchApi({ url: API_GET_ORDER_PRICE, params: { assetId: 22, side: SIDE.BUY } })
                ]);

                let rateSell, rateBuy;

                if (rateUsdtBuy.status === 'fulfilled' && rateUsdtBuy.value.status === ApiStatus.SUCCESS) {
                    rateBuy = rateUsdtBuy.value.data;
                }
                if (rateUsdtSell.status === 'fulfilled' && rateUsdtSell.value.status === ApiStatus.SUCCESS) {
                    rateSell = rateUsdtSell.value.data;
                }
                setRate({
                    [SIDE.BUY]: {
                        72: 1,
                        39: 1,
                        22: rateBuy
                    },
                    [SIDE.SELL]: {
                        72: 1,
                        39: 1,
                        22: rateSell
                    }
                });
            } catch (error) {
                console.log('API_GET_ORDER_PRICE error:', error);
            }
        };

        fetch();
    }, []);

    const [loading, setLoading] = useState(false);

    const onOpenModal = ({ side, assetId }) => setModal({ isOpen: true, side, assetId });
    const onCloseModal = () => setModal({ isOpen: false, side: null, assetId: null });

    const getAssetOrderConfigWithSide = useCallback(
        ({ assetId, side }) => {
            const assetKey = +assetId === ALLOWED_ASSET_ID['VNDC'] ? '' : ALLOWED_ASSET[assetId ?? ALLOWED_ASSET_ID['VNDC']];
            const orderConfigAssetKey = camelCase((side?.toLowerCase() ?? SIDE.BUY) + assetKey);
            return partner?.orderConfig?.[orderConfigAssetKey];
        },
        [partner]
    );

    const onEditOrderConfig = async ({ side, min, max, assetId, status }) => {
        setLoading(true);
        try {
            const editResponse = await editPartnerConfig({ side, min, max, status, assetId });
            const isDeactivateSide = status === 0;

            const orderConfig = getAssetOrderConfigWithSide({ assetId, side });

            if (editResponse && editResponse.status === ApiStatus.SUCCESS) {
                // toggle activate per side
                if (min === orderConfig?.min && max === orderConfig?.max) {
                    toast({
                        text: t(`dw_partner:${isDeactivateSide ? 'de' : ''}activated_side`, {
                            side: t(`common:${side?.toLowerCase()}`),
                            assetCode: ALLOWED_ASSET[+assetId]
                        }),
                        type: 'success'
                    });
                }
                // setting limit min max per side
                else {
                    toast({
                        text: t('dw_partner:change_side_limit', { side: t(`common:${side?.toLowerCase()}`), assetCode: ALLOWED_ASSET[+assetId] }),
                        type: 'success',
                        duration: 4000,
                        customActionClose: () => {}
                    });
                }
                onCloseModal();
                setPartner(editResponse?.data);
            } else {
                toast({ text: t('common:feedback_sent_failed'), type: 'warning' });
            }
        } catch (error) {
            toast({ text: t('common:feedback_sent_failed'), type: 'warning' });
        } finally {
            setLoading(false);
        }
    };

    const editDWConfig = useCallback(
        ({ side, assetId, onOpenModal, onChange, loading, className = '' }) => {
            const orderConfig = getAssetOrderConfigWithSide({ assetId, side });

            return (
                <div className={className}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="txtPri-7">{t(`common:${side.toLowerCase()}`)}</div>
                        <SwitchV2
                            disabled={loading}
                            checked={orderConfig?.status === 1}
                            onChange={() => {
                                onChange({
                                    side: side.toLowerCase(),
                                    assetId,
                                    status: orderConfig?.status === 1 ? 0 : 1,
                                    min: orderConfig?.min,
                                    max: orderConfig?.max
                                });
                            }}
                        />
                    </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">{t('dw_partner:order_vol_limit')}</div>
                    <div className="flex items-center justify-between mt-3">
                        <div className={classNames('flex text-green-3 dark:text-green-2 font-semibold items-center space-x-1')}>
                            <span className={classNames('text-green-3 dark:text-green-2 font-semibold')}>{formatNumber(orderConfig?.min)}</span>
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">-</span>
                            <span className={classNames('text-green-3 dark:text-green-2  font-semibold')}>{formatNumber(orderConfig?.max)} </span>
                            <span className="">VND</span>
                        </div>

                        <ButtonV2 onClick={() => onOpenModal({ side, assetId })} className="disabled:!bg-transparent !w-auto !py-0 !h-auto" variants="text">
                            {t('common:edit')}
                        </ButtonV2>
                    </div>

                    {/*  hiding convert if token rate is equal to VND (rate = 1) */}
                    <div
                        className={classNames('text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1', {
                            'opacity-0 pointer-events-none': rate[side]?.[assetId] === 1
                        })}
                    >
                        {rate[side]?.[assetId]
                            ? `${formatNumber(orderConfig?.min / rate[side]?.[assetId], assetId === ALLOWED_ASSET_ID['USDT'] ? 4 : 0)} - ${formatNumber(
                                  orderConfig?.max / rate[side]?.[assetId],
                                  assetId === ALLOWED_ASSET_ID['USDT'] ? 4 : 0
                              )}`
                            : `0 - 0`}{' '}
                        {ALLOWED_ASSET[+assetId]}
                    </div>
                </div>
            );
        },
        [partner, t, rate]
    );

    return (
        <div className="mt-[68px]">
            <div className="flex flex-wrap -m-3 items-center">
                {Object.values(ALLOWED_ASSET_ID).map((assetId) => {
                    const assetCode = ALLOWED_ASSET[assetId];
                    return (
                        <div key={assetId} className="p-3 w-full md:w-1/2">
                            <div className="mb-8 txtPri-3 font-semibold">{t('dw_partner:buy_sell_title', { assetCode })}</div>
                            <ConfigAutoSuggest
                                key={`config_auto_asset_${assetId}`}
                                assetId={assetId}
                                autoSuggest={partner?.autoSuggestConfig?.[`${camelCase(`status${assetCode}`)}`]}
                            />
                            <div className="rounded-xl bg-white dark:bg-darkBlue-3 px-8 py-6">
                                {editDWConfig({
                                    side: SIDE.BUY,
                                    assetId,
                                    onOpenModal,
                                    onChange: onEditOrderConfig,
                                    loading: loading || loadingPartner
                                })}
                                <hr className="border-t my-4 dark:border-divider-dark border-divider" />
                                {editDWConfig({
                                    side: SIDE.SELL,
                                    assetId,
                                    onOpenModal,
                                    onChange: onEditOrderConfig,
                                    loading: loading || loadingPartner,
                                    className: 'pt-5'
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <ModalEditDWConfig
                assetId={modal.assetId}
                isVisible={modal.isOpen}
                side={modal.side}
                loading={loading || loadingPartner}
                onConfirm={onEditOrderConfig}
                onClose={onCloseModal}
                rate={rate}
                orderConfig={getAssetOrderConfigWithSide({ assetId: modal.assetId, side: modal.side })}
            />
        </div>
    );
};

export default ProfileSetting;

const ConfigAutoSuggest = ({ assetId, autoSuggest }) => {
    const [isAutoSuggest, setIsAutoSuggest] = useState(autoSuggest);
    const [hasRendered, setHasRendered] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    useEffect(() => {
        if (!hasRendered) {
            setHasRendered(true);
            return;
        }

        const fetchSearchUser = setTimeout(handleSetConfigSuggest, 500);
        return () => clearTimeout(fetchSearchUser);
    }, [isAutoSuggest]);

    const handleSetConfigSuggest = async () => {
        // Call api set config here
        setLoading(true);
        try {
            const { status, data } = await FetchApi({
                url: API_CONFIG_AUTO_SUGGEST_PARTNER,
                options: { method: 'POST' },
                params: {
                    assetId,
                    status: isAutoSuggest ? 1 : 0
                }
            });
            if (status === ApiStatus.SUCCESS) {
                toast({
                    // text: t('dw_partner:change_side_limit', { side: t(`common:${side?.toLowerCase()}`), assetCode: ALLOWED_ASSET[+assetId] }),
                    text: t('common:success'),
                    type: 'success',
                    duration: 4000,
                    customActionClose: () => {}
                });
            } else {
                toast({
                    text: t('common:failure'),
                    type: 'error',
                    duration: 4000,
                    customActionClose: () => {}
                });
            }
        } catch (error) {}
        setLoading(false);
    };

    return (
        <div className="rounded-xl flex items-center justify-between bg-white dark:bg-darkBlue-3 px-8 py-6 mb-4 txtPri-7">
            <div
                className="border-b border-dashed border-gray-1 dark:border-gray-7 cursor-pointer"
                data-tip={t('dw_partner:auto_suggestion_mode_tooltip')}
                data-for={`auto_suggestion_mode_tooltip_${assetId}`}
            >
                {t('dw_partner:auto_suggestion_mode')}
                <Tooltip
                    delayShow={100}
                    delayHide={50}
                    overridePosition={(e) => {
                        if (e?.left < 0)
                            return {
                                left: e.left < 16 ? 16 : e.left,
                                top: e.top
                            };
                        return e;
                    }}
                    id={`auto_suggestion_mode_tooltip_${assetId}`}
                    place={'top'}
                    arrowColor={isDark ? colors.dark['1'] : colors.gray['11']}
                    className={`max-w-[500px] !px-6 !py-3 mr-4 !bg-gray-11 dark:!bg-dark-1 !text-gray-15 dark:!text-gray-4`}
                />
            </div>
            <SwitchV2 disabled={loading} onChange={() => setIsAutoSuggest(!isAutoSuggest)} checked={isAutoSuggest} />
        </div>
    );
};
