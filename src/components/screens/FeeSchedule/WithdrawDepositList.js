import TextButton from 'components/common/V2/ButtonV2/TextButton';
import AssetLogo from 'components/wallet/AssetLogo';
import React, { useEffect, useState } from 'react';
import NoResult from '../Support/NoResult';
import { dwLinkBuilder, formatNumber, walletLinkBuilder } from 'redux/actions/utils';
import Link from 'next/link';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { TYPE_DW } from '../WithdrawDeposit/constants';

const ROW_PER_PAGE = 4;
const WithdrawDepositList = ({ t, paymentConfigs, search, configs }) => {
    const [paymentFees, setPaymentFees] = useState({ filteredData: [], data: [], page: 1, maxPage: 1 });

    useEffect(() => {
        const paymentFeesFilter = paymentConfigs?.filter((fee) => fee.assetCode?.toLowerCase().includes(search?.toLowerCase()));

        setPaymentFees((prev) => ({
            ...prev,
            filteredData: paymentFeesFilter,
            data: paymentFeesFilter.slice(0, ROW_PER_PAGE),
            page: 1,
            maxPage: Math.ceil(paymentFeesFilter.length / ROW_PER_PAGE)
        }));
    }, [search, paymentConfigs]);

    const onShowMore = () => {
        const { page, maxPage, filteredData } = paymentFees;
        const newPage = page + 1;
        if (newPage > maxPage) {
            return;
        }

        const newData = [...filteredData.slice(0, ROW_PER_PAGE * newPage)];

        setPaymentFees((prev) => ({ ...prev, data: newData, page: newPage }));
    };

    return (
        <div className="pt-8">
            <div className="flex flex-col gap-4">
                {paymentFees.data.map((fee, index) => {
                    const assetDigit = configs?.find((conf) => conf.assetCode === fee?.assetCode)?.assetDigit;
                    return <PaymentFeeRowV2 key={fee.assetCode} lastIndex={index === paymentFees.data.length - 1} t={t} fee={fee} assetDigit={assetDigit} />;
                })}
            </div>
            {paymentFees.filteredData.length > ROW_PER_PAGE && (
                <TextButton className="mt-[30px] !text-sm" onClick={onShowMore}>
                    {paymentFees.page + 1 <= paymentFees.maxPage && t('fee-structure:show_more_2')}
                </TextButton>
            )}
            {!paymentFees.filteredData.length && (
                <>
                    <div className="text-center text-txtSecondary dark:text-txtSecondary-dark text-sm">
                        <NoResult />
                        {t('common:no_results_found')}
                    </div>
                </>
            )}
        </div>
    );
};

const PaymentFeeRow = ({ t, fee, assetDigit, lastIndex }) => (
    <div className={`pb-4 ${!lastIndex ? 'border-b border-divider dark:border-divider-dark ' : ' '} pt-4`}>
        <div className="mb-6">
            <div className="flex mb-3 justify-between items-center text-xs text-txtSecondary dark:text-txtSecondary-dark">
                <div>Coin / Token</div>
                <div>{t('wallet:deposit_fee')}</div>
            </div>
            <div className="flex mb-3 justify-between items-center" passHref>
                <Link
                    href={dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, fee?.assetCode)}
                    // href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, {
                    //     type: 'crypto',
                    //     asset: fee?.assetCode
                    // })}
                >
                    <div className="text-base font-semibold flex items-center hover:!underline">
                        <AssetLogo assetCode={fee?.assetCode} size={20} />
                        <div className="ml-2"> {fee?.assetCode}</div>
                    </div>
                </Link>

                <div className="text-dominant text-sm font-semibold">{t('common:free')}</div>
            </div>
        </div>
        <div>
            {fee.networkList.map((network, i) => (
                <div key={network._id} className="mb-3">
                    <NetworkPaymentCard network={network} i={i} t={t} assetDigit={assetDigit} />
                </div>
            ))}
        </div>
    </div>
);

const PaymentFeeRowV2 = ({ t, fee, assetDigit, lastIndex }) => {
    const sortedNetworkList = fee?.networkList.sort((a, b) => parseFloat(a.withdrawFee) - parseFloat(b.withdrawFee));
    return (
        <div>
            <div className="bg-hover-1 dark:bg-darkBlue-3 p-4 rounded-md">
                <div className="flex mb-3 justify-between items-center text-xs">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">Coin/Token</div>
                    <Link href={dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, fee?.assetCode)}>
                        <div className="text-base font-semibold flex items-center hover:!underline">
                            <AssetLogo assetCode={fee?.assetCode} size={20} />
                            <div className="ml-2 text-sm"> {fee?.assetCode}</div>
                        </div>
                    </Link>
                </div>
                <div className="border-t-[1px] border-divider dark:border-divider-dark pt-[12.5px]">
                    <div className="flex mb-3 justify-between items-center text-xs">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">Mạng lưới</div>
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">Phí mạng lưới</div>
                    </div>
                    <div className="flex gap-3 flex-col">
                        {sortedNetworkList.map((network, i) => (
                            <div key={network._id}>
                                <div className="flex justify-between items-center text-sm">
                                    <div>{network?.name}</div>
                                    <div>{formatNumber(network?.withdrawFee, assetDigit, network?.withdrawFee === 0 ? 6 : 0)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NetworkPaymentCard = ({ t, network, i, assetDigit }) => (
    <div className="bg-hover-1 dark:bg-darkBlue-3 p-3 rounded-md">
        <div className="flex mb-3 justify-between items-center text-sm">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                {t('wallet:network')} {i + 1}
            </div>
            <div>{network?.name}</div>
        </div>
        <div className="flex mb-3 justify-between items-center text-sm">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:min_withdraw')}</div>
            <div>{formatNumber(network?.withdrawMin, assetDigit, network?.withdrawMin === 0 ? 6 : 0)}</div>
        </div>
        <div className="flex mb-3 justify-between items-center text-sm">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:withdraw_fee')}</div>
            <div>{formatNumber(network?.withdrawFee, assetDigit, network?.withdrawFee === 0 ? 6 : 0)}</div>
        </div>
    </div>
);

export default WithdrawDepositList;
