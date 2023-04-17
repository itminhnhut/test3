import { useMemo } from 'react';

import ModalV2 from 'components/common/V2/ModalV2';
import SelectV2 from 'components/common/V2/SelectV2';
import TextCopyable from 'components/screens/Account/TextCopyable';

import { formatNumber } from 'redux/actions/utils';

import UserCircle from 'components/svg/UserCircle';

import classNames from 'classnames';
import PropTypes from 'prop-types';

const KIND = {
    Spot: { vi: 'KL Spot', en: 'Spot Volume' },
    Futures: { vi: 'KL Futures', en: 'Futures Volume' },
    Staking: { vi: 'KL Daily Staking', en: 'Daily Staking Vol' }
};

const ModalFriendDetail = ({ isModal, detailFriend, options, toggle, level, onChangeOption, defaultOption, t, language, assetConfig }) => {
    const totalCommission = useMemo(() => {
        const commissionByAsset = (detailFriend?.commission || [])?.find((f) => f?.asset === options?.commission) || {};
        return commissionByAsset?.total || {};
    }, [detailFriend?.commission, options?.commission]);

    const totalOrderVol = useMemo(() => {
        const orderVolByAsset = (detailFriend?.order_vol || [])?.find((f) => f?.asset === options?.orderVol) || {};
        return orderVolByAsset?.total?.reduce((acc, curr) => {
            acc = { ...acc, ...curr };
            return acc;
        }, {});
    }, [detailFriend?.order_vol, options?.orderVol]);

    const valueCommission = useMemo(() => {
        return defaultOption.find((f) => f.value === options.commission)?.value;
    }, [options]);

    const valueOrderVol = useMemo(() => {
        return defaultOption.find((f) => f.value === options.orderVol)?.value;
    }, [options]);

    const handleTotal = (type, value) => {
        const symbol = assetConfig.find((f) => f.id === type) || {};
        return formatNumber(value, symbol?.assetDigit, 0, true);
    };

    return (
        <ModalV2 isVisible={isModal} className="w-[30.5rem]" onBackdropCb={toggle}>
            <div className="flex flex-col items-center">
                <UserCircle size={48} className="mb-3" color="#47cc85" />
                <span className="text-txtPrimary dark:text-gray-4 leading-5 font-semibold mb-2 text-2xl">{detailFriend?.name || '_'}</span>
                <span className="text-gray-1 dark:text-gray-7 leading-6">{detailFriend?.code || '_'}</span>
            </div>
            <div className="w-full flex flex-row items-center justify-between h-10 mt-6">
                <div className="font-semibold">{t('reference:friend_list.detail.commission')}</div>
                <div className="!w-[98px] h-10">
                    <SelectV2
                        position="top"
                        keyExpr="value"
                        className="!h-10"
                        displayExpr="title"
                        options={defaultOption}
                        value={valueCommission}
                        onChange={(e) => onChangeOption(e, 'commission')}
                    />
                </div>
            </div>
            <div className="bg-dark-13 dark:bg-dark-4 p-4 rounded-xl mt-6 last:pb-0">
                <div className={classNames('flex flex-row justify-between', { 'mb-4': level === 0 })}>
                    <div className="text-gray-1 dark:text-gray-7">{t('reference:friend_list.detail.total_commission')}</div>
                    <div className="font-semibold">{handleTotal(valueCommission, totalCommission?.receive)}</div>
                </div>
                {level === 0 && (
                    <div className="flex flex-row justify-between mb-4 last:mb-0">
                        <div className="text-gray-1 dark:text-gray-7">{t('reference:friend_list.detail.payback_commission')}</div>
                        <div className="font-semibold">{handleTotal(valueCommission, totalCommission?.remuneration)}</div>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-row items-center justify-between h-10 mt-8">
                <div className="font-semibold">{t('reference:friend_list.detail.volume')}</div>
                <div className="!w-[98px] h-10">
                    <SelectV2
                        position="top"
                        keyExpr="value"
                        className="!h-10"
                        displayExpr="title"
                        value={valueOrderVol}
                        options={defaultOption}
                        onChange={(e) => onChangeOption(e, 'orderVol')}
                    />
                </div>
            </div>

            <div className="bg-dark-13 dark:bg-dark-4 p-4 rounded-xl mt-6">
                <div className="flex flex-row justify-between mb-4">
                    <div className="text-gray-1 dark:text-gray-7">{KIND['Spot']?.[language]}</div>
                    <div className="font-semibold">{handleTotal(valueOrderVol, totalOrderVol?.spot)}</div>
                </div>
                <div className="flex flex-row justify-between mb-4">
                    <div className="text-gray-1 dark:text-gray-7">{KIND['Futures']?.[language]}</div>
                    <div className="font-semibold">{handleTotal(valueOrderVol, totalOrderVol?.futures)}</div>
                </div>
                <div className="flex flex-row justify-between mb-4 last:mb-0">
                    <div className="text-gray-1 dark:text-gray-7">{KIND['Staking']?.[language]}</div>
                    <div className="font-semibold">{handleTotal(valueOrderVol, totalOrderVol?.staking)}</div>
                </div>
            </div>

            {level === 0 && (
                <>
                    <div className="w-full flex flex-row items-center mt-8 mb-6">
                        <div className="font-semibold">{t('reference:friend_list.detail.title')}</div>
                    </div>
                    <div className="bg-dark-13 dark:bg-dark-4 p-4 rounded-xl mt-6 ">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="text-gray-1 dark:text-gray-7">{t('reference:referral.referral_code')}</div>
                            <div className="font-semibold">
                                <TextCopyable text={detailFriend?.relation?.refCode} />
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="text-gray-1 dark:text-gray-7">{t('reference:friend_list.detail.received')}</div>
                            <div className="font-semibold text-teal dark:text-teal-2">
                                {100 - detailFriend?.relation?.remunerationRate}%/{detailFriend?.relation?.remunerationRate}%
                            </div>
                        </div>
                    </div>
                </>
            )}
        </ModalV2>
    );
};

ModalFriendDetail.propTypes = {
    isModal: PropTypes.bool,
    detailFriend: PropTypes.shape({
        commission: PropTypes.arrayOf(
            PropTypes.shape({
                asset: PropTypes.number,
                total: PropTypes.shape({
                    receive: PropTypes.number,
                    remuneration: PropTypes.number
                })
            })
        ),
        order_vol: PropTypes.arrayOf(
            PropTypes.shape({
                asset: PropTypes.number,
                total: PropTypes.arrayOf(
                    PropTypes.shape({
                        spot: PropTypes.number
                    })
                )
            })
        ),
        relation: PropTypes.shape({
            refCode: PropTypes.string,
            remunerationRate: PropTypes.number
        })
    }),
    options: PropTypes.shape({
        commission: PropTypes.number,
        orderVol: PropTypes.number
    }),
    level: PropTypes.number,
    defaultOption: PropTypes.array,

    toggle: PropTypes.func,
    onChangeOption: PropTypes.func
};

export default ModalFriendDetail;
