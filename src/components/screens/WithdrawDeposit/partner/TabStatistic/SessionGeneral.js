import React, { useState } from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useTranslation } from 'next-i18next';
import { TIME_FILTER } from '../../constants';
import classNames from 'classnames';
import CardWrapper from 'components/common/CardWrapper';
import { formatNumber } from 'utils/reference-utils';
import { formatPercentage } from 'redux/actions/utils';

const SessionGeneral = () => {
    const [timeTab, setTimeTab] = useState(TIME_FILTER[0].value);
    const { t } = useTranslation();

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="font-semibold text-[20px] leading-6">Báo cáo hoa hồng</div>
                <div className="flex gap-3">
                    {TIME_FILTER.map((item) => {
                        return (
                            <div
                                key={item.value}
                                onClick={() => setTimeTab(item.value)}
                                className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                                    'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== item.value,
                                    'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === item.value
                                })}
                            >
                                {t(item.localized)}
                            </div>
                        );
                    })}
                    <DatePickerV2
                        initDate={filter.range}
                        onChange={(e) => {
                            setFilter({
                                range: {
                                    startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                                    endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                                    key: 'selection'
                                }
                            });
                        }}
                        month={2}
                        hasShadow
                        position="right"
                        text={
                            <div
                                onClick={() => setTimeTab('custom')}
                                className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal select-none', {
                                    'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                                    'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom'
                                })}
                            >
                                {t('dw_partner:filter.custom')}
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Body */}
            <div className="flex gap-x-6">
                <CardWrapper className="flex-auto flex">
                    <div className="w-1/2 pr-7 border-r border-divider dark:border-divider-dark">
                        {/* top */}
                        <div>
                            <h1 className="txtSecond-3">Tổng hoa hồng</h1>
                            <div className="pt-4 txtPri-5">{formatNumber(71900000, 0)}</div>
                        </div>

                        {/* divider */}
                        <hr className="border-divider dark:border-divider-dark my-4" />

                        {/* bottom */}
                        <div>
                            <h1 className="txtSecond-3">Tỷ lệ hoa hồng</h1>
                            <div className="pt-4 txtPri-5">{formatPercentage(0.182563 * 100, 2)}%</div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-end justify-center">
                        <h1 className="txtSecond-3">Tổng khối lượng</h1>
                        <div className="pt-4 txtPri-6">
                            <span className="text-green-3 dark:text-green-2">719M</span>
                            <span>/200M</span>
                        </div>
                    </div>
                </CardWrapper>
                <CardWrapper className="flex-auto"></CardWrapper>
            </div>
        </div>
    );
};

export default SessionGeneral;
