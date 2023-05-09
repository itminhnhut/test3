import React, { useState, useRef, useEffect, useMemo } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';
import ContestTeamRanks from 'components/screens/Nao/Contest/ContestTeamRanks';
import ContestDetail from 'components/screens/Nao/Contest/ContestDetail';
import InvitationsDetail from 'components/screens/Nao/Contest/season2/InvitationsDetail';
import { API_CONTEST_LAST_TIME_SCAN, API_CONTEST_NAO_SPECIAL_RANK } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import ContestMasterRank from 'components/screens/Nao/Contest/ContestMasterRank';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

import Image from 'next/image';

import classNames from 'classnames';
import NaoHeader from '../NaoHeader';
const ListRankings = dynamic(() => import('./ListRankings'));
const currencies = [
    { label: 'VNDC', value: 'VNDC' },
    { label: 'USDT', value: 'USDT' }
];
export const seasons = [
    {
        season: 1,
        start: '2022-07-07T17:00:00.000Z',
        end: '2022-07-27T17:00:00.000Z',
        contest_id: 4,
        button: 'nao:contest:last_season',
        title_detail: { vi: 'NAO Futures mùa đầu tiên', en: 'NAO Futures Trading Contest Season 1' },
        title: { vi: 'Đua TOP giao dịch NAO Futures mùa đầu tiên', en: 'NAO Futures Trading Contest Season 1' },
        minVolumeInd: { vi: '1 tỷ VNDC', en: '1 billion VNDC', isHtml: true },
        minVolumeTeam: { vi: '5 tỷ VNDC', en: '5 billion VNDC', isHtml: true },
        rules: 'https://goonus.io/dang-ky-tham-gia-dua-top-onus-futures-mua-dau-tien',
        total_rewards: '300,000,000 VNDC',
        quoteAsset: 'VNDC',
        active: false,
        top_ranks_per: 10,
        top_ranks_team: 10
    },
    {
        season: 2,
        start: '2022-08-07T17:00:00.000Z',
        end: '2022-08-30T17:00:00.000Z',
        contest_id: 5,
        title_detail: { vi: 'NAO Futures mùa hai', en: 'NAO Futures Trading Contest Season 2' },
        title: { vi: 'Đua TOP giao dịch NAO Futures mùa hai', en: 'NAO Futures Trading Contest Season 2' },
        minVolumeInd: { vi: '10 tỷ VNDC', en: '10 billion VNDC', isHtml: true },
        minVolumeTeam: { vi: '50 tỷ VNDC', en: '50 billion VNDC', isHtml: true },
        rules: 'https://goonus.io/onus-x-nami-dua-top-giao-dich-onus-futures-mua-02',
        total_rewards: '300,000,000 VNDC',
        quoteAsset: 'VNDC',
        active: false,
        top_ranks_per: 10,
        top_ranks_team: 10
    },
    {
        season: 3,
        start: '2022-09-04T17:00:00.000Z',
        end: '2022-10-02T17:00:00.000Z',
        contest_id: 6,
        title_detail: { vi: 'NAO Futures USDT – Nami Championship mùa 1', en: 'NAO Futures USDT – Nami Championship Season 1' },
        title: { vi: 'Giải đấu NAO Futures USDT – Nami Championship mùa 1', en: 'NAO Futures USDT – Nami Championship Season 1' },
        minVolumeInd: { vi: '50,000 USDT', en: '50,000 USDT', isHtml: true },
        minVolumeTeam: { vi: '50,000 USDT', en: '50,000 USDT', isHtml: true },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-usdt-nami-championship-mua-1',
        total_rewards: '30,000 USDT',
        quoteAsset: 'USDT',
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10
    },
    {
        season: 4,
        start: '2022-09-30T17:00:00.000Z',
        end: '2022-10-28T17:00:00.000Z',
        contest_id: 7,
        title_detail: { vi: 'NAO Futures VNDC – Nami Championship mùa 1', en: 'NAO Futures VNDC – Nami Championship Season 1' },
        title: { vi: 'Giải đấu NAO Futures VNDC – Nami Championship mùa 1', en: 'NAO Futures VNDC – Nami Championship Season 1' },
        minVolumeInd: { vi: '1 tỷ VNDC', en: '1 billion VNDC', isHtml: true },
        minVolumeTeam: { vi: '10 tỷ VNDC', en: '10 billion VNDC', isHtml: true },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-1',
        total_rewards: '1,000,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2022-09-21T17:00:00.000Z', end: '2022-10-07T17:00:00.000Z' },
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10
    },
    {
        season: 5,
        start: '2022-10-31T17:00:00.000Z',
        end: '2022-11-29T17:00:00.000Z',
        contest_id: 8,
        title_detail: { vi: 'NAO Futures VNDC – Nami Championship mùa 2', en: 'NAO Futures VNDC – Nami Championship Season 2' },
        title: { vi: 'Giải đấu NAO Futures VNDC – Nami Championship mùa 2', en: 'NAO Futures VNDC – Nami Championship Season 2' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để được xếp hạng',
            en: 'Traders need to meet the Basic Conditions to be ranked. For details',
            isHtml: false
        },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-2',
        total_rewards: '1,000,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2022-10-25T17:00:00.000Z', end: '2022-11-09T17:00:00.000Z' },
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10
    },
    {
        season: 6,
        start: '2022-11-30T17:00:00.000Z',
        end: '2022-12-31T17:00:00.000Z',
        contest_id: 9,
        title_detail: { vi: 'NAO Futures VNDC – Nami Championship mùa 3', en: 'NAO Futures VNDC – Nami Championship Season 3' },
        title: { vi: 'Giải đấu NAO Futures VNDC – Nami Championship mùa 3', en: 'NAO Futures VNDC – Nami Championship Season 3' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để được xếp hạng',
            en: 'Traders need to meet the Basic Conditions to be ranked. For details',
            isHtml: false
        },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-3',
        total_rewards: '500,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2022-11-25T17:00:00.000Z', end: '2022-12-09T17:00:00.000Z' },
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10,
        top_ranks_master: 3
    },
    {
        season: 7,
        start: '2022-12-31T17:00:00.000Z',
        end: '2023-01-31T17:00:00.000Z',
        contest_id: 10,
        title_detail: { vi: 'NAO Futures VNDC – Nami Championship mùa 4', en: 'NAO Futures VNDC – Nami Championship Season 4' },
        title: { vi: 'NAO Futures VNDC', en: 'NAO Futures VNDC' },
        title_champion: { vi: 'Nami Championship mùa 4', en: 'Nami Championship Season 4' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để được xếp hạng',
            en: 'Traders need to meet the Basic Conditions to be ranked. For details',
            isHtml: false
        },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-nao-futures-vndc-nami-championship-mua-4',
        total_rewards: '1,000,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2022-12-28T17:00:00.000Z', end: '2023-01-08T17:00:00.000Z' },
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10,
        lastUpdated: true
    },
    {
        season: 8,
        start: '2023-02-05T17:00:00.000Z',
        end: '2023-03-05T17:00:00.000Z',
        contest_id: 11,
        title_detail: { vi: 'NAO Futures VNDC & USDT – Nami Championship mùa 5', en: 'NAO Futures VNDC & USDT – Nami Championship Season 5' },
        title: { vi: 'NAO Futures VNDC & USDT', en: 'NAO Futures VNDC & USDT' },
        title_champion: { vi: 'Nami Championship mùa 5', en: 'Nami Championship Season 5' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để được xếp hạng',
            en: 'Traders need to meet the Basic Conditions to be ranked. For details',
            isHtml: false
        },
        rules: {
            vi: 'https://goonus.io/onus-x-nami-giai-dau-nao-futures-vndc-usdt-nami-championship-mua-5',
            en: 'https://goonus.io/en/onus-x-nami-nao-futures-vndc-usdt-tournament-nami-championship-season-5'
        },
        total_rewards: '1,000,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2023-02-02T17:00:00.000Z', end: '2023-02-16T17:00:00.000Z' },
        active: false,
        top_ranks_per: 20,
        top_ranks_team: 10,
        lastUpdated: true,
        hasTabCurrency: true
    },
    {
        season: 9,
        start: '2023-03-05T17:00:00.000Z',
        end: '2023-03-31T17:00:00.000Z',
        contest_id: 12,
        title_detail: { vi: 'NAO Futures VNDC & USDT – Nami Championship mùa 6', en: 'NAO Futures VNDC & USDT – Nami Championship Season 6' },
        title: { vi: 'NAO Futures VNDC & USDT', en: 'NAO Futures VNDC & USDT' },
        title_champion: { vi: 'Nami Championship mùa 6', en: 'Nami Championship Season 6' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để được xếp hạng',
            en: 'Traders need to meet the Basic Conditions to be ranked. For details',
            isHtml: false
        },
        rules: {
            vi: 'https://goonus.io/onus-x-nami-giai-dau-nao-futures-vndc-usdt-nami-championship-mua-6',
            en: 'https://goonus.io/en/onus-x-nami-nao-futures-vndc-usdt-tournament-nami-championship-season-6'
        },
        total_rewards: '1,000,000,000 VNDC',
        quoteAsset: 'VNDC',
        time_to_create: { start: '2023-03-02T17:00:00.000Z', end: '2023-03-16T17:00:00.000Z' },
        active: true,
        top_ranks_per: 20,
        top_ranks_team: 10,
        lastUpdated: true,
        hasTabCurrency: true
    }
];

const CONTEST_ID_SPECIAL = 10;
const SEASON_SPECIAL = 7;

const initState = {
    tab: 'Contest Ranking',
    loadingSpecial: false,
    tab1: 'Contest Ranking',
    tab2: 'Special Awards'
};

const Contest = (props) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [showDetail, showShowDetail] = useState(false);
    const [showInvitations, showShowInvitationst] = useState(false);
    const [showAccept, showShowAccept] = useState(false);
    const [inviteDetail, setInviteDetail] = useState(null);
    const [lastUpdatedTime, setLastUpdatedTime] = useState(null);
    const refInfo = useRef(null);

    const sortName = useRef('volume');
    const rowData = useRef(null);
    const invitationsData = useRef(null);

    const [tab, setTab] = useState(initState.tab);
    const [data, setData] = useState([]);
    const [loadingSpecial, setLoadingSpecial] = useState(initState.loadingSpecial);

    const handleChangTab = async (value) => {
        setTab(value);
        setLoadingSpecial(!loadingSpecial);

        // ANCHOR VOL1: KLGD: 500,000,000,000 VNDC
        const rsKLGD5 = fetchApi({
            url: API_CONTEST_NAO_SPECIAL_RANK,
            params: { contest_id: CONTEST_ID_SPECIAL, type: 'VOL5' }
        });

        // ANCHOR VOL3: KLGD: 300,000,000,000 VNDC
        const rsKLGD3 = fetchApi({
            url: API_CONTEST_NAO_SPECIAL_RANK,
            params: { contest_id: CONTEST_ID_SPECIAL, type: 'VOL3' }
        });

        // ANCHOR VOL2: KLGD: 200,000,000,000 VNDC
        const rsKLGD2 = fetchApi({
            url: API_CONTEST_NAO_SPECIAL_RANK,
            params: { contest_id: CONTEST_ID_SPECIAL, type: 'VOL2' }
        });

        // ANCHOR VOL1: KLGD: 100,000,000,000 VNDC
        const rsKLGD1 = fetchApi({
            url: API_CONTEST_NAO_SPECIAL_RANK,
            params: { contest_id: CONTEST_ID_SPECIAL, type: 'VOL1' }
        });

        try {
            await Promise.all([rsKLGD5, rsKLGD3, rsKLGD2, rsKLGD1]).then((value) => setData(value));
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSpecial(initState.loadingSpecial);
        }
    };

    useEffect(() => {
        if (props.season === SEASON_SPECIAL && tab === initState.tab2) {
            setTab(initState.tab);
        }
    }, [props.season]);

    const onShowDetail = (e, sort, quoteAsset) => {
        sortName.current = sort;
        rowData.current = { ...e, quoteAsset };
        showShowDetail(true);
    };

    const onShowInvitations = (e, data) => {
        invitationsData.current = e;
        showShowInvitationst(true);
    };

    const showAcceptForm = (data) => {
        showShowInvitationst(false);
        setInviteDetail(data);
        showShowAccept(true);
    };

    const backInvitationsForm = () => {
        showShowInvitationst(true);
        setInviteDetail(null);
        showShowAccept(false);
    };

    const getInfo = () => {
        if (refInfo.current) refInfo.current.onGetInfo();
        showShowInvitationst(false);
    };

    const onCloseDetail = (key) => {
        if (key === 'trigger') {
            getInfo();
        }
        showShowDetail(false);
    };

    const renderLastUpdated = async (season) => {
        const { data, status } = await fetchApi({
            url: API_CONTEST_LAST_TIME_SCAN,
            params: { contest_id: season }
        });
        if (data?.time && status === ApiStatus.SUCCESS) {
            setLastUpdatedTime(data.time);
        }
    };

    // useEffect(() => {
    //     if (props?.lastUpdated) renderLastUpdated(props?.contest_id);
    // }, [props?.contest_id, props?.lastUpdated]);

    const showPnl = ![9, 10, 11, 12].includes(props?.contest_id);

    const params = useMemo(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return {
            individual: !showPnl ? 'volume' : urlParams.get('individual') !== 'pnl' ? 'volume' : 'pnl',
            team: !showPnl ? 'volume' : urlParams.get('team') !== 'pnl' ? 'volume' : 'pnl'
        };
    }, [props?.contest_id]);

    const [KLGD5, KLGD3, KLGD2, KLGD1] = data;

    const onDownload = (key) => {
        let url = '';
        switch (key) {
            case 'app_store':
                url = 'https://apps.apple.com/us/app/onus-invest-btc-eth-doge/id1498452975';
                break;
            case 'google_play':
                url = 'https://play.google.com/store/apps/details?id=com.vndc';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    };

    const renderTab = () => {
        return (
            <ul className="tabMenu">
                <li
                    className={classNames('font-semibold mr-4 text-xs sm:text-sm w-[34%] sm:w-[162px] sm:h-[72px] flex relative', {
                        active: tab === initState.tab1
                    })}
                    onClick={() => handleChangTab(initState.tab1)}
                >
                    {t('nao:contest:contest_ranking')}
                </li>
                <li
                    className={classNames('font-semibold text-xs sm:text-sm w-[60%] sm:w-[250px] sm:h-[72px] flex relative !pl-2 sm:!pl-8 !justify-start', {
                        active: tab === initState.tab2
                    })}
                    onClick={() => handleChangTab(initState.tab2)}
                >
                    {t('nao:contest:contest_special')}
                    <div className="wrapper_star right-0 absolute top-0 border-[#24E0CF] bg-bgNaoStart flex items-center border-solid rounded-b-xl py-1 px-[18px]">
                        <Image src={getS3Url('/images/contest/ic_star.png')} width="16px" height="16px" />
                        <div className="ml-2 font-semibold text-sm leading-6">HOT</div>
                    </div>
                </li>
                <li className="hidden lg:inline absolute right-0 top-0">
                    <Image src={getS3Url('/images/contest/bg_champion.png')} width="274px" height="187px" />
                </li>
            </ul>
        );
    };

    const renderContestRank = () => {
        return (
            <>
                {props.top_ranks_master && <ContestMasterRank {...props} onShowDetail={onShowDetail} lastUpdatedTime={lastUpdatedTime} sort="pnl" />}
                <ContestTeamRanks
                    {...props}
                    onShowDetail={onShowDetail}
                    lastUpdatedTime={lastUpdatedTime}
                    params={params}
                    sort={params.team}
                    showPnl={showPnl}
                    currencies={currencies}
                />
                <ContestPerRanks
                    {...props}
                    lastUpdatedTime={lastUpdatedTime}
                    params={params}
                    sort={params.individual}
                    showPnl={showPnl}
                    currencies={currencies}
                />
            </>
        );
    };
    const renderContentTab1 = () => {
        return (
            <section id="content1" className={`${tab === initState?.tab1 ? 'inline' : 'hidden'}`}>
                {renderContestRank()}
            </section>
        );
    };
    const renderContentTab2 = () => {
        return (
            <section id="content2" className={`${tab === initState?.tab2 ? 'inline' : 'hidden'}`}>
                <ListRankings data={KLGD5?.data || []} loading={loadingSpecial} />
                <ListRankings isList type="vol_3" data={KLGD3?.data || []} rank_metadata="vol_3" loading={loadingSpecial} />
                <ListRankings isList type="vol_2" data={KLGD2?.data || []} rank_metadata="vol_2" loading={loadingSpecial} />
                <ListRankings isList type="vol_1" data={KLGD1?.data || []} rank_metadata="vol_1" loading={loadingSpecial} />
            </section>
        );
    };
    return (
        <LayoutNaoToken isHeader={false}>
            {showDetail && <ContestDetail {...props} rowData={rowData.current} sortName={sortName.current} onClose={onCloseDetail} />}
            {showInvitations && (
                <InvitationsDetail
                    {...props}
                    onShowDetail={onShowDetail}
                    getInfo={getInfo}
                    data={invitationsData.current}
                    onClose={() => showShowInvitationst(false)}
                />
            )}
            <div className="min-h-screen">
                <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0">
                    <NaoHeader onDownload={onDownload} />
                </div>
                <div className="nao_section">
                    <div className="px-4 sm_only:pt-6">
                        <ContesRules seasons={seasons} seasonConfig={SEASON_SPECIAL} {...props} />
                    </div>
                    <div className="bg-gray-12 dark:bg-bgPrimary-dark rounded-t-3xl px-4">
                        <ContestInfo {...props} ref={refInfo} onShowDetail={onShowDetail} onShowInvitations={onShowInvitations} currencies={currencies} />
                        {props?.season == SEASON_SPECIAL ? (
                            <div className="tab1 overflow-hidden pt-[68px] lg:pt-[234px]">
                                {renderTab()}
                                {renderContentTab1()}
                                {renderContentTab2()}
                            </div>
                        ) : (
                            renderContestRank()
                        )}
                    </div>
                </div>
            </div>
        </LayoutNaoToken>
    );
};

export default Contest;
