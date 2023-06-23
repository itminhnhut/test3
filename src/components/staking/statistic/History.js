import { useMemo, useState, useCallback } from 'react';

import { useTranslation } from 'next-i18next';
import TableV2 from 'components/common/V2/TableV2';
import Chip from 'components/common/V2/Chip';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';

import classNames from 'classnames';

const DATE_OPTIONS = [
    {
        title: { vi: 'Tất cả', en: 'All' },
        value: 'all'
    },
    {
        title: { vi: '7 ngày', en: '7 days' },
        value: 7
    },
    {
        title: { vi: '30 ngày', en: '30 days' },
        value: 30
    },
    {
        title: { vi: '365 ngày', en: '365 days' },
        value: 365
    }
];

const MILLISECOND = 1;
const LIMIT = 10;

const initState = {
    range: 'all'
};

const TIME_FILTER = [
    {
        localized: 'common:all',
        value: 'all'
    },
    {
        localized: 'dw_partner:filter.a_week',
        value: 'w',
        format: 'dd/MM',
        interval: '1d'
    },
    {
        localized: 'dw_partner:filter.a_month',
        value: 'm',
        format: 'dd/MM',
        interval: '1d'
    }
];
const HistoryStaking = ({ dataSource, loading = false, page = 1, onPage }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [range, setRange] = useState(initState.range);

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    });

    const handleChangeRanger = (value) => {
        setRange(value);
    };

    const renderDateOptions = useMemo(() => {
        return DATE_OPTIONS.map((item) => {
            const isActive = item.value === range;
            return (
                <Chip onClick={() => handleChangeRanger(item.value)} selected={isActive}>
                    {item.title?.[language]}
                </Chip>
            );
        });
    }, [range]);

    const handleChangeDate = (e) => {
        const value = e?.selection || {};
        const startDate = value?.startDate ? new Date(value?.startDate).getTime() : null;
        const endDate = value?.endDate ? new Date(value?.endDate).getTime() + 86400000 - MILLISECOND : null;
        setFilter((prev) => ({
            ...prev,
            range: {
                startDate,
                endDate
            }
        }));
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'name',
                dataIndex: 'name',
                title: t('staking:statics:history:columns.type'),
                align: 'left',
                render: (value) => value || '_'
            },
            {
                key: 'code',
                dataIndex: 'code',
                title: t('staking:statics:history:columns.amount'),
                align: 'left',
                render: (value) => value || '_'
            },
            {
                key: 'code',
                dataIndex: 'code',
                title: t('staking:statics:history:columns.time'),
                align: 'left',
                render: (value) => value || '_'
            },
            {
                key: 'code',
                dataIndex: 'code',
                title: t('staking:statics:history:columns.status'),
                align: 'left',
                // width: 220,
                render: (value) => value || '_'
            }
        ];

        return (
            <TableV2
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                loading={loading}
                columns={columns}
                scroll={{ x: true }}
                className="border-t border-divider dark:border-divider-dark"
                data={dataSource?.results || []}
                rowKey={(item) => `${item?.key}`}
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: dataSource?.hasNext,
                    onChangeNextPrev: (delta) => {
                        onPage(page + delta);
                    },
                    language: language
                }}
            />
        );
    }, [dataSource, loading]);

    return (
        <section>
            <h2 className="font-semibold text-2xl mt-[60px]">{t('staking:statics:history.title')}</h2>
            <section className="rounded-xl border-[1px] border-[#30BF73] dark:border-[#222940] mt-8">
                <section className="flex flex-row my-8 ml-6 mr-[21px] h-[62px] items-center">
                    <section className="w-2/5">
                        <div className="text-gray-15 dark:text-gray-7">{t('staking:statics:history.profit_received')}</div>
                        <div className="text-txtPrimary dark:text-gray-4 font-semibold mt-2">1,670,000 VNDC</div>
                    </section>
                    <section className="w-3/5 flex flex-row items-center gap-x-2 justify-end">
                        {renderDateOptions}
                        <DatePickerV2
                            initDate={filter.range}
                            onChange={handleChangeDate}
                            month={2}
                            hasShadow
                            position="right"
                            text={
                                <Chip
                                    onClick={() => handleChangeRanger('all')}
                                    className={classNames({
                                        'text-teal border-teal bg-teal/[.1] !font-semibold': range === 'all'
                                    })}
                                >
                                    {t('reference:referral.custom')}
                                </Chip>
                            }
                        />
                    </section>
                </section>
                <section>{renderTable()}</section>
            </section>
        </section>
    );
};
export default HistoryStaking;
