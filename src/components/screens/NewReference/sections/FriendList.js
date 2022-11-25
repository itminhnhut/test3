import React, { useEffect, useRef, useState, Fragment, useMemo } from 'react';
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { FilterTabs, Line, NoData, RefButton } from '..';
import ReferralLevelIcon from '../../../svg/RefIcons';
import PopupModal from '../PopupModal';
import DatePicker from '../../../common/DatePicker/DatePicker';
import fetchApi from 'utils/fetch-api';
import { API_GET_LIST_FRIENDS } from 'redux/actions/apis';
import RePagination from 'components/common/ReTable/RePagination';
import { Code } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import { commisionConfig } from 'config/referral';

const title = {
    en: 'Friend List',
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
    const [page, setPage] = useState(1)
    const [dataSource, setdataSource] = useState({
        results: [],
        hasNext: false,
        total: 0
    });
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
                params: {
                    ...params,
                    limit: 6,
                    skip: 6 * (page - 1)
                }
            });
            if (data) {
                setdataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListFriends();
    }, [filter, page]);

    return (
        <div className="px-4 w-screen"  >
            {/* {showAllData && (
                <AllDataModal
                    onClose={() => setShowAllData(false)}
                    language={language}
                    isAll
                    dataSource={dataSource}
                    arrStatus={arrStatus}
                    filter={filter}
                    setFilter={setFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    loading={loading}
                />
            )} */}
            <ListData
                dataSource={dataSource.results}
                total={dataSource.total}
                setPage={setPage}
                page={page}
                arrStatus={arrStatus}
                filter={filter}
                setFilter={setFilter}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                loading={loading}
            />
        </div>
    );
};

const commissionType = {
    spot: 'Giao ngay',
    futures: 'Futures',
    swap: 'Quy đổi',
    staking: 'Staking'
}

const ListData = ({ total, dataSource, arrStatus, filter, setFilter, showFilter, setShowFilter, loading, isAll, setPage, page }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const onConfirm = (e) => {
        setFilter(e);
        setShowFilter(false);
    };

    const general = useMemo(() => {
        return {
            kycStatus: arrStatus.find((rs) => rs.value === filter.kycStatus)?.title,
            invitedAt: formatTime(filter.invitedAt, 'dd/MM/yyyy'),
            totalCommission: filter.range.startDate
                ? formatTime(filter.range.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(filter.range.endDate, 'dd/MM/yyyy')
                : null
        };
    }, [filter]);

    const dataFilter = useMemo(() => {
        return isAll ? dataSource : dataSource.slice(0, 10);
    }, [dataSource, isAll]);

    return (
        <>
            {showFilter && (
                <FilterModal isVisible={showFilter} onClose={() => setShowFilter(false)} onConfirm={onConfirm} t={t} filter={filter} arrStatus={arrStatus} />
            )}
            <CollapsibleRefCard title={title[language]} wrapperClassName={isAll ? '!p-0' : ''} isTitle={!isAll}>
                <div className="w-auto">
                    {dataSource.length ? <div className="flex flex-wrap gap-2">
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            <FilterIcon /> {t('common:filter')}
                        </FilterContainer>
                        {general.invitedAt && (
                            <FilterContainer onClick={() => setShowFilter(true)}>
                                {t('reference:referral.referral_date')}: {general.invitedAt}
                            </FilterContainer>
                        )}
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            {t('reference:referral.status')}: {general.kycStatus}
                        </FilterContainer>
                        {general.totalCommission && <FilterContainer onClick={() => setShowFilter(true)}>Tổng HH: {general.totalCommission}</FilterContainer>}
                    </div> : null}
                </div>
                <div className="mt-6">
                    {dataSource.length <= 0 && !loading ? (
                        <NoData text={t('reference:referral.no_friends')} className='h-[300px]' />
                    ) : (
                        dataFilter.map((data, index) => {
                            const status = arrStatus.find((rs) => rs.value === data.kycStatus)?.title;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col justify-center items-start">
                                            <div className="leading-6 font-semibold text-sm text-darkBlue flex gap-1 items-center">
                                                {/* {data.code} {ReferralLevelIcon(data.rank)} */}
                                                {data.code} <div data-tip="" data-for={'info' + data.code} data-offset="{'left': 16}">
                                                    <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
                                                </div>
                                                <Tooltip id={'info' + data.code} place="top" data-offset="{'left': 16}" effect="solid" className='w-[calc(100vw-32px)] !left-4 !p-0'>
                                                    <div className='w-full pt-6 pb-2 px-3 font-semibold text-base'>
                                                        <div className='w-full rounded-md border-[1px] border-teal h-10 flex items-center justify-center'>
                                                            {data.code}
                                                        </div>
                                                        <div className='mt-4'>
                                                            <div className='text-teal'>
                                                                Tỷ lệ hoa hồng trực tiếp
                                                            </div>
                                                            <div className='text-darkBlue font-medium text-xs flex'>
                                                                {Object.values(commisionConfig[data?.rank ?? 1]?.direct).map(config => {
                                                                    return (
                                                                        <span>{}{config.direct}</span>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="leading-[14px] font-medium text-xs text-gray-1">
                                                {t('reference:referral.referral_date')}: {formatTime(data.invitedAt, 'dd/MM/yyyy')}
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
                                            <div className="text-gray-1 leading-5">{t('reference:referral.referred')}</div>
                                            <div className="text-darkBlue leading-6">
                                                {formatNumber(data.invitedCount)} {t('reference:referral.friends')}
                                            </div>
                                        </div>
                                        <div className="w-full text-center text-sm font-medium">
                                            <div className="text-gray-1 leading-5">{t('reference:referral.commission_rate')}</div>
                                            <div className="text-darkBlue leading-6">{formatNumber(data.rate)}%</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium flex flex-col gap-1">
                                        <div className="flex justify-between w-full">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-1">{t('reference:referral.total_direct_commissions')}</span>
                                                <div data-tip="" data-for={'direct' + data.code}>
                                                    <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
                                                </div>
                                                <Tooltip id={'direct' + data.code} place="top" effect="solid">
                                                    <div className='flex flex-col w-full min-w-[120px]'>
                                                        <div className='flex justify-between w-full'><div className=''>VNDC</div> {formatNumber(data?.directCommission?.['72'], 2)}</div>
                                                        <div className='flex justify-between w-full'><div className=''>USDT</div> {formatNumber(data?.directCommission?.['22'], 2)}</div>
                                                        <div className='flex justify-between w-full'><div className=''>NAO</div> {formatNumber(data?.directCommission?.['447'], 2)}</div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="text-teal">
                                                +{formatNumber(data?.directCommission?.total)} {data.symbol} VNDC
                                            </div>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-1">{t('reference:referral.total_indirect_commissions')}</span>
                                                <div data-tip="" data-for={'indirect' + data.code}>
                                                    <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
                                                </div>
                                                <Tooltip id={'indirect' + data.code} place="top" effect="solid" arrowColor='#fff'>
                                                    <div className='flex flex-col w-full min-w-[120px] !bg-white'>
                                                        <div className='flex justify-between w-full'><div className=''>VNDC</div> {formatNumber(data?.indirectCommission?.['72'], 2)}</div>
                                                        <div className='flex justify-between w-full'><div className=''>USDT</div> {formatNumber(data?.indirectCommission?.['22'], 2)}</div>
                                                        <div className='flex justify-between w-full'><div className=''>NAO</div> {formatNumber(data?.indirectCommission?.['447'], 2)}</div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="text-teal">
                                                +{formatNumber(data?.undirectCommission?.total)} {data.symbol} VNDC
                                            </div>
                                        </div>
                                    </div>
                                    {dataSource.length === index + 1 ? null : <Line className="my-4" />}
                                </div>
                            );
                        })
                    )}
                </div>
                {/* {dataSource.length > 10 && !isAll && (
                    <div className="mt-6 text-center text-sm font-medium text-teal underline" onClick={() => onShowAll()}>
                        {t('common:show_more')}
                    </div>
                )} */}
                <div className='w-full flex justify-center items-center mt-8'>
                    <RePagination
                        total={total}
                        pageSize={6}
                        current={page}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            </CollapsibleRefCard>
        </>
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
        <PopupModal isVisible={isVisible} onBackdropCb={onClose} title="Lọc kết quả" useAboveAll contentClassname="px-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.referral_date')}</div>
                    <DatePicker isCalendar date={state.invitedAt} onChange={(e) => onChange('invitedAt', e)} />
                </div>
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.total_commissions')}</div>
                    <DatePicker date={state.range} onChange={(e) => onChange('range', e.selection)} />
                </div>
                <div className="flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1 mb-4">
                    <div>{t('reference:referral.status')}</div>
                    <div className="flex overflow-auto no-scrollbar">
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

const AllDataModal = ({ onClose, language, ...props }) => {
    return (
        <PopupModal isVisible={true} onBackdropCb={onClose} title={title[language]} useFullScreen>
            <ListData {...props} />
        </PopupModal>
    );
};


const Tooltip = ({ children, place, offset, arrowColor, className, ...restProps }) => {
    const ref = useRef()
    return (
        <ReactTooltip
            ref={ref}
            className={classNames('!bg-white !rounded-lg !opacity-100 !text-darkBlue !shadow-ref', className)}
            place={place}
            effect='solid'
            {...restProps}
        >
            {children}
        </ReactTooltip>
    )
}


export default FriendList;
