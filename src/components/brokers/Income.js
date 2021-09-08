import TableNoData from 'components/common/table/TableNoData';
import TableLoader from 'components/loader/TableLoader';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { IconPaginationNext, IconPaginationPrev, IconSearch, IconSort } from 'src/components/common/Icons';
import { tableStyle } from 'src/config/tables';
import { getBrokerIncome } from 'src/redux/actions/broker';
import { formatWallet } from 'src/redux/actions/utils';
import AuthSelector from 'src/redux/selectors/authSelectors';

const BrokerIncome = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [incomeList, setIncomeList] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalIncome, setTotalIncome] = useState({});

    const user = useSelector(AuthSelector.userSelector);

    const fetchBrokerIncome = async (page) => {
        const data = await getBrokerIncome({ page: page ?? currentPage });
        await setPageCount(Math.ceil(data?.total / 10)); // pageSize = 10
        await setIncomeList(data?.histories);
        await setTotalIncome(data?.totalIncome);
        setLoading(false);
    };

    useEffect(() => {
        fetchBrokerIncome();
    }, []);

    const handlePageClick = async (page) => {
        await setLoading(true);
        await setCurrentPage(page.selected + 1);
        fetchBrokerIncome(page.selected + 1);
    };

    const customStyles = {
        ...tableStyle,
        table: {
            style: {
                margin: 0,
                padding: 0,
            },
        },
        rows: {
            style: {
                borderBottom: 'none !important',
                '&:nth-child(odd)': {
                    background: '#F6F9FC',
                },
                height: '60px',
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem !important',
                lineHeight: '1.3125rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
    };

    const renderReward = (row) => {
        if (row.category === 'SPOT_COMMISSION_BROKER') {
            return (row?.estimateValue?.value ?
                <p><span className="truncate">{formatWallet(row?.estimateValue?.value)}</span> <span
                    className="text-[#8B8C9B]"
                >{row?.estimateValue?.asset}
                </span>
                </p> : '-');
        }
        if (row.category === 'SPOT_COMMISSION_BROKER_KYC') {
            return (row?.metadata?.value ?
                <p><span className="truncate">{formatWallet(row?.metadata?.value)}</span> <span
                    className="text-[#8B8C9B]"
                >{row?.metadata?.asset}
                </span>
                </p> : '-');
        }
    };
    const columns = useMemo(() => [
        {
            name: t('broker:index'),
            sortable: false,
            center: true,
            cell: (row, index) => (currentPage === 1 ? index + 1 : currentPage * 10 - 10 + index + 1),
            width: '100px',
        },
        {
            name: t('broker:transactionCode'),
            selector: 'displayingId',
        },
        {
            name: t('broker:type'),
            cell: (row, index) => t(`broker:${row?.category}`),
        },
        {
            name: t('broker:from'),
            selector: 'from',
            cell: (row) => (row?.userInfo?.name ? <span className="truncate">{row?.userInfo?.name}</span> : '-'),
        },
        {
            name: t('broker:amount'),
            width: '150px',
            right: true,
            cell: (row) => renderReward(row),
        },
        {
            name: t('broker:volume'),
            right: true,
            cell: (row) => (row?.estimateVolume?.value ?
                <p><span className="truncate">{formatWallet(row?.estimateVolume?.value)}</span> <span
                    className="text-[#8B8C9B]"
                >{row?.estimateVolume?.asset}
                </span>
                </p> : '-'),
        },
        {
            name: t('broker:time'),
            cell: (row) => {
                const date = parseISO(row?.createdAt);
                return format(date, 'dd/MM/yyyy H:mm');
            },
        },
        {
            name: t('broker:status'),
            selector: 'status',
            center: true,
            cell: (row, index) => (
                <span className="text-green">
                    Đã nhận
                </span>
            ),
        },
    ], [incomeList]);

    if (user) {
        return (
            <div className="card-body lg:!py-[60px] lg:!px-[70px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-sm mb-2">{t('broker:totalIncome')}</div>
                        <div className="font-semibold flex items-center">
                            <div className="text-3xl mr-1.5">{formatWallet(totalIncome?.value, 6, true)}</div>
                            <div>{totalIncome?.asset}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                placeholder={t('broker:search')}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div
                                className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                            >
                                <span className="input-group-text text-black-500">
                                    <IconSearch />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
                                data={incomeList}
                                columns={columns}
                                sortIcon={<div className="mx-1"><IconSort /></div>}
                                defaultSortAsc={false}
                                noHeader
                                customStyles={customStyles}
                                overflowY // prevent clipping menu
                                overflowYOffset="0px"
                                // pagination
                                noDataComponent={<TableNoData />}
                                progressPending={loading}
                                progressComponent={<TableLoader records={10} />}
                            />
                        )
                }
                <div className="flex items-center justify-center mt-5 z-10">
                    {
                        incomeList && incomeList.length > 0 && (
                            <ReactPaginate
                                previousLabel={<IconPaginationPrev isActive={currentPage !== 1} />}
                                nextLabel={<IconPaginationNext isActive={currentPage !== pageCount} />}
                                breakLabel="..."
                                pageCount={pageCount}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={2}
                                onPageChange={handlePageClick}
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
            </div>
        );
    }
    return (
        <div className="card-body lg:!py-[60px] lg:!px-[70px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-sm mb-2">{t('broker:totalIncome')}</div>
                    <div className="font-semibold flex items-center">
                        <div className="text-3xl mr-1.5">{formatWallet(totalIncome?.value, 6, true)}</div>
                        <div>{totalIncome?.asset}</div>
                    </div>
                </div>
                {/* <div className="form-group">
                        <div className="input-group">
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                placeholder={t('broker:search')}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div
                                className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                            >
                                <span className="input-group-text text-black-500">
                                    <IconSearch />
                                </span>
                            </div>
                        </div>
                    </div> */}
            </div>
            <TableNoData />
        </div>
    );
};

export default BrokerIncome;
