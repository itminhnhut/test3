import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SwitchV2 from 'components/common/V2/SwitchV2';
import React, { useCallback, useEffect, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import ModalEditDWConfig from './ModalEditDWConfig';
import { editPartnerConfig } from 'redux/actions/withdrawDeposit';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import classNames from 'classnames';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from '../constants';
import FetchApi from 'utils/fetch-api';

const ProfileSetting = ({ partner, t, loadingPartner, setPartner }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        side: null,
        assetId: null
    });

    const [rate, setRate] = useState({
        [SIDE.BUY]: {
            72: null,
            22: null
        },
        [SIDE.SELL]: {
            72: null,
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
                        22: rateBuy
                    },
                    [SIDE.SELL]: {
                        72: 1,
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

    const onEditOrderConfig = async ({ side, min, max, assetId, status }) => {
        setLoading(true);
        try {
            const editResponse = await editPartnerConfig({ side, min, max, status, assetId });
            const isDeactivateSide = status === 0;
            const orderConfig = partner?.orderConfig?.[side?.toLowerCase() + (assetId === ALLOWED_ASSET_ID['VNDC'] ? '' : 'Usdt')];

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
                        type: 'success'
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
        ({ side, assetId, onOpenModal, onChange, loading }) => {
            const orderConfig = partner?.orderConfig?.[side?.toLowerCase() + (assetId === ALLOWED_ASSET_ID['VNDC'] ? '' : 'Usdt')];

            return (
                <div className="">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] ">{t(`common:${side.toLowerCase()}`)}</div>
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
                    <div className="flex items-center justify-between">
                        <div className={classNames('flex text-dominant font-semibold items-center space-x-1')}>
                            <span className={classNames('text-dominant font-semibold')}>{formatNumber(orderConfig?.min)}</span>
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">-</span>
                            <span className={classNames('text-dominant  font-semibold')}>{formatNumber(orderConfig?.max)} </span>
                            <span className="">VND</span>
                        </div>

                        <ButtonV2 onClick={() => onOpenModal({ side, assetId })} className="disabled:!bg-transparent !w-auto !py-0 !h-auto" variants="text">
                            {t('common:edit')}
                        </ButtonV2>
                    </div>

                    <div
                        className={classNames('text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1', {
                            'opacity-0 pointer-events-none': assetId === ALLOWED_ASSET_ID['VNDC']
                        })}
                    >
                        {rate[side]?.[assetId]
                            ? `${formatNumber(orderConfig?.min / rate[side]?.[assetId], assetId === 72 ? 0 : 4)} - ${formatNumber(
                                  orderConfig?.max / rate[side]?.[assetId],
                                  assetId === 72 ? 0 : 4
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
        <div className="mt-20">
            <div className="flex flex-wrap -m-3 items-center">
                <div className="p-3 w-full md:w-1/2">
                    <div className="mb-8 txtPri-3 font-semibold">{t('dw_partner:buy_sell_title', { assetCode: 'VNDC' })}</div>
                    <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
                        {editDWConfig({
                            side: SIDE.BUY,
                            assetId: ALLOWED_ASSET_ID['VNDC'],
                            onOpenModal,
                            onChange: onEditOrderConfig,
                            loading: loading || loadingPartner
                        })}
                        <hr className="border-t my-9 dark:border-divider-dark border-divider" />
                        {editDWConfig({
                            side: SIDE.SELL,
                            assetId: ALLOWED_ASSET_ID['VNDC'],
                            onOpenModal,
                            onChange: onEditOrderConfig,
                            loading: loading || loadingPartner
                        })}
                    </div>
                </div>
                <div className="p-3 w-full md:w-1/2">
                    <div className="mb-8 txtPri-3 font-semibold">{t('dw_partner:buy_sell_title', { assetCode: 'USDT' })}</div>
                    <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
                        {editDWConfig({
                            side: SIDE.BUY,
                            assetId: ALLOWED_ASSET_ID['USDT'],
                            onOpenModal,
                            onChange: onEditOrderConfig,
                            loading: loading || loadingPartner
                        })}
                        <hr className="border-t my-9 dark:border-divider-dark border-divider" />
                        {editDWConfig({
                            side: SIDE.SELL,
                            assetId: ALLOWED_ASSET_ID['USDT'],
                            onOpenModal,
                            onChange: onEditOrderConfig,
                            loading: loading || loadingPartner
                        })}
                    </div>
                </div>
            </div>
            <ModalEditDWConfig
                assetId={modal.assetId}
                partner={partner}
                isVisible={modal.isOpen}
                side={modal.side}
                loading={loading || loadingPartner}
                onConfirm={onEditOrderConfig}
                onClose={onCloseModal}
                rate={rate}
            />
        </div>
    );
};

export default ProfileSetting;
