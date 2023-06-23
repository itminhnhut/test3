import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'src/redux/actions/utils';
import { useSelector } from 'react-redux';

import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import { ASSET_DIGITAL } from 'constants/staking';

const AssetDigitalStaking = ({ isMobile }) => {
    const auth = useSelector((state) => state.auth?.user);
    const router = useRouter();
    const {
        i18n: { language }
    } = useTranslation();

    const renderBtnAssetDigital = (data) => {
        return !auth ? (
            <a
                className="w-full"
                href={getLoginUrl('sso', 'login', {
                    redirect: `${process.env.NEXT_PUBLIC_API_URL}/${router.locale}/withdraw-deposit/crypto?side=BUY&assetId=${data?.title}`
                })}
            >
                <ButtonV2>{data?.btn[language]}</ButtonV2>
            </a>
        ) : (
            <a className="w-full" href={data?.href}>
                <ButtonV2>{data?.btn[language]}</ButtonV2>
            </a>
        );
    };

    const renderAssetDigital = useMemo(() => {
        return ASSET_DIGITAL.map((item) => {
            return (
                <section
                    key={`asset-digital-${item.title}`}
                    className="h-full lg:h-[589px] w-full
                    border-[1px] dark:border-[#222940] dark:bg-dark-4 bg-white border-[#dcdfe6] rounded-xl border-solid
                    px-5 lg:px-[60px] py-10 lg:py-[80px] flex flex-col justify-center items-center
                    first:mt-[88px] lg:first:mt-0
                    "
                >
                    <Image width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} src={getS3Url(item.imgSrc)} />
                    <div className="uppercase text-[20px] lg:text-3xl font-semibold text-green-2 mt-6 lg:mt-7">{item.title}</div>
                    <div className="uppercase text-gray-15 dark:text-gray-4 mt-1 lg:mt-2 text-sm lg:text-base">{item.subText}</div>
                    <div
                        className="border-t border-divider dark:border-divider-dark
                            divide-y divide-divider dark:divide-divider-dark space-y-3 w-full my-5 lg:my-7"
                    />
                    <div className="text-gray-15 dark:text-gray-4 text-sm lg:text-base">{item.content[language]}</div>
                    <div className="text-[20px] lg:text-3xl font-semibold text-green-2 mg-1 lg:mt-2 mb-6 lg:mb-10">{item.percent}%</div>
                    {renderBtnAssetDigital(item)}
                </section>
            );
        });
    }, [auth]);

    return (
        <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
            <section className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row lg:gap-[80px] justify-between px-0 lg:px-[108px] relative z-20">
                {renderAssetDigital}
            </section>
        </section>
    );
};

export default AssetDigitalStaking;
