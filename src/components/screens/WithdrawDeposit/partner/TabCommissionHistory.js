import React, { useEffect, useMemo, useState } from 'react';
import FilterButton from '../components/FilterButton';
import { formatBalance, formatTime, getAssetCode, shortHashAddress } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TableV2 from 'components/common/V2/TableV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ApiStatus, PartnerOrderStatus } from 'redux/actions/const';
import { isEmpty, isNull } from 'lodash';
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

const LIMIT_ROW = 10;

const TabCommissionHistory = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

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
            endDate: Date.now(),
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
                    from: filter?.range?.startDate ? filter.range.startDate : Date.now() - 86400000,
                    to: filter?.range?.endDate ? filter.range.endDate : Date.now(),
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
                render: (v) => <TextCopyable className="gap-x-1" showingText={shortHashAddress(v, 5, 8)} text={v} />
            },
            {
                key: 'currency',
                dataIndex: 'currency',
                title: t('common:asset'),
                align: 'left',
                width: 180,
                render: (v) => {
                    const assetCode = getAssetCode(+v);
                    return (
                        <div className="flex gap-2 items-center">
                            <AssetLogo assetCode={assetCode} size={32} useNextImg /> <div>{assetCode}</div>
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
                key: 'main_balance',
                dataIndex: 'main_balance',
                title: t('common:amount'),
                align: 'right',
                width: 200,
                render: (v) => {
                    return '+' + formatBalance(v);
                }
            }
        ],
        [categoryConfig, t]
    );

    const [openModalDetail, setOpenModalDetail] = useState(null);

    return (
        <div>
            <FilterTimeTab filter={filter} setFilter={setFilter} positionCalendar="left" className="mb-6" />
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
                typeCommission={categoryConfig?.[openModalDetail?.category]?.[language]}
            />
        </div>
    );
};

export default TabCommissionHistory;
