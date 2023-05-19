import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import React from 'react';
import RankList from 'components/screens/Nao/YearSummary/RankList';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import NaoFuturesPerformance from 'components/screens/Nao/YearSummary/NaoFuturesPerformance';
import classNames from 'classnames';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import { TextLiner } from 'components/screens/Nao/NaoStyle';
import { API_CONTEST_NAO_YEAR_SUMMARY_PNL, API_CONTEST_NAO_YEAR_SUMMARY_VOLUME, API_CONTEST_NAO_YEAR_SUMMARY_ORDER } from 'redux/actions/apis';

const seeDetailedVIURL = 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-3/';
const seeDetailedENURL = 'https://goonus.io/en/onus-x-nami-onus-futures-vndc-tournament-nami-championship-season-3/';

export default function ({ version }) {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderVolume = (value, className = '') => {
        return <span className={classNames('text-sm sm:text-base text-right', className)}> {formatNumber(value, 0)} VNDC</span>;
    };

    const renderPNLRate = (value, className = '') => {
        return <span className={classNames('text-sm sm:text-base text-right text-teal', className)}>{value} %</span>;
    };

    const renderOrderCount = (value, className = '') => {
        return (
            <span className={classNames('text-sm sm:text-base text-right', className)}>
                {value} {t('nao:year_summary:orders')}
            </span>
        );
    };

    return (
        <LayoutNaoToken isHeader={false}>
            <div className="min-h-screen">
                <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0">
                    <NaoHeader />
                </div>
                <div className="nao_section px-4 nao:p-0 max-w-[72.5rem] w-full m-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 mt-14">
                        <div className="flex flex-col justify-center">
                            <h4 className="font-semibold text-xl sm:text-5xl text-center sm:text-left">{t('nao:year_summary:title', { version })}</h4>
                            <p className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark mt-4 sm:mt-8 text-center sm:text-left">
                                {t('nao:year_summary:content', { version })} {/* <a */}
                                {/*     href={language === LANGUAGE_TAG.EN ? seeDetailedENURL : seeDetailedVIURL} */}
                                {/*     target="_blank" */}
                                {/*     className="text-teal underline cursor-pointer block sm:inline" */}
                                {/* > */}
                                {/*     {t('nao:year_summary:see_detailed_rules')} */}
                                {/* </a> */}
                            </p>
                        </div>
                        <div className="flex justify-center sm:mt-0 mt-10">
                            <img width={353} className="sm:min-w-[500px]" src={`/images/nao/year_summary/banner_${version}.png`} alt="Nami Nao" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-13 dark:bg-dark rounded-t-2xl pb-20 sm:pb-[120px] mt-12 sm:mt-20">
                    <div className="nao_section pt-6 px-4 nao:p-0 max-w-[72.5rem] w-full m-auto">
                        <NaoFuturesPerformance version={version} />

                        <div className="mt-12 md:mt-20">
                            <TextLiner className="font-semibold mb-6 md:mb-8">{t('nao:year_summary:pnl_ranking')}</TextLiner>
                            <RankList
                                url={API_CONTEST_NAO_YEAR_SUMMARY_PNL}
                                rankFieldName="rank_pnl"
                                information={[
                                    {
                                        label: t('nao:year_summary:volume'),
                                        valueKey: 'total_volume',
                                        render: renderVolume
                                    },
                                    {
                                        label: t('nao:year_summary:pnl_rate'),
                                        valueKey: 'pnl_rate',
                                        render: renderPNLRate
                                    }
                                ]}
                            />
                        </div>

                        <div className="mt-12 md:mt-20">
                            <TextLiner className="font-semibold mb-6 md:mb-8">{t('nao:year_summary:volume_ranking')}</TextLiner>
                            <RankList
                                url={API_CONTEST_NAO_YEAR_SUMMARY_VOLUME}
                                rankFieldName="rank_volume"
                                information={[
                                    {
                                        label: t('nao:year_summary:volume'),
                                        valueKey: 'total_volume',
                                        render: renderVolume
                                    },
                                    {
                                        label: t('nao:year_summary:total_trades'),
                                        valueKey: 'total_order',
                                        render: renderOrderCount
                                    }
                                ]}
                            />
                        </div>

                        <div className='mt-12 md:mt-20'>
                            <TextLiner className="font-semibold mb-6 md:mb-8">{t('nao:year_summary:total_trade_ranking')}</TextLiner>
                            <RankList
                                url={API_CONTEST_NAO_YEAR_SUMMARY_ORDER}
                                rankFieldName="rank_order"
                                information={[
                                    {
                                        label: t('nao:year_summary:volume'),
                                        valueKey: 'total_volume',
                                        render: renderVolume
                                    },
                                    {
                                        label: t('nao:year_summary:total_trades'),
                                        valueKey: 'total_order',
                                        render: renderOrderCount
                                    }
                                ]}
                            />
                        </div>

                        <div className="mt-12 sm:mt-20 flex flex-col items-center">
                            <img className="w-[59px] sm:w-[93px]" src={'/images/nao/year_summary/ic_nao_v1.png'} />
                            <span className="mt-4 sm:mt-6 text-sm sm:text-base font-semibold max-w-4xl text-center">{t('nao:year_summary:tks')}</span>
                        </div>
                    </div>
                </div>

                <NaoFooter noSpacingTop />
            </div>
        </LayoutNaoToken>
    );
}
