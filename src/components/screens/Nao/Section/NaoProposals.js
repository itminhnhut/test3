import {
    CardNao,
    Progressbar,
    TextLiner,
} from "components/screens/Nao/NaoStyle";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API_USER_POOL } from "redux/actions/apis";
import { formatNumber, getS3Url } from "redux/actions/utils";
import SvgCancelCircle from "components/svg/CancelCircle";
import SvgChecked from "components/svg/Checked";
import SvgSuccessfulCircle from "components/svg/SuccessfulCircle";
import SvgTimeIC from "components/svg/TimeIC";
import FetchApi from "utils/fetch-api";
import SvgProgress from "components/svg/SvgEdit";
import CheckCircle from "components/svg/CheckCircle";
import TimeCircle from "components/svg/TimeIC";
import SvgCross from "components/svg/Cross";
import CrossCircle from "components/svg/CrossCircle";

export default function NaoProposals({ listProposal, assetNao }) {
    const [dataUserVote, setDataUserVote] = useState("");

    async function fetchData() {
        try {
            const useVoteRes = await FetchApi({
                url: API_USER_POOL,
                options: { method: "GET" },
            });
            setDataUserVote(useVoteRes ?? []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(async () => {
        fetchData();
    }, []);

    const {
        t,
        i18n: { language },
    } = useTranslation();
    return (
        <section id="nao_proposal" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div>
                    <TextLiner className="normal-case">
                        {t("nao:vote:title")}
                        {/* Proposals */}
                    </TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                        {t("nao:vote:description")}
                        {/* Track proposal statuses and vote on changes. */}
                    </span>
                </div>
            </div>
            {Array.isArray(listProposal) && listProposal.map((proposal, index) => {
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
    const { voteName, totalPool, _id, totalVoteYes, totalVoteNo, status } =
        proposal;
    const router = useRouter();
    const { t } = useTranslation();
    const statusText = t(`nao:vote:status:${status.toLowerCase()}`);
    return (
        <CardNao
            className="mt-6 p-6 !sm:min-h-0 !min-h-0 cursor-pointer"
            onClick={() => {
                router.push(`/nao/vote/${_id}`);
            }}
        >
            <div className="grid grid-cols-3 gap-4">
                <div className="lg:col-span-2 col-span-3 flex flex-row gap-1 flex-1 items-center">
                    {status === "Processing" && (
                        <SvgProgress className="md:w-6 md:h-6 w-4 h-4 flex-shrink-0" />
                    )}
                    {status === "Executed" && (
                        <CheckCircle className="md:w-6 md:h-6 w-4 h-4 flex-shrink-0" />
                    )}
                    {status === "Failed" && (
                        <CrossCircle fill="blue" className="md:w-6 md:h-6 w-4 h-4 flex-shrink-0" />
                    )}
                    {status === "Canceled" && (
                        <SvgCancelCircle className="md:w-6 md:h-6 w-4 h-4 flex-shrink-0" />
                    )}

                    <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium sm:text-lg ml-2">
                        {voteName && voteName[language]}
                    </span>
                </div>
                <div className="lg:col-span-1 col-span-3 lg:max-w-[340px]">
                    <div className="flex flex-row justify-between mb-3">
                        <div>
                            <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                {t("nao:vote:voted_for")}:
                            </span>
                            <span className="font-semibold ml-2">
                                {totalVoteYes &&
                                    formatNumber(
                                        totalVoteYes,
                                        assetNao?.assetDigit ?? 0
                                    )}
                            </span>
                        </div>
                        {status === "Executed" && (
                            <div className="flex flex-row justify-start items-center gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />

                                <span className="text-[0.875rem]">
                                    {statusText}
                                </span>
                            </div>
                        )}
                        {status === "Failed" && (
                            <div className="flex flex-row justify-start items-center gap-2">
                                <CrossCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="text-[0.875rem]">
                                    {statusText}
                                </span>
                            </div>
                        )}
                        {status === "Canceled" && (
                            <div className="flex flex-row justify-start items-center gap-2">
                                <SvgCancelCircle className="w-[12px] h-[12px]" />
                                <span className="text-[0.875rem]">
                                    {statusText}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-11 dark:bg-dark-1 relative rounded-lg mb-3">
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
                    <div className="flex flex-row justify-between">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-[0.75rem] leading-6">
                            {t("nao:vote:vote_rating")}
                        </span>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <SvgChecked className="w-3 h-3 flex-shrink-0" />

                                <span className="text-[0.75rem] text-txtPrimary dark:text-txtPrimary-dark">{`${(
                                    (totalVoteYes / totalPool) *
                                    100
                                ).toFixed()}%`}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <SvgTimeIC className="w-3 h-3 flex-shrink-0" />
                                <span className="text-[0.75rem] text-txtPrimary dark:text-txtPrimary-dark">{`${(
                                    (totalVoteNo / totalPool) *
                                    100
                                ).toFixed()}%`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardNao>
    );
};
