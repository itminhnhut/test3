import React from 'react';
import styled from 'styled-components';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import NaoInfo from 'components/screens/Nao/Section/NaoInfo';
import NaoPlatform from 'components/screens/Nao/Section/NaoPlatform';
import NaoGov from 'components/screens/Nao/Section/NaoGov';
import NaoToken from 'components/screens/Nao/Section/NaoToken';
import { getS3Url } from 'redux/actions/utils';
const NaoDashboard = () => {
    return (
        <LayoutNaoToken>
            <Background>
                <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto">
                    <NaoHeader />
                    <div className="nao_section">
                        <NaoInfo />
                        <NaoPlatform />
                        <NaoGov />
                        <NaoToken />
                    </div>
                </div>
                <NaoFooter />
            </Background>
        </LayoutNaoToken>
    );
};
const Background = styled.div.attrs({
    className: 'min-w-full min-h-screen flex flex-col justify-between'
})`
    background-image:${() => `url(${getS3Url('/images/nao/bg-dashboard.png')})`};
    background-position: center;
    background-repeat: no-repeat;     
    background-size: cover;
`
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
        ])),
    },
})
export default NaoDashboard;