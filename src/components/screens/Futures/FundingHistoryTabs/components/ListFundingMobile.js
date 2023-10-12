import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Divider from 'components/common/Divider';
import { usePrevious } from 'react-use';
import Skeletor from 'components/common/Skeletor';
import { Countdown } from 'redux/actions/utils';
import NoData from 'components/common/V2/TableV2/NoData';

export default function ListFundingMobile({ dataTable, currency, loading, isSearch }) {
    const { t } = useTranslation();
    const prevCurrency = usePrevious(currency);

    const [loadedNumber, setLoadedNumber] = useState(10);

    useEffect(() => {
        if (currency !== prevCurrency) {
            setLoadedNumber(10);
        }
    }, [currency, prevCurrency]);

    const handleLoadMore = () => {
        setLoadedNumber(loadedNumber + 10);
    };

    const Item = ({ item, index, isLastItem, hasMore }) => {
        return (
            <Fragment key={item.asset}>
                <div className="flex flex-col items-start justify-between w-full py-8 sm:px-6">
                    <div className="mb-6">{item.asset}</div>
                    <div className="space-y-3 w-full">
                        <div className="flex justify-between w-full">
                            <p className="text-sm text-txtTabInactive dark:text-txtTabInactive-dark">
                                {t('futures:funding_history_tab:time_left_to_next_funding')}
                            </p>
                            <p className="text-sm text-txtPrimary dark:text-txtPrimary-dark">
                                {item?.isSkeleton ? item.fundingTime : <Countdown date={item?.fundingTime} />}
                            </p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p className="text-sm text-txtTabInactive dark:text-txtTabInactive-dark">{t('futures:funding_history_tab:funding_rate')}</p>
                            <p className="text-sm text-txtPrimary dark:text-txtPrimary-dark">{item?.isSkeleton ? item.fundingTime : `${item.fundingRate}%`}</p>
                        </div>
                    </div>
                </div>

                {isLastItem && hasMore ? (
                    <div onClick={handleLoadMore} className="text-teal text-sm font-semibold text-center cursor-pointer mb-8 mt-2">
                        {t('futures:funding_history_tab:more')}
                    </div>
                ) : (
                    <Divider />
                )}
            </Fragment>
        );
    };

    const skeletons = useMemo(() => {
        const skeletons = [];
        for (let i = 0; i < 10; ++i) {
            skeletons.push({ ...ROW_SKELETON, isSkeleton: true, key: `asset__skeleton__${i}` });
        }
        return skeletons;
    }, []);

    if (!skeletons?.length) return null;
    if (!loading && !dataTable.length) return <NoData isSearch={!!isSearch} />;

    return (
        <>
            {(!loading ? dataTable : skeletons)?.slice(0, loadedNumber)?.map((item, index) => {
                return (
                    <Item item={item} isLastItem={index === dataTable?.length - 1 || loadedNumber - 1 === index} hasMore={dataTable?.length > loadedNumber} />
                );
            })}
        </>
    );
}

const ROW_SKELETON = {
    asset: <Skeletor width={200} />,
    fundingTime: <Skeletor width={65} />,
    fundingRate: <Skeletor width={65} />
};
