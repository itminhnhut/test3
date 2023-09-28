import React, { useState, useEffect } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// ** Hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Redux
import { API_GET_DETAIL_NFT } from 'redux/actions/apis';

// ** Components
import TableV2 from 'components/common/V2/TableV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

// ** Third party
import styled from 'styled-components';
import Button from 'components/common/V2/ButtonV2/Button';

// ** Dynamic components
const Effective = dynamic(() => import('components/screens/NFT/Components/Detail/Effective'), {
    ssr: false
});

const Description = dynamic(() => import('components/screens/NFT/Components/Detail/Description'), {
    ssr: false
});

const Contents = dynamic(() => import('components/screens/NFT/Components/Detail/Contents'), {
    ssr: false
});

const ModalImage = dynamic(() => import('components/screens/NFT/Components/Modal/Image'), {
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
    const [isToggleImage, setIsToggleImage] = useState(false);

    // ** handle
    const handleToggleImage = () => setIsToggleImage((prev) => !prev);

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

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px] gap-10 flex flex-row mt-20">
                    <section className="w-full">
                        <Contents detail={detail} isDark={isDark} />
                        <Description detail={detail} />
                        <Effective effective={detail?.[`effective_${language}`] || []} dark={isDark} />
                    </section>
                    <section className="border-divider dark:border-dark rounded-xl p-4 border-[1px] max-h-max">
                        <WrapperImage className="w-full max-w-[401px] max-h-[401px] cursor-pointer" onClick={handleToggleImage}>
                            {detail?.image ? <img width={401} height={401} src={detail?.image} /> : null}
                        </WrapperImage>
                        <Button className="mt-6">{t('nft:detail:get_rewarded_now')}</Button>
                    </section>
                </article>
            </main>
            <ModalImage onClose={handleToggleImage} isModal={isToggleImage} image={detail?.image} name={detail?.name} />
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

const WrapperImage = styled.section`
    img {
        border-radius: 12px !important;
    }
`;

export default index;
