import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import RankList from 'components/screens/Nao/YearSummary/RankList';
import {
    API_CONTEST_NAO_YEAR_SUMMARY_ORDER,
    API_CONTEST_NAO_YEAR_SUMMARY_PNL,
    API_CONTEST_NAO_YEAR_SUMMARY_VOLUME
} from 'redux/actions/apis';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import NaoFuturesPerformance from 'components/screens/Nao/YearSummary/NaoFuturesPerformance';
import classNames from 'classnames';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const seeDetailedVIURL = 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-3/';
const seeDetailedENURL = 'https://goonus.io/en/onus-x-nami-onus-futures-vndc-tournament-nami-championship-season-3/';

export default function () {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderVolume = (value, className = '') => {
        return <span
            className={classNames('text-sm text-right font-medium', className)}
        > {formatNumber(value, 0)} VNDC</span>;
    };

    const renderPNLRate = (value, className = '') => {
        return <span
            className={classNames('text-sm text-right text-nao-green2 font-medium', className)}
        >{value} %</span>;
    };

    const renderOrderCount = (value, className = '') => {
        return <span
            className={classNames('text-sm text-right font-medium', className)}
        >{value} {t('nao:year_summary:orders')}</span>;
    };

    return (
        <LayoutNaoToken>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-14'>
                <div className='flex flex-col justify-center'>
                    <h4 className='font-semibold text-[2.125rem] leading-10 text-center md:text-left'>{t('nao:year_summary:title')} 2022</h4>
                    <p className='text-lg text-nao-text mt-2 text-center md:text-left'>
                        {t('nao:year_summary:content')}{' '}
                        <a href={language === LANGUAGE_TAG.EN ? seeDetailedENURL : seeDetailedVIURL}
                           target='_blank'
                           className='text-onus-base underline cursor-pointer block md:inline'>{t('nao:year_summary:see_detailed_rules')}</a>
                    </p>
                </div>
                <div className='flex justify-center md:mt-0 mt-10'>
                    <img
                        width={353}
                        className='w-[300px] md:w-[353]'
                        src={getS3Url('/images/nao/year_summary/banner.png')}
                        alt='Nami Nao'
                    />
                </div>
            </div>

            <NaoFuturesPerformance />

            <h3 className='font-semibold mb-12 mt-20'>{t('nao:year_summary:pnl_ranking')}</h3>
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

            <h3 className='font-semibold mb-12 mt-20'>{t('nao:year_summary:volume_ranking')}</h3>
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
            <h3 className='font-semibold mb-12 mt-20'>{t('nao:year_summary:total_trade_ranking')}</h3>
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

            <div className='mt-20 flex flex-col items-center'>
                <img width={100} src={getS3Url('/images/nao/year_summary/footer.png')} />
                <span className='mt-5'>{t('nao:year_summary:tks')}</span>
            </div>
        </LayoutNaoToken>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao']))
    }
});
