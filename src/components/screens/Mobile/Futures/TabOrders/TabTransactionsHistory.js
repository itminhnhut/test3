import {endOfDay, format, startOfDay} from "date-fns";
import {Check, ChevronDown, ChevronUp, Copy} from "react-feather";
import colors from "styles/colors";
import DateRangePicker from "components/screens/Mobile/Futures/DateRangePicker";
import {useEffect, useMemo, useState} from "react";
import Modal from "components/common/ReModal";
import fetchApi from 'utils/fetch-api';
import {API_GET_VNDC_FUTURES_TRANSACTION_HISTORIES} from "redux/actions/apis";
import classNames from "classnames";
import {concat, filter, find, keyBy, last, range} from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import {IconLoading} from "components/common/Icons";
import AssetLogo from "components/wallet/AssetLogo";
import {useSelector} from "react-redux";
import {formatNumber} from "redux/actions/utils";
import {useTranslation} from "next-i18next";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";

const categories = ['all', 600, 602, 606, 603, 4, 5]

const ASSETS = [72]

function TabTransactionsHistory({scrollSnap, active}) {
    const [data, setData] = useState({
        result: [],
        hasNext: false
    })
    const [visibleDateRangePicker, setVisibleDateRangePicker] = useState(false)
    const [visibleCategoryPicker, setVisibleCategoryPicker] = useState(false)
    const [range, setRange] = useState({
        start: null,
        end: null
    })
    const [loading, setLoading] = useState(false)
    const [transactionDetail, setTransactionDetail] = useState()
    const assetConfigs = useSelector(state => state.utils.assetConfig)
    const timestamp = useSelector((state) => state.heath.timestamp);

    const {t} = useTranslation()

    const assetConfigMap = useMemo(() => {
        return keyBy(filter(assetConfigs, (a) => ASSETS.includes(a.id)), 'id')
    }, [assetConfigs])

    const [category, setCategory] = useState(categories[0])

    const _setRange = (range) => {
        if (range.start && !range.end) {
            range.end = range.start
        }
        setRange(range)
    }

    const fetchData = (isLoadMore) => {
        setLoading(!isLoadMore)
        fetchApi({
            url: API_GET_VNDC_FUTURES_TRANSACTION_HISTORIES,
            params: {
                timeFrom: range.start ? startOfDay(range.start).valueOf() : '',
                timeTo: range.end ? endOfDay(range.end).valueOf() : '',
                category: category !== 'all' ? category : '',
                lastId: isLoadMore ? last(data.result)?._id : ''
            }
        }).then(res => {
            setLoading(false)
            if (res.status === 'ok' && res.data) {
                setData({
                    hasNext: res.data.hasNext,
                    result: isLoadMore ? concat(data.result, res.data.result) : res.data.result
                })
                // setTransactionDetail(res.data.result[0])
            }
        })
    }

    useEffect(() => {
        if (active) {
            fetchData()
        }
    }, [range, category, active, timestamp])

    return <div>
        <DateRangePicker
            visible={visibleDateRangePicker}
            onClose={() => setVisibleDateRangePicker(false)}
            value={range}
            onChange={_setRange}
        />
        <CategoryPicker
            t={t}
            visible={visibleCategoryPicker}
            onClose={() => setVisibleCategoryPicker(false)}
            value={category}
            onChange={setCategory}
        />
        <TransactionDetail
            t={t}
            visible={!!transactionDetail}
            onClose={() => setTransactionDetail()}
            transaction={transactionDetail}
            assetConfig={assetConfigMap[transactionDetail?.currency]}
        />

        <div className='flex justify-between text-xs text-onus-grey px-4 pt-2'>
            <div className='flex items-center p-2 -ml-2' onClick={() => setVisibleDateRangePicker(true)}>
                <span className='mr-1'>
                    {range.start && range.end ?
                        <>
                            <span>{format(range.start, 'dd/M/yyyy')}</span>
                            <span className='px-1'>-></span>
                            <span>{format(range.end, 'dd/M/yyyy')}</span>
                        </> :
                        t('futures:mobile:transaction_histories:time')}
                </span>
                <ChevronDown size={12} color={colors.onus.grey}/>
            </div>
            <div
                className={classNames('flex items-center p-2 -mr-2', {
                    'text-onus-base': visibleCategoryPicker
                })}
                onClick={() => setVisibleCategoryPicker(true)}>
                <span className='mr-1'>{t(`futures:mobile:transaction_histories:categories:${category}`)}</span>
                {visibleCategoryPicker ?
                    <ChevronUp size={12} color={colors.onus.base}/> :
                    <ChevronDown size={12} color={colors.onus.grey}/>}
            </div>
        </div>
        <div
            // id="list-transaction-histories"
            className=''
        >
            <InfiniteScroll
                dataLength={data.result.length}
                hasMore={data.hasNext && !loading}
                next={() => fetchData(true)}
                scrollableTarget="futures-mobile"
                loader={<div><IconLoading color={colors.onus.white}/></div>}
                {...scrollSnap ? {height: 'calc(100vh - 5.25rem)'} : {scrollableTarget: "futures-mobile"}}
            >
                {loading ? <Loading/> : data.result.map(item => {
                    const assetConfig = assetConfigMap[item.currency]
                    return <div
                        key={item._id}
                        className='flex justify-between p-4 border-b border-onus-line'
                        onClick={() => setTransactionDetail(item)}
                    >
                        <div className='flex items-center'>
                            <AssetLogo size={36} assetCode={assetConfig?.assetCode}/>
                            <div className='ml-2'>
                                <div className='font-bold text-onus-white'>{assetConfig?.assetCode}</div>
                                <div
                                    className='font-medium text-onus-grey text-xs mr-2'
                                >
                                    {format(new Date(item.created_at), 'yyyy-MM-dd H:mm:ss')}
                                </div>
                            </div>
                        </div>
                        <div className='text-right'>
                            <div
                                className='font-bold text-onus-white'
                            >
                                {formatNumber(item.money_use, assetConfig?.assetDigit, null, true)}
                            </div>
                            <div
                                className='font-medium text-onus-grey text-xs'
                            >
                                {categories.includes(item.category) ? t(`futures:mobile:transaction_histories:categories:${item.category}`) : '--'}
                            </div>
                        </div>
                    </div>
                })}
            </InfiniteScroll>
        </div>

    </div>
}

const CategoryPicker = ({t, visible, onClose, value, onChange}) => {
    const _onChange = (v) => {
        onChange(v)
        onClose()
    }
    return <Modal
        isVisible={visible}
        onusMode
        onBackdropCb={onClose}
        onusClassName='pb-8 pt-8'
    >
        {categories.map(c => {
            return <div
                key={c}
                className='flex justify-between items-center'
                onClick={() => _onChange(c)}
            >
                <span className='text-onus-white py-3 font-medium'>
                    {t(`futures:mobile:transaction_histories:categories:${c}`)}
                </span>
                {value === c && <Check size={16} color={colors.onus.base}/>}
            </div>
        })}
    </Modal>
}

const TransactionDetail = ({t, visible, onClose, transaction, assetConfig = {}}) => {
    return <Modal
        isVisible={visible}
        onusMode
        onBackdropCb={onClose}
        onusClassName='px-0'
    >
        <div className='text-onus-white text-center border-b border-onus-bg2 pb-6'>
            <span className='text-sm'>
                {transaction?.category ? t(`futures:mobile:transaction_histories:categories:${transaction?.category}`) : '--'}
            </span>
            <div className='text-2xl font-bold'>
                <span>{formatNumber(transaction?.money_use, assetConfig.assetDigit, null, true)}</span>
                <span className='ml-1'>{assetConfig.assetCode}</span>
            </div>
        </div>
        <div className='px-4 pt-6 space-y-4'>
            <div className='flex justify-between text-sm'>
                <span className='text-onus-grey mr-2 whitespace-nowrap'>
                    {t('futures:mobile:transaction_histories:transaction_number')}
                </span>
                <div className='flex flex-1 min-w-0 items-center'>
                    <div className='flex-1 min-w-0 overflow-hidden text-right'
                         style={{textOverflow: 'ellipsis'}}>{transaction?._id}</div>
                    <CopyToClipboard text={transaction?._id}>
                        <Copy className='ml-2' size={14} color={colors.onus.grey}/>
                    </CopyToClipboard>
                </div>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-onus-grey'>{t('futures:mobile:transaction_histories:time')}</span>
                <span>{transaction?.created_at ? format(new Date(transaction?.created_at), 'yyyy-MM-dd H:mm:ss') : '--'}</span>
            </div>
        </div>
        <div
            className='flex items-center justify-center mx-4 mt-8 font-bold text-onus-white h-12 rounded bg-onus-base'
            onClick={onClose}
        >{t('futures:mobile:transaction_histories:close')}</div>
    </Modal>
}

const Loading = () => {
    return range(0, 6).map(i => {
        return <div key={i} className='flex justify-between animate-pulse p-4 border-b border-onus-line'>
            <div className='flex items-center'>
                <div className='!rounded-full bg-darkBlue-3 h-9 !w-9'/>
                <div className='flex flex-col justify-between h-full ml-2'>
                    <div className='rounded bg-darkBlue-3 h-3 w-12'/>
                    <div className='rounded bg-darkBlue-3 h-2 w-28'/>
                </div>
            </div>
            <div className='flex flex-col justify-between items-end'>
                <div className='rounded bg-darkBlue-3 w-9 h-3'/>
                <div className='rounded bg-darkBlue-3 w-14 h-2'/>
            </div>
        </div>
    })
}

export default TabTransactionsHistory;
