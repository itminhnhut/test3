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

const LIMIT = 10;

const History = ({ idNFT }) => {
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
            const data = await FetchApi({ url: API_GET_HISTORY_NFT, params: { id: idNFT, limit: LIMIT } });
            setDataHistory(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ** handle call api history NFT
    useEffect(() => {
        handleHistoryNFT();
    }, [idNFT]);

    const renderFrom = (row) => {
        if (row.type === 'Create') return '-';
        if (row.type === 'Give') return '-';
        return row?.old_status?.owner || '-';
    };

    const renderTo = (row) => {
        if (row.type === 'Create') return '-';
        if (row.type === 'Give') return row?.new_status?.owner || '-';
        return row?.new_status?.owner || '-';
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'type',
                dataIndex: 'type',
                // title: t('staking:statics:history:columns.type'),
                title: 'event',
                align: 'left',
                maxWidth: 302,
                render: (value) => <div>{value === 'Create' ? 'Mint NFT' : 'Chuyển'}</div>
            },
            {
                key: 'from',
                dataIndex: 'from',
                title: 'From',
                align: 'left',
                maxWidth: 302,
                render: (row, value) => renderFrom(value)
            },
            {
                key: 'to',
                dataIndex: 'to',
                title: 'To',
                align: 'left',
                maxWidth: 302,
                render: (row, value) => renderTo(value)
            },
            {
                key: 'createdAt',
                dataIndex: 'createdAt',
                title: t('staking:statics:history:columns.time'),
                align: 'right',
                maxWidth: 302,
                render: (value) => <div className="font-normal">{formatTime(new Date(value), 'HH:mm:ss dd/MM/yyyy') || '-'}</div>
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
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: dataHistory?.hasNext,
                    onChangeNextPrev: (delta) => {
                        setPage(page + delta);
                    },
                    language: language
                }}
                tableStyle={{
                    rowHeight: '64px'
                }}
            />
        );
    }, [dataHistory?.data, loading]);

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
