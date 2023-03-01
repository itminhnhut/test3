import Axios from 'axios';
import { API_GET_DEPWDL_HISTORY } from 'redux/actions/apis';
import { ApiStatus, DepWdlStatus } from 'redux/actions/const';
import { useEffect, useMemo, useState } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import Empty from 'components/common/Empty';
import useWindowSize from 'hooks/useWindowSize';
import { useSelector } from 'react-redux';
import { keyBy, range } from 'lodash';
import AssetLogo from 'components/wallet/AssetLogo';
import format from 'date-fns/format';
import { formatWallet, shortHashAddress } from 'redux/actions/utils';
import TagV2 from 'components/common/V2/TagV2';
import { useTranslation } from 'next-i18next';
import Skeletor from 'components/common/Skeletor';

const HISTORY_SIZE = 6;
export default function () {
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const mapAssetConfig = useMemo(() => keyBy(assetConfigs, 'id'), [assetConfigs]);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [histories, setHistories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const getWithdrawHistory = (page) => {
        setLoading(true);
        Axios.get(API_GET_DEPWDL_HISTORY, {
            params: {
                type: status,
                page,
                pageSize: HISTORY_SIZE
            }
        })
            .then(({ data: res }) => {
                if (res.status === ApiStatus.SUCCESS && res.data) {
                    setHistories(res.data);
                }
            })
            .catch((err) => {
                console.log(`Can't get withdraw history `, err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    let columns = [
        {
            key: 'txId',
            dataIndex: 'txId',
            title: 'TxHash',
            align: 'left',
            render: (txHash) => {
                return txHash ? shortHashAddress(txHash, 6, 6) : '--';
            }
        },
        {
            key: 'asset',
            dataIndex: 'assetId',
            title: t('common:asset'),
            align: 'left',
            render: (assetId) => {
                const assetConfig = mapAssetConfig[assetId];
                return (
                    <div className="flex items-center">
                        <AssetLogo size={30} assetId={assetId} />
                        <span className="ml-2">{assetConfig?.assetCode}</span>
                    </div>
                );
            }
        },
        {
            key: 'network',
            dataIndex: 'network',
            title: t('wallet:network'),
            align: 'left'
        },
        {
            key: 'time',
            dataIndex: 'executeAt',
            title: t('common:time'),
            align: 'left',
            render: (time) => time && format(new Date(time), 'dd/MM/yyyy')
        },
        {
            key: 'amount',
            dataIndex: 'amount',
            title: t('common:amount'),
            align: 'right',
            render: (amount) => formatWallet(amount)
        },
        {
            key: 'withdraw_to',
            dataIndex: ['to', 'address'],
            title: t('common:to'),
            align: 'right',
            render: (address) => {
                return address ? shortHashAddress(address, 6, 6) : '--';
            }
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: t('common:status'),
            align: 'right',
            render: (status) =>
                ({
                    [DepWdlStatus.Success]: (
                        <TagV2 className="ml-auto" type="success">
                            {t('common:success')}
                        </TagV2>
                    ),
                    [DepWdlStatus.Pending]: (
                        <TagV2 className="ml-auto" type="warning">
                            {t('common:pending')}
                        </TagV2>
                    ),
                    [DepWdlStatus.Declined]: (
                        <TagV2 className="ml-auto" type="failed">
                            {t('common:declined')}
                        </TagV2>
                    )
                }[status])
        }
    ];

    if (loading) {
        columns = columns.map((c) => ({
            ...c,
            render: () => <Skeletor width={65} />
        }));
    }

    let tableStatus = null;
    if (histories?.length) {
        tableStatus = <Empty />;
    }

    useEffect(() => {
        getWithdrawHistory(currentPage);
    }, [currentPage, status]);

    const listStatus = [
        {
            label: t('common:all'),
            value: null
        },
        {
            label: t('common:success'),
            value: DepWdlStatus.Success
        },
        {
            label: t('common:pending'),
            value: DepWdlStatus.Pending
        },
        {
            label: t('common:declined'),
            value: DepWdlStatus.Declined
        }
    ];

    return (
        <>
            {/* <div className="space-x-3 flex items-center my-6">
                {listStatus.map((rs, i) => (
                    <div
                        key={i}
                        onClick={() => setStatus(rs.value)}
                        className={`px-5 py-3 border text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark w-max rounded-full cursor-pointer ${
                            status === rs.value ? '!text-teal font-semibold !border-teal' : ''
                        }`}
                    >
                        {rs.label}
                    </div>
                ))}
            </div> */}
            <div className="bg-white dark:bg-dark dark:border dark:border-divider-dark pb-2 rounded-xl pt-4">
                <TableV2
                    useRowHover
                    data={loading ? range(0, 6) : histories}
                    columns={columns}
                    rowKey={(item) => item?.key}
                    scroll={{ x: true }}
                    tableStatus={tableStatus}
                    pagingClassName="border-none"
                    pagingPrevNext={{
                        page: currentPage,
                        hasNext: histories.length === HISTORY_SIZE,
                        onChangeNextPrev: (delta) => setCurrentPage(currentPage + delta),
                        language
                    }}
                />
            </div>
        </>
    );
}
