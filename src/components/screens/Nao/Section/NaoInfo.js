import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { Progressbar } from 'components/screens/Nao/NaoStyle';
import { useSelector } from 'react-redux';

const NaoInfo = ({ dataSource, assetNao, ammData }) => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user) || null;

    const holders_wallet = useMemo(() => {
        return 22250000 - ammData - dataSource?.totalStaked
    }, [dataSource, ammData])

    return (
        <section id="nao_info" className="flex items-center justify-between pt-12 sm:pt-20 flex-wrap gap-8">
            <div className="flex items-center">
                <BackgroundImage>
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} className="w-[62px] h-[62px] sm:w-[80px] sm:h-[80px]" alt="" />
                </BackgroundImage>
                <div className="flex flex-col justify-between font-semibold">
                    <div>
                        <div className="text-2xl sm:text-5xl">{t('nao:project_info')}</div>
                        <div className="sm:text-lg flex items-center pt-1 flex-wrap">
                            <label className="text-green-3 dark:text-teal uppercase">NAO</label>
                            <span className="mx-2">•</span>
                            <div className="capitalize">Nami frame futures</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-6 sm:px-8 sm:py-[26px] relative z-0 flex-1">
                <div className="bg-nao-corner-mb sm:bg-nao-corner dark:bg-nao-corner-mb-dark sm:dark:bg-nao-corner-dark bg-full w-full h-full absolute z-0 left-0 top-0"></div>
                <div className="relative z-10 flex sm:flex-none flex-col sm:flex-row">
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
                    <div className="h-[1px] mx-0 my-4 sm:h-auto sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-7 sm:my-0"></div>
                    <div className="flex flex-col justify-between gap-3 w-full text-sm sm:text-base">
                        <div className="flex items-center justify-between space-x-2">
                            <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:holders_wallet')}</label>
                            <div className="flex items-center space-x-2">
                                {ammData ? (
                                    <div className="font-semibold text-right break-all">{formatNumber(holders_wallet, assetNao?.assetDigit ?? 8)}</div>
                                ) : (
                                    <div className="font-semibold">-</div>
                                )}
                                <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:liq_pools')}</label>
                            <div className="flex items-center space-x-2">
                                {ammData ? (
                                    <div className="font-semibold text-right break-all">{formatNumber(ammData, assetNao?.assetDigit ?? 8)}</div>
                                ) : (
                                    <div className="font-semibold">-</div>
                                )}
                                <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:governance_pool')}</label>
                            <div className="flex items-center space-x-2">
                                <div className="font-semibold text-right break-all">{formatNumber(dataSource?.totalStaked, assetNao?.assetDigit ?? 8)}</div>
                                <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const BackgroundImage = styled.div.attrs({
    className: 'min-w-[90px] w-[90px] h-[90px] sm:min-w-[116px] sm:w-[116px] sm:h-[116px] rounded-[50%] flex justify-center items-center mr-4 sm:mr-6'
})`
    background: linear-gradient(136deg, #00144e -5%, #003a33 115%);
`;



export default NaoInfo;
