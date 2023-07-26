import React, { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';

import { API_GET_DETAIL_NFT } from 'redux/actions/apis';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

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
        handleDetailNFT();
    }, [idNFT]);

    const handleUseSubmit = () => {
        try {
            toast({ text: 'Sử dụng WNFT thành công', type: 'success', duration: 1500 });
            handleModalUse();
        } catch (error) {
            console.error(error);
        }
    };

    //** render */
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
                            {detail?.image ? <Image width={614} height={614} src={detail?.image} sizes="100vw" /> : null}
                        </section>
                        <section className="w-full">
                            <Contents detail={detail} wallet={true} />
                            <Description detail={detail} />
                            <Effective effective={detail?.effective} dark={isDark} />
                            {renderStatus()}
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">Lịch sử Mint/Chuyển</h3>
                        <section className="mt-4">
                            <History idNFT={idNFT} />
                        </section>
                    </section>
                </article>
                <Use isModal={isUse} onCloseModal={handleModalUse} onUseSubmit={handleUseSubmit} />
                <Transfer isModal={isTransfer} onCloseModal={handleModalTransfer} />
            </main>
        </MaldivesLayout>
    );
};

export default WalletDetail;
