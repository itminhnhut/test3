import React, { useRef, useState, useEffect, useMemo } from 'react';
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import OrderItemMobile from './OrderItemMobile'
import { useSelector } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";
import ShareFutureMobile from './ShareFutureMobile';
import OrderDetail from '../OrderDetail';
import { socket } from "components/KlineChart/kline.service";
import { useTranslation } from 'next-i18next';
import Skeletor from 'components/common/Skeletor'

const TabOrdersHistory = ({ isDark, scrollSnap, pair, setForceRender, forceRender, isVndcFutures, active }) => {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const filter = useRef({
        pageSize: 20,
        page: 0
    })
    const hasMore = useRef(true);
    const rowData = useRef(null);
    const [showDetail, setShowDetail] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const isLoading = useRef(true);

    useEffect(() => {
        if (active) {
            filter.current.page = 0;
            setLoading(true);
            getOrders();
        } else {
            isLoading.current = true;
            setDataSource([])
        }
    }, [active])

    const onShowModal = (item, key) => {
        rowData.current = item;
        setOpenShareModal(!openShareModal)
    }

    const getOrders = async () => {
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: {
                    ...filter.current,
                    status: 1,
                },
            })

            if (status === ApiStatus.SUCCESS) {
                if (data.pagesCount <= filter.current.page) {
                    hasMore.current = false;
                }
                const _dataSource = [...dataSource].concat(data?.orders);
                setDataSource(_dataSource)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            isLoading.current = false;
            setLoading(false);
        }
    }

    const onNext = () => {
        filter.current.page = filter.current.page + 1;
        getOrders();
    }

    const onShowDetail = (row) => {
        // rowData.current = row;
        // if (showDetail) {
        //     socket.emit('subscribe:futures:ticker', pair)
        //     setForceRender(!forceRender)
        // }
        // setShowDetail(!showDetail);
    }

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === rowData.current?.symbol)
    }, [rowData.current, showDetail])

    const Loading = () => (
        <div className="py-[10px]">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Skeletor containerClassName="mr-[12px]" width={38} height={38} />
                    <div className="flex flex-col">
                        <div className="flex">
                            <Skeletor width={80} height={21} />&nbsp;&nbsp;
                            <Skeletor width={20} height={20} /></div>
                        <div className="flex">
                            <Skeletor width={30} height={10} />&nbsp;&nbsp;
                            <Skeletor width={50} height={10} />
                        </div>
                    </div>
                </div>
                <Skeletor width={26} height={26} />
            </div>
            <div className="flex items-center justify-between flex-wrap mt-[5px]">
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
            </div>
            <div className="h-[1px]"> <Skeletor width={'100%'} height={1} className="mt-[15px]" /></div>
        </div>
    )

    const getLoading = () => {
        let rs = [];
        for (let i = 1; i <= 5; i++) {
            rs.push(<Loading key={i} />)
        }
        return rs;
    }

    if (loading && isLoading.current) return (<div className="min-h-screen px-[10px]">{getLoading()}</div>)
    if (dataSource.length <= 0 && !loading) return <TableNoData title={t('futures:order_table:no_history_order')} className="h-full min-h-screen" />

    return (
        <div className="min-h-screen">
            {openShareModal && <ShareFutureMobile
                isVisible={openShareModal} order={rowData.current}
                onClose={() => setOpenShareModal(false)}
                isClosePrice
            // pairPrice={marketWatch[rowData.current?.symbol]}
            />}
            {showDetail &&
                <OrderDetail order={rowData.current} onClose={onShowDetail} isMobile
                    pairConfig={pairConfigDetail}
                    pairParent={pair} isVndcFutures={isVndcFutures}
                />
            }
            <InfiniteScroll
                dataLength={dataSource.length}
                next={onNext}
                hasMore={active && hasMore.current}
                {...scrollSnap ? { height: 'calc(100vh - 122px)' } : { scrollableTarget: "futures-mobile" }}
            // loader={loading ? loader() : null}
            >
                <div className="px-[16px]">
                    {dataSource?.map((order, i) => {
                        const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
                        return (
                            <OrderItemMobile key={i} order={order} mode="history"
                                isDark={isDark} onShowDetail={onShowDetail} symbol={symbol}
                                onShowModal={onShowModal}
                            />
                        )
                    })}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default TabOrdersHistory;