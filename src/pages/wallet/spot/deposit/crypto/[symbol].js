import { IconArrowLeft } from 'components/common/Icons';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import DataTable from 'react-data-table-component';
import { QRCode } from 'react-qrcode-logo';
import { useSelector } from 'react-redux';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import TableNoData from 'src/components/common/table/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import { tableStyle } from 'src/config/tables';
import { ApiStatus, DepositStatus } from 'src/redux/actions/const';
import { formatTime, formatWallet, getAssetCode, getS3Url } from 'src/redux/actions/utils';
import fetchAPI from 'src/utils/fetch-api';

const DepositCrypto = ({ symbol, depositConfig }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('ERC20');
    const [copied, setCopied] = useState(false);
    const [copiedTag, setCopiedTag] = useState(false);
    const [network, setNetwork] = useState('');
    const [networks, setNetworks] = useState([]);
    const [depositAddress, setDepositAddress] = useState({});
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const asset = assetConfig.find(e => e.assetCode === symbol.toUpperCase()) || {};
    const { networkList } = depositConfig[asset.id] || { networkList: [] };

    const getDepositAddress = async (_network, shouldCreate = false) => {
        if (!_network) return;
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/deposit_address',
            options: {
                method: 'GET',
            },
            params: {
                assetId: asset.id,
                network: _network,
                shouldCreate,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setDepositAddress(data);
        }
    };

    const getDepositHistory = async () => {
        setLoadingHistory(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/deposit_withdraw_history',
            options: {
                method: 'GET',
            },
            params: {
                type: 1,
                assetId: asset.id,
                transactionType: 'on-chain',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistory(data);
            setLoadingHistory(false);
        }
    };

    const handleChangeTab = (tab) => {
        setNetwork(tab.network);
        setActiveTab(tab.name);
        setCopied(false);
    };

    useEffect(() => {
        if (networkList.length) {
            const _networks = networkList.filter(e => e.depositEnable && e.network !== 'bank-transfer' && e.network !== 'off-chain');
            setNetworks(_networks);
            if (_networks.length) {
                const defaultNetwork = _networks.filter(net => net?.isDefault === true,
                )?.[0];
                setActiveTab(defaultNetwork?.name ?? _networks[0].name);
                setNetwork(defaultNetwork.network ?? _networks[0].network);
            }
        }
    }, [networkList]);

    useEffect(() => {
        getDepositAddress(network);
    }, [network]);

    useEffect(() => {
        if (asset?.id) getDepositHistory();
    }, [asset?.id]);

    const customStyles = {
        ...tableStyle,
    };

    const columns = useMemo(() => [
        {
            name: t('time'),
            selector: 'time',
            ignoreRowClick: true,
            omit: false,
            width: '150px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('asset'),
            selector: 'coin',
            ignoreRowClick: true,
            right: true,
            cell: (row) => getAssetCode(row.assetId),
        },
        {
            name: t('amount'),
            selector: 'amount',
            ignoreRowClick: true,
            right: true,
            cell: (row) => <span>+{formatWallet(row.amount)}</span>,
        },
        {
            name: t('status'),
            selector: 'status',
            ignoreRowClick: true,
            right: true,
            cell: (row) => <span className="text-green">{t('common:success')}</span>,
        },
    ], [assetConfig]);

    const Status = ({ status }) => {
        let text = '';
        let className = '';
        switch (status) {
            case DepositStatus.COMPLETED:
                text = t('completed');
                className = 'text-violet';
                break;
            case DepositStatus.PENDING:
                text = t('pending');
                className = 'text-yellow';
                break;
            case DepositStatus.REJECTED:
                text = t('pending');
                className = 'text-red';
                break;
            default:
                break;
        }
        return <span className={className}>{text}</span>;
    };

    const specialTip = networks?.filter(net => net?.network === network)?.[0]?.specialTips;

    return (
        <LayoutWithHeader>
            <div className="flex flex-1 items-center flex-col mt-10 px-5">
                <div className="wallet-container-withdraw w-full">
                    <div className="flex items-center mb-8 cursor-pointer" aria-hidden role="button" onClick={() => router?.back()}>
                        <button className="btn btn-icon -ml-1 mr-4 !p-0 !text-[#4021D0]" type="button">
                            <IconArrowLeft width={16} height={20} />
                        </button>
                        <div className="font-bold text-[#4021D0]">
                            {t('common:back')}
                        </div>
                    </div>
                    <div className="card card-shadow bg-white rounded-3xl mb-10">
                        <div className="card-header !pt-6 !pb-0 card-header-network- !px-10">
                            <ul className="tabs !border-b-0 w-full items-center justify-center">
                                {networks.map((tab, index) => (
                                    <li className="tab-item !mr-5" key={index}>
                                        <a
                                            className={'tab-link !text-lg font-semibold ' + (activeTab === tab.name ? 'active text-black-700' : 'text-black-400')}
                                            onClick={() => handleChangeTab(tab)}
                                        > {tab.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-body !py-10 !px-10 md:!px-32 lg:!px-[220px]">
                            <div className="tab-content">
                                {depositAddress ? (
                                    <>
                                        <div className="flex justify-center items-center mb-10">
                                            {depositAddress?.address ? (
                                                <QRCode
                                                    value={depositAddress.address}
                                                    size={260}
                                                    logoImage={getS3Url(asset.s3LogoUrl)}
                                                />
                                            ) : null}
                                        </div>
                                        <div className="mb-5">
                                            <div className="font-semibold mb-2">
                                                {t('wallet:deposit_address')}
                                            </div>
                                            <div className="flex justify-between">
                                                <div
                                                    className="deposit-address- text-sm text-black-600 break-all flex-1 sm:flex-2 sm:max-w-[240px]"
                                                >{depositAddress?.address}
                                                </div>
                                                <div className="flex-1 text-xs text-right">
                                                    <CopyToClipboard
                                                        text={depositAddress?.address}
                                                        className="cursor-pointer text-sm text-violet-700 font-semibold"
                                                        onCopy={() => setCopied(true)}
                                                    >
                                                        <button
                                                            className="btn btn-primary btn-clean text-xs !px-0"
                                                            type="button"
                                                        >
                                                            {copied ? t('referral:copied') : t('referral:copy')}
                                                        </button>
                                                    </CopyToClipboard>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            depositAddress?.addressTag && depositAddress?.addressTag !== ''
                                                ? (
                                                    <div className="mb-5">
                                                        <div className="font-semibold mb-2">
                                                            {t('wallet:deposit_memo')}
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <div
                                                                className="deposit-address- text-sm text-black-600 break-all flex-1 sm:flex-2 sm:max-w-[240px]"
                                                            >{depositAddress?.addressTag}
                                                            </div>
                                                            <div className="flex-1 text-xs text-right">
                                                                <CopyToClipboard
                                                                    text={depositAddress?.addressTag}
                                                                    className="cursor-pointer text-sm text-violet-700 font-semibold"
                                                                    onCopy={() => setCopiedTag(true)}
                                                                >
                                                                    <button
                                                                        className="btn btn-primary btn-clean text-xs !px-0"
                                                                        type="button"
                                                                    >
                                                                        {copiedTag ? t('referral:copied') : t('referral:copy')}
                                                                    </button>
                                                                </CopyToClipboard>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                : null
                                        }
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-center items-center mb-10 opacity-10">
                                            <Image src="/images/qr.svg" height={260} width={260} />
                                        </div>
                                        <div className="text-center mb-5">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => getDepositAddress(network, true)}
                                            >{t('wallet:get_address')}
                                            </button>
                                        </div>
                                    </>

                                )}
                                {
                                    specialTip
                                        && (
                                            <div className="mb-5">
                                                <div className="font-semibold mb-2">
                                                    {t('wallet:special_tip')}
                                                </div>
                                                <p className="text-sm text-black-600 break-words">
                                                    {specialTip}
                                                </p>
                                            </div>
                                        )
                                }
                                <div className="">
                                    <div className="font-semibold mb-2">
                                        {t('wallet:note')}
                                    </div>
                                    <div className="text-sm text-black-600">
                                        {t('wallet:deposit_note', { asset: asset.assetCode })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white rounded-3xl mb-8">
                        <div className="card-header">
                            <div className="card-header-text">
                                {t('wallet:deposit_history')}
                            </div>
                            <div className="card-header-actions">
                                <Link href="/wallet/history">
                                    <span className="text-sm text-violet-700 font-bold cursor-pointer">{t('wallet:all')}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <DataTable
                                data={history}
                                columns={columns}
                                customStyles={customStyles}
                                noHeader
                                fixedHeader
                                fixedHeaderScrollHeight="300px"
                                dense
                                noDataComponent={<TableNoData />}
                                progressPending={loadingHistory}
                                progressComponent={<TableLoader />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getServerSideProps({ params, locale }) {
    const { data } = await fetchAPI({
        url: '/api/v1/deposit/config',
        options: {
            method: 'GET',
        },
    });
    return {
        props: {
            depositConfig: data || {},
            symbol: params.symbol,
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'referral', 'error', 'convert']),
        },
    };
}

export default DepositCrypto;
