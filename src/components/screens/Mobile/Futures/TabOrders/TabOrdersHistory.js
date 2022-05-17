import React, { useRef, useState, useEffect } from 'react';
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import OrderItemMobile from './OrderItemMobile'
import { useSelector } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";

const TabOrdersHistory = ({ isDark }) => {
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const filter = useRef({
        pageSize: 20,
        page: 0
    })
    const hasMore = useRef(true);

    useEffect(() => {
        setLoading(true);
        getOrders();
    }, [])

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

    if (loading) return null;
    if (dataSource.length <= 0) return <TableNoData />

    return (
        <InfiniteScroll
            dataLength={dataSource.length}
            next={onNext}
            hasMore={hasMore.current}
            height={'calc(100vh - 122px)'}
        // loader={loading ? loader() : null}
        >
            <div className="px-[16px]">
                {dataSource?.map((order, i) => {
                    const dataMarketWatch = allPairConfigs.find(rs => rs.symbol === order.symbol)
                    return (
                        <OrderItemMobile key={i} order={order} dataMarketWatch={dataMarketWatch} mode="history"
                            isDark={isDark}
                        />
                    )
                })}
            </div>
        </InfiniteScroll>
    );
};

export default TabOrdersHistory;