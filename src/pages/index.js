import React, { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken'
import NaoInfo from 'components/screens/Nao/Section/NaoInfo';
import NaoPerformance from 'components/screens/Nao/Section/NaoPerformance';
import NaoPool from 'components/screens/Nao/Section/NaoPool';
import NaoToken from 'components/screens/Nao/Section/NaoToken';
import fetchApi from 'utils/fetch-api';
import { API_POOL_INFO } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import { SectionNao } from '../components/screens/Nao/NaoStyle';
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
            <div className="nao_section">
                <NaoInfo dataSource={dataSource} assetNao={assetNao} />
                <NaoPerformance />
                <NaoPool dataSource={dataSource} assetNao={assetNao} />
                {/* <NaoToken onDownload={onDownload} /> */}
                <section id="nao_pool" className="pt-10 sm:pt-20">
                    <SectionNao noBg className="px-6 sm:px-10 rounded-xl min-w-full sm:min-w-[372px] flex flex-col justify-between flex-1 relative">
                        <ContesRules inHome={true}/>
                    </SectionNao>
                </section>

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
export default NaoDashboard;