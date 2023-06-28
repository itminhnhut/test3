import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import React, { useMemo, memo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import Button from 'components/common/V2/ButtonV2/Button';
import { API_POST_CHANGE_FEES_CURRENCY_ORDER, API_GET_FEE_ASSET } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';
import Skeletor from 'components/common/Skeletor';
import { fees_futures } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import orderBy from 'lodash/orderBy';

const FuturesFeeModal = memo(
    ({ isVisible, onClose, order, setting }) => {
        const { t } = useTranslation();
        const walletFutures = useSelector((state) => state.wallet?.FUTURES);
        const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
        const [fee, setFee] = useState({ asset: null, assetId: null, assetCode: null });
        const [loading, setLoading] = useState(true);
        const quoteAsset = order?.quoteAsset ?? (order?.symbol?.indexOf('USDT') > -1 ? 'USDT' : 'VNDC');
        const [dataSource, setDataSource] = useState({
            accepted_assets: [],
            user_setting: null
        });
        const [isSubmit, setIsSubmit] = useState(false);
        const currency = order?.fee_metadata?.close_order?.currency ?? order?.fee_metadata?.place_order?.currency;

        const convertData = (data) => {
            return orderBy(
                data.map((item) => {
                    const asset = fees_futures.find((i) => i.assetCode === String(item.asset).toUpperCase());
                    return {
                        ...item,
                        assetId: asset?.assetId,
                        assetCode: asset.assetCode
                    };
                }),
                ['discount_fee_ratio'],
                'asc'
            );
        };

        const getFeeAsset = async () => {
            if (setting) {
                setLoading(false);
                setFee({ asset: setting?.user_setting });
                setDataSource({
                    accepted_assets: convertData(setting?.accepted_assets),
                    user_setting: setting?.user_setting
                });
                return;
            }
            setLoading(true);
            try {
                const { data } = await FetchApi({
                    url: API_GET_FEE_ASSET,
                    params: { marginAsset: quoteAsset }
                });

                if (data) {
                    let user_setting;
                    if (currency) {
                        const asset = fees_futures.find((item) => item.assetId === currency);
                        user_setting = String(asset?.assetCode).toLowerCase();
                    } else {
                        user_setting = data?.user_setting;
                    }
                    setFee({ asset: user_setting });
                    setDataSource({
                        accepted_assets: convertData(data?.accepted_assets),
                        user_setting: user_setting
                    });
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            if (isVisible) getFeeAsset();
        }, [isVisible, quoteAsset, currency, setting]);

        const onSave = async () => {
            setIsSubmit(true);
            try {
                const { status } = await FetchApi({
                    url: setting ? API_GET_FEE_ASSET : API_POST_CHANGE_FEES_CURRENCY_ORDER,
                    options: {
                        method: setting ? 'POST' : 'PUT'
                    },
                    params: setting
                        ? { asset: fee.asset, marginAsset: quoteAsset }
                        : { displaying_id: order?.displaying_id, currency_change: fee.asset, set_default: false }
                });
                if (status === 'ok') {
                    toast({ text: t('futures:mobile:change_success'), type: 'success' });
                    if (onClose) onClose(fee.asset);
                } else {
                    toast({ text: t(`error:futures:${status || 'UNKNOWN'}`), type: 'error' });
                }
            } catch (error) {
                console.log('onSave_fee', error);
                toast({ text: t(`error:futures:${error?.status || 'UNKNOWN'}`), type: 'error' });
            } finally {
                setIsSubmit(false);
            }
        };

        const loader = useMemo(() => {
            const arr = [];
            for (let i = 1; i <= 2; i++) {
                arr.push(
                    <div key={i} className={classNames('p-6 ring-transparent ring-[1px] rounded-xl bg-dark-4 cursor-pointer')}>
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <Skeletor width={20} height={20} />
                                        <Skeletor width={100} height={20} />
                                    </div>
                                    <Skeletor width={200} height={20} />
                                </div>
                                <div className="flex items-end flex-col justify-between">
                                    <Skeletor width={100} height={20} />
                                </div>
                            </div>
                            <div className="min-w-[24px]">
                                <Skeletor width={24} height={24} />
                            </div>
                        </div>
                    </div>
                );
            }
            return arr;
        }, []);

        const disabled = useMemo(() => {
            const _avlb = walletFutures?.[fee?.assetId];
            const availableAsset = Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0);
            return !availableAsset || isSubmit || dataSource.user_setting === fee.asset;
        }, [walletFutures, isSubmit, fee, dataSource]);

        return (
            <ModalV2 containerClassName='!z-[9999999999]' className="!max-w-[588px]" isVisible={isVisible} onBackdropCb={onClose}>
                <div className="text-xl sm:text-2xl font-semibold pb-4">
                    {t('common:transaction_fee')} {quoteAsset} Futures
                </div>
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:fee_modal:select_currency')}.</span>
                <div className="mt-8 flex flex-col space-y-4">
                    {loading
                        ? loader
                        : dataSource.accepted_assets.map((item) => {
                              const _avlb = walletFutures?.[item.assetId];
                              const _assetConfigs = assetConfigs.find((e) => e.id === item.assetId);
                              const availableAsset = Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0);
                              const active = fee?.asset === item.asset;
                              return (
                                  <div
                                      key={item.assetId}
                                      onClick={() => setFee(item)}
                                      className={classNames('p-6 ring-transparent ring-[1px] rounded-xl bg-dark-4 cursor-pointer', {
                                          'ring-teal': active
                                      })}
                                  >
                                      <div className="flex items-center justify-between space-x-4">
                                          <div className="flex items-center justify-between w-full">
                                              <div className="flex flex-col space-y-1">
                                                  <div className="flex items-center space-x-2">
                                                      <img className="w-5 h-5" src={getS3Url(`/images/coins/64/${item.assetId}.png`)} width={20} height={20} />
                                                      <span className="font-semibold">{item.assetCode}</span>
                                                  </div>
                                                  <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark">
                                                      {t(`futures:mobile:adjust_margin:available`)} {formatNumber(availableAsset, _assetConfigs?.assetDigit)}
                                                  </span>
                                              </div>
                                              <div className="flex items-end flex-col justify-between">
                                                  {item?.discount_fee_ratio && (
                                                      <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm line-through">
                                                          {formatNumber(item?.fee_ratio * 100, 5)}%
                                                      </span>
                                                  )}
                                                  <span className="font-semibold">
                                                      {formatNumber((item?.discount_fee_ratio ? item?.discount_fee_ratio : item?.fee_ratio) * 100, 5)}%
                                                  </span>
                                              </div>
                                          </div>
                                          <div className="min-w-[24px]">
                                              {active ? (
                                                  <CheckCircleIcon size={24} color={colors.teal} />
                                              ) : (
                                                  <div style={{ minWidth: 20 }} className="w-5 h-5 rounded-full border-2 border-dark-6 m-auto"></div>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                </div>
                <Button onClick={onSave} disabled={disabled} className="mt-10">
                    {t('futures:fee_modal:save')}
                </Button>
            </ModalV2>
        );
    },
    (pre, next) => {
        return pre.isVisible === next.isVisible && pre.order === next.order;
    }
);

export default FuturesFeeModal;
