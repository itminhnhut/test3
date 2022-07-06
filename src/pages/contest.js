import React from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import ContestInfo from 'components/screens/Nao/Contest/ContestInfo';
import ContestPerRanks from 'components/screens/Nao/Contest/ContestPerRanks';

const Contest = () => {
    return (
        <LayoutNaoToken>
            <div className="nao_section">
                <ContesRules />
                <ContestInfo />
                <ContestPerRanks />
            </div>
        </LayoutNaoToken>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao'
        ])),
    },
})

export default Contest;