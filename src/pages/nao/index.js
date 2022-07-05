import React, { useState, useEffect } from 'react';
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
import fetchApi from 'utils/fetch-api';
import { API_POOL_INFO } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const getAssetNao = createSelector(
    [
        state => state.utils.assetConfig,
        (utils, params) => params
    ],
    (assets, params) => {
        return assets.find(rs => rs.assetCode === params);
    }
);

const NaoDashboard = () => {
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([])
    const assetNao = useSelector(state => getAssetNao(state, 'NAO'));

    useEffect(() => {
        getStake();
    }, [])

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_INFO,
            });
            if (data) {
                setDataSource(data)
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

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
    }

    return (
        <LayoutNaoToken>
            <Background width={width}>
                <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0">
                    <NaoHeader onDownload={onDownload} />
                    <div className="nao_section">
                        <NaoInfo dataSource={dataSource} assetNao={assetNao} />
                        <NaoPerformance />
                        <NaoPool dataSource={dataSource} assetNao={assetNao} />
                        <NaoToken onDownload={onDownload} />
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
