import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import { ASSET_DIGITAL } from 'constants/staking';

const AssetDigitalStaking = ({ isMobile }) => {
    const {
        i18n: { language }
    } = useTranslation();

    const renderAssetDigital = useMemo(() => {
        return ASSET_DIGITAL.map((item) => {
            return (
                <section
                    key={`asset-digital-${item.title}`}
                    className="h-full lg:h-[589px] w-full
                    border-[1px] dark:border-[#222940] dark:bg-dark-4 bg-white border-[#dcdfe6] rounded-xl border-solid
                    px-[60px] py-10 lg:py-[80px] flex flex-col justify-center items-center
                    first:mt-[88px] lg:first:mt-0
                    "
                >
                    <Image width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} src={item.imgSrc} />
                    <div className="uppercase text-[20px] lg:text-3xl font-semibold text-green-2 mt-6 lg:mt-7">{item.title}</div>
                    <div className="uppercase text-gray-15 dark:text-gray-4 mt-1 lg:mt-2 text-sm lg:text-base">{item.subText}</div>
                    <div
                        className="border-t border-divider dark:border-divider-dark
                            divide-y divide-divider dark:divide-divider-dark space-y-3 w-full my-5 lg:my-7"
                    />
                    <div className="text-gray-15 dark:text-gray-4 text-sm lg:text-base">{item.content}</div>
                    <div className="text-[20px] lg:text-3xl font-semibold text-green-2 mg-1 lg:mt-2 mb-6 lg:mb-10">{item.percent}%</div>
                    <Link href={item?.href}>
                        <ButtonV2>{item.btn[language]}</ButtonV2>
                    </Link>
                </section>
            );
        });
    }, []);

    return (
        <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
            <section className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row lg:gap-[80px] justify-between px-0 lg:px-[108px] relative z-20">
                {renderAssetDigital}
            </section>
        </section>
    );
};

export default AssetDigitalStaking;
