import React, { useState, useCallback, useEffect } from 'react';
import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';

import { API_GET_DETAIL_NFT, API_GET_HISTORY_NFT } from 'redux/actions/apis';
import { formatTime } from 'redux/actions/utils';

import TableV2 from 'components/common/V2/TableV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import styled from 'styled-components';

const LIMIT = 10;

const Effective = dynamic(() => import('components/screens/NFT/Components/Detail/Effective'), {
    ssr: false
});

const Description = dynamic(() => import('components/screens/NFT/Components/Detail/Description'), {
    ssr: false
});

const Contents = dynamic(() => import('components/screens/NFT/Components/Detail/Contents'), {
    ssr: false
});

const initState = {
    loading: false,
    page: 1,
    dataHistory: {
        data: [],
        hasNext: false,
        go_next: true
    }
};

const index = ({ idNFT }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [detail, setDetail] = useState();

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const [page, setPage] = useState(initState.page);
    const [loading, setLoading] = useState(initState.loading);
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

    //** call api detail NFT
    const handleDetailNFT = async () => {
        try {
            const { data } = await FetchApi({ url: API_GET_DETAIL_NFT, params: { id: idNFT } });
            setDetail(data);
        } catch (error) {
            console.error(error);
        }
    };

    // ** handle call api detail NFT
    useEffect(() => {
        idNFT && handleDetailNFT();
    }, [idNFT]);

    // ** handle call api history NFT
    useEffect(() => {
        handleHistoryNFT();
    }, [idNFT]);

    const renderFrom = (row) => {
        if (row.type === 'Create') return '-';
        if (row.type === 'Give') return '-';
        return row?.old_status?.owner || 'Infinity';
    };

    const renderTo = (row) => {
        if (row.type === 'Create') return '-';
        if (row.type === 'Give') return row?.new_status?.owner || 'Infinity';
        return row?.new_status?.owner || 'Infinity';
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'type',
                dataIndex: 'type',
                title: t('nft:history:event'),
                align: 'left',
                maxWidth: 302,
                render: (value) => <div>{value === 'Create' ? 'Mint' : t('nft:history:transfer')}</div>
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
    }, [dataHistory?.data, loading]);

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
                    <header className="mt-10">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">{t('nft:detail:title')}</h1>
                    </header>
                    <section className="mt-8 flex flex-row gap-4">
                        <WrapperImage className="w-full max-w-[550px] max-h-[550px]">
                            {detail?.image ? <img width={550} height={550} src={detail?.image} /> : null}
                        </WrapperImage>
                        <section className="w-full">
                            <Contents detail={detail} />
                            <Description detail={detail} />
                            <Effective effective={detail?.[`effective_${language}`] || []} dark={isDark} />
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">{t('nft:history:title')}</h3>
                        <section className="mt-4">{renderTable()}</section>
                    </section>
                </article>
            </main>
        </MaldivesLayout>
    );
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true
    };
}
export const getStaticProps = async ({ locale, params }) => ({
    props: {
        idNFT: params.id,
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking', 'nft']))
    }
});

const WrapperTable = styled(TableV2)`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            min-height: auto;
        }
    }
`;

const WrapperImage = styled.section`
    img {
        border-radius: 12px !important;
    }
`;

export default index;
