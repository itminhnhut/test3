import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import NaoInfo from 'components/screens/Nao/Section/NaoInfo';
import NaoPerformance from 'components/screens/Nao/Section/NaoPerformance';
import NaoPool from 'components/screens/Nao/Section/NaoPool';
import NaoProposals from 'components/screens/Nao/Section/NaoProposals';
import fetchApi from 'utils/fetch-api';
import { API_POOL_AMM, API_POOL_INFO } from 'redux/actions/apis';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { API_USER_VOTE } from 'redux/actions/apis';

import ContesRules from 'components/screens/Nao/Contest/ContesRules';
import { SectionNao } from 'components/screens/Nao/NaoStyle';
import { seasons } from 'components/screens/Nao/Contest/Contest';
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

const getAssetNao = createSelector([(state) => state.utils.assetConfig, (utils, params) => params], (assets, params) => {
    return assets.find((rs) => rs.assetCode === params);
});

const NaoDashboard = () => {
    const [dataSource, setDataSource] = useState([]);
    const [ammData, setAmmData] = useState(null);
    const assetNao = useSelector((state) => getAssetNao(state, 'NAO'));
    const [listProposal, setListProposal] = useState([]);

    useEffect(async () => {
        try {
            const res = await fetchApi({
                url: API_USER_VOTE,
                options: { method: 'GET' }
            });
            if (res && res.length) setListProposal(res);
        } catch (error) {
            console.log(error);
        }
    }, []);
    useEffect(() => {
        getStake();
        getPoolAmm();
    }, []);

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_INFO
            });
            if (data) {
                setDataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const getPoolAmm = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_AMM
            });
            if (data) {
                setAmmData(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const current = seasons.find((season) => season.active);

    return (
        <MaldivesLayout>
            <LayoutNaoToken isHeader={false}>
                <div className="min-h-screen">
                    {/* <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0">
                    <NaoHeader/>
                </div> */}
                    <div className="nao_section px-4 nao:p-0 max-w-screen-v3 w-full m-auto">
                        <NaoInfo dataSource={dataSource} assetNao={assetNao} ammData={ammData} />
                    </div>
                    <div className="bg-bgPrimary dark:bg-dark mt-6 sm:mt-0 rounded-t-3xl">
                        <div className="nao_section px-4 nao:p-0 max-w-screen-v3 w-full m-auto">
                            <NaoPerformance />
                            <NaoPool dataSource={dataSource} assetNao={assetNao} />
                            <NaoProposals listProposal={listProposal} assetNao={assetNao} />

                            <section id="nao_pool" className="pb-20 pt-12 sm:pt-20 sm:pb-[120px]">
                                <SectionNao
                                    noBg
                                    className="px-3 sm:px-10 rounded-xl min-w-full sm:min-w-[372px] flex flex-col justify-between flex-1 relative bg-bgPrimary dark:bg-bgPrimary-dark"
                                >
                                    <ContesRules season={current?.season ?? 1} seasons={seasons} {...current} inHome={true} />
                                </SectionNao>
                            </section>
                        </div>
                    </div>
                    {/* <NaoFooter noSpacingTop /> */}
                </div>
            </LayoutNaoToken>
        </MaldivesLayout>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao', 'navbar']))
    }
});
export default NaoDashboard;
