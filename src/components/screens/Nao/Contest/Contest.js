import React, { useState, useRef, useEffect, useMemo } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';
import ContestTeamRanks from 'components/screens/Nao/Contest/ContestTeamRanks';
import ContestDetail from 'components/screens/Nao/Contest/ContestDetail';
import InvitationsDetail from 'components/screens/Nao/Contest/season2/InvitationsDetail';
import { API_CONTEST_LAST_TIME_SCAN } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';

export const seasons = [
    {
        season: 1, start: '2022-07-07T17:00:00.000Z', end: '2022-07-27T17:00:00.000Z',
        contest_id: 4, button: 'nao:contest:last_season',
        title_detail: { vi: 'ONUS Futures mùa đầu tiên (đã kết thúc)', en: 'ONUS Futures Trading Contest Season 1 (Ended)' },
        title: { vi: 'Đua TOP giao dịch ONUS Futures mùa đầu tiên', en: 'ONUS Futures Trading Contest Season 1' },
        minVolumeInd: { vi: '1 tỷ VNDC', en: '1 billion VNDC' },
        minVolumeTeam: { vi: '5 tỷ VNDC', en: '5 billion VNDC' },
        rules: 'https://goonus.io/dang-ky-tham-gia-dua-top-onus-futures-mua-dau-tien',
        total_rewards: '300,000,000 VNDC', quoteAsset: 'VNDC',
        active: false
    },
    {
        season: 2, start: '2022-08-07T17:00:00.000Z', end: '2022-08-30T17:00:00.000Z',
        contest_id: 5,
        title_detail: { vi: 'ONUS Futures mùa hai (đã kết thúc)', en: 'ONUS Futures Trading Contest Season 2 (Ended)' },
        title: { vi: 'Đua TOP giao dịch ONUS Futures mùa hai', en: 'ONUS Futures Trading Contest Season 2' },
        minVolumeInd: { vi: '10 tỷ VNDC', en: '10 billion VNDC' },
        minVolumeTeam: { vi: '50 tỷ VNDC', en: '50 billion VNDC' },
        rules: 'https://goonus.io/onus-x-nami-dua-top-giao-dich-onus-futures-mua-02',
        total_rewards: '300,000,000 VNDC', quoteAsset: 'VNDC',
        active: false
    },
    {
        season: 3, start: '2022-09-04T17:00:00.000Z', end: '2022-10-02T17:00:00.000Z',
        contest_id: 6,
        title_detail: { vi: 'ONUS Futures USDT – Nami Championship mùa 1 (đang diễn ra)', en: 'ONUS Futures USDT – Nami Championship season 1 (Going on)' },
        title: { vi: 'Giải đấu ONUS Futures USDT – Nami Championship mùa 1', en: 'ONUS Futures USDT – Nami Championship season 1' },
        minVolumeInd: { vi: '50,000 USDT', en: '50,000 USDT' },
        minVolumeTeam: { vi: '50,000 USDT', en: '50,000 USDT' },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-usdt-nami-championship-mua-1',
        total_rewards: '30,000 USDT', quoteAsset: 'USDT',
        active: true
    },
    {
        season: 4, start: '2022-10-09T17:00:00.000Z', end: '2022-10-28T17:00:00.000Z',
        contest_id: 7,
        title_detail: { vi: 'ONUS Futures VNDC – Nami Championship mùa 1 (sắp diễn ra)', en: 'ONUS Futures VNDC – Nami Championship mùa 1 (Coming soon)' },
        title: { vi: 'Giải đấu ONUS Futures VNDC – Nami Championship mùa 1', en: 'ONUS Futures VNDC – Nami Championship season 1' },
        minVolumeInd: { vi: '1 tỷ VNDC', en: '1 billion VNDC' },
        minVolumeTeam: { vi: '10 tỷ VNDC', en: '10 billion VNDC' },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-vndc-nami-championship-mua-1',
        total_rewards: '1,000,000,000 VNDC', quoteAsset: 'VNDC',
        active: false
    },
]

const Contest = (props) => {
    const [showDetail, showShowDetail] = useState(false)
    const [showInvitations, showShowInvitationst] = useState(false)
    const [showAccept, showShowAccept] = useState(false)
    const [inviteDetail, setInviteDetail] = useState(null)
    const [lastUpdatedTime, setLastUpdatedTime] = useState(null)
    const refInfo = useRef(null);

    const sortName = useRef('volume');
    const rowData = useRef(null);
    const invitationsData = useRef(null);

    const onShowDetail = (e, sort) => {
        sortName.current = sort;
        rowData.current = e;
        showShowDetail(true)
    }

    const onShowInvitations = (e, data) => {
        invitationsData.current = e
        showShowInvitationst(true)
    }

    const showAcceptForm = (data) => {
        showShowInvitationst(false)
        setInviteDetail(data)
        showShowAccept(true)
    }

    const backInvitationsForm = () => {
        showShowInvitationst(true)
        setInviteDetail(null)
        showShowAccept(false)
    }

    const getInfo = () => {
        if (refInfo.current) refInfo.current.onGetInfo()
        showShowInvitationst(false);
    }

    const onCloseDetail = (key) => {
        if (key === 'trigger') {
            getInfo();
        }
        showShowDetail(false);
    }

    const renderLastUpdated = async (season) => {
        const {
            data,
            status
        } = await fetchApi({
            url: API_CONTEST_LAST_TIME_SCAN,
            params: { contest_id: season },
        });
        if (data?.time && status === ApiStatus.SUCCESS) {
            setLastUpdatedTime(data.time)
        }
    }

    // useEffect(() => {
    //     renderLastUpdated(6);
    // });

    const params = useMemo(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return {
            individual: urlParams.get('individual') !== 'pnl' ? 'volume' : 'pnl',
            team: urlParams.get('team') !== 'pnl' ? 'volume' : 'pnl'
        }
    }, [])

    return (
        <LayoutNaoToken>
            {showDetail && <ContestDetail {...props} rowData={rowData.current} sortName={sortName.current} onClose={onCloseDetail} />}
            {showInvitations && <InvitationsDetail {...props} onShowDetail={onShowDetail} getInfo={getInfo} data={invitationsData.current} onClose={() => showShowInvitationst(false)} />}
            <div className="nao_section">
                <ContesRules seasons={seasons} {...props} />
                <ContestInfo {...props} ref={refInfo} onShowDetail={onShowDetail} onShowInvitations={onShowInvitations} />
                <ContestPerRanks  {...props} lastUpdatedTime={lastUpdatedTime} params={params} sort={params.individual} />
                <ContestTeamRanks {...props} onShowDetail={onShowDetail} lastUpdatedTime={lastUpdatedTime} params={params} sort={params.team} />
            </div>
        </LayoutNaoToken>
    );
};

export default Contest;
