import TextButton from 'components/common/V2/ButtonV2/TextButton';
import { FEE_TABLE } from 'constants/constants';
import { orderBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

const ROW_PER_PAGE = 10;

const FeeTabMobile = ({ tabIndex, translate, futuresFeeConfig, loadingFuturesFeeConfigs }) => {
    const [chosenFuturesFee, setChosenFuturesFee] = useState({ dataFilter: [], data: [], page: 1, maxPage: 0 });

    useEffect(() => {
        const dataFilter = futuresFeeConfig?.filter((config) => {
            const quote = config?.name.substring(config?.name?.length - 4);
            if (tabIndex === 1) {
                return quote === 'USDT';
            } else if (tabIndex === 2) {
                return quote === 'VNDC';
            }
        });

        const sortedData = orderBy(dataFilter, ['name'], ['asc']);

        setChosenFuturesFee({
            dataFilter: sortedData,
            data: sortedData.slice(0, ROW_PER_PAGE),
            page: 1,
            maxPage: Math.ceil(dataFilter?.length / ROW_PER_PAGE)
        });
    }, [futuresFeeConfig, tabIndex]);

    const onShowMore = () => {
        const newPage = chosenFuturesFee.page + 1;
        if (newPage > chosenFuturesFee.maxPage) {
            // setChosenFuturesFee((prev) => ({ ...prev, data: prev.dataFilter.slice(0, ROW_PER_PAGE), page: 1 }));
            return;
        }

        const newFuturesFee = [...chosenFuturesFee.dataFilter.slice(0, ROW_PER_PAGE * newPage)];
        setChosenFuturesFee((prev) => ({ ...prev, page: newPage, data: newFuturesFee }));
    };
    return (
        <div>
            {tabIndex === 0 ? (
                FEE_TABLE.map((feeEx) => <ExchangeTabColumn key={feeEx.level} translate={translate} fee={feeEx} />)
            ) : loadingFuturesFeeConfigs ? (
                <></>
            ) : (
                <>
                    {chosenFuturesFee.data.map((feeEx, index) => (
                        <FuturesTabColumn lastIndex={index === chosenFuturesFee.data.length - 1} key={feeEx.level} translate={translate} fee={feeEx} />
                    ))}

                    <TextButton onClick={onShowMore}>{chosenFuturesFee.page + 1 <= chosenFuturesFee.maxPage && translate('common:show_more')}</TextButton>
                </>
            )}
        </div>
    );
};

const ExchangeTabColumn = ({ fee, translate }) => (
    <div className="pb-4 border-b border-divider dark:border-divider-dark pt-4 last:border-b-0">
        <div className="mb-6">
            <div className="flex text-txtSecondary dark:text-txtSecondary-dark justify-between items-center text-xs mb-2">
                <div className="">{translate('common:fee_level')}</div>
                <div>NAMI</div>
            </div>
            <div className="flex font-semibold justify-between items-center mb-2">
                <div className="">VIP {fee.level}</div>
                <div>
                    {'≥'} {fee.nami_holding}
                </div>
            </div>
        </div>
        <div className="mb-4">
            <div className="flex  justify-between items-center text-sm mb-3">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">Maker/Taker</div>
                <div>{fee.maker_taker}</div>
            </div>
            <div className="flex  justify-between items-center text-sm">
                <div className="text-txtSecondary dark:text-txtSecondary-dark ">
                    <div>Maker/Taker</div>
                    <div className="text-dominant">
                        (
                        {translate('fee-structure:use_asset_deduction', {
                            value: '25%',
                            asset: 'NAMI'
                        })}
                        )
                    </div>
                </div>
                <div>{fee.maker_taker_deducted}</div>
            </div>
        </div>
    </div>
);

const FuturesTabColumn = ({ fee, translate, lastIndex }) => (
    <div className={`pb-4 ${!lastIndex ? 'border-b border-divider dark:border-divider-dark ' : ' '} pt-4`}>
        <div className="mb-6">
            <div className="flex text-txtSecondary dark:text-txtSecondary-dark justify-between items-center text-xs mb-2">
                <div className="">{translate('common:pair')}</div>
                <div>{translate('common:max_leverage')}</div>
            </div>
            <div className="flex font-semibold justify-between items-center mb-2">
                <div className="">{fee.name}</div>
                <div>{fee.max_leverage}x</div>
            </div>
        </div>
        <div className="mb-4">
            <div className="flex  justify-between items-center text-sm mb-3">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                    {translate('common:fee')} ({translate('common:open')}/{translate('common:close')})
                </div>
                <div>
                    {fee?.place_order_fee * 100}% / {fee?.close_order_fee * 100}%
                </div>
            </div>
            <div className="flex  justify-between items-center text-sm">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                    {translate('common:fee')} NAMI ({translate('common:open')}/{translate('common:close')})
                </div>
                <div>
                    {fee.place_order_fee_promote * 100}% / {fee.close_order_fee_promote * 100}%
                </div>
            </div>
        </div>
    </div>
);

export default FeeTabMobile;
