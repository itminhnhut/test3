import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Divider from 'components/common/Divider';
import { renderTimeLeft } from '../FundingTab';
import { useFavicon, usePrevious } from 'react-use';

export default function ModalFundingTabMobile({ dataTable, currency }) {
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
            <>
                <div className="flex flex-col items-start justify-between w-full px-4 py-6">
                    <div className="mb-[10px]">{item.asset}</div>
                    <div className="flex justify-between w-full mb-1">
                        <p className="text-sm leading-5 text-txtTabInactive dark:text-txtTabInactive-dark">
                            {t('futures:funding_history:time_left_to_next_funding')}
                        </p>
                        <p className="text-sm leading-5 text-txtPrimary dark:text-txtPrimary-dark">
                            {renderTimeLeft({ targetDate: item?.fundingTime })}
                        </p>
                    </div>
                    {/*  */}
                    <div className="flex justify-between w-full">
                        <p className="text-sm leading-5 text-txtTabInactive dark:text-txtTabInactive-dark">
                            {t('futures:funding_history:funding_rate')}
                        </p>
                        <p className="text-sm leading-5 text-txtPrimary dark:text-txtPrimary-dark">
                            {`${item.fundingRate}%`}
                        </p>
                    </div>
                </div>

                {isLastItem && hasMore ? (
                    <div
                        onClick={handleLoadMore}
                        className={
                            'w-full text-center underline text-txtBtnSecondary dark:text-txtBtnSecondary-dark text-sm leading-6 !mb-4'
                        }
                    >
                        {t('futures:funding_history:more')}
                    </div>
                ) : (
                   <div className='px-4'>
                     <Divider className={'px-4'}/>
                   </div>
                )}
            </>
        );
    };

    if (dataTable?.length === 0) return null;
    return (
        <>
            {dataTable?.slice(0, loadedNumber)?.map((item, index) => {
                return (
                    <Item
                        item={item}
                        isLastItem={index === dataTable?.length - 1 || loadedNumber - 1 === index}
                        hasMore={dataTable?.length > loadedNumber}
                    />
                );
            })}
        </>
    );
}
