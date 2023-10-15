const InfoDeposit = ({ totalDebt, totalAdjust }) => {
    return (
        <section className="dark:bg-dark-4 bg-dark-13 pt-6 pb-4 px-4 rounded-md my-6">
            <section className="flex flex-row justify-between">
                <section className="dark:text-gray-7 text-gray-1">Tổng dư nợ</section>
                <section className="text-gray-15 font-semibold dark:text-gray-4">
                    {totalDebt.total} {totalDebt.assetCode}
                </section>
            </section>
            <div className="h-[1px] dark:bg-divider-dark bg-divider my-3" />
            <section className="flex flex-row justify-between">
                <section className="dark:text-gray-7 text-gray-1">Tổng ký quỹ</section>
                <section className="text-gray-15 font-semibold dark:text-gray-4">
                    {totalAdjust.total} {totalAdjust.assetCode}
                </section>
            </section>
        </section>
    );
};

export default InfoDeposit;
