import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { ButtonNao, CardNao, Progressbar } from 'components/screens/Nao/NaoStyle';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const NaoInfo = ({ dataSource, assetNao, ammData }) => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user) || null;

    const holders_wallet = useMemo(() => {
        return 22250000 - ammData - dataSource?.totalStaked;
    }, [dataSource, ammData]);

    return (
        <section id="nao_info" className="pt-12 sm:pt-20">
            <div className="flex items-center">
                <BackgroundImage>
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} className="w-[62px] h-[62px] sm:w-[80px] sm:h-[80px]" alt="" />
                </BackgroundImage>
                <div className="flex gap-4 justify-between font-semibold">
                    <div>
                        <div className="text-2xl sm:text-5xl">{t('nao:project_info')}</div>
                        <div className="sm:text-lg flex items-center pt-1 flex-wrap">
                            <label className="text-green-3 dark:text-teal uppercase">NAO</label>
                            <span className="mx-2">•</span>
                            <div className="capitalize">Nami frame futures</div>
                        </div>
                    </div>
                    {user && (
                        <div className="hidden sm:block">
                            <Link href={'/nao/stake'}>
                                <a>
                                    <ButtonNao className="!rounded-md h-10 !px-6 !py-2 mt-6">{t(`nao:Stake NAO`)}</ButtonNao>
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <CardNao
                    noBg
                    className="bg-bgPrimary dark:bg-bgPrimary-dark !min-w-max !py-6 !px-6 sm:max-w-[390px] !flex-none z-0 relative"
                    customHeight="sm:max-h-[162px]"
                >
                    <div className="flex flex-col w-full">
                        <label className="font-semibold sm:text-lg pb-2 leading-7">{t('nao:circulating_supply')}</label>
                        <div className="text-sm sm:text-base">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center mr-8">
                                    <span className="font-semibold mr-1 leading-7">22,250,000</span>
                                    <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                                </div>
                                <div className="text-txtSecondary dark:text-txtSecondary-dark">100,000,000</div>
                            </div>
                            <div className="my-2">
                                <div className="w-full bg-gray-11 dark:bg-dark-1 rounded-lg">
                                    <Progressbar percent={(22250000 / 100000000) * 100} />
                                </div>
                            </div>
                            <div className="text-xs leading-6">{(22250000 / 100000000) * 100}%</div>
                        </div>
                    </div>
                </CardNao>
                <div className="flex flex-col sm:flex-row sm:justify-evenly sm:items-center w-full text-sm sm:text-base p-6 sm:p-8 bg-white dark:bg-dark-4 border border-divider dark:border-none rounded-xl gap-4 sm:gap-0">
                    <div className="flex sm:flex-col items-center sm:justify-center justify-between gap-3">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:holders_wallet')}</label>
                        <div className="flex items-center space-x-2">
                            {ammData ? (
                                <div className="font-semibold text-right break-all">{formatNumber(holders_wallet, 0)}</div>
                            ) : (
                                <div className="font-semibold">-</div>
                            )}
                            <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                        </div>
                    </div>
                    <div className="hidden sm:block h-[1px] mx-0 my-4 sm:h-[5.75rem] sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-7 sm:my-0"></div>
                    <div className="flex sm:flex-col items-center sm:justify-center justify-between gap-3">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:liq_pools')}</label>
                        <div className="flex items-center space-x-2">
                            {ammData ? (
                                <div className="font-semibold text-right break-all">{formatNumber(ammData, 0)}</div>
                            ) : (
                                <div className="font-semibold">-</div>
                            )}
                            <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                        </div>
                    </div>
                    <div className="hidden sm:block h-[1px] mx-0 my-4 sm:h-[5.75rem] sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-7 sm:my-0"></div>
                    <div className="flex sm:flex-col items-center sm:justify-center justify-between gap-3">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:governance_pool')}</label>
                        <div className="flex items-center space-x-2">
                            <div className="font-semibold text-right break-all">{formatNumber(dataSource?.totalStaked, 0)}</div>
                            <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            {user && (
                <div className="sm:hidden w-full mt-4">
                    <Link href={'/nao/stake'}>
                        <a>
                            <ButtonNao className="!rounded-md h-10 !px-6 !py-2">{t(`nao:Stake NAO`)}</ButtonNao>
                        </a>
                    </Link>
                </div>
            )}
        </section>
    );
};

const BackgroundImage = styled.div.attrs({
    className: 'min-w-[90px] w-[90px] h-[90px] sm:min-w-[116px] sm:w-[116px] sm:h-[116px] rounded-[50%] flex justify-center items-center mr-4 sm:mr-6'
})`
    background: linear-gradient(136deg, #00144e -5%, #003a33 115%);
`;

export default NaoInfo;
