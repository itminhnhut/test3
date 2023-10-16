//** utils
import { formatLTV } from 'components/screens/Lending/utils';

const AddMarginResult = ({ currentLTV, adjustedLTV, totalAmountAdjusted, isDefaultDash }) => {
    return (
        <section className="w-1/2 dark:bg-dark-4 bg-dark-13 p-4 rounded-xl">
            <div className="dark:text-gray-4 text-gray-15 font-semibold">Kết quả</div>
            <section className="flex flex-col gap-3 mt-6">
                <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                    <div>LTV Hiện tại</div>
                    <div className="text-gray-15 dark:text-gray-4 font-semibold">{currentLTV}%</div>
                </section>
                <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7">
                    <div>LTV đã điều chỉnh</div>
                    <div className="text-gray-15 dark:text-gray-4 font-semibold">{isDefaultDash || `${formatLTV(adjustedLTV)}%`}</div>
                </section>
                <section className="flex flex-row justify-between text-gray-1 dark:text-gray-7 flex-wrap">
                    <div>Tổng ký quỹ điều chỉnh</div>
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
    );
};

export default AddMarginResult;
