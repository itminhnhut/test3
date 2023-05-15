import { useTranslation } from 'next-i18next';
import { ButtonNao, CardNao, TextLiner } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { Popover, Transition } from '@headlessui/react';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { range } from 'lodash';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import format from 'date-fns/format';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_NAO_YEAR_SUMMARY_STATISTIC } from 'redux/actions/apis';
import useWindowSize from 'hooks/useWindowSize';
import SvgFilter from 'components/svg/SvgFilter';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import CheckCircle from 'components/svg/CheckCircle';

const rate_USDT_VNDC = 23400;
function NaoFuturesPerformance({ version }) {
    const [data, setData] = useState({
        last_time_update: 0,
        statistic: {}
    });
    const [filters, setFilters] = useState({
        year: 2022,
        month: null,
        currency: 72
    });

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width < 620;

    const getData = async () => {
        const { status, data } = await fetchApi({
            url: API_CONTEST_NAO_YEAR_SUMMARY_STATISTIC,
            params: filters
        });

        if (status === 'ok' && !!data) {
            setData(data);
        }
    };

    // useEffect(() => {
    //     getData();
    // }, [filters]);

    const changeFilters = (filter) => {
        setFilters({ ...filters, ...filter });
    };

    const config = {
        72: {
            total_volume: '227204089300551',
            order_number: '9543083',
            user_count: '679095'
        },
        22: {
            total_volume: '1282784200',
            order_number: '1122754',
            user_count: '43197'
        }
    };

    const general = useMemo(() => {
        return config[filters.currency];
    }, [filters]);

    return (
        <>
            <div className="mb-12 mt-20">
                <div className="flex items-center flex-wrap justify-between gap-5">
                    <TextLiner className="">{t('nao:onus_performance:title', { version })}</TextLiner>
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
                        {/* <RangePopover
                            language={language}
                            active={filters.month}
                            onChange={(value) => changeFilters({ month: value === 2022 ? null : value })}
                            className="flex order-last"
                            popoverClassName={'lg:mr-2'}
                        /> */}
                        <div className="order-first gap-2 flex gap-last h-10">
                            <button
                                type="BUTTON"
                                className={classNames(
                                    'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                    { '!border-teal bg-teal/10 !text-teal font-semibold': filters.currency === WalletCurrency.VNDC }
                                )}
                                onClick={() => changeFilters({ currency: WalletCurrency.VNDC })}
                            >
                                Futures VNDC
                            </button>
                            <button
                                type="BUTTON"
                                className={classNames(
                                    'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                    { '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': filters.currency !== WalletCurrency.VNDC }
                                )}
                                onClick={() => changeFilters({ currency: WalletCurrency.USDT })}
                            >
                                Futures USDT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:onus_performance:total_volume')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">{formatNumber(general.total_volume)} {assetCodeFromId(filters.currency)}</span>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base mt-2">
                        ${formatNumber(general.total_volume / (filters.currency === 72 ? rate_USDT_VNDC : 1))}
                    </span>
                </CardNao>

                <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:year_summary:order_number')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">{formatNumber(general.order_number)}</span>
                </CardNao>

                <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:year_summary:user_count')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">{formatNumber(general.user_count)}</span>
                </CardNao>
                {/* <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:year_summary:total_profit_share')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">18,666,106,056 VNDC</span>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base mt-2">$797,697</span>
                </CardNao>
                <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:year_summary:total_number_investors')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">1,992</span>
                </CardNao>
                <CardNao className="rounded-lg">
                    <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark font-medium leading-7">
                        {t('nao:year_summary:total_commission')}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold mt-4">31,344,773,689 VNDC</span>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base mt-2">$1,339,520</span>
                </CardNao> */}
            </div>
        </>
    );
}

const RangePopover = ({ active, onChange, popoverClassName = '', isMobile = false }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const getOptionString = (option) => {
        if (option === 2022 || !option) {
            return t('nao:year_summary:year', { year: 2022 });
        }
        if (language === LANGUAGE_TAG.EN) {
            option = format(new Date(2022, option - 1, 1), 'MMMM 2022');
        }
        return t('nao:year_summary:month', { month: option, year: 2022 });
    };

    return (
        <Popover className={classNames('relative flex', popoverClassName)}>
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <div className="h-10 flex justify-center items-center">
                            <div className="sm:hidden">
                                <SvgFilter size={24} color="currentColor" className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </div>
                            <div className="hidden sm:flex px-4 py-3 items-center gap-x-1 bg-gray-12 dark:bg-dark-2 font-semibold text-txtSecondary dark:text-txtSecondary-dark rounded-md !font-SF-Pro !text-base">
                                {getOptionString(active)}
                                <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute min-w-[11rem] sm:min-w-[14rem] shadow-onlyLight top-8 left-auto right-0 z-50 bg-bgPrimary dark:bg-dark-4 border border-divider dark:border-divider-dark rounded-md mt-3">
                            <div className="text-sm sm:text-base flex flex-col text-txtPrimary dark:text-txtPrimary-dark sm:py-3">
                                {[2022, ...range(12, 5, -1)].map((option) => {
                                    const isActive = active === option || (option === 2022 && !active);
                                    return (
                                        <div
                                            key={option}
                                            onClick={() => {
                                                onChange(option);
                                                close();
                                            }}
                                            className={classNames(
                                                'flex justify-between items-center py-3 my-1 px-4 cursor-pointer',
                                                'first:rounded-t-md last:rounded-b-md hover:bg-hover-1 dark:hover:bg-hover-dark'
                                            )}
                                        >
                                            <span>{getOptionString(option)}</span>
                                            {isActive && <CheckCircle color="currentColor" size={16} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default NaoFuturesPerformance;
