import AssetLogo from 'src/components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthSelector from 'redux/selectors/authSelectors';
import { formatNumber } from 'src/redux/actions/utils';
import TableV2 from '../common/V2/TableV2';

const TradeHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);

    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const spotWallet = useSelector((state) => state?.wallet?.SPOT) || null;
    const [wallet, setWallet] = useState([]);
    const [loading, setLoading] = useState(false);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

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

    const renderActions = () => {
        return (
            <div className={`flex items-center text-teal divide-x divide-divider-dark`}>
                <span className="cursor-pointer pr-3">Mua</span>
                <span className="cursor-pointer px-3">Nạp</span>
                <span className="cursor-pointer px-3">Rút</span>
                <span className="cursor-pointer pl-3">Chuyển đổi</span>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                key: 'assetCode',
                title: t('common:asset'),
                dataIndex: 'assetCode',
                width: 150,
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
                title: t('common:total_balance'),
                dataIndex: 'value',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(v)
            },
            {
                title: t('common:available_balance'),
                dataIndex: 'available_balance',
                align: 'right',
                width: 150,
                render: (v, row) => formatNumber(row.value - Math.max(row.locked_value, 0))
            },
            {
                title: t('common:in_order'),
                dataIndex: 'locked_value',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(Math.max(v, 0))
            },
            {
                title: 'Tác vụ',
                width: isPro ? 300 : 150,
                align: 'left',
                fixed: 'right',
                render: (v) => renderActions()
            }
        ],
        [exchangeConfig, isPro]
    );

    const renderTable = useCallback(() => {
        // if (!isAuth || !wallet.length) return <TableNoData />;
        let data = wallet;

        return (
            <TableV2
                useRowHover
                data={data}
                rowKey={(item) => `${item?.assetCode}`}
                columns={columns}
                loading={loading}
                scroll={{ x: true }}
                limit={6}
                skip={0}
            />
        );
    }, [isAuth, columns, loading, filterByCurrentPair, currentPair, wallet]);

    return renderTable();
};

export default TradeHistory;
