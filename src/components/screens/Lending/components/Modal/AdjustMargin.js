import { useState } from 'react';

// ** next
import { useTranslation } from 'next-i18next';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { setTransferModal } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux';

//** components
import ModalV2 from 'components/common/V2/ModalV2';
import InputV2 from 'components/common/V2/InputV2';
import InputSlider from 'src/components/trade/InputSlider';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import dynamic from 'next/dynamic';

const MARGIN = [
    { title: { vi: 'Thêm ký quỹ', en: 'Thêm ký quỹ' }, key: 'add' },
    { title: { vi: 'Bớt ký quỹ', en: 'Bớt ký quỹ' }, key: 'subtract' }
];

const ModalConfirmMargin = dynamic(() => import('./ConfirmMargin'), { ssr: false });

const AdjustMargin = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const dispatch = useDispatch();

    //**  useState
    const [tab, setTab] = useState('add');
    const [isConfirmModal, setIsConfirmModal] = useState(false);

    // ** handle
    const handleToggle = () => setIsConfirmModal((prev) => !prev);

    // ** render
    const renderAddMargin = () => {
        return (
            <>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="dark:text-gray-4 font-semibold">85%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">85%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>Tổng ký quỹ điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">2 BTC</div>
                    </section>
                </section>
            </>
        );
    };

    const renderSubtractMargin = () => {
        return (
            <>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Lưu ý</div>
                <div className="my-6 text-gray-1 dark:text-gray-7">{`Chỉ cho phép bớt ký quỹ khi LTV < LTV ban đầu. LTV cuối cùng phải ≤ LTV ban đầu.`}</div>
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="dark:text-gray-4 font-semibold">85%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">85%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>Tổng ký quỹ điều chỉnh</div>
                        <div className="dark:text-gray-4 font-semibold">2 BTC</div>
                    </section>
                </section>
            </>
        );
    };

    return (
        <>
            <ModalV2
                isVisible={isModal}
                className="w-[800px] overflow-auto no-scrollbar"
                onBackdropCb={onClose}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onClose}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <div className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Điều chỉnh ký quỹ</div>
                <section className="mt-6 flex flex-row gap-6">
                    <section className="w-1/2">
                        <section className="cursor-pointer flex flex-row border rounded border-divider dark:border-divider-dark justify-between text-center bg-white dark:bg-dark">
                            {MARGIN?.map((item, key) => {
                                return (
                                    <section
                                        key={`margin_${key}_${item.title?.[language]}`}
                                        className={classNames('w-1/2 dark:text-gray-7 text-gray-1 font-semibold py-4', {
                                            'dark:bg-dark-2 bg-dark-12 dark:text-gray-4 text-gray-15': item.key === tab,
                                            'border-r-[1px] border-r-divider dark:border-r-divider-dark': key === 0
                                        })}
                                        onClick={() => setTab(item.key)}
                                    >
                                        {item.title?.[language]}
                                    </section>
                                );
                            })}
                        </section>
                        <section className="dark:bg-dark-4 bg-dark-13 pt-6 pb-4 px-4 rounded-md my-6">
                            <section className="flex flex-row justify-between">
                                <section className="dark:text-gray-7 text-gray-1">Tổng dư nợ</section>
                                <section className="text-gray-15 font-semibold dark:text-gray-4">711,014,163 VNDC</section>
                            </section>
                            <div className="h-[1px] dark:bg-divider-dark bg-divider my-3" />
                            <section className="flex flex-row justify-between">
                                <section className="dark:text-gray-7 text-gray-1">Tổng ký quỹ</section>
                                <section className="text-gray-15 font-semibold dark:text-gray-4">6,6 BTC</section>
                            </section>
                        </section>
                        <section>
                            <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1 text-sm">
                                <section className="">Số lượng</section>
                                <section className="flex flex-row items-center gap-1">
                                    <div className="flex flex-row">
                                        <span>Khả dụng:</span>
                                        <span className="dark:text-gray-4 text-gray-15">2 BTC</span>
                                    </div>
                                    <AddCircleColorIcon
                                        size={16}
                                        onClick={() =>
                                            dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.SPOT, toWallet: WalletType.FUTURES }))
                                        }
                                        className="cursor-pointer"
                                    />
                                </section>
                            </section>
                            <InputV2 className="mt-4" />
                            <InputSlider
                                axis="x"
                                labelSuffix="%"
                                useLabel
                                positionLabel="top"
                                x={0}
                                // onChange={({ x }) => {
                                //     onHandleChange('percentage', x, { side: _orderSide });
                                // }}
                            />
                        </section>
                    </section>
                    <section className="w-1/2 dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">{tab === 'add' ? renderAddMargin() : renderSubtractMargin()}</section>
                </section>
                <ButtonV2 className="mt-10">Thêm ký quỹ</ButtonV2>
            </ModalV2>
            <ModalConfirmMargin isModal={isConfirmModal} onClose={handleToggle} />
        </>
    );
};

export default AdjustMargin;
