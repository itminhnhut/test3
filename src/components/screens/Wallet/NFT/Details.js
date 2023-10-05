import React, { useState, useEffect, useCallback } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Utils
import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';

// ** Redux
import { API_GET_DETAIL_OWNER_NFT, API_POST_ACTIVE_NFT, API_GET_CHECK_NFT } from 'redux/actions/apis';

// ** Components
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

// ** Third party
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

const ModalImage = dynamic(() => import('components/screens/NFT/Components/Modal/Image'), {
    ssr: false
});

const initState = {
    loading: false,
    page: 1,
    dataHistory: {
        result: [{ event: 'Mint' }, { event: 'Mint' }],
        hasNext: false,
        go_next: true
    },
    isTransfer: false,
    isUse: false,
    tab: 'info'
};

const TAB_DETAILS = [
    { label: { vi: 'Thông tin', en: 'Info' }, value: 'info' },
    { label: { vi: 'Lịch sử', en: 'History' }, value: 'history' }
];

const WalletDetail = ({ idNFT }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    // ** useState
    const [tab, setTabs] = useState(initState.tab);
    const [detail, setDetail] = useState();
    const [isUse, setIsUse] = useState(initState.isUse);
    const [isTransfer, setIsTransfer] = useState(initState.isTransfer);
    const [isLoading, setIsLoading] = useState(initState.loading);
    const [statusCodeNFT, setStatusCodeNFT] = useState();
    const [isToggleImage, setIsToggleImage] = useState(false);

    // ** handle modal events
    const handleModalUse = () => setIsUse((prev) => !prev);
    const handleModalTransfer = () => setIsTransfer((prev) => !prev);

    // ** handle
    const handleTab = (tab) => setTabs(tab);
    const handleToggleImage = () => setIsToggleImage((prev) => !prev);

    //** call api detail NFT
    const handleDetailNFT = async () => {
        try {
            const { data } = await FetchApi({ url: API_GET_DETAIL_OWNER_NFT, params: { id: idNFT } });
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
                toast({ text: t('nft:active:toast_success', { type: detail?.name }), type: 'success', duration: 1500 });
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
                {detail?.transferable ? (
                    <ButtonV2 variants="secondary" onClick={handleModalTransfer}>
                        {t('nft:history:transfer')}
                    </ButtonV2>
                ) : null}
                {detail?.status === 0 ? <ButtonV2 onClick={handleCheckNFT}>{t('nft:history:active')}</ButtonV2> : null}
            </section>
        );
    };

    const renderImage = () => {
        // if (detail?.category === 1 && detail?.status !== 0) {
        //     return (
        //         <WrapperImage className="w-[100vw] max-w-[401px] max-h-[401px]">
        //             <img width={401} height={401} src={detail?.image} />
        //         </WrapperImage>
        //     );
        // }
        // if (detail?.category === 2 && detail?.status !== 0 && !detail?.transferable) {
        //     return (
        //         <WrapperImage className="w-[100vw] max-w-[550px] max-h-[550px]">
        //             <img width={550} height={550} src={detail?.image} />
        //         </WrapperImage>
        //     );
        // }

        return detail?.image ? (
            <WrapperImage className="w-[100vw] max-w-[401px] max-h-[401px] cursor-pointer" onClick={handleToggleImage}>
                <img width={401} height={401} src={detail?.image} />
            </WrapperImage>
        ) : null;
    };

    const LIST_CONTENT = {
        info: (
            <>
                <Description detail={detail} />
                <Effective effective={detail?.[`effective_${language}`] || []} dark={isDark} />
            </>
        ),
        history: <History idNFT={idNFT} />
    };

    const renderTabs = useCallback(() => {
        return (
            <>
                <Tabs isDark tab={tab} className="mt-6 gap-6 border-b border-divider dark:border-divider-dark justify-between">
                    <section className="flex gap-6">
                        {TAB_DETAILS?.map((item) => (
                            <TabItem
                                key={item.label?.[language]}
                                className="!text-left !px-0 !text-base "
                                value={item.value}
                                onClick={(isClick) => isClick && handleTab(item.value)}
                                isActive={item.value === tab}
                            >
                                {item.label?.[language]}
                            </TabItem>
                        ))}
                    </section>
                </Tabs>
                {LIST_CONTENT?.[tab]}
            </>
        );
    }, [tab, detail]);

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px] mt-20 gap-10 flex flex-row">
                    <section className="w-full">
                        <Contents detail={detail} wallet isDark={isDark} />
                        <section>{renderTabs()}</section>
                    </section>
                    <section className="border-divider dark:border-dark rounded-xl p-4 border-[1px] max-h-max">
                        {renderImage()}
                        {detail?.category === 1 ? renderVoucher(detail) : renderNFT(detail)}
                    </section>
                </article>
                <Use
                    isModal={isUse}
                    nameNFT={detail?.name}
                    category={detail?.category}
                    onCloseModal={handleModalUse}
                    statusCodeNFT={statusCodeNFT}
                    onUseSubmit={handleUseSubmit}
                />
                <Transfer isModal={isTransfer} isDark={isDark} onCloseModal={handleModalTransfer} detail={detail} idNFT={idNFT} />
            </main>
            <ModalImage onClose={handleToggleImage} isModal={isToggleImage} image={detail?.image} name={detail?.name} />
        </MaldivesLayout>
    );
};

const WrapperImage = styled.section`
    img {
        border-radius: 12px !important;
    }
`;

export default WalletDetail;
