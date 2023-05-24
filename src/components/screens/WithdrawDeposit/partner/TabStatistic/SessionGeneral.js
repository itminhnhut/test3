import React, { useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import CardWrapper from 'components/common/CardWrapper';
import { convertDateToMs, formatAbbreviateNumber, formatNanNumber, formatPercentage, getS3Url } from 'redux/actions/utils';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_REPORT_PARTNER } from 'redux/actions/apis';
import Skeletor from 'components/common/Skeletor';
import FilterTimeTab from 'components/common/FilterTimeTab';
import Tooltip from 'components/common/Tooltip';

const SessionGeneral = () => {
    const { t } = useTranslation();

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    });

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
                <FilterTimeTab isTabAll filter={filter} setFilter={setFilter} />
            </div>

            {/* Body */}
            <div className="flex gap-x-6">
                <CardWrapper className="flex-auto flex">
                    <div className="w-1/2 pr-7 border-r border-divider dark:border-divider-dark">
                        {/* top */}
                        <div>
                            <h1 className="txtSecond-3">{t('dw_partner:total_commissions')}</h1>
                            <div className="pt-4 txtPri-5">
                                {loading ? <Skeletor width="100px" /> : formatNanNumber(data?.totalCommission?.convertedCommissionValue, 0)}
                            </div>
                        </div>

                        {/* divider */}
                        <hr className="border-divider dark:border-divider-dark my-4" />

                        {/* bottom */}
                        <div>
                            <Tooltip place="top" effect="solid" isV3 id="commission-rate-description">
                                <div className="max-w-[300px] py-2 text-sm z-50">{t('dw_partner:commission_rate_description')}</div>
                            </Tooltip>
                            <div data-tip="" className="inline-block" data-for="commission-rate-description" id="commission-rate-description">
                                <h1 className="txtSecond-3 nami-underline-dotted">{t('dw_partner:commission_rate')}</h1>{' '}
                            </div>

                            <div className="pt-4 txtPri-5">{loading ? <Skeletor width="100px" /> : `${formatPercentage(data?.commissionRate * 100, 2)}%`}</div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-end justify-center">
                        <h1 className="txtSecond-3">
                            <Trans i18nKey="dw_partner:total_volume">
                                <span className="text-teal" />

                                <span className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </Trans>
                        </h1>
                        <div className="pt-4 txtPri-6 flex">
                            <span className="text-green-3 dark:text-green-2">
                                {loading ? <Skeletor width="50px" /> : formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedBuyVolume)}
                            </span>
                            {loading ? <Skeletor width="50px" /> : <span>/{formatAbbreviateNumber(data?.totalPartnerOrderVolume.convertedSellVolume)}</span>}
                        </div>
                    </div>
                </CardWrapper>
                <CardWrapper className="flex gap-x-6 justify-between">
                    <div className="max-w-[237px] flex flex-col">
                        <div className="txtPri-5 pb-4">{t('dw_partner:standard_partner')}</div>
                        <div className="txtSecond-3 text-left flex items-center flex-auto">{t('dw_partner:standard_partner_des')}</div>
                    </div>
                    <div
                        className="min-w-[168px] min-h-[168px]"
                        style={{
                            backgroundImage: `url('${getS3Url('/images/screen/partner/RegisterPartnerSuccess.png')}')`,
                            // backgroundImage: `url('/images/screen/partner/RegisterPartnerSuccess.png')`,
                            backgroundSize: 'cover'
                        }}
                    ></div>
                </CardWrapper>
            </div>
        </div>
    );
};

export default SessionGeneral;
