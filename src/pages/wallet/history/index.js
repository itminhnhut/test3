import { differenceInCalendarDays, endOfDay, format, getUnixTime, parseISO, startOfDay, subDays } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import {
    IconArrowDown,
    IconCalendar,
    IconPaginationNext,
    IconPaginationPrev,
    IconSort,
} from 'src/components/common/Icons';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import TableNoData from 'src/components/common/table/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import DetailModal from 'src/components/wallet/trading-history/DetailModal';
import TokenSelect from 'src/components/wallet/trading-history/TokenSelect';
import { tableStyle } from 'src/config/tables';
import { getTradingHistory, getTradingHistoryCategory } from 'src/redux/actions/trading-history';
import { formatWallet, getLoginUrl } from 'src/redux/actions/utils';
import AuthSelector from 'src/redux/selectors/authSelectors';
import UtilsSelector from 'src/redux/selectors/utilsSelectors';
import { useComponentVisible, useWindowSize } from 'src/utils/customHooks';

const TradingHistory = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation(['trading-history', 'common']);
    const filterList = {
        ALL: '',
        DEPOSIT_WITHDRAW: 'WITHDRAW, WITHDRAW_ON_CHAIN, WITHDRAW_CHARGE_BACK, WITHDRAW_FEE, DEPOSIT, DEPOSIT_ON_CHAIN, DEPOSIT_CHARGE_BACK, DEPOSIT_FEE',
        TRADING: 'SPOT_FEE, SPOT_MATCH_ORDER',
        SWAP: 'SWAP_FEE, SWAP_PLACE_ORDER',
        TRANSFER_INTERNAL: 'TRANSFER_INTERNAL, TRANSFER_INTERNAL_FEE',
        STAKE_REWARD: 'STAKE_REWARD',
        SPOT_COMMISSION_BROKER: 'SPOT_COMMISSION_BROKER',
        ATTLAS_MEMBERSHIP: 'ATTLAS_MEMBERSHIP, ATTLAS_MEMBERSHIP_STAKING_DAILY, ATTLAS_MEMBERSHIP_STAKE, ATTLAS_MEMBERSHIP_UNSTAKE',
        ATTLAS_STARTER: 'ATTLAS_STARTER_BUY',
        ATTLAS_EARNING: 'EARNING_TRANSFER, EARNING_REWARD',
    };

    const [selectedFilter, setSelectedFilter] = useState(filterList[router?.query?.initFilter] ?? '');
    const [timeRange, setTimeRange] = useState([
        {
            startDate: startOfDay(subDays(new Date(), 29)),
            endDate: endOfDay(new Date()),
            key: 'selection',
        },
    ]);
    const [invalidDateRange, setInvalidDateRange] = useState(false);
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [history, setHistory] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState([]);
    const [fullCategory, setFullCategory] = useState([]);
    const [toggleDetailModal, setToggleDetailModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});
    const [queryTransation, setQueryTransaction] = useState('');
    const [filterTitle, setFilterTitle] = useState(router?.query?.initFilter ?? 'all');

    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

    const assetConfigList = useSelector(UtilsSelector.assetConfigSelector);
    const user = useSelector(AuthSelector.userSelector);

    const fetchData = async (page) => {
        if (user) {
            const data = await getTradingHistory({
                category: selectedFilter,
                assetId: selectedTokenId || '',
                page: page ?? currentPage,
                from: getUnixTime(timeRange[0].startDate) * 1000,
                to: getUnixTime(timeRange[0].endDate) * 1000,
                transactionId: queryTransation,
            });
            await setPageCount(Math.ceil(data?.total / 10)); // pageSize = 10
            await setHistory(data?.histories);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        if (category.length === 0) {
            const categoryList = await getTradingHistoryCategory();
            setFullCategory(categoryList);
            if (categoryList && categoryList.length > 0) {
                const sortedCategoryList = await categoryList.sort((a, b) => (a.id - b.id));
                const filteredCategoryList = sortedCategoryList.filter(cat => cat?.name === 'DEPOSIT' ||
                    cat?.name === 'SPOT_MATCH_ORDER' ||
                    cat?.name === 'SPOT_PLACE_ORDER' ||
                    cat?.name === 'TRANSFER_INTERNAL' ||
                    cat?.name === 'STAKE_REWARD' ||
                    cat?.name === 'WITHDRAW' ||
                    cat?.name.startsWith('ATTLAS_MEMBERSHIP') ||
                    cat?.name === 'ATTLAS_STARTER_BUY' ||
                    cat?.name.startsWith('EARNING_'),
                );
                setCategory(filteredCategoryList);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    useEffect(() => {
        fetchCategories();
    }, [category]);

    useEffect(() => {
        if (router?.query?.initFilter) {
            setSelectedFilter(filterList[router?.query?.initFilter]);
            setFilterTitle(router?.query?.initFilter);
        }
    }, [router?.query?.initFilter]);

    const handleSubmitFilter = async () => {
        setLoading(true);
        const data = await getTradingHistory({
            category: selectedFilter,
            assetId: selectedTokenId || '',
            pageNumber: currentPage,
            from: getUnixTime(timeRange[0].startDate) * 1000,
            to: getUnixTime(timeRange[0].endDate) * 1000,
            transactionId: queryTransation,
        });
        setPageCount(Math.ceil(data?.total / 10)); // pageSize = 10
        await setHistory(data?.histories);
        setLoading(false);
    };

    const handleTimeRange = (value) => {
        const dateRange = differenceInCalendarDays(endOfDay(value[0].endDate), startOfDay(value[0].startDate));
        setTimeRange([{
            startDate: startOfDay(value[0].startDate),
            endDate: endOfDay(value[0].endDate),
            key: 'selection',
        }]);
        if (dateRange > 30) {
            return setInvalidDateRange(true);
        }
        return setInvalidDateRange(false);
    };

    const handleChangeAsset = (asset) => {
        if (asset) {
            return setSelectedTokenId(asset?.id);
        }
        return setSelectedTokenId(null);
    };

    const handleToggleDetailModal = async (data) => {
        await setSelectedDetail(data);
        setToggleDetailModal(!toggleDetailModal);
    };

    const handleCloseDetailModal = () => {
        setToggleDetailModal(false);
    };

    const renderTitle = () => {
        return t(`filter_${filterTitle.toLowerCase()}`) || t('filter_all');
    };

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                '&:nth-child(odd)': {
                    background: '#F6F9FC',
                },
                height: '60px',
                cursor: 'pointer',
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem',
                lineHeight: '1.3125rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
    };

    const { width } = useWindowSize();

    const columns = useMemo(() => {
        if (width > 1400) {
            return [
                {
                    name: t('time'),
                    width: '180px',
                    selector: 'createdAt',
                    cell: (row) => {
                        const date = parseISO(row?.createdAt);
                        return <span onClick={() => handleToggleDetailModal(row)}>{format(date, 'dd/MM/yyyy H:mm')}</span>;
                    },
                    sortable: true,
                },
                {
                    name: t('transaction_code'),
                    selector: 'transactionId',
                    width: '180px',
                    cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{row?.transactionId}</span>,
                    sortable: true,
                    sortFunction: (a, b) => a.transactionId.localeCompare(b.transactionId),
                },
                {
                    name: t('wallet_type'),
                    selector: 'walletType',
                    width: '150px',
                    cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{row?.walletType}</span>,
                    sortable: true,
                },
                {
                    name: t('transaction'),
                    width: '150px',
                    selector: 'category',
                    cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{fullCategory.filter(cat => cat.name === row.category)?.[0]?.description?.[i18n.language] || '-'}</span>,
                    sortable: true,
                },
                {
                    name: t('from'),
                    width: '200px',
                    selector: 'fromUser?.name',
                    cell: (row) => (row?.fromUser?.name ? <span onClick={() => handleToggleDetailModal(row)} className="truncate">{row?.fromUser?.name}</span> : '-'),
                    sortable: true,
                    sortFunction: (a, b) => a?.fromUser?.name.localeCompare(b?.fromUser?.name),
                },
                {
                    name: t('to'),
                    width: '200px',
                    selector: 'toUser?.name',
                    cell: (row) => (row?.toUser?.name ? <span onClick={() => handleToggleDetailModal(row)} className="truncate">{row?.toUser?.name}</span> : '-'),
                    sortable: true,
                    sortFunction: (a, b) => a?.toUser?.name.localeCompare(b?.toUser?.name),
                },
                {
                    name: t('token_type'),
                    width: '120px',
                    selector: 'assetId',
                    cell: (row) => {
                        if (assetConfigList && assetConfigList.length > 0) {
                            const token = assetConfigList.filter(asset => asset.id === row.assetId)?.[0];
                            if (token) {
                                return <span onClick={() => handleToggleDetailModal(row)}>{token?.assetCode}</span>;
                            }
                            return <span onClick={() => handleToggleDetailModal(row)}>-</span>;
                        }
                        return <span onClick={() => handleToggleDetailModal(row)}>-</span>;
                    },
                    sortable: true,
                },
                {
                    name: t('quantity'),
                    width: '200px',
                    right: true,
                    selector: 'moneyUse',
                    cell: (row) => {
                        if (assetConfigList && assetConfigList.length > 0) {
                            const token = assetConfigList.filter(asset => asset.id === row.assetId)?.[0];
                            if (token) {
                                if (row?.moneyUse > 0) {
                                    return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>{`+${formatWallet(row?.moneyUse, 6, true)} ${token?.assetCode}`}</span>;
                                }
                                return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>{`${formatWallet(row?.moneyUse, 6, true)} ${token?.assetCode}`}</span>;
                            }
                            return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>-</span>;
                        }
                        return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>-</span>;
                    },
                    sortable: true,
                },
                {
                    name: t('status'),
                    width: '150px',
                    selector: 'status',
                    cell: (row) => (
                        <span onClick={() => handleToggleDetailModal(row)} className={row?.status === 1 ? 'text-[#05B169]' : 'text-[#E95F67]'}>
                            {row?.status === 1 ? t('status_success') : t('status_expired')}
                        </span>
                    ),
                    sortable: true,
                },
            ];
        }
        return [
            {
                name: t('time'),
                width: '180px',
                selector: 'createdAt',
                cell: (row) => {
                    const date = parseISO(row?.createdAt);
                    return <span onClick={() => handleToggleDetailModal(row)}>{format(date, 'dd/MM/yyyy H:mm')}</span>;
                },
                sortable: true,
            },
            {
                name: t('transaction_code'),
                selector: 'transactionId',
                width: '180px',
                cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{row?.transactionId}</span>,
                sortable: true,
                sortFunction: (a, b) => a.transactionId.localeCompare(b.transactionId),
            },
            {
                name: t('wallet_type'),
                selector: 'walletType',
                width: '150px',
                cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{row?.walletType}</span>,
                sortable: true,
            },
            {
                name: t('transaction'),
                selector: 'category',
                width: '150px',
                cell: (row) => <span onClick={() => handleToggleDetailModal(row)}>{fullCategory.filter(cat => cat.name === row.category)?.[0]?.description?.[i18n.language] || '-'}</span>,
                sortable: true,
            },
            {
                name: t('quantity'),
                width: '220px',
                selector: 'moneyUse',
                right: true,
                cell: (row) => {
                    if (assetConfigList && assetConfigList.length > 0) {
                        const token = assetConfigList.filter(asset => asset.id === row.assetId)?.[0];
                        if (token) {
                            if (row?.moneyUse > 0) {
                                return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>{`+${formatWallet(row?.moneyUse, 6, true)} ${token?.assetCode}`}</span>;
                            }
                            return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>{`${formatWallet(row?.moneyUse, 6, true)} ${token?.assetCode}`}</span>;
                        }
                        return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>-</span>;
                    }
                    return <span className="text-right" onClick={() => handleToggleDetailModal(row)}>-</span>;
                },
                sortable: true,
            },
            {
                name: t('from'),
                width: '200px',
                cell: (row) => (row?.fromUser?.name ? <span onClick={() => handleToggleDetailModal(row)} className="truncate">{row?.fromUser?.name}</span> : '-'),
                sortable: true,
                sortFunction: (a, b) => a?.fromUser?.name.localeCompare(b?.fromUser?.name),
            },
            {
                name: t('to'),
                width: '200px',
                cell: (row) => (row?.toUser?.name ? <span onClick={() => handleToggleDetailModal(row)} className="truncate">{row?.toUser?.name}</span> : '-'),
                sortable: true,
                sortFunction: (a, b) => a?.toUser?.name.localeCompare(b?.toUser?.name),
            },
            {
                name: t('token_type'),
                width: '130px',
                selector: 'assetId',
                cell: (row) => {
                    if (assetConfigList && assetConfigList.length > 0) {
                        const token = assetConfigList.filter(asset => asset.id === row.assetId)?.[0];
                        if (token) {
                            return <span onClick={() => handleToggleDetailModal(row)}>{token?.assetCode}</span>;
                        }
                        return <span onClick={() => handleToggleDetailModal(row)}>-</span>;
                    }
                    return <span onClick={() => handleToggleDetailModal(row)}>-</span>;
                },
                sortable: true,
            },
            {
                name: t('status'),
                width: '150px',
                selector: 'status',
                cell: (row) => (
                    <span onClick={() => handleToggleDetailModal(row)} className={row?.status === 1 ? 'text-[#05B169]' : 'text-[#E95F67]'}>
                        {row?.status === 1 ? t('status_success') : t('status_expired')}
                    </span>
                ),
                sortable: true,
            },
        ];
    }, [history, assetConfigList, fullCategory, width]);

    const handlePageClick = async (page) => {
        await setLoading(true);
        await setCurrentPage(page.selected + 1);
        fetchData(page.selected + 1);
    };

    const resetStates = () => {
        setCurrentPage(1);
        setTimeRange([
            {
                startDate: startOfDay(subDays(new Date(), 29)),
                endDate: endOfDay(new Date()),
                key: 'selection',
            },
        ]);
        setSelectedTokenId(null);
        setQueryTransaction('');
    };

    const handleFilterByCategory = (cat, index, filter) => async () => {
        await resetStates();
        await setLoading(true);
        setSelectedFilter(cat);
        setFilterTitle(filter);
    };

    useAsync(async () => {
        await fetchData();
    }, [selectedFilter]);

    if (user && assetConfigList && assetConfigList.length > 0) {
        return (
            <LayoutWithHeader>
                <div className="relative container px-4 sm:px-6 md:px-8 lg:px-10 xxl:px-0">
                    <p className="text-4xl text-[#02083D] font-bold mt-20 mb-8">{t('title')}</p>
                    <div>
                        {
                            Object.keys(filterList).map((filter, index) => (

                                <button
                                    key={index}
                                    type="button"
                                    className={`mr-[10px] mb-5 rounded-md px-3 py-2 box-border border text-sm  ${selectedFilter === Object.values(filterList)[index] ? 'bg-[#02083D] font-bold text-white border-[#02083D]' : 'bg-transparent border-[#E1E2ED] text-[#52535C]'}`}
                                    onClick={handleFilterByCategory(filterList[filter], index, filter)}
                                >
                                    {t(`filter_${filter.toLowerCase()}`)}
                                </button>
                            ))
                        }
                    </div>
                    <div
                        className="mb-8 relative"
                    >
                        <div className="grid grid-cols-2 place-items-start gap-y-2 lg:flex lg:flex-row lg:items-center">
                            <div className="relative flex flex-col" ref={ref}>
                                <span className="text-[#02083D] text-[12px] mb-1" style={{ lineHeight: '18px' }}>{t('time')}</span>
                                <div className="relative w-[290px]">
                                    <button
                                        type="button"
                                        onClick={() => setIsComponentVisible(!isComponentVisible)}
                                        className="bg-white w-full px-4 py-[10px] border border-[#E1E2ED] box-border rounded-md focus:outline-none text-left text-sm"
                                        style={{ fontWeight: '500' }}
                                    >
                                        {format(timeRange[0].startDate, 'dd/MM/yyyy')} - {format(timeRange[0].endDate, 'dd/MM/yyyy')}
                                    </button>
                                    <div className="absolute top-3 right-4 cursor-pointer" onClick={() => setIsComponentVisible(!isComponentVisible)}><IconCalendar /></div>
                                </div>
                                <div
                                    className={isComponentVisible ? 'block absolute top-[76px] left-0 z-10 rounded-[12px] bg-white' : 'hidden'}
                                    style={isComponentVisible ? { boxShadow: '0px 24px 40px rgba(2, 8, 61, 0.12)' } : null}
                                >
                                    <DateRange
                                        moveRangeOnFirstSelection={false}
                                        onChange={(item) => handleTimeRange([item.selection])}
                                        months={2}
                                        ranges={timeRange}
                                        direction="horizontal"
                                        locale={i18n.language === 'vi' ? vi : enUS}
                                        className="rounded-[12px]"
                                        showDateDisplay={false}
                                        rangeColors={['#02083D']}
                                        monthDisplayFormat="LLLL, yyyy"
                                        weekdayDisplayFormat="EEEEE"
                                    />
                                    {invalidDateRange && <p className="px-[40px] pb-6 text-sm text-[#E95F67]">{t('date_out_of_range')}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col lg:ml-6">
                                <span className="text-[#02083D] text-[12px] mb-1" style={{ lineHeight: '18px' }}>{t('token_type')}</span>
                                <div className="relative w-[290px]">
                                    <TokenSelect onChange={handleChangeAsset} baseAssetList={assetConfigList} />
                                    <div className="absolute top-4 right-4 mt-[2px] cursor-pointer"><IconArrowDown /></div>
                                </div>
                            </div>
                            <div className="flex flex-col lg:ml-6">
                                <span className="text-[#02083D] text-[12px] mb-1" style={{ lineHeight: '18px' }}>{t('transaction_code')}</span>
                                <input
                                    type="text"
                                    className="bg-white px-4 py-[10px] border border-[#E1E2ED] box-border rounded-md focus:outline-none text-left text-sm w-[290px]"
                                    onChange={e => setQueryTransaction(e.target.value)}
                                    value={queryTransation}
                                />
                            </div>
                            <div className="flex flex-col lg:ml-6 place-self-stretch justify-end">
                                <button
                                    type="button"
                                    className={`place-self-stretch lg:ml-6 lg:mt-6 rounded-md px-[36px] py-[11px] min-w-[110px] w-[110px] max-h-[44px] box-border border text-sm ${(invalidDateRange || !user) ? 'opacity-50 cursor-not-allowed' : ''} bg-[#4021D0] font-bold text-white border-[#4021D0]`}
                                    onClick={(invalidDateRange || !user) ? null : handleSubmitFilter}
                                >
                                    {t('filter')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl px-10 box-border pt-[51px] pb-4 mb-20">
                        <>
                            <p className="text-[#02083D] text-xl font-bold ml-[13px]">{renderTitle()}</p>
                            {
                                loading
                                    ?
                                    (
                                        <div className="mt-5">
                                            <TableLoader records={10} />
                                        </div>
                                    )
                                    :
                                    (
                                        <DataTable
                                            data={history}
                                            columns={columns}
                                            noHeader
                                            customStyles={customStyles}
                                            overflowY // prevent clipping menu
                                            noDataComponent={<TableNoData />}
                                            sortIcon={<div className="mx-1"><IconSort /></div>}
                                            className="ats-table"
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                            }}
                                            progressComponent={<TableLoader records={10} />}
                                            onRowClicked={handleToggleDetailModal}
                                        />
                                    )
                            }

                            <div className="flex items-center justify-center mt-5">
                                {
                                    history && history.length > 0 && (
                                        <ReactPaginate
                                            previousLabel={<IconPaginationPrev isActive={currentPage !== 1} />}
                                            nextLabel={<IconPaginationNext isActive={currentPage !== pageCount} />}
                                            breakLabel="..."
                                            pageCount={pageCount}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            forcePage={currentPage - 1}
                                            containerClassName="flex flex-row items-center text-sm"
                                            activeClassName="bg-[#02083D] box-border px-[10px] py-[10px] w-[40px] h-[40px] text-center rounded"
                                            activeLinkClassName="text-white"
                                            pageClassName="text-[#8B8C9B] box-border px-[10px] py-[10px] w-[40px] h-[40px] text-center rounded"
                                            nextClassName="ml-[24px]"
                                            previousClassName="mr-[24px]"
                                            breakLinkClassName="text-[#8B8C9B]"
                                        />
                                    )
                                }
                            </div>
                        </>
                    </div>
                    {toggleDetailModal && <DetailModal
                        detail={selectedDetail}
                        assetConfig={assetConfigList}
                        closeModal={handleCloseDetailModal}
                        fullCategory={fullCategory}
                    />}
                </div>
            </LayoutWithHeader>
        );
    }
    return (
        <LayoutWithHeader>
            <div className="relative container">
                <p className="text-4xl text-[#02083D] font-bold mt-20 mb-8">{t('title')}</p>
                <div>
                    {
                        category && category.length > 0 && category.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`mr-[10px] mb-5 rounded-md px-3 py-2 box-border border text-sm ${selectedFilter === filterList[cat.name] ? 'bg-[#02083D] font-bold text-white border-[#02083D]' : 'bg-transparent border-[#E1E2ED] text-[#52535C]'}`}
                                onClick={() => setSelectedFilter(cat.name)}
                            >
                                {cat?.description?.[i18n.language]}
                            </button>
                        ))
                    }
                </div>
                <div
                    className="mb-8 relative"
                >
                    <div className="flex flex-row items-center">
                        <div className="relative" ref={ref}>
                            <p className="text-[#02083D] text-[12px] mb-2" style={{ lineHeight: '18px' }}>{t('time')}</p>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsComponentVisible(!isComponentVisible)}
                                    className="bg-white px-4 py-[10px] border border-[#E1E2ED] box-border rounded-md md:w-[290px] focus:outline-none text-left text-sm"
                                    style={{ fontWeight: '500' }}
                                >
                                    {format(timeRange[0].startDate, 'dd/MM/yyyy')} - {format(timeRange[0].endDate, 'dd/MM/yyyy')}
                                </button>
                                <div className="absolute top-3 right-4 cursor-pointer" onClick={() => setIsComponentVisible(!isComponentVisible)}><IconCalendar /></div>
                            </div>
                            <div
                                className={isComponentVisible ? 'block absolute top-[76px] left-0 z-10 rounded-[12px] bg-white' : 'hidden'}
                                style={isComponentVisible ? { boxShadow: '0px 24px 40px rgba(2, 8, 61, 0.12)' } : null}
                            >
                                <DateRange
                                    moveRangeOnFirstSelection={false}
                                    onChange={(item) => handleTimeRange([item.selection])}
                                    months={2}
                                    ranges={timeRange}
                                    direction="horizontal"
                                    locale={i18n.language === 'vi' ? vi : enUS}
                                    className="rounded-[12px]"
                                    showDateDisplay={false}
                                    rangeColors={['#02083D']}
                                    monthDisplayFormat="LLLL, yyyy"
                                    weekdayDisplayFormat="EEEEE"
                                />
                                {invalidDateRange && <p className="px-[40px] pb-6 text-sm text-[#E95F67]">{t('date_out_of_range')}</p>}
                            </div>
                        </div>
                        <div className="ml-6">
                            <p className="text-[#02083D] text-[12px] mb-2" style={{ lineHeight: '18px' }}>{t('token_type')}</p>
                            <div className="relative">
                                <TokenSelect onChange={handleChangeAsset} baseAssetList={assetConfigList} />
                                <div className="absolute top-4 right-4 mt-[2px] cursor-pointer"><IconArrowDown /></div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`ml-6 mt-6 rounded-md px-[36px] py-[11px] min-w-[110px] max-h-[44px] box-border border text-sm ${(invalidDateRange || !user) ? 'opacity-50 cursor-not-allowed' : ''} bg-[#4021D0] font-bold text-white border-[#4021D0]`}
                            onClick={(invalidDateRange || !user) ? null : handleSubmitFilter}
                        >
                            {t('filter')}
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-3xl px-10 box-border pt-[51px] pb-4 mb-20">
                    <div className="flex flex-col items-center justify-center mb-20">
                        <TableNoData />
                        <a href={getLoginUrl('sso')} className="btn button-common block text-center">
                            {t('common:sign_in_to_continue')}
                        </a>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'trading-history']),
        },
    };
}

export default TradingHistory;
