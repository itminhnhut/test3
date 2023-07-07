import React, { useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import CardWrapper from 'components/common/CardWrapper';
import { convertDateToMs, formatAbbreviateNumber, formatNanNumber, formatPercentage, getS3Url } from 'redux/actions/utils';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_REPORT_PARTNER } from 'redux/actions/apis';
import Skeletor from 'components/common/Skeletor';
import FilterTimeTab from 'components/common/FilterTimeTab';
import Tooltip from 'components/common/Tooltip';
import FilterTimeTabV2 from 'components/common/FilterTimeTabV2';

const SessionGeneral = ({ filter, setFilter }) => {
    const { t } = useTranslation();

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_COMMISSION_REPORT_PARTNER,
            params: {
                from: convertDateToMs(filter?.range?.startDate),
                to: convertDateToMs(filter?.range?.endDate ? filter.range.endDate : Date.now(), 'endOf')
            }
        },
        true,
        [filter]
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="font-semibold text-[20px] leading-6">{t('dw_partner:report_commission')}</div>
                <FilterTimeTabV2 filter={filter} setFilter={setFilter} positionCalendar="right" isTabAll maxMonths={3} isDeepBackground={true} />
            </div>

            {/* Body */}

            <CardWrapper className="w-full flex justify-between items-center txtSecond-3 !p-6">
                <div className="flex gap-x-10">
                    <div>
                        <span>{t('dw_partner:total_commissions')}</span>
                        <div className="pt-2 txtPri-1">
                            {loading ? <Skeletor width="100px" /> : formatNanNumber(data?.totalCommission?.convertedCommissionValue, 0) + ' VNDC'}
                        </div>
                    </div>
                    <div>
                        <Tooltip place="top" effect="solid" isV3 id="commission-rate-description">
                            <div className="max-w-[300px] py-2 text-sm z-50">{t('dw_partner:commission_rate_description')}</div>
                        </Tooltip>
                        <div data-tip="" className="inline-block" data-for="commission-rate-description" id="commission-rate-description">
                            <h1 className="nami-underline-dotted">{t('dw_partner:commission_rate')}</h1>{' '}
                        </div>
                        <div className="pt-2 txtPri-1">{loading ? <Skeletor width="100px" /> : `${formatPercentage(data?.commissionRate * 100, 2)}%`} </div>
                    </div>
                    <div>
                        <span>{t('common:transaction_fee')}</span>
                        <div className="pt-2 txtPri-1">
                            {loading ? <Skeletor width="100px" /> : formatNanNumber(data?.totalFee, 0) + ' VND'}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                        <h1 className="txtSecond-3">
                            <Trans i18nKey="dw_partner:total_volume">
                                <span className="text-teal" />
                                <span className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </Trans>
                        </h1>
                        <div className="pt-1 txtPri-3 flex items-center">
                            <span className="text-green-3 dark:text-green-2">
                                {loading ? <Skeletor width="50px" /> : formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedBuyVolume)}
                            </span>
                            /{loading ? <Skeletor width="40px" /> : <span>{formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedSellVolume)}</span>}
                        </div>
                    </div>
            </CardWrapper>


        </div>
    );
};

export default SessionGeneral;
