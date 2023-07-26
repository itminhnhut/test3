import React, { useState, useCallback, useEffect } from 'react';
import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';

import { API_GET_DETAIL_NFT, API_GET_HISTORY_NFT } from 'redux/actions/apis';
import { formatTime } from 'redux/actions/utils';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import { WrapperLevelItems } from 'components/screens/NFT/ListFilter';

import styled from 'styled-components';

import { WrapperStatus } from './index';

const Use = dynamic(() => import('./components/modal/use'), { ssr: false });
const Transfer = dynamic(() => import('./components/modal/transfer'), { ssr: false });
const Effective = dynamic(() => import('components/screens/NFT/Components/Detail/Effective'), {
    ssr: false
});

const Description = dynamic(() => import('components/screens/NFT/Components/Detail/Description'), {
    ssr: false
});

const Contents = dynamic(() => import('components/screens/NFT/Components/Detail/Contents'), {
    ssr: false
});

const LIMIT = 10;

const initState = {
    loading: false,
    page: 1,
    dataHistory: {
        result: [{ event: 'Mint' }, { event: 'Mint' }],
        hasNext: false,
        go_next: true
    },
    isTransfer: false,
    isUse: false
};

const WalletDetail = ({ idNFT }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;
    const [detail, setDetail] = useState();

    const [loading, setLoading] = useState(initState.loading);
    const [page, setPage] = useState(initState.page);
    const [dataHistory, setDataHistory] = useState(initState.dataHistory);

    const [isUse, setIsUse] = useState(initState.isUse);
    const [isTransfer, setIsTransfer] = useState(initState.isTransfer);

    const handleModalUse = () => setIsUse((prev) => !prev);
    const handleModalTransfer = () => setIsTransfer((prev) => !prev);

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

    const handleUseSubmit = () => {
        try {
            toast({ text: 'Sử dụng WNFT thành công', type: 'success', duration: 1500 });
            handleModalUse();
        } catch (error) {
            console.error(error);
        }
    };

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

    //** render */

    const renderFeature = () => {
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4 mt-[18px]">Tính năng</h3>
                <div className="w-full rounded-xl mt-3 flex flex-col gap-3 h-[72px] overflow-y-auto">
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">1,5% phí giao dịch NAO Futures trong tuần 55</p>
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">Giảm 50% phí giao dịch trong vòng 3 ngày</p>
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">APY Booster 100% trong 3 ngày</p>
                    </div>
                </div>
            </WrapperContent>
        );
    };

    const renderDescription = () => {
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4 mt-[18px]">Mô tả</h3>
                <section className="mt-3 h-[72px] overflow-y-auto dark:text-gray-4 text-gray-15">
                    Một định nghĩa quen thuộc trong ngành Blockchain, bên cạnh đó, cá voi còn đại diện cho sự kiên định và khát khao chinh phục những thử thách
                    mới, một phẩm chất cần có trong mọi nhà đầu tư khi tham gia vào thị trường,có trong mọi nhà đầu tư khi tham gia vào thị trường
                </section>
            </WrapperContent>
        );
    };

    const renderDetail = () => {
        return (
            <WrapperContent>
                <section className="flex flex-row justify-between">
                    <h2 className="text-green-3 dark:text-green-2 font-semibold">Ocean Eye</h2>
                    <WrapperStatus status="active" className="h-7 py-1 px-4 rounded-[80px] text-sm">
                        Đã kích hoạt
                    </WrapperStatus>
                </section>
                <h3 className="font-semibold text-4xl text-gray-15 dark:text-gray-4 mt-[18px]">Whale</h3>
                <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                    <p>Cấp độ:</p>
                    <p className="rate">Siêu hiếm</p>
                </WrapperLevelItems>
                <div className="h-[1px] bg-divider dark:bg-divider-dark my-4" />
                <div className="flex flex-row">
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Loại:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">Voucher</li>
                    </ul>
                    <div className="flex mx-3 my-3 items-center w-1 h-1 rounded-full bg-gray-1 dark:bg-gray-7"></div>
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Thời hạn sử dụng:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">07:00:00 20/07/2023</li>
                    </ul>
                </div>
            </WrapperContent>
        );
    };

    const renderStatus = () => {
        return (
            <section className="flex flex-row gap-3 mt-4">
                <ButtonV2 variants="secondary" onClick={handleModalTransfer}>
                    Chuyển
                </ButtonV2>
                <ButtonV2 onClick={handleModalUse}>Sử dụng</ButtonV2>
            </section>
        );
    };

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
                    <header className="mt-20">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">Chi tiết {detail?.name}</h1>
                    </header>
                    <section className="mt-8 flex flex-row gap-4">
                        <section className="w-full max-w-[614px] max-h-[614px] rounded-xl">
                            <Image width={614} height={614} src="/images/nft/Banner-2.png" sizes="100vw" />
                        </section>
                        <section className="w-full">
                            <Contents detail={detail} />
                            <Description detail={detail} />
                            <Effective effective={detail?.effective} dark={isDark} />
                            {renderStatus()}
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">Lịch sử Mint/Chuyển</h3>
                        <section className="mt-4">{renderTable()}</section>
                    </section>
                </article>
                <Use isModal={isUse} onCloseModal={handleModalUse} onUseSubmit={handleUseSubmit} />
                <Transfer isModal={isTransfer} onCloseModal={handleModalTransfer} />
            </main>
        </MaldivesLayout>
    );
};

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
export default WalletDetail;
