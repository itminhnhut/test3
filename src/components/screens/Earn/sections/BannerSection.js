import React from 'react';
import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import CheckCircle from 'components/svg/CheckCircle';
import { useTranslation } from 'next-i18next';

const Feature = ({ children }) => {
    return (
        <div className="flex text-teal text-base space-x-2 items-center font-semibold">
            <CheckCircle size={24} />
            <span>{children}</span>
        </div>
    );
};

const BannerSection = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-[#0b1c18]">
            <div className="relative w-fit leading-[0] m-auto">
                <div className="absolute inset-0 w-full m-auto z-10 px-4 v3:px-0 max-w-screen-v3 2xl:max-w-screen-xxl">
                    <div className="flex flex-col justify-center h-full max-w-[460px]">
                        <h1 className="text-6xl text-white font-semibold">{t('earn:heading')}</h1>
                        <div className="text-txtPrimary-dark mt-6 text-base">{t('earn:description')}</div>

                        <div className="mt-7 flex space-x-7">
                            <div className="flex flex-col space-y-4">
                                <Feature>{t('earn:features:profit')}</Feature>
                                <Feature>{t('earn:features:period')}</Feature>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <Feature>{t('earn:features:daily_rewards')}</Feature>
                                <Feature>{t('earn:features:simple')}</Feature>
                            </div>
                        </div>
                    </div>
                </div>
                <Image priority={false} layout="intrinsic" src={getS3Url('/images/screen/earn/banner_earn.webp')} width={1920} height={588} />
            </div>
        </div>
    );
};

export default BannerSection;
