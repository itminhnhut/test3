import React, { useState, useRef } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';
import ContestTeamRanks from 'components/screens/Nao/Contest/ContestTeamRanks';
import ContestDetail from 'components/screens/Nao/Contest/ContestDetail';
import InvitationsDetail from 'components/screens/Nao/Contest/season2/InvitationsDetail';
import CreateTeamModal from 'components/screens/Nao/Contest/season2/CreateTeamModal';
import ConfirmJoiningTeam from 'components/screens/Nao/Contest/season2/ConfirmJoiningTeam';

const Contest = () => {
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
            {showDetail && <ContestDetail rowData={rowData.current} sortName={sortName.current} onClose={onCloseDetail} />}
            {showInvitations && <InvitationsDetail onShowDetail={onShowDetail} getInfo={getInfo} data={invitationsData.current} onClose={() => showShowInvitationst(false)} />}
            {/* {showAccept && <ConfirmJoiningTeam data={inviteDetail} onBack={() => backInvitationsForm()} onClose={() => {
                refInfo.current.onGetInfo()
                showShowAccept(false)
            }
            } />} */}
            <div className="nao_section">
                <ContesRules />
                <ContestInfo ref={refInfo} onShowDetail={onShowDetail} onShowInvitations={onShowInvitations} />
                <ContestPerRanks />
                <ContestTeamRanks onShowDetail={onShowDetail} />
            </div>
        </LayoutNaoToken>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao', 'error'
        ])),
    },
})

export default Contest;