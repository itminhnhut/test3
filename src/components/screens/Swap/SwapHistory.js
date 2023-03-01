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
import Link from 'next/link';

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

    const columns = [
        { key: 'displayingId', dataIndex: 'displayingId', title: 'ID', width: 140, fixed: 'left', align: 'left' },
        {
            key: 'swap_pair',
            dataIndex: 'swap_pair',
            title: t('common:swap_pair'),
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
            title: t('common:from'),
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
            title: t('common:to'),
            width: 220,
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
            title: t('common:rate'),
            width: 306,
            align: 'left',
            render: (v, item) => {
                const { fromAsset, toAsset, displayingPrice, displayingPriceAsset } = item;
                return (
                    <span>
                        1 {displayingPriceAsset === fromAsset ? toAsset : fromAsset} = {formatPrice(+displayingPrice)} {displayingPriceAsset}
                    </span>
                );
            }
        },
        { key: 'createdAt', dataIndex: 'createdAt', title: t('common:time'), width: 135, align: 'left', render: (v) => formatTime(v, 'dd/MM/yyyy') }
    ];

    return (
        <div className="m-auto mt-20">
            <div className="text-[24px] leading-[30px] font-semibold text-txtPrimary dark:text-txtPrimary-dark text-left">{t('convert:history')}</div>
            {auth ? (
                <div className="mt-8 pt-4 bg-white dark:bg-dark dark:border dark:border-divider-dark rounded-xl">
                    <TableV2
                        loading={state.loading}
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
                    <p className="!text-base text-txtSecondary dark:text-txtSecondary-dark mt-3">
                        <a href={getLoginUrl('sso')} className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4">
                            {t('common:sign_in')}{' '}
                        </a>
                        {t('common:or')}{' '}
                        <a
                            href={getLoginUrl('sso', 'register')}
                            className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4"
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

export default SwapHistory;
