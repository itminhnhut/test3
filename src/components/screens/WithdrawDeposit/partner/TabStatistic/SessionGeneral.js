import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import CardWrapper from 'components/common/CardWrapper';
import { formatNumber } from 'utils/reference-utils';
import { formatAbbreviateNumber, formatPercentage } from 'redux/actions/utils';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_REPORT_PARTNER } from 'redux/actions/apis';
import Skeletor from 'components/common/Skeletor';
import FilterTimeTab from 'components/common/FilterTimeTab';

const mockData = {
    totalCommission: {
        totalValue: [],
        convertedCommissionValue: 0
    },
    totalPartnerOrderVolume: {
        _id: 0,
        sumBuy: 36000,
        sumSell: 50053000,
        convertedBuyVolume: 36000,
        convertedSellVolume: 50053000
    },
    commissionRate: null
};

const SessionGeneral = () => {
    const { t } = useTranslation();

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });

    const { data, loading, error } = useFetchApi(
        { url: API_GET_COMMISSION_REPORT_PARTNER, params: { from: +filter?.range?.startDate, to: +filter?.range?.endDate } },
        true,
        [filter]
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="font-semibold text-[20px] leading-6">Báo cáo hoa hồng</div>
                <FilterTimeTab filter={filter} setFilter={setFilter} />
            </div>

            {/* Body */}
            <div className="flex gap-x-6">
                <CardWrapper className="flex-auto flex">
                    <div className="w-1/2 pr-7 border-r border-divider dark:border-divider-dark">
                        {/* top */}
                        <div>
                            <h1 className="txtSecond-3">Tổng hoa hồng</h1>
                            <div className="pt-4 txtPri-5">
                                {loading ? (
                                    <Skeletor width="100px" />
                                ) : (
                                    formatNumber(
                                        data?.totalCommission.totalValue.filter((item) => item !== null).reduce((acc, val) => acc + val, 0),
                                        0
                                    )
                                )}
                            </div>
                        </div>

                        {/* divider */}
                        <hr className="border-divider dark:border-divider-dark my-4" />

                        {/* bottom */}
                        <div>
                            <h1 className="txtSecond-3">Tỷ lệ hoa hồng</h1>
                            <div className="pt-4 txtPri-5">{loading ? <Skeletor width="100px" /> : `${formatPercentage(data?.commissionRate * 100, 2)}%`}</div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-end justify-center">
                        <h1 className="txtSecond-3">Tổng khối lượng</h1>
                        <div className="pt-4 txtPri-6 flex">
                            <span className="text-green-3 dark:text-green-2">
                                {loading ? <Skeletor width="50px" /> : formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedBuyVolume)}
                            </span>
                            {loading ? <Skeletor width="50px" /> : <span>/{formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedSellVolume)}</span>}
                        </div>
                    </div>
                </CardWrapper>
                <CardWrapper className="flex-auto flex gap-x-6 justify-between">
                    <div className="max-w-[237px] flex flex-col">
                        <div className="txtPri-5 pb-4">Đối tác nạp rút tiêu biểu</div>
                        <div className="txtSecond-3 text-left flex items-center flex-auto">
                            Lorem ipsum dolor sit amet consectetur. Tellus viverra ut a vitae massa sed. Sit elementum tincidunt tortor.
                        </div>
                    </div>
                    <div
                        className="min-w-[168px] min-h-[168px]"
                        style={{
                            // backgroundImage: `url('${getS3Url('/images/reference/background_mobile.png')}')`,
                            backgroundImage: `url('/images/screen/partner/RegisterPartnerSuccess.png')`,
                            backgroundSize: 'cover'
                        }}
                    ></div>
                </CardWrapper>
            </div>
        </div>
    );
};

export default SessionGeneral;
