import React, { useState, useRef } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';
import ContestTeamRanks from 'components/screens/Nao/Contest/ContestTeamRanks';
import ContestDetail from 'components/screens/Nao/Contest/ContestDetail';
import InvitationsDetail from 'components/screens/Nao/Contest/season2/InvitationsDetail';

export const seasons = [
    {
        season: 1, start: '2022-07-07T17:00:00.000Z', end: '2022-07-27T17:00:00.000Z',
        contest_id: 4, button: 'nao:contest:last_season', title: 'first',
        minVolumeInd: { vi: '1 tỷ VNDC', en: '1 billion VNDC' },
        minVolumeTeam: { vi: '5 tỷ VNDC', en: '5 billion VNDC' },
        rules: 'https://goonus.io/dang-ky-tham-gia-dua-top-onus-futures-mua-dau-tien',
        total_rewards: '300,000,000 VNDC', quoteAsset: 'VNDC'
    },
    {
        season: 2, start: '2022-08-07T17:00:00.000Z', end: '2022-08-30T17:00:00.000Z',
        contest_id: 5, title: 'second',
        minVolumeInd: { vi: '10 tỷ VNDC', en: '10 billion VNDC' },
        minVolumeTeam: { vi: '50 tỷ VNDC', en: '50 billion VNDC' },
        rules: 'https://goonus.io/onus-x-nami-dua-top-giao-dich-onus-futures-mua-02',
        total_rewards: '300,000,000 VNDC', quoteAsset: 'VNDC'
    },
    {
        season: 3, start: '2022-09-04T17:00:00.000Z', end: '2022-10-02T17:00:00.000Z',
        contest_id: 6, title: 'third',
        minVolumeInd: { vi: '50,000 USDT', en: '50,000 USDT' },
        minVolumeTeam: { vi: '50,000 USDT', en: '50,000 USDT' },
        rules: 'https://goonus.io/onus-x-nami-giai-dau-onus-futures-usdt-nami-championship-mua-1',
        total_rewards: '30,000 USDT', quoteAsset: 'USDT'
    },
]

const Contest = (props) => {
    const [showDetail, showShowDetail] = useState(false)
    const [showInvitations, showShowInvitationst] = useState(false)
    const [showAccept, showShowAccept] = useState(false)
    const [inviteDetail, setInviteDetail] = useState(null)
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

    return (
        <LayoutNaoToken>
            {showDetail && <ContestDetail {...props} rowData={rowData.current} sortName={sortName.current} onClose={onCloseDetail} />}
            {showInvitations && <InvitationsDetail {...props} onShowDetail={onShowDetail} getInfo={getInfo} data={invitationsData.current} onClose={() => showShowInvitationst(false)} />}
            <div className="nao_section">
                <ContesRules seasons={seasons} {...props} />
                <ContestInfo {...props} ref={refInfo} onShowDetail={onShowDetail} onShowInvitations={onShowInvitations} />
                <ContestPerRanks {...props} />
                <ContestTeamRanks {...props} onShowDetail={onShowDetail} />
            </div>
        </LayoutNaoToken>
    );
};

export default Contest;