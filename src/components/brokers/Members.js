import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { IconCircleCheck, IconPaginationNext, IconPaginationPrev, IconSort } from 'src/components/common/Icons';
import { tableStyle } from 'src/config/tables';
import TableNoData from 'components/common/table/TableNoData';
import TableLoader from 'components/loader/TableLoader';
import DataTable from 'react-data-table-component';
import { KYC_STATUS } from 'src/redux/actions/const';
import { getBrokerUsers } from 'src/redux/actions/broker';
import ReactPaginate from 'react-paginate';
import { formatWallet, getTimeAgo } from 'src/redux/actions/utils';
import { parseISO } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

const BrokerMembers = () => {
    const { t, i18n } = useTranslation();
    // const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchBrokerUsers = async (page) => {
        const data = await getBrokerUsers({ page: page ?? currentPage });
        await setPageCount(Math.ceil(data?.total / 10)); // pageSize = 10
        await setUserList(data?.users);
        setLoading(false);
    };

    useEffect(() => {
        fetchBrokerUsers();
    }, []);

    const handlePageClick = async (page) => {
        await setLoading(true);
        await setCurrentPage(page.selected + 1);
        fetchBrokerUsers(page.selected + 1);
    };

    const renderUserKycStatus = (kycStatus) => {
        if (kycStatus === KYC_STATUS.APPROVED || kycStatus === KYC_STATUS.ADVANCE_KYC) {
            return (
                <div className="flex items-center text-green">
                    <IconCircleCheck />
                    <span className="ml-2">{t('broker:kyc_success')}</span>
                </div>
            );
        }
        if (kycStatus === KYC_STATUS.PENDING_APPROVAL || kycStatus === KYC_STATUS.APPROVED_PENDING_APPROVAL_ADVANCE || kycStatus === KYC_STATUS.PENDING_APPROVAL_ADVANCE) {
            return (
                <div className="text-gray-400">
                    {t('broker:kyc_pending')}
                </div>
            );
        }
        return (
            <div className="text-gray-400">
                {t('broker:kyc_draft')}
            </div>
        );
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

    const columns = useMemo(() => [
        {
            name: t('broker:index'),
            sortable: false,
            center: true,
            cell: (row, index) => (
                index + 1
            ),
            width: '100px',
        },
        {
            name: t('broker:name'),
            selector: 'name',
        },
        {
            name: t('broker:user_id'),
            selector: 'userId',
        },
        {
            name: t('broker:status'),
            selector: 'verification',
            cell: (row, index) => (
                renderUserKycStatus(row.kycStatus)
            ),
        },
        {
            name: t('broker:volumeSpot'),
            cell: (row) => (row?.estimateVolume?.value ?
                <p>
                    <span className="truncate">{formatWallet(row?.estimateVolume?.value, 2, true)}</span>
                    <span className="text-[#8B8C9B]">
                        {row?.estimateVolume?.asset}
                    </span>
                </p> : '-'),
            right: true,
        },
        {
            name: t('broker:lastLogin'),
            cell: (row) => {
                return getTimeAgo(parseISO(row?.lastLoggedIn), { locale: i18n.language === 'vi' ? vi : enUS });
            },
        },
    ], [userList]);

    return (
        <div className="card-body lg:!py-[60px] lg:!px-[70px]">
            <div className="flex items-center justify-between mb-8">
                <div
                    className="text-xl font-semibold"
                >{t('broker:countMember', { count: (userList && userList.length > 0) ? userList.length : 0 })}
                </div>
                {/* <div className="form-group">
                        <div className="input-group">
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="Tìm kiếm"
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
                            data={userList}
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
                    userList && userList.length > 0 && (
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
};

export default BrokerMembers;
