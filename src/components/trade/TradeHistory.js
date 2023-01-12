import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthSelector from 'redux/selectors/authSelectors';
import { API_GET_HISTORY_TRADE } from 'src/redux/actions/apis';
import { ApiStatus } from 'src/redux/actions/const';
import { formatTime, TypeTable, formatNumber } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import TableV2 from '../common/V2/TableV2';

const TradeHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [histories, setHistories] = useState([]);
    const [filteredHistories, setFilteredHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const { currentPair, filterByCurrentPair, darkMode } = props;

    const columns = useMemo(
        () => [
            {
                title: t('common:order_id'),
                dataIndex: 'displayingId',
                width: 120
            },
            {
                title: t('common:time'),
                dataIndex: 'createdAt',
                width: 180,
                render: (v) => formatTime(v)
            },
            {
                title: t('common:pair'),
                dataIndex: 'symbol',
                width: 150
            },
            {
                title: `${t('common:buy')}/${t('common:sell')}`,
                dataIndex: 'side',
                width: 100,
                render: (v, row) => <TypeTable type={'side'} data={row} />
            },
            {
                title: t('common:avg_price'),
                dataIndex: 'price',
                width: 200,
                align: 'right',
                render: (v) => formatNumber(v, 2)
            },
            {
                title: t('common:quantity'),
                dataIndex: 'baseQty',
                width: 200,
                align: 'right',
                render: (v) => formatNumber(v, 4)
            },
            {
                title: t('common:total'),
                dataIndex: 'quoteQty',
                width: 200,
                align: 'right',
                render: (v) => <span className="pl-2">{formatNumber(v, 2)}</span>
            },
        ],
        [exchangeConfig]
    );

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_HISTORY_TRADE,
            options: {
                method: 'GET'
            }
        });
        if (status === ApiStatus.SUCCESS) {
            setHistories(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    const renderTable = useCallback(() => {
        // if (!isAuth || !histories.length) return <TableNoData />;
        let data = histories;
        if (filterByCurrentPair) {
            data = histories.filter((hist) => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
        }

        return <TableV2 useRowHover data={data} columns={columns} loading={loading} scroll={{ x: true }} limit={10} skip={0} />;
    }, [filteredHistories, isAuth, columns, loading, filterByCurrentPair, currentPair]);

    return renderTable();
};

export default TradeHistory;
