import React, { useState, useCallback, useEffect } from 'react';
import { useWindowSize } from 'react-use';

import { useTranslation } from 'next-i18next';

import FetchApi from 'utils/fetch-api';

import { API_GET_HISTORY_NFT } from 'redux/actions/apis';
import { formatTime } from 'redux/actions/utils';

import TableV2 from 'components/common/V2/TableV2';

import styled from 'styled-components';

const initState = {
    loading: false,
    page: 1,
    dataHistory: {
        result: [{ event: 'Mint' }, { event: 'Mint' }],
        hasNext: false,
        go_next: true
    }
};

const LIMIT = 50;

const EVENT = {
    CREATE: { vi: 'Mint', en: 'Mint' },
    GIVE: { vi: 'Chuyển', en: 'Transfer' },
    TRANSFER: { vi: 'Chuyển', en: 'Transfer' }
};

const History = ({ idNFT, status }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const [loading, setLoading] = useState(initState.loading);
    const [page, setPage] = useState(initState.page);
    const [dataHistory, setDataHistory] = useState(initState.dataHistory);

    //** call api history NFT
    const handleHistoryNFT = async () => {
        try {
            setLoading(true);
            const data = await FetchApi({ url: API_GET_HISTORY_NFT, params: { id: idNFT, limit: LIMIT } });
            setDataHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ** handle call api history NFT
    useEffect(() => {
        handleHistoryNFT();
    }, [idNFT, status]);

    const renderFrom = (row) => {
        if (row.type === 'CREATE') return '-';
        if (row.type === 'GIVE') {
            if (!row?.old_status) return '-';
            return row?.old_status?.owner || 'Infinity';
        }
        if (!row?.old_status) return '-';
        return row?.old_status?.owner || 'Infinity';
    };

    const renderTo = (row) => {
        if (row.type === 'CREATE') return '-';
        if (row.type === 'GIVE') {
            if (!row?.new_status) return '-';
            return row?.new_status?.owner || 'Infinity';
        }
        if (!row?.new_status) return '-';
        return row?.new_status?.owner || 'Infinity';
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'type',
                dataIndex: 'type',
                title: t('nft:history:event'),
                title: 'event',
                align: 'left',
                maxWidth: 302,
                render: (value) => <div>{EVENT?.[value]?.[language] || ''}</div>
            },
            {
                key: 'from',
                dataIndex: 'from',
                title: t('nft:history:from'),
                align: 'left',
                maxWidth: 302,
                render: (row, value) => renderFrom(value)
            },
            {
                key: 'to',
                dataIndex: 'to',
                title: t('nft:history:to'),
                align: 'left',
                maxWidth: 302,
                render: (row, value) => renderTo(value)
            },
            {
                key: 'createdAt',
                dataIndex: 'createdAt',
                title: t('nft:history:date'),
                align: 'right',
                maxWidth: 302,
                render: (value) => <div className="font-normal">{value ? formatTime(new Date(value), 'HH:mm:ss dd/MM/yyyy') : '-'}</div>
            }
        ];

        return (
            <WrapperTable
                isMobile={isMobile}
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                loading={loading}
                columns={columns}
                scroll={{ x: true }}
                className="border-[1px] rounded-xl border-divider dark:border-divider-dark"
                data={dataHistory?.data || []}
                rowKey={(item) => `${item?.key}`}
                pagingClassName="!border-0 !py-8"
                // pagingPrevNext={{
                //     page: page - 1,
                //     hasNext: dataHistory?.hasNext,
                //     onChangeNextPrev: (delta) => {
                //         setPage(page + delta);
                //     },
                //     language: language
                // }}
                tableStyle={{
                    rowHeight: '64px'
                }}
            />
        );
    }, [dataHistory?.data, loading, status]);

    return <>{renderTable()}</>;
};

const WrapperTable = styled(TableV2)`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            min-height: auto;
        }
    }
`;

export default History;
