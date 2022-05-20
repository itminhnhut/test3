import React, { useRef, useState, useEffect } from 'react';
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import OrderItemMobile from './OrderItemMobile'
import { useSelector } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";
import Adjustmentdetails from 'components/screens/Futures/PlaceOrder/Vndc/Adjustmentdetails';
import ShareFutureMobile from './ShareFutureMobile';

const TabOrdersHistory = ({ isDark, scrollSnap }) => {
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

    useEffect(() => {
        setLoading(true);
        getOrders();
    }, [])

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
            setLoading(false);
        }
    }

    const onNext = () => {
        filter.current.page = filter.current.page + 1;
        getOrders();
    }

    const onShowDetail = (row) => {
        rowData.current = row;
        setShowDetail(!showDetail);
    }

    if (loading) return null;
    if (dataSource.length <= 0) return <TableNoData title={t('futures:order_table:no_history_order')} className="h-full min-h-[300px]" />

    return (
        <>
            {openShareModal && <ShareFutureMobile
                isVisible={openShareModal} order={rowData.current}
                onClose={() => setOpenShareModal(false)}
                isClosePrice
            // pairPrice={marketWatch[rowData.current?.symbol]}
            />}
            {showDetail && <Adjustmentdetails rowData={rowData.current} onClose={onShowDetail} isMobile />}
            <InfiniteScroll
                dataLength={dataSource.length}
                next={onNext}
                hasMore={hasMore.current}
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
        </>
    );
};

export default TabOrdersHistory;