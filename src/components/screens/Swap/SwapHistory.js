import { useCallback, useState, useEffect } from 'react';
import { useAsync } from 'react-use';
import { API_GET_SWAP_HISTORY } from 'redux/actions/apis';
import { Trans, useTranslation } from 'next-i18next';
import { ApiStatus } from 'redux/actions/const';
import { formatPrice, formatTime, getLoginUrl } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { ChevronLeft, ChevronRight } from 'react-feather';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import fetchApi from '../../../utils/fetch-api';
import MCard from 'src/components/common/MCard';
import Skeletor from 'src/components/common/Skeletor';
import Empty from 'src/components/common/Empty';
import { useSelector } from 'react-redux';
import SvgEmptyHistory from 'components/svg/SvgEmptyHistory';
import TableV2 from 'src/components/common/SwapTableV2';

import { PATHS } from 'constants/paths';

const SwapHistory = ({ width }) => {
    const [state, set] = useState({
        page: 0,
        pageSize: 5,
        loading: false,
        histories: null
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const auth = useSelector((state) => state.auth?.user);
    const {
        t,
        i18n: { language }
    } = useTranslation(['convert', 'common']);

    const data = dataHandler(state.histories, state.loading);

    useAsync(async () => {
        if (!auth) return;
        setState({ loading: true, histories: null });
        try {
            const {
                status,
                data: { orders: histories }
            } = await fetchApi({
                url: API_GET_SWAP_HISTORY,
                options: { method: 'GET' },
                params: { page: state.page, pageSize: state.pageSize }
            });

            if (status === ApiStatus.SUCCESS && histories) {
                setState({ histories });
            }
        } catch (e) {
            console.log(`Can't get swap history `, e);
        } finally {
            setState({ loading: false });
        }
    }, [state.page, state.pageSize, auth]);

    // const dataTemp = Array.from({ length: 12 }, (x, i) => {
    //     return { id: i, swap_pair: 'BTCVNDC', from_qty: 12, to_qty: 12000, rate: 1.2, time: Date.now() };
    // });

    return (
        <div className="mal-container mt-20">
            <div className="text-[20px] text-left leading-7 text-txtPrimary dark:text-txtPrimary-dark font-medium">{t('convert:history')}</div>

            {auth ? (
                <TableV2
                    useRowHover
                    data={data}
                    columns={columns}
                    rowKey={(item) => `${item?.displayingId}`}
                    loading={state.loading}
                    scroll={{ x: true }}
                    limit={10}
                    skip={0}
                />
            ) : (
                <div className="flex flex-col justify-center items-center mt-[60px]">
                    <img src={'/images/screen/swap/login-success.png'} alt="" className="mx-auto h-[124px] w-[124px]" />
                    <p className="text-base text-namiv2-gray-1 mt-3">
                        <a href={getLoginUrl('sso', 'login')} className="text-teal font-semibold leading-6">
                            {t('common:sign_in')}{' '}
                        </a>
                        {t('common:or')}{' '}
                        <a href={getLoginUrl('sso', 'register')} className="text-teal font-semibold leading-6">
                            {t('common:sign_up')}{' '}
                        </a>
                        {t('common:swap_history')}
                    </p>
                </div>
            )}
        </div>
    );
};

const LIMIT_ROW = 5;
const KEY = 'swap_history__item_';

const columns = [
    { key: 'id', dataIndex: 'id', title: 'Order#ID', width: 100, fixed: 'left', align: 'left' },
    { key: 'swap_pair', dataIndex: 'swap_pair', title: 'Swap Pair', width: 100, align: 'left' },
    { key: 'from_qty', dataIndex: 'from_qty', title: 'From Quantity', width: 100, align: 'right' },
    { key: 'to_qty', dataIndex: 'to_qty', title: 'To Quantity', width: 100, align: 'right' },
    { key: 'rate', dataIndex: 'rate', title: 'Rate', width: 100, align: 'right' },
    { key: 'time', dataIndex: 'time', title: 'Time', width: 100, align: 'right' }
];

const dataHandler = (data, loading) => {
    if (loading) {
        const skeleton = [];
        for (let i = 0; i < LIMIT_ROW; ++i) {
            skeleton.push({ ...ROW_LOADING_SKELETON, key: `${KEY}${i}` });
        }
        return skeleton;
    }

    if (!Array.isArray(data) || !data || !data.length) return [];

    const result = [];
    data.forEach((item) => {
        const { displayingId, displayingPrice, displayingPriceAsset, feeMetadata: fee, fromAsset, toAsset, fromQty, toQty, createdAt } = item;
        // createdAt: "2021-11-15T08:18:23.162Z"
        // displayingId: "259"
        // displayingPrice: 644
        // displayingPriceAsset: "USDT"
        // feeMetadata: {value: 9.27, asset: 'USDT', assetId: 22}
        // fromAsset: "BNB"
        // fromAssetId: 40
        // fromQty: 12
        // price: 643.98
        // toAsset: "USDT"
        // toAssetId: 22
        // toQty: 7727.76
        // updatedAt: "2021-11-15T08:18:23.162Z"
        // userId: 888
        // _id: "619217cfd3297c78ea07fcba"

        result.push({
            key: `${KEY}${displayingId}`,
            id: <div className="text-left">{displayingId}</div>,
            swap_pair: (
                <div className="text-left">
                    {fromAsset} <span className="inline-block mx-1">&#8652;</span> {toAsset}
                </div>
            ),
            from_qty: (
                <div className="text-right">
                    {formatPrice(+fromQty)} {fromAsset}
                </div>
            ),
            to_qty: (
                <div className="text-right">
                    {formatPrice(+toQty)} {toAsset}
                </div>
            ),
            rate: (
                <div className="text-right">
                    1 {displayingPriceAsset === fromAsset ? toAsset : fromAsset} = {formatPrice(+displayingPrice)} {displayingPriceAsset}
                </div>
            ),
            time: <div className="text-right">{formatTime(createdAt, 'HH:mm dd-MM-yyyy')}</div>,
            [RETABLE_SORTBY]: {
                id: +displayingId,
                swap_pair: `${fromAsset}${toAsset}`,
                from_qty: +fromQty,
                to_qty: +toQty,
                rate: +displayingPrice,
                time: createdAt
            }
        });
    });

    return result;
};

const ROW_LOADING_SKELETON = {
    id: <Skeletor width={65} />,
    swap_pair: <Skeletor width={65} />,
    from_qty: <Skeletor width={65} />,
    to_qty: <Skeletor width={65} />,
    rate: <Skeletor width={65} />,
    time: <Skeletor width={65} />
};

export default SwapHistory;
