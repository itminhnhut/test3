import React, { useEffect, useRef, useState, Fragment, useMemo } from 'react';
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { FilterTabs, Line, RefButton } from '..';
import ReferralLevelIcon from '../../../svg/DiamondIcon';
import PopupModal from '../PopupModal';
import DatePicker from '../../../common/DatePicker/DatePicker';
import fetchApi from 'utils/fetch-api';
import { API_GET_LIST_FRIENDS } from 'redux/actions/apis';
import Tooltip from 'components/common/Tooltip';
import TableNoData from 'src/components/common/table.old/TableNoData';

const title = {
    en: 'Friend list',
    vi: 'Danh sách bạn bè'
};

const FriendList = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const arrStatus = [
        { title: t('common:all'), value: null },
        { title: t('broker:kyc_draft'), value: 0 },
        { title: t('broker:kyc_pending'), value: 1 },
        { title: t('broker:kyc_success'), value: 2 }
    ];
    const [filter, setFilter] = useState({
        kycStatus: arrStatus[0].value,
        invitedAt: null,
        range: {
            startDate: null,
            endDate: new Date(''),
            key: 'selection'
        }
    });

    const [showFilter, setShowFilter] = useState(false);
    const [dataSource, setdataSource] = useState([]);
    const [loading, setLoading] = useState(true);

    const getListFriends = async () => {
        const params = { ...filter };
        if (params.invitedAt) params.invitedAt = new Date(params.invitedAt).getTime();
        if (params.range.startDate) {
            params.from = new Date(params.range.startDate).getTime();
            params.to = new Date(params.range.endDate).getTime();
        }
        delete params.range;

        try {
            const { data } = await fetchApi({
                url: API_GET_LIST_FRIENDS,
                params: params
            });
            if (data) {
                setdataSource(data.results);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListFriends();
    }, [filter]);

    const onConfirm = (e) => {
        setFilter(e);
        setShowFilter(false);
    };

    const dataFilter = useMemo(() => {
        return {
            kycStatus: arrStatus.find((rs) => rs.value === filter.kycStatus)?.title,
            invitedAt: formatTime(filter.invitedAt, 'dd/MM/yyyy'),
            totalCommission: filter.range.startDate
                ? formatTime(filter.range.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(filter.range.endDate, 'dd/MM/yyyy')
                : null
        };
    }, [filter]);

    return (
        <div className="px-4">
            {showFilter && (
                <FilterModal isVisible={showFilter} onClose={() => setShowFilter(false)} onConfirm={onConfirm} t={t} filter={filter} arrStatus={arrStatus} />
            )}
            <CollapsibleRefCard title={title[language]}>
                <div className="w-auto">
                    <div className="flex flex-wrap gap-2">
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            <FilterIcon /> {t('common:filter')}
                        </FilterContainer>
                        {dataFilter.invitedAt && <FilterContainer onClick={() => setShowFilter(true)}>Ngày giới thiệu: {dataFilter.invitedAt}</FilterContainer>}
                        <FilterContainer onClick={() => setShowFilter(true)}>Tình trạng: {dataFilter.kycStatus}</FilterContainer>
                        {dataFilter.totalCommission && (
                            <FilterContainer onClick={() => setShowFilter(true)}>Tổng HH: {dataFilter.totalCommission}</FilterContainer>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    {dataSource.length <= 0 && !loading ? (
                        <TableNoData />
                    ) : (
                        dataSource.map((data, index) => {
                            const status = arrStatus.find((rs) => rs.value === data.kycStatus)?.title;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col justify-center items-start">
                                            <div className="leading-6 font-semibold text-sm text-darkBlue flex gap-1 items-center">
                                                {data.code} {ReferralLevelIcon(data.rank)}
                                            </div>
                                            <div className="leading-[14px] font-medium text-xs text-gray-1">
                                                Ngày giới thiệu: {formatTime(data.invitedAt, 'dd/MM/yyyy')}
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                'px-2 py-1 rounded-md font-semibold text-sm leading-6',
                                                data.kycStatus === 2 ? 'text-teal bg-teal/[.05]' : 'text-gray-1 bg-gray-1/[.05]'
                                            )}
                                        >
                                            {status}
                                        </div>
                                    </div>
                                    <div className="my-3 py-2 rounded-md border-[1px] border-gray-2/[.15] flex">
                                        <div className="w-full text-center border-r-[1px] text-sm font-medium">
                                            <div className="text-gray-1 leading-5">Đã giới thiệu</div>
                                            <div className="text-darkBlue leading-6">
                                                {t('common:users', {
                                                    value: formatNumber(data.invitedCount)
                                                })}
                                            </div>
                                        </div>
                                        <div className="w-full text-center text-sm font-medium">
                                            <div className="text-gray-1 leading-5">Tỷ lệ hoa hồng</div>
                                            <div className="text-darkBlue leading-6">{formatNumber(data.rate)}%</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium flex flex-col gap-1">
                                        <div className="flex justify-between w-full">
                                            <div className="flex items-center space-x-2">
                                                <span>Tổng hoa hồng trực tiếp</span>
                                                <div data-tip="1231312" data-for="liquidate-fee">
                                                    <img src={getS3Url('/images/icon/ic_help.png')} height={12} width={12} />
                                                </div>
                                                <Tooltip id="liquidate-fee" place="top" effect="solid" />
                                            </div>
                                            <div className="text-teal">
                                                +{formatNumber(data?.directCommission)} {data.symbol} VNDC
                                            </div>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <div className="flex items-center space-x-2">
                                                <span>hoa hồng gián tiếp</span>
                                                <div data-tip="1231312" data-for="liquidate-fee">
                                                    <img src={getS3Url('/images/icon/ic_help.png')} height={12} width={12} />
                                                </div>
                                                <Tooltip id="liquidate-fee" place="top" effect="solid" />
                                            </div>
                                            <div className="text-teal">
                                                +{formatNumber(data?.undirectCommission)} {data.symbol} VNDC
                                            </div>
                                        </div>
                                    </div>
                                    {dataSource.length === index + 1 ? null : <Line className="my-4" />}
                                </div>
                            );
                        })
                    )}
                </div>
            </CollapsibleRefCard>
        </div>
    );
};

const FilterModal = ({ isVisible, onClose, onConfirm, t, filter, arrStatus }) => {
    const [state, setState] = useState(filter);

    const onChange = (key, value) => {
        setState({ ...state, [key]: value });
    };

    const _onConfirm = () => {
        onConfirm(state);
    };

    return (
        <PopupModal isVisible={isVisible} onBackdropCb={onClose} title="Lọc kết quả" contentClassname="px-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>Ngày giới thiệu</div>
                    <DatePicker isCalendar date={state.invitedAt} onChange={(e) => onChange('invitedAt', e)} />
                </div>
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>Tổng hoa hồng theo thời gian</div>
                    <DatePicker date={state.range} onChange={(e) => onChange('range', e.selection)} />
                </div>
                <div className="flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1 mb-4">
                    <div>Tình trạng</div>
                    <div className="flex">
                        <FilterTabs
                            className="!px-4 !py-3 !font-medium !text-sm whitespace-nowrap"
                            tabs={arrStatus}
                            type={state.kycStatus}
                            setType={(e) => onChange('kycStatus', e)}
                        />
                    </div>
                </div>
                <RefButton onClick={_onConfirm} title={t('common:confirm')} />
            </div>
        </PopupModal>
    );
};

export default FriendList;
