import React, { useMemo, useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DynamicNoSsr from 'components/DynamicNoSsr';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import CollapseV2 from 'components/common/V2/CollapseV2';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';

import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import { WHY_CHOOSE_NAMI, ASSET_DIGITAL, FAQ, STEP_STAKING } from './constant.js';
import CalculateInterest from 'components/screens/Staking/CalculateInterest.js';

const Reference = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme, onThemeSwitch, setTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    useEffect(() => {
        if (isMobile) {
            const root = document.querySelector(':root');
            root.classList.add('dark');
            setTheme(THEME_MODE.DARK);
        }
    }, [currentTheme, isMobile]);

    const renderWhyChooseNami = useMemo(() => {
        return WHY_CHOOSE_NAMI.map((item, idx) => {
            return (
                <article key={idx} className="flex flex-col gap-3 w-full last:mb-[60px] mb-[60px] first:mt-[53px]">
                    <div className="text-gray-15 dark:text-gray-4 font-semibold text-2xl">{item.title[language]}</div>
                    <div className="text-gray-1 dark:text-gray-7">{item.context[language]}</div>
                </article>
            );
        });
    }, []);

    const renderAssetDigital = useMemo(() => {
        return ASSET_DIGITAL.map((item, idx) => {
            return (
                <section
                    key={idx}
                    className="h-[589px] w-full
                    border-[1px] dark:border-[#222940] dark:bg-dark-4 bg-white border-[#dcdfe6] rounded-xl border-solid
                    px-[60px] py-[80px] flex flex-col justify-center items-center"
                >
                    <Image width="120px" height="120px" src={item.imgSrc} />
                    <div className="uppercase text-3xl font-semibold text-green-2 mt-7">{item.title}</div>
                    <div className="uppercase text-gray-15 dark:text-gray-4 mt-2">{item.subText}</div>
                    <div
                        className="border-t border-divider dark:border-divider-dark
                            divide-y divide-divider dark:divide-divider-dark space-y-3 w-full my-7"
                    />
                    <div className="text-gray-15 dark:text-gray-4">{item.content}</div>
                    <div className="text-3xl font-semibold text-green-2 mt-2 mb-10">{item.percent}%</div>
                    <ButtonV2>{item.btn[language]}</ButtonV2>
                </section>
            );
        });
    }, []);

    const renderFAQ = useMemo(() => {
        return FAQ.map((item, idx) => {
            return (
                <CollapseV2
                    key={idx}
                    className="w-full divider-bottom"
                    divLabelClassname="w-full justify-between pb-[21px]"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={item.title?.[language]}
                    labelClassname="text-base font-semibold mt-5 text-gray-15 dark:text-white"
                    chevronDownClassName="mt-5"
                    isDividerBottom={true}
                    dividerBottomClassName="!mt-5"
                >
                    <ul className="list-disc pl-5">
                        <li className="text-gray-1 dark:text-gray-7">{item.content[language]}</li>
                    </ul>
                </CollapseV2>
            );
        });
    }, [isDark]);

    const renderStep = useMemo(() => {
        return STEP_STAKING.map((item, idx) => {
            return !item?.isDivider ? (
                <section key={idx} className="w-full px-4">
                    <Image width="54px" height="54px" src={item.imgSrc} />
                    <div className="font-semibold text-gray-15 dark:text-gray-4 mt-6">{item.title?.[language]}</div>
                    <div className="text-gray-1 dark:text-gray-7 mt-6">{item.subText?.[language]}</div>
                </section>
            ) : (
                <section key={idx} className="w-[92px]">
                    <div className="h-[1px] w-[92px] bg-gradient-to-l from-dominant dark:to-[rgba(0,0,0,.2)] to-[rgba(255,255,255,0.2)]"></div>
                </section>
            );
        });
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <DynamicNoSsr>
                <MaldivesLayout>
                    <main className="bg-white dark:bg-shadow">
                        <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                            <div className="flex flex-row justify-between gap-x-[99px]">
                                <div className="w-full mt-[120px]">
                                    <h1 className="text-gray-15 dark:text-gray-4 text-6xl font-semibold">
                                        Nhận lãi suất không kỳ hạn với chương trình Staking của Nami
                                    </h1>
                                    <div className="text-gray-1 dark:text-gray-7 mt-3">
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

                            <WrapperStep
                                isDark={isDark}
                                className="mt-[120px] relative
                                  border-[1px] dark:border-[#222940] dark:bg-dark-4 bg-divider border-[#30BF73] rounded-3xl  border-solid"
                            >
                                <div className="h-[294px] flex flex-row gap-x-4 items-center justify-center text-center">{renderStep}</div>
                            </WrapperStep>

                            <CalculateInterest />

                            <section className="mt-[120px]">
                                <h2 className="text-gray-15 dark:text-gray-4 text-5xl font-semibold text-center">Tại sao nên chọn Nami Exchange?</h2>
                                <div className="flex flex-row gap-x-[103px] justify-between mt-[60px]">
                                    <div className="w-full">
                                        <Image width="596px" height="520px" src="/images/staking/bg_why_choose_nami.png" />
                                    </div>
                                    <article className="w-full">{renderWhyChooseNami}</article>
                                </div>
                            </section>
                        </div>
                        <section className="relative mt-[120px]">
                            <div className="absolute -z-10 w-full h-full cursor-pointer">
                                <Image width="1440px" height="1606px" src="/images/staking/bg_nen.png" layout="fill" objectFit="cover" quality={100} />
                            </div>
                            <section className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                                <section className="flex flex-row gap-[80px] justify-between px-[108px] relative z-20">{renderAssetDigital}</section>
                            </section>
                            <section className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto mt-[120px] mb-[120px]">
                                <h2 className="text-5xl font-semibold text-gray-15 dark:text-gray-4">Các câu hỏi thường gặp (FAQ)</h2>
                                <div className="mt-[60px]">{renderFAQ}</div>
                            </section>
                        </section>
                    </main>
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

const WrapperStep = styled.div`
    background: ${(props) =>
        props?.isDark
            ? `linear-gradient(184.08deg, rgba(30, 32, 40, 0.15) 3.33%, rgba(30, 128, 110, 0.15) 69%, rgba(30, 255, 201, 0.15) 130.36%)`
            : `linear-gradient(184.08deg, rgba(255, 255, 255, 0.15) 3.33%, rgba(70, 211, 128, 0.075) 130.36%);`};
`;

//bg-gradient-to-l from-dominant dark:to-[rgba(0,0,0,.2)] to-[rgba(255,255,255,0.2)];

export default Reference;
