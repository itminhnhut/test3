import React, { useState, useEffect, useRef } from 'react';
import { TextLiner, CardNao, Table, Column, Tooltip, capitalize, ImageNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_GET_CONTEST_REFERRAL } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { formatTime } from 'utils/reference-utils';
import TickFbIcon from 'components/svg/TickFbIcon';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import RePagination from 'components/common/ReTable/RePagination';

const ContestPerRanks = ({ previous, contestId, minVolumeInd, lastUpdated, top_ranks_per, userID }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(false);
    const lastUpdatedTime = useRef(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(limit);
    const isMobile = width <= 640;
    const limit = isMobile ? 10 : 20;
    const rank = 'rank';

    useEffect(() => {
        setPage(1);
        setPageSize(limit);
    }, [isMobile]);

    useEffect(() => {
        getRanks();
    }, [contestId]);

    const onReadMore = () => {
        setPageSize((old) => {
            const newSize = pageSize + limit;
            return newSize >= dataSource.length ? dataSource.length : newSize;
        });
    };

    const getRanks = async () => {
        try {
            const { data: originalData, status } = await fetchApi({
                url: API_GET_CONTEST_REFERRAL,
                params: { contestId }
            });
            const data = originalData?.users;
            setTotal(data.length);
            if (data && status === ApiStatus.SUCCESS) {
                if (originalData?.last_time_update) lastUpdatedTime.current = originalData?.last_time_update;
                const dataFilter = data.filter((rs) => rs?.[rank] > 0 && rs?.[rank] < 4);
                const sliceIndex = dataFilter.length > 3 ? 3 : dataFilter.length;
                const _top3 = data.slice(0, sliceIndex);
                const _dataSource = data.slice(sliceIndex);
                setTop3(_top3);
                setDataSource(_dataSource);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderName = (data, item) => {
        return (
            <div className="flex items-center space-x-3">
                <ImageNao className="rounded-full object-cover w-6 h-6" src={item?.avatar} alt="" width={24} height={24} />
                <div>{capitalize(data)}</div>
                {item?.is_onus_master && <TickFbIcon size={16} />}
            </div>
        );
    };

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                {data && data <= top_ranks_per ? (
                    <>
                        <img src={getS3Url('/images/nao/contest/ic_top_teal.png')} className="w-6 h-6" width="24" height="24" alt="" />
                        <span className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">
                            {item?.rowIndex + 4}
                        </span>
                    </>
                ) : (
                    <span>{_rank}</span>
                )}
            </div>
        );
    };

    const dataFilter = dataSource.slice((page - 1) * pageSize, page * pageSize);

    return (
        <section className="contest_individual_ranks">
            {minVolumeInd && (
                <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]" arrowColor="transparent" id="tooltip-personal-rank">
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                            __html: minVolumeInd?.isHtml ? t('nao:contest:tooltip_personal', { value: minVolumeInd[language] }) : minVolumeInd[language]
                        }}
                    ></div>
                </Tooltip>
            )}
            <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]" arrowColor="transparent" id="tooltip-friends"></Tooltip>
            <div className="flex justify-between flex-wrap gap-4 text-sm sm:text-base mb-8">
                <div className="flex items-center space-x-2">
                    <TextLiner className="!text-txtPrimary dark:!text-txtPrimary-dark">{t('nao:contest:referral:ranking')}</TextLiner>
                    {minVolumeInd && (
                        <div data-tip={''} data-for="tooltip-personal-rank" className="cursor-pointer">
                            <QuestionMarkIcon isFilled size={16} />
                        </div>
                    )}
                </div>
            </div>

            {top3.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm sm:text-base mb-3 sm:mb-6">
                    {top3.map((item, index) => (
                        <CardNao key={index} className="!p-4 sm:!p-5 space-y-7 sm:!min-h-[160px] border border-divider dark:border-none">
                            <div className="flex items-center justify-between flex-1">
                                <div className="flex items-center space-x-4">
                                    <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                        <ImageNao className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                    </div>
                                    <div className="sm:space-y-[2px] flex flex-col">
                                        <div className="flex items-center gap-2 text-lg font-semibold capitalize">
                                            <span title={capitalize(item?.name)} className="sm_only:max-w-[200px] xl:max-w-[200px] truncate">
                                                {capitalize(item?.name)}
                                            </span>
                                            {item?.is_onus_master && <TickFbIcon size={16} />}
                                        </div>
                                        <span className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">{item?.[userID]}</span>
                                    </div>
                                </div>
                                <div className="text-5xl sm:text-6xl font-semibold pb-0 italic">{item?.[rank] > 0 ? `#${index + 1}` : '-'}</div>
                            </div>
                            <div className="flex flex-col mt-auto space-y-1 rounded-lg">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:referral:number_of_friends')}</div>
                                    <span className="font-semibold">{formatNumber(item?.total, 0)}</span>
                                </div>
                            </div>
                        </CardNao>
                    ))}
                </div>
            )}
            {width <= 640 ? (
                <>
                    {Array.isArray(dataSource) && dataSource?.length > 0 ? (
                        dataFilter.map((item, index) => {
                            return (
                                <CardNao key={index} className={`flex gap-4 sm:gap-6 p-4 mt-3 border border-divider dark:border-none`}>
                                    <div className="flex-1 text-sm sm:text-base space-y-7">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                                    <ImageNao className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <label className="font-semibold capitalize max-w-[200px] truncate">{capitalize(item?.name)}</label>
                                                        {item?.is_onus_master && <TickFbIcon size={16} />}
                                                    </div>
                                                    <div className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">ID: {item?.[userID]}</div>
                                                </div>
                                            </div>
                                            <div className="min-w-[24px] text-txtSecondary dark:text-txtSecondary-dark">
                                                {loading ? (
                                                    <Skeletor width={24} height={24} circle />
                                                ) : item?.[rank] && item?.[rank] <= top_ranks_per ? (
                                                    <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                                                        <img
                                                            src={getS3Url('/images/nao/contest/ic_top_teal.png')}
                                                            className="w-6 h-6"
                                                            width="24"
                                                            height="24"
                                                            alt=""
                                                        />
                                                        <span className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">
                                                            {index + 4}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    item?.[rank] || null
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {t('nao:contest:referral:number_of_friends')}
                                            </label>
                                            <span className="text-right">{formatNumber(item?.total, 0)}</span>
                                        </div>
                                    </div>
                                </CardNao>
                            );
                        })
                    ) : (
                        <div className={`flex items-center justify-center flex-col m-auto pt-8`}>
                            <div className="block dark:hidden">
                                <NoDataLightIcon />
                            </div>
                            <div className="hidden dark:block">
                                <NoDataDarkIcon />
                            </div>
                            <div className="mt-1 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:no_rank')}</div>
                        </div>
                    )}
                </>
            ) : (
                <div className="dark:bg-dark-4 rounded-xl border border-divider dark:border-none">
                    <Table
                        loading={loading}
                        noItemsMessage={t('nao:contest:no_rank')}
                        dataSource={dataFilter}
                        classWrapper="!text-sm sm:!text-base !mt-0"
                        classHeader="!py-6 dark:!pt-10 !text-sm"
                    >
                        <Column
                            minWidth={50}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                            title={t('nao:contest:rank')}
                            fieldName={rank}
                            cellRender={renderRank}
                        />
                        <Column minWidth={300} className="font-semibold capitalize" title={t('nao:contest:name')} fieldName="name" cellRender={renderName} />
                        <Column minWidth={150} className="text-txtPrimary dark:text-txtPrimary-dark" title={'Nami ID'} fieldName={userID} />
                        <Column
                            minWidth={100}
                            align="left"
                            className=""
                            title={
                                <div className="flex itmes-center space-x-2">
                                    <span>{t('nao:contest:referral:number_of_friends')}</span>
                                    <div
                                        data-tip={t('nao:contest:referral:tooltip_friends')}
                                        data-for="tooltip-friends"
                                        className="cursor-pointer flex items-center justify-center"
                                    >
                                        <QuestionMarkIcon isFilled size={16} />
                                    </div>
                                </div>
                            }
                            decimal={0}
                            fieldName="total"
                        />
                    </Table>
                    {total > 1 && (
                        <div className="w-full hidden sm:flex justify-center py-8">
                            <RePagination onusMode total={total} current={page} pageSize={pageSize} onChange={(page) => setPage(page)} name="" />
                        </div>
                    )}
                </div>
            )}
            {lastUpdated && lastUpdatedTime.current && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 10 })}: {formatTime(lastUpdatedTime.current, 'HH:mm:ss DD/MM/YYYY')}
                </div>
            )}
            {isMobile && pageSize < dataSource.length && (
                <div className="w-fit block sm:hidden m-auto text-teal font-semibold mt-6" onClick={onReadMore}>
                    {t('common:read_more')}
                </div>
            )}
        </section>
    );
};

export default ContestPerRanks;
