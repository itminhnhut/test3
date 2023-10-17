// ** utils
import { formatLTV } from 'components/screens/Lending/utils';

// ** constants
import { PERCENT } from 'components/screens/Lending/constants';

const SubtractMarginResult = ({ isDefaultDash, currentLTV, initialLTV, adjustedLTV, totalAmountAdjusted }) => {
    return (
        <section className="flex flex-col gap-6 w-1/2">
            <section className="dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Lưu ý</div>
                <div className="mt-6 text-gray-1 dark:text-gray-7">{`Chỉ cho phép bớt ký quỹ khi LTV < LTV ban đầu. LTV cuối cùng phải ≤ LTV ban đầu.`}</div>
            </section>
            <section className="dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
                <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
                <section className="flex flex-col gap-3 mt-6">
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV ban đầu</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{initialLTV * PERCENT}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV Hiện tại</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{currentLTV}%</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div>LTV đã điều chỉnh</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{isDefaultDash || `${formatLTV(adjustedLTV)}%`}</div>
                    </section>
                    <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                        <div className="flex flex-wrap">Tổng ký quỹ điều chỉnh</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold flex flex-row gap-1">
                            {isDefaultDash || (
                                <>
                                    <span>{totalAmountAdjusted.total}</span>
                                    <span>{totalAmountAdjusted.assetCode}</span>
                                </>
                            )}
                        </div>
                    </section>
                </section>
            </section>
        </section>
    );
};
export default SubtractMarginResult;
