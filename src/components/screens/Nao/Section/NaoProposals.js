import React, { useEffect, useState } from "react";
import {
    TextLiner,
    CardNao,
    Divider,
    ButtonNao,
    Tooltip,
    Progressbar,
} from "components/screens/Nao/NaoStyle";
import { useTranslation } from "next-i18next";
import { getS3Url } from "redux/actions/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { API_USER_VOTE } from "redux/actions/apis";
import FetchApi from "utils/fetch-api";
import { formatNumber } from "redux/actions/utils";

export default function NaoProposals({ listProposal, assetNao }) {
    const [dataUserVote, setDataUserVote] = useState("");

    async function fetchData() {
        try {
            const useVoteRes = await FetchApi({
                url: API_USER_VOTE + "/getuserpool",
                options: { method: "GET" },
            });
            console.log(useVoteRes);
            setDataUserVote(useVoteRes ?? []);
        } catch (error) {
            console.log(error);
        }
    }
    console.log(assetNao);
    useEffect(async () => {
        fetchData();
    }, []);
    const {
        t,
        i18n: { language },
    } = useTranslation();
    return (
        <section id="nao__proposals" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div>
                    <TextLiner className="normal-case">
                        {t("nao:proposals:title")}
                        {/* Proposals */}
                    </TextLiner>
                    <span className="text-nao-grey">
                        {t("nao:proposals:description")}
                        {/* Track proposal statuses and vote on changes. */}
                    </span>
                </div>
            </div>
            {listProposal.map((proposal, index) => {
                return (
                    <Proposal
                        key={index}
                        proposal={proposal}
                        language={language}
                        assetNao={assetNao}
                    />
                );
            })}
        </section>
    );
}
const Proposal = ({ proposal, language, assetNao }) => {
    const { voteName, totalPool, _id, totalVoteYes } = proposal;

    const router = useRouter();
    return (
        <CardNao
            className="mt-6 p-6 !sm:min-h-0 !min-h-0 cursor-pointer"
            onClick={() => {
                router.push(`/nao/vote/${_id}`);
            }}
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-1 flex-1 items-center">
                    <img
                        onClick={() => onNavigate(false)}
                        className="cursor-pointer h-[24px]"
                        src={getS3Url("/images/nao/ic_nao_radio.png")}
                    />
                    <span className="text-nao-text font-medium sm:text-lg ml-2">
                        {voteName && voteName[language]}
                    </span>
                </div>
                <div className="w-[340px]">
                    <div>
                        <span className="text-sm text-nao-grey leading-6">
                            Voted for:
                        </span>
                        <span className="font-semibold ml-2">
                            {totalVoteYes &&
                                formatNumber(
                                    totalVoteYes,
                                    assetNao?.assetDigit ?? 0
                                )}
                        </span>
                    </div>
                    <div className="bg-black mt-3 relative rounded-lg">
                        <img
                            src={getS3Url("/images/nao/ic_caret_down.png")}
                            className="absolute bottom-2 inset-x-1/2"
                        />
                        <img
                            src={getS3Url("/images/nao/ic_caret_up.png")}
                            className="absolute top-2 inset-x-1/2"
                        />
                        <Progressbar
                            percent={Math.ceil(
                                (totalVoteYes / totalPool) * 100
                            )}
                            height={6}
                        />
                    </div>
                </div>
            </div>
        </CardNao>
    );
};
