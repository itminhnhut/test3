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
import SvgCancelCircle from "src/components/svg/CancelCircle";
import SvgSuccessfulCircle from "src/components/svg/SuccessfulCircle";
import SvgTimeCircle from "src/components/svg/TimeCircle";
import SvgTimeIC from "src/components/svg/TimeIC";
import FetchApi from "utils/fetch-api";

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

    useEffect(() => {
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
                    <span className="text-nao-grey">
                        {t("nao:vote:description")}
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
                <div className="md:col-span-2 col-span-3 flex flex-row gap-1 flex-1 items-center">
                    {status === "Processing" && (
                        <img
                            className="cursor-pointer h-[24px]"
                            src={getS3Url("/images/nao/ic_nao_radio.png")}
                        />
                    )}
                    {status === "Executed" && <SvgSuccessfulCircle />}
                    {status === "Failed" && <SvgTimeCircle />}
                    {status === "Canceled" && <SvgCancelCircle />}

                    <span className="text-nao-text font-medium sm:text-lg ml-2">
                        {voteName && voteName[language]}
                    </span>
                </div>
                <div className="md:col-span-1 col-span-3">
                    <div className="flex flex-row justify-between mb-3">
                        <div>
                            <span className="text-sm text-nao-grey leading-6">
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
                                <img
                                    src={getS3Url("/images/nao/ic_checked.png")}
                                    alt=""
                                    className="w-[15px] h-[12px]"
                                />
                                <span className="text-[0.875rem]">
                                    {statusText}
                                </span>
                            </div>
                        )}
                        {status === "Failed" && (
                            <div className="flex flex-row justify-start items-center gap-2">
                                <SvgTimeIC />
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
                    <div className="bg-black relative rounded-lg mb-3">
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
                        <span className="text-nao-grey text-[0.875rem] leading-7">
                            {t("nao:vote:vote_rating")}
                        </span>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-row items-center">
                                <img
                                    src={getS3Url("/images/nao/ic_checked.png")}
                                    alt=""
                                    className="w-[15px] h-[12px] mr-2"
                                />
                                <span className="text-[0.875rem]">{`${(
                                    (totalVoteYes / totalPool) *
                                    100
                                ).toFixed()}%`}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <SvgTimeIC className="" />
                                <span className="text-[0.875rem]">{`${(
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
