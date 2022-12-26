import { useTranslation } from 'next-i18next';
import { ButtonNao } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { Popover, Transition } from '@headlessui/react';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { Check } from 'react-feather';
import colors from 'styles/colors';
import { Fragment, useEffect, useState } from 'react';
import { merge, range } from 'lodash';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import format from 'date-fns/format';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_NAO_YEAR_SUMMARY_STATISTIC } from 'redux/actions/apis';
import useWindowSize from 'hooks/useWindowSize';

function NaoFuturesPerformance() {
    const [data, setData] = useState({
        last_time_update: 0,
        statistic: {}
    });
    const [filters, setFilters] = useState({
        year: 2022,
        month: null,
        currency: 22
    });
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width < 620;

    const getData = async () => {
        const {
            status,
            data
        } = await fetchApi({
            url: API_CONTEST_NAO_YEAR_SUMMARY_STATISTIC,
            params: filters
        });

        if (status === 'ok' && !!data) {
            setData(data);
        }
    };

    useEffect(() => {
        getData();
    }, [filters]);

    const changeFilters = (filter) => {
        setFilters({ ...filters, ...filter });
    };

    return <>
        <div className='mb-12 mt-20'>
                <h3 className={classNames('inline-block font-semibold text-2xl', {
                    'text-nao-gradient': isMobile
                })}>{t('nao:onus_performance:title')}</h3>
            <div className='flex gap-2 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end'>
                <RangePopover
                    language={language}
                    active={filters.month}
                    onChange={(value) => changeFilters({ month: value === 2022 ? null : value })}
                    className='flex order-last md:order-first'
                    popoverClassName={'md:mr-2'}
                    isMobile={isMobile}
                />
                <div className='order-first gap-2 md:order-last flex gap-last'>
                    <ButtonNao
                        className={classNames({ '!bg-nao-bg3 !font-normal': filters.currency !== WalletCurrency.VNDC })}
                        onClick={() => changeFilters({ currency: WalletCurrency.VNDC })}
                    >{isMobile ? 'VNDC' : 'Futures VNDC'}</ButtonNao>
                    <ButtonNao
                        className={classNames({ '!bg-nao-bg3 !font-normal': filters.currency !== WalletCurrency.USDT })}
                        onClick={() => changeFilters({ currency: WalletCurrency.USDT })}
                    >{isMobile ? 'USDT' : 'Futures USDT'}</ButtonNao>
                </div>
            </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <div className='flex flex-col px-10 py-8 rounded-xl bg-nao/[.15]'>
                <span
                    className='text-lg text-nao-text font-medium leading-7'>{t('nao:year_summary:volume_trades')}</span>
                <span
                    className='text-xl font-semibold leading-8 mt-4'>{formatNumber(data.statistic?.volume, 0)} {assetCodeFromId(filters.currency)}</span>
                <span className='text-nao-grey text-sm mt-2'>${formatNumber(data.statistic?.volume_usdt, 0)}</span>
            </div>

            <div className='flex flex-col px-10 py-8 rounded-xl bg-nao/[.15]'>
                <span
                    className='text-lg text-nao-text font-medium leading-7'>{t('nao:year_summary:order_number')}</span>
                <span
                    className='text-xl font-semibold leading-8 mt-4'>{formatNumber(data.statistic?.num_of_transaction, 0)}</span>
            </div>

            <div className='flex flex-col px-10 py-8 rounded-xl bg-nao/[.15]'>
                <span className='text-lg text-nao-text font-medium leading-7'>{t('nao:year_summary:user_count')}</span>
                <span
                    className='text-xl font-semibold leading-8 mt-4'>{formatNumber(data.statistic?.num_of_user, 0)}</span>
            </div>
        </div>
    </>;
}

const RangePopover = ({
    active,
    onChange,
    popoverClassName = '',
    isMobile = false
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const getOptionString = (option) => {
        if (option === 2022 || !option) {
            return t('nao:year_summary:year', { year: 2022 });
        }
        if (language === LANGUAGE_TAG.EN) {
            option = format(new Date(1970, option, 1), 'MMMM');
        }
        return t('nao:year_summary:month', { month: option });
    };

    return <Popover className={classNames('relative flex', popoverClassName)}>
        {({
            open,
            close
        }) => (
            <>
                <Popover.Button>
                    <div
                        className='text-sm pl-4 pr-2 h-10 bg-nao-bg3 rounded-md flex items-center justify-between text-nao-white min-w-[72px]'>
                        <span className='mr-1'>{getOptionString(active)}</span>
                        <img alt='' src={getS3Url('/images/nao/ic_arrow_bottom.png')} height='16' width='16' />
                    </div>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                >
                    <Popover.Panel
                        className='absolute min-w-[8rem] shadow-onlyLight top-8 right-0 z-50 bg-nao-bg3 rounded-xl mt-3'>
                        <div className='font-medium text-xs flex flex-col'>
                            {[2022, ...range(12, 5, -1)]
                                .map(option => {
                                    const isActive = active === option || (option === 2022 && !active);
                                    return (
                                        <div
                                            key={option}
                                            onClick={() => {
                                                onChange(option);
                                                close();
                                            }}
                                            className={classNames(
                                                'flex justify-between items-center py-2 px-4 cursor-pointer leading-6',
                                                'first:rounded-t-xl last:rounded-b-xl hover:bg-onus-2'
                                            )}>
                                            <span>{getOptionString(option)}</span>
                                            {isActive && <Check size={16} color={colors.onus.base} />}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        )}
    </Popover>;
};

export default NaoFuturesPerformance;
