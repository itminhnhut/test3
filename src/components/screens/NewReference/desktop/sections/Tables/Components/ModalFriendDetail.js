import { useMemo } from 'react';

import ModalV2 from 'components/common/V2/ModalV2';
import SelectV2 from 'components/common/V2/SelectV2';
import TextCopyable from 'components/screens/Account/TextCopyable';

import { formatNumber } from 'redux/actions/utils';

import UserCircle from 'components/svg/UserCircle';

import classNames from 'classnames';
import PropTypes from 'prop-types';

const ModalFriendDetail = ({ isModal, detailFriend, options, toggle, level, onChangeOption, defaultOption }) => {
    const totalCommission = useMemo(() => {
        const commissionByAsset = (detailFriend?.commission || [])?.find((f) => f?.asset === options?.commission) || {};
        return commissionByAsset?.total || {};
    }, [detailFriend?.commission, options?.commission]);

    const totalOrderVol = useMemo(() => {
        const orderVolByAsset = (detailFriend?.order_vol || [])?.find((f) => f?.asset === options?.orderVol) || {};
        return orderVolByAsset?.total?.reduce((acc, curr) => {
            acc = { spot: curr?.spot || 0, staking: curr?.staking || 0, futures: curr?.futures || 0 };
            return acc;
        }, {});
    }, [detailFriend?.order_vol, options?.orderVol]);

    const valueCommission = useMemo(() => {
        return defaultOption.find((f) => f.value === options.commission)?.value;
    }, [options]);

    const valueOrderVol = useMemo(() => {
        return defaultOption.find((f) => f.value === options.orderVol)?.value;
    }, [options]);

    return (
        <ModalV2 isVisible={isModal} className="w-[30.5rem]" onBackdropCb={toggle}>
            <div className="flex flex-col items-center">
                <UserCircle size={48} className="mb-3" color="#47cc85" />
                <span className="text-txtPrimary dark:text-gray-4 leading-5 font-semibold mb-2">{detailFriend?.name || '_'}</span>
                <span className="text-gray-1 dark:text-gray-7 leading-6">{detailFriend?.code || '_'}</span>
            </div>
            <div className="w-full flex flex-row items-center justify-between h-10 mt-6">
                <div className="font-semibold">Hoa hồng</div>
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
            <div className="bg-[#141921] dark:bg-[#141921] p-4 rounded-xl mt-6">
                <div className={classNames('flex flex-row justify-between', { 'mb-4': level === 0 })}>
                    <div className="text-gray-1 dark:text-gray-7">Tổng hoa hồng</div>
                    <div className="font-semibold">{formatNumber(totalCommission?.receive || 0, 2)}</div>
                </div>
                {level === 0 && (
                    <div className="flex flex-row justify-between mb-4 last:mb-0">
                        <div className="text-gray-1 dark:text-gray-7">Hoa hồng chia sẻ</div>
                        <div className="font-semibold">{formatNumber(totalCommission?.remuneration || 0, 2)}</div>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-row items-center justify-between h-10 mt-8">
                <div className="font-semibold">Khối lượng giao dịch</div>
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

            <div className="bg-[#141921] dark:bg-[#141921] p-4 rounded-xl mt-6">
                <div className="flex flex-row justify-between mb-4">
                    <div className="text-gray-1 dark:text-gray-7">Spot</div>
                    <div className="font-semibold">{formatNumber(totalOrderVol?.spot || 0, 2)}</div>
                </div>
                <div className="flex flex-row justify-between mb-4">
                    <div className="text-gray-1 dark:text-gray-7">Futures</div>
                    <div className="font-semibold">{formatNumber(totalOrderVol?.futures || 0, 2)}</div>
                </div>
                <div className="flex flex-row justify-between mb-4 last:mb-0">
                    <div className="text-gray-1 dark:text-gray-7">Staking</div>
                    <div className="font-semibold">{formatNumber(totalOrderVol?.staking || 0, 2)}</div>
                </div>
            </div>

            {level === 0 && (
                <>
                    <div className="w-full flex flex-row items-center mt-8 mb-6">
                        <div className="font-semibold">Thông tin chi tiết</div>
                    </div>
                    <div className="bg-[#141921] dark:bg-[#141921] p-4 rounded-xl mt-6">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="text-gray-1 dark:text-gray-7">Mã giới thiệu</div>
                            <div className="font-semibold">
                                <TextCopyable text={detailFriend?.relation?.refCode} />
                            </div>
                        </div>

                        <div className="flex flex-row justify-between mb-4">
                            <div className="text-gray-1 dark:text-gray-7">Bạn nhận/Bạn bè nhận</div>
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
