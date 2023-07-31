import React, { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';

import { API_GET_DETAIL_NFT, API_POST_ACTIVE_NFT, API_GET_CHECK_NFT } from 'redux/actions/apis';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import { TABS } from 'components/screens/NFT/Constants';

import styled from 'styled-components';

const Use = dynamic(() => import('./Components/Modal/Use'), { ssr: false });
const Transfer = dynamic(() => import('./Components/Modal/Transfer'), { ssr: false });
const Effective = dynamic(() => import('components/screens/NFT/Components/Detail/Effective'), {
    ssr: false
});

const Description = dynamic(() => import('components/screens/NFT/Components/Detail/Description'), {
    ssr: false
});

const Contents = dynamic(() => import('components/screens/NFT/Components/Detail/Contents'), {
    ssr: false
});

const History = dynamic(() => import('components/screens/NFT/Components/Detail/History'), {
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

    const [isUse, setIsUse] = useState(initState.isUse);
    const [isTransfer, setIsTransfer] = useState(initState.isTransfer);

    const [isLoading, setIsLoading] = useState(initState.loading);

    const [statusCodeNFT, setStatusCodeNFT] = useState();

    const handleModalUse = () => setIsUse((prev) => !prev);
    const handleModalTransfer = () => setIsTransfer((prev) => !prev);

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

    // ** handle submit  use active
    const handleUseSubmit = async () => {
        try {
            const { statusCode } = await FetchApi({
                url: API_POST_ACTIVE_NFT,
                options: {
                    method: 'POST'
                },
                params: { id: idNFT }
            });
            if (statusCode !== 200) {
                // update detail
                handleDetailNFT();

                // close modal
                if (isUse) {
                    handleModalUse();
                }
                const category = TABS.find((item) => item.value === detail?.category);
                toast({ text: t('nft:active:toast_success', { type: category?.label }), type: 'success', duration: 1500 });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ** handle check nft before call api update
    const handleCheckNFT = async () => {
        try {
            setIsLoading(true);
            const { statusCode } = await FetchApi({ url: API_GET_CHECK_NFT, params: { id: idNFT } });
            if (statusCode === 200) {
                handleUseSubmit();
            } else {
                handleModalUse();
                setStatusCodeNFT(statusCode);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    //** render */
    const renderVoucher = (detail) => {
        return detail.status === 0 ? (
            <section className="mt-4">
                <ButtonV2 onClick={handleCheckNFT} disabled={isLoading}>
                    {t('nft:history:active')}
                </ButtonV2>
            </section>
        ) : null;
    };

    const renderNFT = (detail) => {
        return (
            <section className="flex flex-row gap-3 mt-4 cursor-pointer">
                <ButtonV2 variants="secondary" onClick={handleModalTransfer}>
                    {t('nft:history:transfer')}
                </ButtonV2>
                {detail?.status === 0 ? <ButtonV2 onClick={handleCheckNFT}>Sử dụng</ButtonV2> : null}
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
                        <WrapperImage className="w-[100vw] max-w-[614px] max-h-[614px]">
                            {detail?.image ? <img width={614} height={614} src={detail?.image} /> : null}
                        </WrapperImage>
                        <section className="w-full">
                            <Contents detail={detail} wallet={true} />
                            <Description detail={detail} />
                            <Effective effective={detail?.[`effective_${language}`] || []} dark={isDark} />
                            {detail?.category === 1 ? renderVoucher(detail) : renderNFT(detail)}
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">{t('nft:history:title')}</h3>
                        <section className="mt-4">
                            <History idNFT={idNFT} />
                        </section>
                    </section>
                </article>
                <Use isModal={isUse} category={detail?.category} onCloseModal={handleModalUse} statusCodeNFT={statusCodeNFT} onUseSubmit={handleUseSubmit} />
                <Transfer isModal={isTransfer} onCloseModal={handleModalTransfer} detail={detail} idNFT={idNFT} />
            </main>
        </MaldivesLayout>
    );
};

const WrapperImage = styled.section`
    img {
        border-radius: 12px !important;
    }
`;

export default WalletDetail;
