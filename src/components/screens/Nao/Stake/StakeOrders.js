import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Divider } from 'components/screens/Nao/NaoStyle';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_SHARE_HISTORIES, API_POOL_STAKE_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import { useTranslation } from 'next-i18next';
import { formatNumber, getS3Url, formatTime } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';

const StakeOrders = ({ assetConfig }) => {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState([]);
    const hasNext = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStakeOrders(true);
    }, [])

    const getStakeOrders = async (isReset) => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_STAKE_ORDER,
                params: {
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

    const renderStatus = (status) => {
        const title = status === 0 ? t('common:canceled') : status === 1 ? t('nao:pool:pending') : t('common:success');
        const color = status === 0 ? 'text-nao-red' : status === 1 ? 'text-onus-orange' : 'text-nao-green';
        return <div className={`font-semibold ${color}`}>{title}</div>
    }

    const loader = () => {
        const rs = [];
        for (let i = 0; i <= 5; i++) {
            rs.push(<Fragment key={i}>
                {i !== 0 && <Divider className="w-full !my-4" />}
                <div className="">
                    <div className="flex items-center justify-between">
                        <div className="text-nao-text font-semibold leading-6">
                            <Skeletor width={100} height={10} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Skeletor width={100} height={10} />
                            <Skeletor width={20} height={20} circle />
                        </div>
                    </div>
                    <div className="flex items-center justify-between leading-6 text-sm pt-2">
                        <Skeletor width={100} height={10} />
                        <Skeletor width={100} height={10} />
                    </div>
                </div>
            </Fragment>)
        }
        return rs
    }

    return (
        <div className='min-h-[300px]'>
            {loading ? loader() :
                <InfiniteScroll
                    dataLength={dataSource.length}
                    next={getStakeOrders}
                    hasMore={hasNext.current}
                // {...scrollSnap ? { height: 'calc(100vh - 42px)' } : { scrollableTarget: "futures-mobile" }}
                >
                    {dataSource.map((item, idx) => {
                        return (
                            <Fragment key={idx}>
                                {idx !== 0 && <Divider className="w-full !my-4" />}
                                <div className="">
                                    <div className="flex items-center justify-between">
                                        <div className="text-nao-text font-semibold leading-6">{t(`nao:pool:${item?.type === 1 ? 'lock' : 'unlock'}`)} NAO</div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-lg font-semibold leading-7">{formatNumber(item?.amount, assetConfig[447]?.assetDigit ?? 2)}</div>
                                            <img src={getS3Url('/images/nao/ic_nao.png')} width={20} height={20} alt="" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between leading-6 text-sm pt-2">
                                        <div className="text-nao-grey ">{formatTime(item?.createdAt, 'dd/MM/yyyy HH:mm:ss')}</div>
                                        {renderStatus(item?.status)}
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </InfiniteScroll>
            }
        </div>
    );
};

export default StakeOrders;