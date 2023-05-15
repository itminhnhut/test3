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

const seeDetailedVIURL = 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-3/';
const seeDetailedENURL = 'https://goonus.io/en/onus-x-nami-onus-futures-vndc-tournament-nami-championship-season-3/';

export default function ({ version }) {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderVolume = (value, className = '') => {
        return <span className={classNames('text-sm sm:text-base text-right font-semibold', className)}> {formatNumber(value, 0)} VNDC</span>;
    };

    const renderPNLRate = (value, className = '') => {
        return <span className={classNames('text-sm sm:text-base text-right text-teal font-semibold', className)}>{value} %</span>;
    };

    const renderOrderCount = (value, className = '') => {
        return (
            <span className={classNames('text-sm sm:text-base text-right font-semibold', className)}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 mt-14">
                        <div className="flex flex-col justify-center">
                            <h4 className="font-semibold text-2xl sm:text-5xl text-center sm:text-left">{t('nao:year_summary:title', { version })}</h4>
                            <p className="text-base lg:text-lg text-txtPrimary dark:text-txtPrimary-dark mt-2 text-center sm:text-left">
                                {t('nao:year_summary:content', { version })}{' '}
                                {/* <a */}
                                {/*     href={language === LANGUAGE_TAG.EN ? seeDetailedENURL : seeDetailedVIURL} */}
                                {/*     target="_blank" */}
                                {/*     className="text-teal underline cursor-pointer block sm:inline" */}
                                {/* > */}
                                {/*     {t('nao:year_summary:see_detailed_rules')} */}
                                {/* </a> */}
                            </p>
                        </div>
                        <div className="flex justify-center sm:mt-0 mt-10">
                            <img width={353} className="w-[300px] sm:w-[353]" src={getS3Url('/images/nao/year_summary/banner.png')} alt="Nami Nao" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-13 dark:bg-dark mt-12 sm:mt-20 rounded-t-3xl pb-20 sm:pb-[120px] pt-6 sm:pt-20">
                    <div className="nao_section px-4 nao:p-0 max-w-[72.5rem] w-full m-auto">
                        <NaoFuturesPerformance version={version} />

                        {/* <TextLiner className="font-semibold mb-12 mt-20">{t('nao:year_summary:pnl_ranking')}</TextLiner>
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

                        <TextLiner className="font-semibold mb-12 mt-20">{t('nao:year_summary:volume_ranking')}</TextLiner>
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
                        <TextLiner className="font-semibold mb-12 mt-20">{t('nao:year_summary:total_trade_ranking')}</TextLiner>
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
                        /> */}

                        <div className="mt-20 lg:pt-20 flex flex-col items-center">
                            <img width={100} src={getS3Url('/images/nao/year_summary/footer.png')} />
                            <span className="mt-5 font-semibold max-w-4xl text-center">{t('nao:year_summary:tks')}</span>
                        </div>
                    </div>
                </div>

                <NaoFooter noSpacingTop />
            </div>
        </LayoutNaoToken>
    );
}
