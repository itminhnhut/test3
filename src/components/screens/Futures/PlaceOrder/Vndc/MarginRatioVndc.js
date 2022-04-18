import SpeedMeter from 'components/svg/SpeedMeter'
import { ChevronDown, X } from 'react-feather'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    setTransferModal,
} from 'redux/actions/utils';
import { useEffect, useState } from 'react';
import { orderBy } from 'lodash'
import { formatNumber } from 'redux/actions/utils'
import { ApiStatus, UserSocketEvent } from 'redux/actions/const'
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { getProfitVndc } from './VndcFutureOrderType';
import { useTranslation } from 'next-i18next'

const AVAILBLE_KEY = 'futures_available'

const FuturesMarginRatioVndc = ({ pairConfig, auth, lastPrice }) => {
    const dispatch = useDispatch();
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null
    const userSocket = useSelector((state) => state.socket.userSocket);
    const wallets = useSelector(state => state.wallet.FUTURES)
    const [balance, setBalance] = useState({});
    const [totalProfit, setTotalProfit] = useState(0);
    const { t } = useTranslation()

    const walletMapper = (allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return
        const mapper = []
        const FUTURES_ASSET = ['VNDC']
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter(o => FUTURES_ASSET.includes(o?.assetCode))
            futures && futures.forEach(item => allWallet?.[item.id]
                && mapper.push(
                    {
                        ...item,
                        [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value,
                        wallet: allWallet?.[item?.id]
                    }))
        }
        const dataFilter = orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']);
        if (Array.isArray(dataFilter) && dataFilter.length > 0) {
            setBalance(dataFilter[0])
        }
    }

    useEffect(() => {
        walletMapper(wallets, assetConfig)
    }, [wallets, assetConfig])

    useEffect(() => {
        getOrders();
    }, [])

    useEffect(() => {
        if (userSocket) {
            userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            }
        };
    }, [userSocket]);


    const getOrders = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: { status: 0 },
            })
            if (status === ApiStatus.SUCCESS && Array.isArray(data?.orders)) {
                let _totalProfit = 0;
                data?.orders.forEach((item) => {
                    _totalProfit += getProfitVndc(item, lastPrice);
                });
                setTotalProfit(_totalProfit);
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const onOpenTransfer = () => {
        dispatch(setTransferModal({ isVisible: true }))
    }

    return (
        <div className='pt-5 h-full !overflow-x-hidden overflow-y-auto'>
            <div className='pt-4 pb-5 px-[10px]'>
                <div className='flex items-center justify-between'>
                    <span className='futures-component-title'>{t('common:assets')}</span>
                </div>
                <div className='mt-4 flex items-center'>
                    <Link href="https://nami.exchange/trade">
                        <a className='!text-darkBlue dark:!text-txtPrimary-dark px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                            {t('futures:buy_crypto')}
                        </a>
                    </Link>
                    <Link href="https://nami.exchange/swap">
                        <a className='!text-darkBlue dark:!text-txtPrimary-dark px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                            {t('futures:convert')}
                        </a>
                    </Link>
                    {auth &&
                        <div onClick={onOpenTransfer} className='cursor-pointer px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                            {t('common:transfer')}
                        </div>
                    }
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Balance
                    </span>
                    <span className='flex items-center font-medium'>
                        {balance?.wallet?.value ? formatNumber(balance?.wallet?.value, balance?.assetCode === 'USDT' ? 2 : balance?.assetDigit) : '0.0000'}
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        Unrealized PNL
                    </span>
                    <span className='flex items-center font-medium'>
                        <span className={totalProfit < 0 ? 'text-red' : 'text-teal'}>{formatNumber(totalProfit, 0, 0, true)}</span>
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FuturesMarginRatioVndc
