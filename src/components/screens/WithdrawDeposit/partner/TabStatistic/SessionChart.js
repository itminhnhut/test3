import React, { useState } from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useTranslation } from 'next-i18next';
import { TIME_FILTER } from '../../constants';
import classNames from 'classnames';
import CardWrapper from 'components/common/CardWrapper';
import { formatNumber } from 'utils/reference-utils';
import { formatPercentage } from 'redux/actions/utils';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';

const SessionChart = () => {
    const [timeTab, setTimeTab] = useState(TIME_FILTER[0].value);
    const [typeTab, setTypeTab] = useState(0);

    const { t } = useTranslation();

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });

    return (
        <div className="mt-20">
            {/* Header */}
            <div className="font-semibold text-[20px] leading-6 mb-8">Báo cáo hoa hồng</div>

            {/* Body */}
            <CardWrapper>
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div>
                        <Tabs tab={typeTab} className="gap-6">
                            <TabItem className="!px-0" value={0} active={typeTab === 0} onClick={() => setTypeTab(0)}>
                                Tổng nạp rút
                            </TabItem>
                            <TabItem className="!px-0" value={1} active={typeTab === 1} onClick={() => setTypeTab(1)}>
                                Tổng hoa hồng
                            </TabItem>
                        </Tabs>
                    </div>

                    {/* Filter */}
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
            </CardWrapper>
        </div>
    );
};

export default SessionChart;
