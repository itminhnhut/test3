import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import DynamicNoSsr from 'components/DynamicNoSsr';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Head from 'next/head';
import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import classNames from 'classnames';
import Image from 'next/image';

const Reference = () => {
    // const currentTheme = useSelector((state) => state.user.theme);
    const [currentTheme, onThemeSwitch, setTheme] = useDarkMode();

    const { width } = useWindowSize();
    const isMobile = width < 830;

    useEffect(() => {
        if (isMobile) {
            const root = document.querySelector(':root');
            root.classList.add('dark');
            setTheme(THEME_MODE.DARK);
        }
    }, [currentTheme, isMobile]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <DynamicNoSsr>
                <MaldivesLayout>
                    <div className="bg-white dark:bg-shadow">
                        <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                            <div className="flex flex-row justify-between gap-x-[99px]">
                                <div className="w-full mt-[120px]">
                                    <h1 className="text-txtPrimary dark:text-gray-4 text-6xl font-semibold">
                                        Nhận lãi suất không kỳ hạn với chương trình Staking của Nami
                                    </h1>
                                    <div className="text-gray-15 dark:text-gray-7 mt-3">
                                        Chương trình Nhận lãi ngày từ Nami Exchange là công cụ tối ưu lợi nhuận từ tài sản số nhàn rỗi với mức lãi suất lên đến
                                        12,79%/năm với VNDC và 6%/năm với USDT
                                    </div>
                                    <div className="flex flex-row gap-3 mt-9">
                                        <ButtonV2 className="w-[151px]">Bắt đầu ngay</ButtonV2>
                                        <ButtonV2 className="w-[151px]" variants="secondary">
                                            Thống kê
                                        </ButtonV2>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Image width="596px" height="582px" src="/images/staking/bg_header.png" />
                                </div>
                            </div>
                            <div>
                                <div>Tại sao nên chọn Nami Exchange?</div>
                                <div className="flex flex-row gap-x-[103px] justify-between">
                                    <div className="w-full">left</div>
                                    <div className="w-full">right</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'reference', 'broker', 'futures']))
    }
});

export default Reference;
