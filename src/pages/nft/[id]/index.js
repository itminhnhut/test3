import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';

import { API_GET_DETAIL_NFT, API_GET_HISTORY_NFT } from 'redux/actions/apis';
import { formatNumber, formatTime } from 'redux/actions/utils';

import TableV2 from 'components/common/V2/TableV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import { LIST_TIER, TABS } from 'components/screens/NFT/Filter';
import { WrapperLevelItems } from 'components/screens/NFT/ListFilter';

import styled from 'styled-components';

const LIMIT = 10;

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

    const [detail, setDetail] = useState({});

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
        handleDetailNFT();
    }, [idNFT]);

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

    const renderContent = () => {
        if (!detail?._id) return;

        const tier = LIST_TIER.find((item) => item.active === detail?.tier);
        const category = TABS.find((item) => item.value === detail?.category);
        const expired_time = detail?.expired_time ? formatTime(new Date(detail?.expired_time), 'HH:mm:ss dd/MM/yyyy') : '-';

        return (
            <WrapperContent>
                <h2 className="text-green-3 dark:text-green-2 font-semibold">
                    <Link
                        href={{
                            pathname: '/nft',
                            query: { collection: detail?.nft_collection, category: 'all' }
                        }}
                    >
                        {detail?.nft_collection_name}
                    </Link>
                </h2>
                <h3 className="font-semibold text-4xl text-gray-15 dark:text-gray-4 mt-[18px]">{detail?.name}</h3>
                <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                    <p>Cấp độ:</p>
                    <p className="rate">{tier?.name?.[language]}</p>
                </WrapperLevelItems>
                <div className="h-[1px] bg-divider dark:bg-divider-dark my-4" />
                <div className="flex flex-row">
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Loại:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">{category?.label}</li>
                    </ul>
                    <div className="flex mx-3 my-3 items-center w-1 h-1 rounded-full bg-gray-1 dark:bg-gray-7"></div>
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Thời hạn sử dụng:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">{expired_time}</li>
                    </ul>
                </div>
            </WrapperContent>
        );
    };

    const renderEffective = () => {
        if (!detail?.effective) return;

        const { FEE, CASHBACK, APY_BOOSTER } = detail?.effective;
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4 mt-[18px]">Tính năng</h3>
                <div className="w-full rounded-xl mt-3 flex flex-col gap-3 h-[72px] overflow-y-auto">
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <Trans
                            i18nKey="nft:detail:effective:FEE"
                            values={{
                                value: FEE?.value,
                                day: FEE?.day
                            }}
                            components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                        />
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <Trans
                            i18nKey="nft:detail:effective:CASHBACK"
                            values={{
                                value: CASHBACK?.value,
                                week: CASHBACK?.week
                            }}
                            components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                        />
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <Trans
                            i18nKey="nft:detail:effective:APY_BOOSTER"
                            values={{
                                value: APY_BOOSTER?.value,
                                day: APY_BOOSTER?.day,
                                max: APY_BOOSTER?.max
                            }}
                            components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                        />
                    </div>
                </div>
            </WrapperContent>
        );
    };

    const renderDescription = () => {
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4 mt-[18px]">Mô tả</h3>
                <section className="mt-3 h-[72px] overflow-y-auto dark:text-gray-4 text-gray-15">{detail?.[`description_${language}`] || '-'}</section>
            </WrapperContent>
        );
    };

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
                    <header className="mt-10">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">Chi tiết {detail?.name}</h1>
                    </header>
                    <section className="mt-8 flex flex-row gap-4">
                        <section className="w-full max-w-[550px] max-h-[550px] rounded-xl">
                            {detail?.image ? <Image width={550} height={550} src={detail?.image} sizes="100vw" /> : null}
                        </section>
                        <section className="w-full">
                            {renderContent()}
                            {renderDescription()}
                            {renderEffective()}
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">Lịch sử Mint/Chuyển</h3>
                        <section className="mt-4">{renderTable()}</section>
                    </section>
                </article>
            </main>
        </MaldivesLayout>
    );
};

export async function getStaticPaths() {
    return {
        paths: [{ params: { id: '' } }],
        fallback: true
    };
}
export const getStaticProps = async ({ locale, params }) => ({
    props: {
        idNFT: params.id,
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking', 'nft']))
    }
});

const WrapperContent = styled.section.attrs(() => ({
    className: 'bg-divider dark:bg-dark-4 px-4 py-4 rounded-xl'
}))``;

const WrapperTable = styled(TableV2)`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            min-height: auto;
        }
    }
`;

const DarkCheckCircle = ({ color = '#47CC85', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);

const CheckCircle = ({ color = '#30BF73', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);
export default index;
