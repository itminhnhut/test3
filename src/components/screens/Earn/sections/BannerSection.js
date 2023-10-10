import React from 'react';
import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import CheckCircle from 'components/svg/CheckCircle';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

const Background = styled.div`
    background-image: linear-gradient(0deg, #1a3831 0%, #091b16 26%, #071713 99%), url('/images/screen/earn/dot_layer.webp');
`;

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
        <Background className="w-full h-[0.30625vw] min-h-[20rem] max-h-[27.5rem]">
            <div className="max-w-screen-xxl w-full m-auto relative h-full">
                <div className="w-full m-auto px-4 v3:px-0 max-w-screen-v3 2xl:max-w-screen-xxl h-full relative z-10">
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
                <img
                    src="/images/screen/earn/banner-element.webp"
                    alt=""
                    className="absolute h-full right-[max(-240px,calc(100%-1216px))] v3:right-0 bottom-0"
                />
            </div>
        </Background>
    );
};

export default BannerSection;
