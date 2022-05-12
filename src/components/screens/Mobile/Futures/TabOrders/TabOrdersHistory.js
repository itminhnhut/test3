import React, { useRef, useState, useEffect } from 'react';
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'

const TabOrdersHistory = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const filter = useRef({
        pageSize: 20,
        page: 0
    })

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async () => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: {
                    ...filter.current,
                    status: 1,
                    // pageSize: pagination.pageSize,
                    // page: pagination.page - 1,
                    // ...filters,
                    // timeFrom: filters.timeFrom?.valueOf(),
                    // timeTo: filters.timeTo?.valueOf(),

                },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data?.orders)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            TabOrdersHistory
        </div>
    );
};

export default TabOrdersHistory;