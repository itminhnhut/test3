import React, { useEffect, useState, forwardRef, useMemo } from 'react';
import { CardNao, TextLiner, ButtonNao, Tooltip, capitalize, TabsNao, TabItemNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import fetchApi from 'utils/fetch-api';
import { formatNumber } from 'redux/actions/utils';
import { API_CONTEST_GET_USER_DETAIL, API_CONTEST_GET_INVITES } from 'redux/actions/apis';
import CreateTeamModal from 'components/screens/Nao/Contest/season2/CreateTeamModal';
import { ApiStatus } from 'redux/actions/const';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import classnames from 'classnames';
import { getWeeksInRange } from './ContestWeekRanks';
import { useUpdateEffect } from 'react-use';
import { CopyIcon } from 'components/screens/NewReference/PopupModal';

// this code block is used for mocking data

// const mockUserData = {
//     group_name: 'group name',
//     time: 720.8,
//     name: 'user name',
//     onus_user_id: '6277729718175025054',
//     group_displaying_id: '452241',
//     total_order: 20,
//     total_pnl: 40000,
//     total_volume: 50000000,
//     individual_rank_pnl: 200000,
//     individual_rank_volume: 200,
//     pnl: 6.78,
//     invites: [
//         {
//             group_name: 'group name',
//             group_displaying_id: '452241',
//             leader_name: 'leader name',
//         },
//         {
//             group_name: 'group name',
//             group_displaying_id: '452241',
//             leader_name: 'leader name',
//         },
//         {
//             group_name: 'group name',
//             group_displaying_id: '452241',
//             leader_name: 'leader name',
//         },
//     ],
// };

const FILTER_STRUCTURE = [
    {
        id: 0,
        name: 'TOP_RACE_MONTH',
        localized: 'nao:this_month'
    },
    {
        id: 1,
        name: 'TOP_RACE_WEEK',
        localized: 'nao:this_week'
    }
];

const FilterTypes = ({ type, setType, types, t, className }) => {
    return (
        <div className={classnames('flex flex-wrap font-normal text-sm items-center gap-2', className)}>
            {types.map((e) => (
                <div
                    key={e.id}
                    className={classnames(
                        ` ${
                            type !== e.id && 'text-txtTextBtn-tonal_dark'
                        } flex w-fit items-center justify-center px-4 py-2 text-sm rounded-[800px] border-[1px] cursor-pointer whitespace-nowrap`,
                        {
                            'border-teal bg-teal bg-opacity-10 text-teal font-semibold': e.id === type,
                            'border-divider dark:border-divider-dark': e.id !== type
                        }
                    )}
                    onClick={() => setType(e.id)}
                >
                    {/* {e?.content[lang]} */}
                    {e.localized ? t(e.localized) : e.name}
                </div>
            ))}
        </div>
    );
};

const ContestInfo = forwardRef(
    (
        {
            onShowDetail,
            onShowInvitations,
            previous,
            contest_id,
            time_to_create,
            currencies,
            quoteAsset: q,
            hasTabCurrency,
            userID,
            weekly_contest_time,
            top_ranks_week
        },
        ref
    ) => {
        const {
            t,
            i18n: { language }
        } = useTranslation();
        const user = useSelector((state) => state.auth.user) || null;
        const [userData, setUserData] = useState(null);
        const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
        const [showGroupDetail, setShowGroupDetail] = useState(false);
        const [invitations, setInvitations] = useState(null);
        const [quoteAsset, setQuoteAsset] = useState(q);
        const [tabIndex, setTabIndex] = useState(0);
        const [isLoading, setIsLoading] = useState(false);

        const week = useMemo(() => {
            if (top_ranks_week && weekly_contest_time && weekly_contest_time.start && weekly_contest_time.end) {
                const { start, end } = weekly_contest_time;
                const weeks = getWeeksInRange(new Date(start), new Date(end));
                const now = Date.now();
                for (let i = 0; i < weeks.numWeeks; i++) {
                    const start = new Date(weeks.weeks[i].start).getTime();
                    const end = new Date(weeks.weeks[i].end).getTime();
                    if (now > start && now < end) {
                        return i + 1;
                    }
                }
            }
            return null;
        }, [weekly_contest_time]);

        useEffect(() => {
            if (user) {
                getData();
            }
        }, [user, contest_id, quoteAsset, tabIndex, week]);

        const getData = async () => {
            try {
                setIsLoading(true);
                let week_id = null;
                if (top_ranks_week && tabIndex && tabIndex !== 0) {
                    week_id = week;
                }

                const { data, status } = await fetchApi({
                    url: API_CONTEST_GET_USER_DETAIL,
                    options: { method: 'GET' },
                    params: { contest_id: contest_id, quoteAsset, week_id }
                });
                if (status === ApiStatus.SUCCESS) {
                    if (data?.pnl_rate) data.pnl = data.pnl_rate;
                    setUserData(data);
                    getInvites(data);
                }
            } catch (e) {
                console.error('__ error', e);
            } finally {
                setIsLoading(false);
            }
        };

        const getInvites = async (user) => {
            try {
                const { data, status } = await fetchApi({
                    url: API_CONTEST_GET_INVITES,
                    options: { method: 'GET' },
                    params: { contest_id: contest_id }
                });
                if (status === ApiStatus.SUCCESS) {
                    if (!user) setUserData(data);
                    setInvitations(data);
                }
            } catch (e) {
                console.error('__ error', e);
            } finally {
            }
        };

        const onShowCreate = (mode) => {
            if (mode) getData();
            setShowCreateTeamModal(!showCreateTeamModal);
        };

        const onShowGroupDetail = () => {
            setShowGroupDetail(!showGroupDetail);
        };

        useEffect(() => {
            if (previous) return;
            const el = document.querySelector('.nao_footer');
            if (el) {
                el.classList[userData?.group_name ? 'remove' : 'add']('sm:mb-0');
                el.classList[userData?.group_name ? 'remove' : 'add']('mb-[88px]');
            }
        }, [userData, previous]);

        const convertHours = (number) => {
            const remainder = number;
            const hours = Math.floor(remainder);
            const minutes = Math.floor(60 * (remainder - hours));
            return { hours, minutes };
        };

        const timer = useMemo(() => {
            return convertHours(userData?.time ?? 0);
        }, [userData]);

        const isValidCreate = useMemo(() => {
            if (!time_to_create) return false;
            const start = new Date(time_to_create?.start).getTime();
            const end = new Date(time_to_create?.end).getTime();
            const now = new Date().getTime();
            return start <= now && end >= now;
        }, [time_to_create]);

        if (!(user && userData)) return null;

        return (
            <>
                <section className="contest_info py-6 sm:pb-14">
                    {top_ranks_week && (
                        <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]" arrowColor="transparent" id="tooltip-contest-info-note">
                            <div className="text-sm">{t('nao:contest:personal_achievements_note')}</div>
                        </Tooltip>
                    )}
                    <div className="md:flex md:justify-between">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <TextLiner>{t('nao:contest:personal')}</TextLiner>
                                {top_ranks_week && (
                                    <div data-tip="" data-for="tooltip-contest-info-note" className="cursor-pointer md:hidden">
                                        <QuestionMarkIcon isFilled size={16} />
                                    </div>
                                )}
                            </div>
                            {!userData?.group_name && isValidCreate && (
                                <ButtonNao className="hidden sm:flex" onClick={() => onShowCreate()}>
                                    {t('nao:contest:create_team')}
                                </ButtonNao>
                            )}
                        </div>
                        {top_ranks_week && (
                            <div className="mt-6 md:mt-0">
                                <FilterTypes
                                    type={tabIndex}
                                    setType={(index) => {
                                        setTabIndex(index);
                                    }}
                                    types={[...FILTER_STRUCTURE]}
                                    t={t}
                                />
                            </div>
                        )}
                    </div>
                    {hasTabCurrency && (
                        <TabsNao className="text-sm sm:text-base">
                            {currencies.map((rs) => (
                                <TabItemNao onClick={() => setQuoteAsset(rs.value)} active={quoteAsset === rs.value}>
                                    {rs.label}
                                </TabItemNao>
                            ))}
                        </TabsNao>
                    )}
                    <div className="flex flex-col lg:flex-row flex-wrap gap-5 md:mt-9 sm:mt-6 mt-6 text-sm md:text-base">
                        <CardNao className={`px-4 py-6 md:!p-8 lg:!max-w-[375px] ${previous && contest_id !== 10 ? '' : '!justify-center space-y-3'}`}>
                            <label className="text-xl sm:text-2xl text-teal font-semibold leading-8 capitalize">{capitalize(userData?.name)}</label>
                            <div className="flex items-center w-full mb-2 !mt-6 gap-2">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm md:text-base">User ID: {userData?.[userID]}</span>
                                <CopyIcon data={userData?.[userID]} className="cursor-pointer" size={16} />
                            </div>
                            <div
                                className={`${
                                    invitations?.invites.length > 0 ? '' : 'hidden'
                                } text-txtSecondary dark:text-txtSecondary-dark flex flex-col items-start text-sm md:text-base`}
                            >
                                {previous && contest_id !== 10 && <div className="leading-6">ID: {userData?.[userID]}</div>}
                                {/* <span className="text-gray-15 dark:text-gray-7 mx-2 sm:hidden">•</span> */}
                                <div className="flex text-txtSecondary dark:text-txtSecondary-dark leading-6 mt-1 mb-2">
                                    {t('nao:contest:team_label')}:&nbsp;
                                    {userData?.group_name ? (
                                        <span
                                            onClick={() =>
                                                userData?.group_name &&
                                                onShowDetail({ displaying_id: userData?.group_displaying_id, ...userData }, null, quoteAsset)
                                            }
                                            className={`${userData?.group_name ? 'text-teal uppercase' : ''} font-semibold cursor-pointer`}
                                        >
                                            {userData?.group_name || t('nao:contest:not_invited')}
                                        </span>
                                    ) : invitations?.invites && invitations.invites.length !== 0 ? (
                                        <span
                                            className="text-teal font-semibold cursor-pointer underline"
                                            onClick={() => invitations && onShowInvitations(invitations.invites)}
                                        >
                                            {t('nao:contest:spending_invitations', { value: invitations.invites.length })}
                                        </span>
                                    ) : (
                                        <span className="">{t('nao:contest:no_invitation')}</span>
                                    )}
                                </div>
                            </div>
                        </CardNao>
                        <CardNao className="!min-h-[136px] !py-6 sm:!py-10 w-full lg:w-max px-4 md:!px-8 gap-3">
                            {/* {(!previous || contest_id === 10) && ( */}
                            <div className="flex items-center justify-between md:space-x-8 flex-wrap md:flex-nowrap gap-3 md:gap-0">
                                {/* <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">ID</label>
                                    <div className="font-semibold leading-8 text-right">{userData?.[userID]}</div>
                                </div> */}

                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</label>
                                    <div
                                        className={`font-semibold text-right`}
                                        dangerouslySetInnerHTML={{
                                            __html: t('nao:contest:date_2', {
                                                hours: timer?.hours,
                                                minutes: timer?.minutes
                                            })
                                        }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:trades')}</label>
                                    <div className="font-semibold text-right">{userData?.total_order ? formatNumber(userData?.total_order) : '-'}</div>
                                </div>
                            </div>
                            {/* )} */}

                            <div className="flex items-center justify-between md:space-x-8 flex-wrap md:flex-nowrap gap-3 md:gap-0">
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_pnl')}</label>
                                    <div
                                        className={`font-semibold text-right ${
                                            !!userData?.total_pnl && (userData?.total_pnl < 0 ? 'text-red-2' : 'text-teal')
                                        }`}
                                    >
                                        {userData?.total_pnl ? formatNumber(userData?.total_pnl, 0, 0, true) + ` ${quoteAsset}` : '-'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="flex items-center text-txtSecondary dark:text-txtSecondary-dark">
                                        {t('nao:contest:per_pnl')}
                                        {/* <div className="px-2 cursor-pointer" data-tip="" data-for="liquidate-fee" id="tooltip-liquidate-fee">
                                        <QuestionMarkIcon size={16} />
                                    </div>
                                    <Tooltip className="!p-[10px] sm:min-w-[282px] sm:!max-w-[282px]"
                                        arrowColor="transparent" id="liquidate-fee" >
                                        <div className="font-semibold text-sm text-gray-4 dark:text-white">
                                            {t('nao:contest:per_pnl_tooltip')}
                                        </div>
                                    </Tooltip> */}
                                    </label>
                                    <div className={`font-semibold text-right ${!!userData?.pnl && (userData?.pnl < 0 ? 'text-red-2' : 'text-teal')}`}>
                                        {userData?.pnl ? formatNumber(userData?.pnl, 2, 0, true) + '%' : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:space-x-8 flex-wrap md:flex-nowrap gap-3 md:gap-0">
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:pnl_rank')}</label>
                                    <div className="font-semibold text-right">{userData?.individual_rank_pnl ? '#' + userData?.individual_rank_pnl : '-'}</div>
                                </div>
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                    <div className="font-semibold text-right">
                                        {userData?.total_volume ? formatNumber(userData?.total_volume, 0, 0, true) + ` ${quoteAsset}` : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:space-x-8 flex-wrap md:flex-nowrap md:!mr-8 gap-3 md:gap-0">
                                <div className="flex items-center justify-between w-full md:w-1/2 my-1">
                                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume_rank')}</label>
                                    <div className="font-semibold text-right">
                                        {userData?.individual_rank_volume ? '#' + userData?.individual_rank_volume : '-'}
                                    </div>
                                </div>
                            </div>
                        </CardNao>
                    </div>
                </section>
                {showCreateTeamModal && <CreateTeamModal contest_id={contest_id} userData={userData} onClose={onShowCreate} onShowDetail={onShowDetail} />}
                {!userData?.group_name && isValidCreate && (
                    <div className="sm:hidden bottom-0 left-0 fixed bg-bgPrimary dark:bg-bgPrimary-dark px-4 py-6 z-10 w-full">
                        <ButtonNao onClick={() => onShowCreate()} className="!rounded-md">
                            {t('nao:contest:create_team')}
                        </ButtonNao>
                    </div>
                )}
            </>
        );
    }
);

export default ContestInfo;
