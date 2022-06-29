import React from 'react';
import styled from 'styled-components';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import NaoInfo from 'components/screens/Nao/Section/NaoInfo';
import NaoPerformance from 'components/screens/Nao/Section/NaoPerformance';
import NaoPool from 'components/screens/Nao/Section/NaoPool';
import NaoToken from 'components/screens/Nao/Section/NaoToken';
import { getS3Url } from 'redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';

const NaoDashboard = () => {
    const { width } = useWindowSize();
    return (
        <LayoutNaoToken>
            <Background width={width}>
                <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto">
                    <NaoHeader />
                    <div className="nao_section">
                        <NaoInfo />
                        <NaoPerformance />
                        <NaoPool />
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
    background-image:${({ width }) => `url(${getS3Url(`/images/nao/bg-dashboard${width <= 780 ? '_mb' : ''}.png`)})`};
    background-repeat: no-repeat;     
    background-size: cover;
    background-position: center top;
`
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao'
        ])),
    },
})
export default NaoDashboard;