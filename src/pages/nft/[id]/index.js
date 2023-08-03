import React, { useState, useCallback, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';

import { API_GET_DETAIL_NFT } from 'redux/actions/apis';

import TableV2 from 'components/common/V2/TableV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import styled from 'styled-components';

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

const index = ({ idNFT }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [detail, setDetail] = useState();

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

    const renderHistory = useCallback(() => {
        return <History idNFT={idNFT} />;
    }, [idNFT]);

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
                            <Contents detail={detail} isDark={isDark} />
                            <Description detail={detail} />
                            <Effective effective={detail?.[`effective_${language}`] || []} dark={isDark} />
                        </section>
                    </section>
                    <section className="mt-[60px]">
                        <h3 className="text-2xl font-semibold text-gray-15 dark:text-gray-4">{t('nft:history:title')}</h3>
                        <section className="mt-4">{renderHistory()}</section>
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
        idNFT: params?.id,
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
