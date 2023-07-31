import { IconLoading } from 'components/common/Icons';
import Tooltip from 'components/common/Tooltip';
import Button from 'components/common/V2/ButtonV2/Button';
import { FutureInsurance } from 'components/svg/SvgIcon';
import useFetchApi from 'hooks/useFetchApi';
import useToggle from 'hooks/useToggle';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'react-feather';
import { useSelector } from 'react-redux';
import { API_USER_INSURANCE_HISTORY } from 'redux/actions/apis';
import { FuturesOrderEnum, UserSocketEvent } from 'redux/actions/const';
import { getInsuranceLoginLink, roundByExactDigit } from 'redux/actions/utils';
import InsuranceListModal from './InsuranceListModal';
import InsuranceRuleModal from './InsuranceRuleModal';

const initialState = {
    showRules: false,
    showList: false
};

const InsuranceSection = React.memo(({ onCloseOrderDetailModal, insuranceRules, order, liquidPrice }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'futures']);
    const [state, set] = useState(initialState);
    const userSocket = useSelector((state) => state.socket.userSocket);
    const [refetch, toggleRefetch] = useToggle();

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.INSURANCE_CONTRACTS, (displayingId) => {
                if (order?.displaying_id === +displayingId) {
                    toggleRefetch();
                }
            });
        }

        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.INSURANCE_CONTRACTS, (data) => {
                    console.log('socket removeListener INSURANCE_CONTRACTS:', data);
                });
            }
        };
    }, [userSocket, order?.displaying_id]);

    const { data, loading } = useFetchApi(
        {
            url: API_USER_INSURANCE_HISTORY + `/${order?.displaying_id}`
        },
        order?.displaying_id,
        [order?.displaying_id, refetch]
    );

    const isPurchaseAble = useMemo(() => {
        if (!insuranceRules.length) return false;
        const existRule = insuranceRules.find((insurance) => {
            return insurance.symbol === order?.symbol;
        });

        if (existRule) {
            return order?.leverage <= existRule.max_leverage;
        }
        return false;
    }, [insuranceRules, order?.symbol]);

    const formatLiquidPrice = roundByExactDigit(liquidPrice, order?.fee_currency === 72 ? 0 : 6);

    const onBuyInsuranceHandler = async () => {
        if (!isPurchaseAble) return;
        await getInsuranceLoginLink({
            params: `${order?.symbol}?${encodeURIComponent(
                `integrate=nami_futures&type=${order?.type}&vol=${order?.order_value}&liq=${formatLiquidPrice}&side=${order?.side}&order=${order?.displaying_id}`
            )}`,
            language,
            targetType: '_blank'
        });
    };
    return (
        <>
            {!isPurchaseAble && (
                <Tooltip
                    effect="solid"
                    isV3
                    place="top"
                    id="insurance_purchase_button"
                    className="max-w-[240px] after:!left-[unset] after:!right-8"
                    overridePosition={({ top, left }) => {
                        return {
                            top,
                            left: left - 52
                        };
                    }}
                >
                    <div className="max-w-[300px] text-sm z-50">{t('futures:insurance:condition_buy_cover')}</div>
                </Tooltip>
            )}

            <div className="mb-8 p-4 bg-white dark:bg-dark-4 border dark:border-none rounded-xl">
                <div className="flex justify-between items-center">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:insurance:title')}</div>
                    <div
                        className="text-teal hover:text-green-4 font-semibold flex items-center space-x-2 cursor-pointer"
                        onClick={() => setState({ showRules: true })}
                    >
                        <span>{t('futures:insurance:rules')}</span>
                        <ChevronRight color="currentColor" size={16} strokeWidth={1.5} />
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-1 text-2xl font-semibold">
                        <span>{loading ? <IconLoading color="currentColor" /> : isNaN(data?.data?.count) ? '0' : data?.data?.count}</span>
                        <span className="lowercase">{t('futures:insurance:contracts')}</span>
                        <FutureInsurance size={32} />
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            className="px-4 py-3 !text-sm !h-9"
                            disabled={loading || isNaN(data?.data?.count) || !data?.data?.count}
                            variants="secondary"
                            onClick={() => setState({ showList: true })}
                        >
                            {t('common:view_all')}
                        </Button>
                        {order?.status === FuturesOrderEnum.Status.ACTIVE && (
                            <div data-tip="" data-for="insurance_purchase_button">
                                <Button className="w-fit !text-sm !h-9 px-4 py-3 whitespace-nowrap" disabled={!isPurchaseAble} onClick={onBuyInsuranceHandler}>
                                    {t('futures:insurance.buy_insurance')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {state.showRules && (
                <InsuranceRuleModal
                    insuranceRules={insuranceRules}
                    visible={state.showRules}
                    onCloseAll={() => {
                        setState({ showRules: false });
                        onCloseOrderDetailModal();
                    }}
                    onClose={() => setState({ showRules: false })}
                />
            )}
            {state.showList && (
                <InsuranceListModal
                    symbol={order?.symbol}
                    insurances={data.data.insurance}
                    visible={state.showList}
                    onClose={() => setState({ showList: false })}
                    onCloseAll={() => {
                        setState({ showList: false });
                        onCloseOrderDetailModal();
                    }}
                />
            )}
        </>
    );
});

export default InsuranceSection;
