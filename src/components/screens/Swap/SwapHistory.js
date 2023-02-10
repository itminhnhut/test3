import { useState } from 'react';
import { useAsync } from 'react-use';
import { API_GET_SWAP_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { ApiStatus } from 'redux/actions/const';
import { formatPrice, formatTime, getLoginUrl } from 'redux/actions/utils';
import { RETABLE_SORTBY } from 'src/components/common/ReTable';
import fetchApi from '../../../utils/fetch-api';
import Skeletor from 'src/components/common/Skeletor';
import { useSelector } from 'react-redux';
import TableV2 from 'components/common/V2/TableV2';
import { SwapIcon } from 'components/svg/SvgIcon';

const SwapHistory = ({ width }) => {
    const [state, set] = useState({
        page: 0,
        pageSize: LIMIT_ROW,
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

    const onChangePagination = (delta) => {
        // console.log('Here: ', delta);
        setState({ page: state.page + delta });
    };
    return (
        <div className="m-auto mt-20">
            <div className="text-[20px] text-left leading-7 text-txtPrimary dark:text-txtPrimary-dark font-medium">{t('convert:history')}</div>
            {auth ? (
                // <TableV2
                //     useRowHover
                //     data={data}
                //     columns={columns}
                //     rowKey={(item) => `${item?.displayingId}`}
                //     loading={state.loading}
                //     scroll={{ x: true }}
                //     limit={LIMIT_ROW}
                //     skip={0}
                // />
                <div className="mt-8 pt-4 border border-divider-dark dark:border-divider-dark rounded-xl">
                    <TableV2
                        useRowHover
                        data={data || []}
                        columns={columns}
                        rowKey={(item) => `${item?.displayingId}`}
                        scroll={{ x: true }}
                        limit={LIMIT_ROW}
                        skip={0}
                        isSearch={!!state.search}
                        pagingClassName="border-none"
                        height={350}
                        pagingPrevNext={{ page: state.page, histories: state.histories, onChangeNextPrev: onChangePagination, language }}
                        // page={state.currentPage}
                        // onChangePage={(currentPage) => setState({ currentPage })}
                    />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-[60px]">
                    <img src={'/images/screen/swap/login-success.png'} alt="" className="mx-auto h-[124px] w-[124px]" />
                    <p className="text-base text-darkBlue-5 mt-3">
                        <a
                            href={getLoginUrl('sso', 'login')}
                            className="text-txtTextBtn dark:text-txtTextBtn-dark focus:text-txtTextBtn-pressed dark:focus:text-txtTextBtn-dark_pressed font-semibold leading-6"
                        >
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
    { key: 'id', dataIndex: 'id', title: 'ID', width: 120, fixed: 'left', align: 'left' },
    { key: 'swap_pair', dataIndex: 'swap_pair', title: 'Swap Pair', width: 180, align: 'left' },
    { key: 'from_qty', dataIndex: 'from_qty', title: 'From Quantity', width: 220, align: 'left' },
    { key: 'to_qty', dataIndex: 'to_qty', title: 'To Quantity', width: 244, align: 'left' },
    { key: 'rate', dataIndex: 'rate', title: 'Rate', width: 280, align: 'left' },
    { key: 'time', dataIndex: 'time', title: 'Time', width: 150, align: 'left' }
];

const dataHandler = (data, loading) => {
    // loading = false;
    // data = Array.from({ length: 12 }, (x, i) => {
    //     return {
    //         displayingId: 10000 + i,
    //         displayingPrice: 12455,
    //         displayingPriceAsset: 235124,
    //         feeMetadata: 0.2,
    //         fromAsset: 'BTC',
    //         toAsset: 'USDT',
    //         fromQty: 1,
    //         toQty: 890234789598,
    //         createdAt: Date.now()
    //     };
    //     // return { id: i, fromAsset: 'BTC', toAsset: 'USDT', from_qty: 12, to_qty: 12000, rate: 1.2, time: Date.now() };
    // });
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
                <div className="text-left flex items-center">
                    {fromAsset}
                    <SwapIcon className="mx-2" />
                    {toAsset}
                    {/* {fromAsset} <span className="inline-block mx-1">&#8652;</span> {toAsset} */}
                </div>
            ),
            from_qty: (
                <span>
                    {formatPrice(+fromQty)} {fromAsset}
                </span>
            ),
            to_qty: (
                <span>
                    {formatPrice(+toQty)} {toAsset}
                </span>
            ),
            rate: (
                <div className="">
                    1 {displayingPriceAsset === fromAsset ? toAsset : fromAsset} = {formatPrice(+displayingPrice)} {displayingPriceAsset}
                </div>
            ),
            time: <span>{formatTime(createdAt, 'dd/MM/yyyy')}</span>,
            // time: <div className="text-right">{formatTime(createdAt, 'HH:mm dd-MM-yyyy')}</div>,
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
