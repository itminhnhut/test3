import React, { useState } from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useTranslation } from 'next-i18next';
import { TIME_FILTER } from '../../constants';
import classNames from 'classnames';
import CardWrapper from 'components/common/CardWrapper';

const TabStatistic = () => {
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
            <div className="flex gap-x-6">
                <CardWrapper className="flex-auto"></CardWrapper>
                <CardWrapper className="flex-auto"></CardWrapper>
            </div>
        </div>
    );
};

export default TabStatistic;
