import AssetLogo from 'src/components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthSelector from 'redux/selectors/authSelectors';
import { formatNumber, walletLinkBuilder, setTransferModal } from 'src/redux/actions/utils';
import TableV2 from 'components/common/V2/TableV2';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';
import router from 'next/router';
import { PATHS } from 'constants/paths';

const TradeHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [currentPage, setCurrentPage] = useState(1);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const spotWallet = useSelector((state) => state?.wallet?.SPOT) || null;
    const [wallet, setWallet] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { currentPair, filterByCurrentPair, isPro } = props;

    useEffect(() => {
        if (assetConfig && assetConfig.length && Object.keys(spotWallet).length) {
            let _newWallet = [];

            assetConfig.map((config) => {
                if (config?.id && spotWallet && spotWallet?.[config?.id]?.value > 0.000001) {
                    _newWallet.push({
                        ...config,
                        ...spotWallet?.[config?.id]
                    });
                }
            });

            setWallet(_newWallet);
        }
    }, [spotWallet, assetConfig]);

    const handleKycRequest = (key, assetCode) => {
        let href = '';
        switch (key) {
            case 'buy':
                href = PATHS.EXCHANGE?.SWAP?.getSwapPair({
                    fromAsset: 'USDT',
                    toAsset: assetCode
                });
                break;
            case 'deposit':
                href = walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, {
                    type: 'crypto',
                    asset: assetCode
                });
                break;
            case 'withdraw':
                href = walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, {
                    type: 'crypto',
                    asset: assetCode
                });
                break;
            case 'convert':
                dispatch(
                    setTransferModal({
                        isVisible: true,
                        fromWallet: WalletType.SPOT,
                        toWallet: WalletType.FUTURES,
                        asset: assetCode
                    })
                );
                return;
            default:
                break;
        }
        router.push(href);
    };

    const renderActions = (row) => {
        const assetCode = row?.assetCode;
        return (
            <div className={`flex items-center text-teal divide-x divide-divider dark:divide-divider-dark font-semibold whitespace-nowrap`}>
                <span onClick={() => handleKycRequest('buy', assetCode)} className="cursor-pointer pr-3">
                    {t('common:buy')}
                </span>
                <span onClick={() => handleKycRequest('deposit', assetCode)} className="cursor-pointer px-3">
                    {t('common:deposit')}
                </span>
                <span onClick={() => handleKycRequest('withdraw', assetCode)} className="cursor-pointer px-3">
                    {t('common:withdraw')}
                </span>
                <span onClick={() => handleKycRequest('convert', assetCode)} className="cursor-pointer pl-3">
                    {t('common:transfer')}
                </span>
            </div>
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filterByCurrentPair]);

    const dataFilter = useMemo(() => {
        return filterByCurrentPair ? wallet.filter((hist) => String(currentPair).toLowerCase().indexOf(String(hist?.assetCode).toLowerCase()) !== -1) : wallet;
    }, [wallet, currentPair, filterByCurrentPair]);

    const columns = useMemo(
        () => [
            {
                key: 'assetCode',
                title: t('common:asset'),
                dataIndex: 'assetCode',
                width: 150,
                fixed: 'left',
                render: (v, row) => (
                    <div className="flex items-center space-x-4 py-4">
                        <AssetLogo assetCode={row?.assetCode} size={32} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold text-sm">{row?.assetCode}</span>
                            <span className="text-xs text-txtSecondary-dark">{row?.assetName}</span>
                        </div>
                    </div>
                )
            },
            {
                key: 'value',
                title: t('common:total_balance'),
                dataIndex: 'value',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(v)
            },
            {
                key: 'available_balance',
                title: t('common:available_balance'),
                dataIndex: 'available_balance',
                align: 'right',
                width: 150,
                render: (v, row) => formatNumber(row.value - Math.max(row.locked_value, 0))
            },
            {
                key: 'locked_value',
                title: t('common:in_order'),
                dataIndex: 'locked_value',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(Math.max(v, 0))
            },
            {
                title: t('common:others'),
                width: isPro ? 300 : 200,
                align: 'left',
                fixed: 'right',
                preventSort: true,
                visible: dataFilter.length > 0,
                render: (v, row) => renderActions(row)
            }
        ],
        [exchangeConfig, isPro, dataFilter]
    );

    return (
        <TableV2
            sort
            useRowHover
            data={dataFilter}
            rowKey={(item) => `${item?.key}`}
            columns={columns}
            loading={loading}
            scroll={{ x: true }}
            limit={6}
            skip={0}
            onChangePage={setCurrentPage}
            page={currentPage}
            noBorder={!isPro || !dataFilter.length}
        />
    );
};

export default TradeHistory;
