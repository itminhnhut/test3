import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Divider from 'components/common/Divider';
import { renderTimeLeft } from '../FundingTab';

export default function ModalFundingTabMobile({ dataTable }) {
    const { t } = useTranslation();

    const [loadedNumber, setLoadedNumber] = useState(10);

    const handleLoadMore = () => {
        setLoadedNumber(loadedNumber + 10);
    };

    const Item = ({ item, index, isLastItem, hasMore }) => {
        return (
            <div className="flex flex-col items-start justify-between w-full">
                <div className="mb-[10px] text-base leading-[22px] text-txtPrimary dark:text-txtPrimary-dark">
                    {item.asset}
                </div>
                <div className="flex justify-between w-full mb-1">
                    <p className="text-sm leading-5 text-txtTabInactive dark:text-txtTabInactive-dark">
                        {t('futures:funding_history:time_left_to_next_funding')}
                    </p>
                    <p className="text-sm leading-5 text-txtPrimary dark:text-txtPrimary-dark">
                        {renderTimeLeft({ targetDate: item?.fundingTime })}
                    </p>
                </div>
                {/*  */}
                <div className="flex justify-between w-full mb-[26px]">
                    <p className="text-sm leading-5 text-txtTabInactive dark:text-txtTabInactive-dark">
                        {t('futures:funding_history:funding_rate')}
                    </p>
                    <p className="text-sm leading-5 text-txtPrimary dark:text-txtPrimary-dark">
                        {`${item.fundingRate}%`}
                    </p>
                </div>
                {isLastItem && hasMore ? (
                    <div
                        onClick={handleLoadMore}
                        className={
                            'w-full text-center underline text-txtBtnSecondary dark:text-txtBtnSecondary-dark text-sm leading-6'
                        }
                    >
                        {t('futures:funding_history:more')}
                    </div>
                ) : (
                    <Divider />
                )}
            </div>
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
