import React, { useState, useMemo } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider, Progressbar } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const PerformanceTab = ({ isSmall, dataSource, assetNao, onShowLock }) => {
    const { t } = useTranslation();

    return (
        dataSource?.totalStaked ?
            <>
                <div>
                    <TextLiner className="pb-1">{t('nao:pool:per_overview')}</TextLiner>
                    <div className="text-nao-grey text-sm">Lorem ipsum doren sitala ipsum doren</div>
                    <CardNao className="divide-nao-line divide-y mt-6">
                        <div className='pb-4'>
                            <label className="text-nao-text font-medium leading-6">{t('nao:pool:total_staked')}</label>
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center mr-8">
                                        <span className="font-semibold mr-1 leading-7">{formatNumber(dataSource?.availableStaked, assetNao?.assetDigit ?? 8)}</span>
                                        <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                                    </div>
                                    <div className="text-nao-grey text-sm">{formatNumber(dataSource?.totalStaked, assetNao?.assetDigit ?? 8)}</div>
                                </div>
                                <div className="my-2">
                                    <div className="w-full bg-[#000000] rounded-lg">
                                        <Progressbar percent={((dataSource?.availableStaked ?? 0) / dataSource?.totalStaked) * 100} />
                                    </div>
                                </div>
                                <div className="text-xs font-medium leading-6">{formatNumber(((dataSource?.availableStaked ?? 0) / dataSource?.totalStaked) * 100, assetNao?.assetDigit ?? 8)}%</div>
                            </div>
                        </div>
                        <div className="py-4">
                            <label className="text-nao-text font-medium leading-6">{t('nao:pool:total_revenue')}</label>
                            <div className="flex items-center mt-4">
                                <div className="text-[22px font-semibold leading-8 mr-2">0 VNDC</div>

                            </div>
                        </div>
                        <div className="pt-4">
                            <label className="text-nao-blue font-medium leading-6">{t('nao:pool:per_est_revenue')}</label>
                            <div className="flex items-center mt-4">
                                <div className="text-[22px font-semibold leading-8 mr-2">{formatNumber(dataSource?.estimateNextValue ?? 0, 0)} VNDC</div>
                            </div>
                        </div>
                    </CardNao>
                </div>
                <div className="mt-10">
                    <TextLiner className="pb-1">{t('nao:pool:history_revenue')}</TextLiner>
                    <div className="text-nao-grey text-sm">Lorem ipsum doren sitala ipsum doren</div>
                    <CardNao className="mt-6">
                        {/* <div>
                            <div className="text-nao-grey text-sm">10/06/2022 - 17/06/2022</div>
                            <div className="flex items-center mt-1">
                                <div className="text-lg font-semibold leading-7 mr-2">100,034,238</div>
                                <img src={getS3Url("/images/nao/ic_nao.png")} width={20} height={20} alt="" />
                            </div>
                        </div>
                        <Divider className="w-full !my-4" />
                        <div>
                            <div className="text-nao-grey text-sm">10/06/2022 - 17/06/2022</div>
                            <div className="flex items-center mt-1">
                                <div className="text-lg font-semibold leading-7 mr-2">100,034,238</div>
                                <img src={getS3Url("/images/nao/ic_nao.png")} width={20} height={20} alt="" />
                            </div>
                        </div> */}
                    </CardNao>
                </div>
            </>
            : <>
                <div className="relative flex flex-col justify-center items-center translate-y-1/2 mt-[-60px]">
                    <img src={getS3Url("/images/nao/ic_nao_coming.png")} className='opacity-[0.4]' alt="" width="100" height="193" width="283" />
                    <div className='text-center mt-6'>
                        <TextLiner className="!text-lg !w-full !pb-0">Bạn chưa stake NAO</TextLiner>
                        <div className="text-sm text-nao-grey mt-4">Lorem ipsum orem ipsum orem ipsum orem ipsum orem ipsum </div>
                    </div>
                </div>
                <div className={`absolute w-full ${isSmall ? 'bottom-[30px] ' : '-ml-4 bottom-[60px] '}`}>
                    <div className='px-4'>
                        <ButtonNao onClick={onShowLock} className="font-semibold py-3 w-full">Stake now</ButtonNao>
                    </div>
                </div>
            </>
    );
};

export default PerformanceTab;