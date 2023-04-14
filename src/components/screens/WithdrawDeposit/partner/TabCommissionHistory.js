import React, { useEffect, useMemo, useState } from 'react';
import FilterButton from '../components/FilterButton';
import { convertDateToMs, formatBalance, formatNanNumber, formatPrice, formatSwapRate, formatTime, getAssetCode, shortHashAddress } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TableV2 from 'components/common/V2/TableV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ApiStatus, PartnerOrderStatus } from 'redux/actions/const';
import { find, isEmpty, isNull } from 'lodash';
import FetchApi from 'utils/fetch-api';
import { API_GET_COMMISSION_HISTORY_PARTNER, API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY } from 'redux/actions/apis';
import TagV2 from 'components/common/V2/TagV2';
import TextCopyable from 'components/screens/Account/TextCopyable';
import AssetLogo from 'components/wallet/AssetLogo';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import { formatLocalTimezoneToUTC } from 'utils/helpers';
import axios from 'axios';
import useFetchApi from 'hooks/useFetchApi';
import FilterTimeTab from 'components/common/FilterTimeTab';
import ModalCommissionHistory from './ModalCommissionHistory';
import { useSelector } from 'react-redux';
import Skeletor from 'components/common/Skeletor';
import moment from 'moment-timezone';

const timezone = moment.tz.guess(); // attempts to guess the user's timezone

// do BE sai nen FE moi phai custom from to cua Filter
const customTime = (input) => {
    const startTimeLocale = moment(input).tz(timezone);
    const startTimeLocaleTimestamp = startTimeLocale.valueOf();

    console.log("startTimeLocaleTimestamp: ",startTimeLocaleTimestamp);
    return startTimeLocaleTimestamp;
};

const LIMIT_ROW = 10;

const TabCommissionHistory = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const configs = useSelector((state) => state.utils?.assetConfig);

    const [state, set] = useState({
        data: [],
        curPage: 0,
        loading: false,
        hasNext: false,
        sort: {}
    });
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    });

    const [categoryConfig, setCategoryConfig] = useState([]);
    useEffect(() => {
        FetchApi({
            url: API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY
        }).then(({ data, statusCode }) => {
            if (statusCode === 200) {
                const result = _.keyBy(data, 'category_id');
                _.forEach(result, (value, key) => {
                    result[key] = value.content;
                });
                setCategoryConfig(result);
            }
        });
    }, []);

    const fetchOrder = async () => {
        setState({ loading: true });
        try {
            const { statusCode, data, message } = await FetchApi({
                url: API_GET_COMMISSION_HISTORY_PARTNER,
                params: {
                    // from: customTime(convertDateToMs(filter?.range?.startDate)),
                    from: convertDateToMs(filter?.range?.startDate),
                    // to: new Date(convertDateToMs(filter?.range?.endDate ? filter.range.endDate : Date.now(), 'endOf')),
                    to: convertDateToMs(filter?.range?.endDate ? filter.range.endDate : Date.now(), 'endOf'),
                    skip: state.curPage * LIMIT_ROW,
                    limit: LIMIT_ROW,
                    type: 'partnercommission',
                    ...state.sort
                }
            });

            if (message === ApiStatus.SUCCESS) {
                setState({ data: data.result, hasNext: data.hasNext });
            }
        } finally {
            setState({ loading: false });
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [state.curPage]);

    useEffect(() => {
        if (state.curPage === 0) {
            fetchOrder();
        } else setState({ curPage: 0 });
    }, [filter, state.sort]);

    const customSort = (tableSorted) => {
        const output = {};

        for (const key in tableSorted) {
            if (tableSorted.hasOwnProperty(key)) {
                output[`sort[${key}]`] = tableSorted[key] ? 'asc' : 'desc';
            }
        }

        setState({
            sort: output
        });
    };

    const columns = useMemo(
        () => [
            {
                key: '_id',
                dataIndex: '_id',
                title: t('common:transaction_id'),
                align: 'left',
                fixed: 'left',
                width: 244,
                render: (v) => <TextCopyable className="gap-x-1" showingText={shortHashAddress(v, 10, 6)} text={v} />
            },
            {
                key: 'currency',
                dataIndex: 'currency',
                title: t('common:asset'),
                align: 'left',
                width: 180,
                render: (v) => {
                    const assetConfig = find(configs, { id: +v });

                    return assetConfig ? (
                        <div className="flex gap-2 items-center">
                            <AssetLogo assetCode={assetConfig?.assetCode} size={32} useNextImg />
                            <div>{assetConfig?.assetName || 'Unknown'}</div>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Skeletor width={32} />
                            <Skeletor width={50} />
                        </div>
                    );
                }
            },
            {
                key: 'created_at',
                dataIndex: 'created_at',
                title: t('common:time'),
                align: 'left',
                width: 244,
                render: (row) => {
                    return formatTime(row, 'HH:mm:ss dd/MM/yyyy');
                }
            },
            {
                key: 'category',
                dataIndex: 'category',
                title: t('reference:referral.commission_type'),
                align: 'left',
                width: 200,
                render: (v) => categoryConfig?.[v]?.[language]
            },
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: t('common:amount'),
                align: 'right',
                width: 200,
                render: (v, item) => '+' + formatNanNumber(v, +item?.currency === 72 ? 0 : 4)
                // render: (v, item) => {
                //     const formattedNumber = formatNanNumber(v, +item?.currency === 72 ? 0 : 4);
                //     if (!formattedNumber) return <span className="text-gray-15 dark:text-gray-4">_</span>;
                //     return '+' + formattedNumber;
                // }
            }
        ],
        [categoryConfig]
    );

    const [openModalDetail, setOpenModalDetail] = useState(null);
    return (
        <div>
            <FilterTimeTab filter={filter} setFilter={setFilter} positionCalendar="left" className="mb-6" isTabAll />
            <TableV2
                sort={['main_balance']}
                limit={LIMIT_ROW}
                skip={0}
                useRowHover
                data={state.data}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                loading={state.loading}
                onRowClick={(transaction) => setOpenModalDetail(transaction)}
                height={600}
                className="bg-white dark:bg-transparent pt-8 border border-divider dark:border-divider-dark rounded-xl"
                tableStyle={{
                    fontSize: '16px',
                    padding: '16px',
                    headerFontStyle: { 'font-size': `14px !important` }
                }}
                pagingPrevNext={{
                    page: state.curPage,
                    hasNext: state.hasNext,
                    onChangeNextPrev: (e) => setState({ curPage: state.curPage + e }),
                    language
                }}
                emptyTextContent={t('dw_partner:no_commission_history')}
                customSort={customSort}
            />
            <ModalCommissionHistory
                t={t}
                isVisible={openModalDetail}
                onClose={() => setOpenModalDetail(null)}
                transaction={openModalDetail}
                sideCommission={categoryConfig?.[openModalDetail?.category]?.[language]}
                id={openModalDetail?._id}
                category={categoryConfig}
            />
        </div>
    );
};

export default TabCommissionHistory;
