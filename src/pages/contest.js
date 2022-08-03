import React, { useState, useRef } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';
import ContestTeamRanks from 'components/screens/Nao/Contest/ContestTeamRanks';
import ContestDetail from 'components/screens/Nao/Contest/ContestDetail';

const Contest = () => {
    const [showDetail, showShowDetail] = useState(false)
    const sortName = useRef('volume');
    const rowData = useRef(null);

    const onShowDetail = (e, sort) => {
        sortName.current = sort;
        rowData.current = e;
        showShowDetail(true)
    }

    return (
        <LayoutNaoToken>
            {showDetail && <ContestDetail rowData={rowData.current} sortName={sortName.current} onClose={() => showShowDetail(false)} />}
            <div className="nao_section">
                <ContesRules />
                <ContestInfo onShowDetail={onShowDetail} />
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