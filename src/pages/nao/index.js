import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LayoutNaoToken from "components/common/layouts/LayoutNaoToken";
import NaoInfo from "components/screens/Nao/Section/NaoInfo";
import NaoPerformance from "components/screens/Nao/Section/NaoPerformance";
import NaoPool from "components/screens/Nao/Section/NaoPool";
import NaoProposals from "components/screens/Nao/Section/NaoProposals";
import fetchApi from "utils/fetch-api";
import { API_POOL_AMM, API_POOL_INFO } from "redux/actions/apis";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import ContesRules from "components/screens/Nao/Contest/ContesRules";
import { SectionNao } from "components/screens/Nao/NaoStyle";

const getAssetNao = createSelector(
    [(state) => state.utils.assetConfig, (utils, params) => params],
    (assets, params) => {
        return assets.find((rs) => rs.assetCode === params);
    }
);

const NaoDashboard = () => {
    const [dataSource, setDataSource] = useState([]);
    const [ammData, setAmmData] = useState(null);
    const assetNao = useSelector((state) => getAssetNao(state, "NAO"));

    useEffect(() => {
        getStake();
        getPoolAmm();
    }, []);

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_INFO,
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
                url: API_POOL_AMM,
            });
            if (data) {
                setAmmData(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const onDownload = (key) => {
        let url = "";
        switch (key) {
            case "app_store":
                url =
                    "https://apps.apple.com/us/app/onus-invest-btc-eth-doge/id1498452975";
                break;
            case "google_play":
                url = "https://play.google.com/store/apps/details?id=com.vndc";
                break;
            default:
                break;
        }
        window.open(url, "_blank");
    };

    return (
        <LayoutNaoToken>
            <div className="nao_section">
                <NaoInfo
                    dataSource={dataSource}
                    assetNao={assetNao}
                    ammData={ammData}
                />
                <NaoPerformance />
                <NaoPool dataSource={dataSource} assetNao={assetNao} />
                <NaoProposals dataSource={dataSource} assetNao={assetNao} />

                <section id="nao_pool" className="pt-10 sm:pt-20">
                    <SectionNao
                        noBg
                        className="px-6 sm:px-10 rounded-xl min-w-full sm:min-w-[372px] flex flex-col justify-between flex-1 relative"
                    >
                        <ContesRules inHome={true} />
                    </SectionNao>
                </section>
            </div>
        </LayoutNaoToken>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "nao"])),
    },
});
export default NaoDashboard;
