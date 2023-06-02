import React, { useState, useEffect, Fragment, useRef, forwardRef, useImperativeHandle } from 'react';
import { Divider } from 'components/screens/Nao/NaoStyle';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_SHARE_HISTORIES, API_POOL_STAKE_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import { useTranslation } from 'next-i18next';
import { formatNumber, getS3Url, formatTime, getTimeAgo } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { add, formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { floor } from 'lodash';
import { useSelector } from 'react-redux';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';


// const mock = [
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 20000,
//         createdAt: '2023-04-13T04:30:32.868Z',
//         updatedAt: '2023-04-13T04:30:32.868Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 10000,
//         createdAt: '2023-04-13T04:30:08.158Z',
//         updatedAt: '2023-04-13T04:30:08.158Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 20000,
//         createdAt: '2023-04-13T04:30:32.868Z',
//         updatedAt: '2023-04-13T04:30:32.868Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 10000,
//         createdAt: '2023-04-13T04:30:08.158Z',
//         updatedAt: '2023-04-13T04:30:08.158Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 20000,
//         createdAt: '2023-04-13T04:30:32.868Z',
//         updatedAt: '2023-04-13T04:30:32.868Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 10000,
//         createdAt: '2023-04-13T04:30:08.158Z',
//         updatedAt: '2023-04-13T04:30:08.158Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 20000,
//         createdAt: '2023-04-13T04:30:32.868Z',
//         updatedAt: '2023-04-13T04:30:32.868Z',
//         __v: 0
//     },
//     {
//         status: 2,
//         _id: uniqueId(),
//         poolId: '64378550a3d8dc6589cbe798',
//         type: 1,
//         amount: 10000,
//         createdAt: '2023-04-13T04:30:08.158Z',
//         updatedAt: '2023-04-13T04:30:08.158Z',
//         __v: 0
//     }
// ];

const StakeOrders = ({ assetConfig }) => {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState([]);
    const hasNext = useRef(false);
    const [loading, setLoading] = useState(true);
    const isReload = useSelector(state => state?.nao?.isReloadStake)
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    useEffect(() => {
        getStakeOrders(true);
    }, [isReload])

    const getStakeOrders = async (isReset) => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_STAKE_ORDER,
                params: isReset ? {} : {
                    lastId: dataSource[dataSource.length - 1]?._id
                }
            });
            if (status === ApiStatus.SUCCESS) {
                if (status === ApiStatus.SUCCESS) {
                    hasNext.current = data?.hasNext;
                    const _dataSource = isReset ? data?.result || [] : [...dataSource].concat(data?.result);
                    setDataSource(_dataSource);
                } else {
                    setDataSource([])
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            if (loading) setLoading(false);
        }
    }

    const formatDate = (minutes) => {
        const hours = floor(minutes / 60);
        const days = floor(minutes / 60 / 24);
        return days >= 1 ? days + ' ' + t('common:days') : hours >= 1 ? hours + ' ' + t('common:hours') : minutes + ' ' + t('common:minutes')
    }

    const renderStatus = (item) => {
        const status = item?.status;
        let minutes = 0;
        if (status === 1) {
            const date = add(new Date(item?.createdAt), { days: 7 })
            minutes = differenceInMinutes(date, new Date());
        }
        const title = status === 0 ? t('nao:pool:fail') : status === 1 ? t('nao:pool:unlock_status', { value: formatDate(minutes) }) : t('common:success');
        const color = status === 0 ? 'text-red-2' : status === 1 ? 'text-yellow-2' : 'text-teal';
        return <div className={`${color}`}>{title}</div>
    }

    const loader = () => {
        const rs = [];
        for (let i = 0; i <= 5; i++) {
            rs.push(<Fragment key={i}>
                {/* {i !== 0 && <Divider className="w-full !my-4" />} */}
                <div className="py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold leading-6">
                            <Skeletor width={100} height={10} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Skeletor width={100} height={10} />
                            <Skeletor width={20} height={20} circle />
                        </div>
                    </div>
                    <div className="flex items-center justify-between leading-6 text-sm mb:text-base mb pt-2">
                        <Skeletor width={100} height={10} />
                        <Skeletor width={100} height={10} />
                    </div>
                </div>
            </Fragment>)
        }
        return rs
    }

    return (
        <Fragment>
            {loading ? (
                loader()
            ) : (
                <>
                    {dataSource.length > 0 ? (
                        <InfiniteScroll
                            dataLength={dataSource.length}
                            next={getStakeOrders}
                            hasMore={hasNext.current}
                            className='flex flex-col space-y-2'
                            // {...scrollSnap ? { height: 'calc(100vh - 42px)' } : { scrollableTarget: "futures-mobile" }}
                        >
                            {dataSource.map((item, idx) => {
                                return (
                                    <Fragment key={idx}>
                                        {/* {idx !== 0 && <Divider className="w-full !my-4" />} */}
                                        <div className="py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-sm mb:text-base">
                                                    {t(`nao:pool:${item?.type === 1 ? 'lock2' : 'unlock'}`)} NAO
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-sm mb:text-base font-semibold">
                                                        {formatNumber(item?.amount, assetConfig[447]?.assetDigit ?? 2)}{' '}
                                                        NAO
                                                    </div>
                                                    {/* <img src={getS3Url('/images/nao/ic_nao.png')} width={20} height={20} alt="" /> */}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs mb:text-sm pt-2">
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                                    {formatTime(item?.createdAt, 'dd/MM/yyyy HH:mm:ss')}
                                                </div>
                                                {renderStatus(item)}
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            })}
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <div className={`flex items-center justify-center flex-col m-auto h-full min-h-[300px]`}>
                                {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
                                <div className="text-xs mb:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:pool:no_transaction_history')}</div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Fragment>
    );
};

export default StakeOrders;