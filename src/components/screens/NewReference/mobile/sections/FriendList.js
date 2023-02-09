import React, { useEffect, useRef, useState, Fragment, useMemo } from 'react';
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../../CollapsibleRefCard';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { FilterTabs, Line, NoData, RefButton } from '..';
import PopupModal from '../../PopupModal';
import fetchApi from 'utils/fetch-api';
import { API_GET_LIST_FRIENDS } from 'redux/actions/apis';
import RePagination from 'components/common/ReTable/RePagination';
import { Code } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import { IconLoading } from 'components/common/Icons';
import colors from 'styles/colors';
import DatePicker from 'components/common/DatePicker/DatePicker';

const title = {
    en: 'Friend List',
    vi: 'Danh sách bạn bè'
};

const FriendList = ({ commisionConfig }) => {
    const { t } = useTranslation();
    const limit = 6;

    const arrStatus = [
        { title: t('common:all'), value: null },
        { title: t('reference:referral.not_kyc'), value: 0 },
        { title: t('reference:referral.pending_kyc'), value: 1 },
        { title: t('reference:referral.kyc'), value: 2 }
        // { title: t('reference:referral.not_kyc'), value: 3 },
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
    const [page, setPage] = useState(1);
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
            setLoading(true);
            const { data } = await fetchApi({
                url: API_GET_LIST_FRIENDS,
                params: {
                    ...params,
                    limit: limit,
                    skip: limit * (page - 1)
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
        <div className="px-4 w-screen">
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
                limit={limit}
                commisionConfig={commisionConfig}
            />
        </div>
    );
};

const ListData = ({ total, dataSource, arrStatus, filter, setFilter, showFilter, setShowFilter, loading, isAll, setPage, page, limit, commisionConfig }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const onConfirm = (e) => {
        setFilter(e);
        setShowFilter(false);
    };

    const commissionType = {
        0: t('reference:referral.commission_types.spot'),
        1: t('reference:referral.commission_types.futures'),
        2: t('reference:referral.commission_types.swap'),
        3: t('reference:referral.commission_types.staking')
    };

    const general = useMemo(() => {
        return {
            kycStatus: arrStatus.find((rs) => rs.value === filter.kycStatus)?.title ?? arrStatus[0].title,
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
            <CollapsibleRefCard title={title[language]} wrapperClassName={isAll ? '!p-0' : ''} isTitle={!isAll} isBlack>
                <div className="w-auto">
                    {true ? (
                        <div className="flex flex-wrap gap-2">
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
                            {general.totalCommission && (
                                <FilterContainer onClick={() => setShowFilter(true)}>Tổng HH: {general.totalCommission}</FilterContainer>
                            )}
                        </div>
                    ) : null}
                </div>
                <div className="mt-6">
                    {loading ? (
                        <IconLoading color={colors.teal} />
                    ) : dataSource.length <= 0 ? (
                        <NoData text={t('reference:referral.no_friends')} className="h-[300px]" />
                    ) : (
                        dataFilter.map((data, index) => {
                            const status = arrStatus.find((rs) => rs.value === data.kycStatus)?.title;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between text-gray-7">
                                        <div className="flex flex-col justify-center items-start">
                                            <div data-tip="" data-for={'info' + data.code} data-offset="{'left': 16}" className="border-b border-dashed border-gray-7 leading-[18px] font-semibold text-sm text-gray-6 flex gap-1 items-center">
                                                {/* {data.code} {ReferralLevelIcon(data.rank)} */}
                                                {data.code}
                                                <Tooltip
                                                    id={'info' + data.code}
                                                    place={index === 0 ? "bottom" : "top"}
                                                    data-offset="{'left': 16}"
                                                    effect="solid"
                                                    className={classNames('w-[calc(100vw-32px)] !left-4 !p-0', { '!mt-10': index === 0 })}
                                                >
                                                    <div className="w-full pt-6 pb-2 px-3 font-semibold text-base text-gray-6">
                                                        <div className="w-full rounded-md border-[1px] border-txtTextBtn h-10 flex items-center justify-center">
                                                            <div className="absolute top-[10px] p-1 text-xs font-medium text-gray-1 bg-dark-2">
                                                                Ref Code
                                                            </div>
                                                            <div className="font-semibold text-sm leading-6">{data.byRefCode}</div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="text-teal leading-6 font-semibold text-sm">
                                                                {t('reference:referral.direct_commissions_rate')}
                                                            </div>
                                                            <div className="font-medium text-xs flex flex-wrap">
                                                                {Object.values(commisionConfig[data?.rank ?? 1]?.direct).map((config, index) => {
                                                                    return (
                                                                        <span key={index} className="pr-2 mt-[2px] leading-6 font-medium text-xs">
                                                                            {commissionType[index]}: {config}%
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="text-teal leading-6 font-semibold text-sm">
                                                                {t('reference:referral.indirect_commissions_rate')}
                                                            </div>
                                                            <div className="font-medium text-xs flex flex-wrap">
                                                                {Object.values(commisionConfig[data?.rank ?? 1]?.indirect).map((config, index) => {
                                                                    return (
                                                                        <span key={index} className="pr-2 mt-[2px] leading-6 font-medium text-xs">
                                                                            {commissionType[index]}: {config}%
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="leading-[14px] font-medium text-xs mt-1">
                                                {t('reference:referral.referral_date')}: {formatTime(data.invitedAt, 'dd/MM/yyyy')}
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                'px-3 py-1 rounded-md font-normal text-xxs flex items-center',
                                                data.kycStatus === 2 ? 'text-teal bg-teal/[.05]' : 'text-gray-7 bg-gray-1/[.05]'
                                            )}
                                        >
                                            {data.kycStatus === 2 ? <CheckIcon className="mr-1" /> : null}
                                            {status}
                                        </div>
                                    </div>
                                    <div className="my-3 py-2 rounded-md border-[1px] border-dark-4 flex text-gray-7">
                                        <div className="w-full text-center border-r-[1px] border-dark-4 text-sm font-medium">
                                            <div className="leading-5">{t('reference:referral.referred')}</div>
                                            <div className="text-gray-6 leading-6 font-semibold">
                                                {formatNumber(data.invitedCount)} {t('reference:referral.friends')}
                                            </div>
                                        </div>
                                        <div className="w-full text-center text-sm font-medium">
                                            <div className="leading-5">{t('reference:referral.level')}</div>
                                            <div className="text-gray-6 leading-6 font-semibold">{formatNumber(data.rank ?? 0)}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium flex flex-col gap-1 text-gray-7">
                                        <div className="flex justify-between w-full">
                                            <div className="flex items-center space-x-2">
                                                <span data-tip="" data-for={'direct' + data.code} className="border-b border-dashed border-gray-7">{t('reference:referral.total_direct_commissions')}</span>
                                                {/* <div data-tip="" data-for={'direct' + data.code}>
                                                    <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
                                                </div> */}
                                                <Tooltip id={'direct' + data.code} place="top" effect="solid" arrowColor="#fff">
                                                    <div className="px-6 py-3 text-tiny !bg-dark-2 min-w-[120px] w-full">
                                                        <div className="mb-2 text-gray-7 font-semibold">
                                                            {t('reference:referral.total_direct_commissions')}:
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-gray-6">
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.directCommission?.['72'], 2)} VNDC
                                                            </div>
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.directCommission?.['22'], 2)} USDT
                                                            </div>
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.directCommission?.['1'], 2)} NAMI
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="text-teal font-semibold">
                                                ~ {formatNumber(data?.directCommission?.total)} {data.symbol} VNDC
                                            </div>
                                        </div>
                                        <div className="flex justify-between w-full text-gray-7">
                                            <div className="flex items-center space-x-2">
                                                <span data-tip="" data-for={'indirect' + data.code} className="border-b border-dashed border-gray-7">{t('reference:referral.total_indirect_commissions')}</span>
                                                <Tooltip id={'indirect' + data.code} place="top" effect="solid" arrowColor="#fff">
                                                    <div className="px-6 py-3 text-tiny !bg-dark-2 min-w-[120px] w-full">
                                                        <div className="mb-2 text-gray-7 font-semibold ">
                                                            {t('reference:referral.total_indirect_commissions')}
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-gray-6">
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.undirectCommission?.['72'], 2)} VNDC
                                                            </div>
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.undirectCommission?.['22'], 2)} USDT
                                                            </div>
                                                            <div className="flex items-center w-full h-6">
                                                                • {formatNumber(data?.undirectCommission?.['1'], 2)} NAMI
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className="text-teal font-semibold">
                                                ~ {formatNumber(data?.undirectCommission?.total)} {data.symbol} VNDC
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
                <div className="w-full flex justify-center items-center mt-8">
                    <RePagination total={total} pageSize={limit} current={page} onChange={(page) => setPage(page)} isNamiApp />
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
        <PopupModal isVisible={isVisible} onBackdropCb={onClose} title="Lọc kết quả" useAboveAll contentClassname="px-6" isMobile>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.referral_date')}</div>
                    <DatePicker
                        isCalendar
                        date={state.invitedAt}
                        onChange={(e) => onChange('invitedAt', e)}
                        wrapperClassname="bg-dark-2 text-gray-6 rounded-md"
                        isNamiApp
                    />
                </div>
                <div className="flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.total_commissions')}</div>
                    <DatePicker
                        date={state.range}
                        onChange={(e) => onChange('range', e.selection)}
                        wrapperClassname="bg-dark-2 text-gray-6 rounded-md"
                        isNamiApp
                    />
                </div>
                <div className="flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1 mb-4">
                    <div>{t('reference:referral.status')}</div>
                    <div className="flex overflow-auto no-scrollbar">
                        <FilterTabs
                            className="!text-sm whitespace-nowrap"
                            tabs={arrStatus}
                            type={state.kycStatus}
                            setType={(e) => onChange('kycStatus', e)}
                            isMobile
                        />
                    </div>
                </div>
                <RefButton onClick={_onConfirm} title={t('common:confirm')} />
            </div>
        </PopupModal>
    );
};

export const Tooltip = ({ children, place, offset, arrowColor, className, ...restProps }) => {
    const ref = useRef();
    return (
        <ReactTooltip
            ref={ref}
            className={classNames('!bg-hover-dark !rounded-lg !opacity-100 !text-gray-6 !shadow-ref !px-3', className)}
            place={place}
            effect="solid"
            {...restProps}
        >
            {children}
        </ReactTooltip>
    );
};

export const CheckIcon = ({ className }) => (
    <svg width="12" className={className} height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 1C3.243 1 1 3.243 1 6s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM5 8.207 3.144 6.354l.706-.708L5 6.793l2.646-2.647.708.708L5 8.207z"
            fill="#47CC85"
        />
    </svg>
);

export default FriendList;
