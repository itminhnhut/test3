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

    // const data = dataHandler(state.histories, state.loading);
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
        setState({ page: state.page + delta });
    };
    return (
        <div className="m-auto mt-20">
            <div className="text-[20px] text-left leading-7 text-txtPrimary dark:text-txtPrimary-dark font-medium">{t('convert:history')}</div>
            {auth ? (
                <div className="mt-8 pt-4 bg-white dark:bg-dark dark:border dark:border-divider-dark rounded-xl">
                    <TableV2
                        useRowHover
                        data={state.histories || []}
                        columns={columns}
                        rowKey={(item) => `${item?.displayingId}`}
                        scroll={{ x: true }}
                        limit={LIMIT_ROW}
                        skip={0}
                        isSearch={!!state.search}
                        pagingClassName="border-none"
                        height={350}
                        pagingPrevNext={{ page: state.page, hasNext: state.histories?.length, onChangeNextPrev: onChangePagination, language }}
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                    />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-[60px]">
                    <img src={'/images/screen/swap/login-success.png'} alt="" className="mx-auto h-[124px] w-[124px]" />
                    <p className="!text-base dark:text-txtSecondary-dark mt-3">
                        <a
                            href={getLoginUrl('sso', 'login')}
                            className="font-semibold dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed"
                        >
                            {t('common:sign_in')}{' '}
                        </a>
                        {t('common:or')}{' '}
                        <a
                            href={getLoginUrl('sso', 'register')}
                            className="font-semibold dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed"
                        >
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
    { key: 'displayingId', dataIndex: 'displayingId', title: 'ID', width: 120, fixed: 'left', align: 'left' },
    {
        key: 'swap_pair',
        dataIndex: 'swap_pair',
        title: 'Swap Pair',
        width: 180,
        align: 'left',
        render: (v, item) => {
            return (
                <div className="text-left flex items-center">
                    {item.fromAsset}
                    <SwapIcon className="mx-2" />
                    {item.toAsset}
                </div>
            );
        }
    },
    {
        key: 'fromQty',
        dataIndex: 'fromQty',
        title: 'From Quantity',
        width: 220,
        align: 'left',
        render: (v, item) => (
            <span>
                {formatPrice(+v)} {item?.fromAsset}
            </span>
        )
    },
    {
        key: 'toQty',
        dataIndex: 'toQty',
        title: 'To Quantity',
        width: 244,
        align: 'left',
        render: (v, item) => (
            <span>
                {formatPrice(+v)} {item?.toAsset}
            </span>
        )
    },
    {
        key: 'rate',
        dataIndex: 'rate',
        title: 'Rate',
        width: 280,
        align: 'left',
        render: (v, item) => {
            console.log('item: ', item);
            const { fromAsset, toAsset, displayingPrice, displayingPriceAsset } = item;
            return (
                <span>
                    1 {displayingPriceAsset === fromAsset ? toAsset : fromAsset} = {formatPrice(+displayingPrice)} {displayingPriceAsset}
                </span>
            );
        }
    },
    { key: 'createdAt', dataIndex: 'createdAt', title: 'Time', width: 150, align: 'left', render: (v) => formatTime(v, 'dd/MM/yyyy') }
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

        result.push({
            key: `${KEY}${displayingId}`,
            id: <div className="text-left">{displayingId}</div>,
            swap_pair: (
                <div className="text-left flex items-center">
                    {fromAsset}
                    <SwapIcon className="mx-2" />
                    {toAsset}
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
