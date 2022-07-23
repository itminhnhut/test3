import React, { useEffect, useRef, useState } from "react";
import LayoutNaoToken from "components/common/layouts/LayoutNaoToken";

import Portal from "components/hoc/Portal";
import classNames from "classnames";
import { formatNumber, getLoginUrl, formatTime } from "redux/actions/utils";
import { getS3Url } from "redux/actions/utils";
import {
    CardNao,
    Progressbar,
    useOutsideAlerter,
    ButtonNao,
} from "components/screens/Nao/NaoStyle";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SvgSuccessfulCircle from "src/components/svg/SuccessfulCircle";
import FetchApi from "utils/fetch-api";
import { API_USER_VOTE } from "redux/actions/apis";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import SvgCancelCircle from "src/components/svg/CancelCircle";
import SvgTimeIC from "src/components/svg/TimeIC";
import LoadingPage from "components/screens/Mobile/LoadingPage";

const getAssetNao = createSelector(
    [(state) => state.utils.assetConfig, (utils, params) => params],
    (assets, params) => {
        return assets.find((rs) => rs.assetCode === params);
    }
);
export default function Vote() {
    const [isShowProposalModal, setIsShowProposalModal] = useState(false);
    const [isShowSuccessModal, setIsShowSuccessModal] = useState(false);
    const [typeModal, setTypeModal] = useState(true);
    const [dataUserVote, setDataUserVote] = useState("");
    const [data, setData] = useState({});
    const { id } = useRouter().query;
    const auth = useSelector((state) => state.auth?.user);
    const router = useRouter();
    const { totalVoteNo, totalVoteYes, totalPool } = data;
    const assetNao = useSelector((state) => getAssetNao(state, "NAO"));
    const {
        t,
        i18n: { language },
    } = useTranslation();

    async function fetchData() {
        try {
            const res = await FetchApi({
                url: API_USER_VOTE + "/" + id,
                options: { method: "GET" },
            });
            const useVoteRes = await FetchApi({
                url: API_USER_VOTE + "/getuserpool",
                options: { method: "GET" },
            });

            setData(res);
            setDataUserVote(useVoteRes);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(async () => {
        fetchData();
    }, []);

    async function handleSubmitVote() {
        setIsShowProposalModal(false);
        const votedYes = typeModal;
        try {
            const res = await FetchApi({
                url: API_USER_VOTE + "/",
                options: { method: "POST" },
                params: {
                    voteId: id,
                    votedYes,
                },
            });
            setIsShowSuccessModal(true);
        } catch (error) {
            console.log(error);
        }
    }
    if (!data || Object.keys(data).length < 1) return <LoadingPage />;
    return (
        <LayoutNaoToken>
            <div className="flex flex-row gap-4 pr-3 justify-between pt-10 items-start flex-wrap">
                <div className="left mr-7 min-w-[528px]">
                    <h3 className="text-[2.5rem] sm:text-3xl leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                        {data?.voteName && data.voteName[language]}
                    </h3>
                    <h5 className="text-nao-white text-[1.5rem] pt-10 font-semibold mb-2">
                        {t("nao:vote:nao_description")}
                    </h5>

                    <div
                        className="description text-nao-grey leading-7"
                        dangerouslySetInnerHTML={{
                            __html:
                                data?.voteDescription &&
                                data.voteDescription[language],
                        }}
                    ></div>
                </div>
                <CardNao className="!min-h-0 gap-7">
                    <div>
                        <div className="flex flex-row justify-between">
                            <span className="text-[0.875rem]">
                                {t("nao:vote:voted_for")}
                            </span>
                            <div className="flex flex-row">
                                <span className="mr-2 text-[1.125rem] font-semibold">
                                    {data.totalVoteYes &&
                                        formatNumber(
                                            data.totalVoteYes,
                                            assetNao?.assetDigit ?? 0
                                        )}
                                </span>
                                <img
                                    src={getS3Url("/images/nao/ic_nao.png")}
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                />
                            </div>
                        </div>
                        <div className="bg-black mt-3 rounded-lg mb-3">
                            <Progressbar
                                percent={
                                    (data.totalVoteYes / data.totalPool) * 100
                                }
                                height={6}
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-nao-grey text-[0.875rem] leading-6">
                                {t("nao:vote:vote_rating")}
                            </span>
                            <span className="text-[0.875rem]">{`${(
                                (totalVoteNo / totalPool) *
                                100
                            ).toFixed()}%`}</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-row justify-between">
                            <span className="text-[0.875rem]">
                                {t("nao:vote:rejected")}
                            </span>
                            <div className="flex flex-row">
                                <span className="mr-2 text-[1.1rem] font-semibold">
                                    {totalVoteYes &&
                                        formatNumber(
                                            totalVoteNo,
                                            assetNao?.assetDigit ?? 0
                                        )}
                                </span>
                                <img
                                    src={getS3Url("/images/nao/ic_nao.png")}
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                />
                            </div>
                        </div>
                        <div className="bg-black mt-3 rounded-lg mb-3">
                            <Progressbar
                                percent={
                                    (data.totalVoteNo / data.totalPool) * 100
                                }
                                height={6}
                                background="red"
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-nao-grey text-[0.875rem] leading-6">
                                {t("nao:vote:vote_rating")}
                            </span>
                            <span className="text-[0.875rem]">{`${(
                                (totalVoteNo / totalPool) *
                                100
                            ).toFixed()}%`}</span>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span className="text-[0.875rem]">
                            {t("common:status")}
                        </span>
                        <div className="flex flex-row items-center">
                            {data.status === "Processing" && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <span className="text-[1.125rem] font-semibold">
                                        {data.status}
                                    </span>
                                </div>
                            )}
                            {data.status === "Executed" && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <img
                                        src={getS3Url(
                                            "/images/nao/ic_checked.png"
                                        )}
                                        alt=""
                                        className="w-[15px] h-[12px] mr-2"
                                    />
                                    <span className="text-[1.125rem] font-semibold">
                                        {data.status}
                                    </span>
                                </div>
                            )}
                            {data.status === "Failed" && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <SvgTimeIC />
                                    <span className="text-[1.125rem] font-semibold">
                                        {data.status}
                                    </span>
                                </div>
                            )}
                            {data.status === "Canceled" && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <SvgCancelCircle className="w-[12px] h-[12px]" />
                                    <span className="text-[1.125rem] font-semibold">
                                        {data.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span className="text-[0.875rem]">
                            {" "}
                            {t("nao:vote:your_vote")}
                        </span>
                        <div className="flex flex-row">
                            <span className="mr-2 text-[1.125rem] font-semibold">
                                {auth && dataUserVote.amount
                                    ? formatNumber(
                                          dataUserVote.amount -
                                              dataUserVote.lockAmount,
                                          assetNao?.assetDigit ?? 0
                                      )
                                    : "__"}
                            </span>
                            <img
                                src={getS3Url("/images/nao/ic_nao.png")}
                                alt=""
                                className="w-[20px] h-[20px]"
                            />
                        </div>
                    </div>
                    <ButtonNao
                        className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                        onClick={() => {
                            if (!auth) {
                                router.push(getLoginUrl("sso"));
                            } else {
                                setTypeModal(true);
                                setIsShowProposalModal(true);
                            }
                        }}
                    >
                        {auth
                            ? t("nao:vote:vote")
                            : t("nao:vote:login_to_vote")}
                    </ButtonNao>
                    {auth && (
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                            onClick={() => {
                                setTypeModal(false);
                                setIsShowProposalModal(true);
                            }}
                        >
                            {t("nao:vote:rejected")}
                        </ButtonNao>
                    )}
                </CardNao>
                {isShowProposalModal && (
                    <VoteProposalModal
                        onClose={() => setIsShowProposalModal(false)}
                        numberOfNao={
                            dataUserVote.amount - dataUserVote.lockAmount
                        }
                        handleSubmitVote={handleSubmitVote}
                        summary={data?.voteSummary?.[language] ?? ""}
                        type={typeModal}
                    />
                )}
                {isShowSuccessModal && (
                    <VoteSuccessModal
                        onClose={() => {
                            setIsShowSuccessModal(false);
                        }}
                        type={typeModal}
                        summary={data?.voteSummary?.[language] ?? ""}
                    />
                )}
            </div>
        </LayoutNaoToken>
    );
}
const VoteProposalModal = ({
    onClose,
    numberOfNao,
    handleSubmitVote,
    summary,
    type,
}) => {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, onClose);
    const { t } = useTranslation();

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    "flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden rounded-lg",
                    "ease-in-out transition-all flex items-end duration-300 z-30"
                )}
            >
                <div
                    ref={wrapperRef}
                    className="w-[500px] min-h-0 bg-nao-bgModal mx-auto mt-[200px] rounded-lg"
                >
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between gap-5">
                        <div className="w-full flex flex-row items-center">
                            <h3 className="text-[1.375rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                                {t("nao:vote:vote_for_proposal")}
                            </h3>
                            <img
                                src={getS3Url("/images/nao/ic_info.png")}
                                className="w-[16px] h-[16px] ml-3"
                            />
                        </div>
                        <p className="text-nao-grey text-[0.875rem] leading-6">
                            {summary}
                        </p>
                        <CardNao className="!min-h-0 w-full">
                            <div className="flex flex-row justify-between">
                                <div className="">
                                    <span className="font-semibold text-nao-white leading-6">
                                        {t("nao:vote:voting_power")}
                                    </span>
                                    <p
                                        className="text-sm text-nao-text leading-6"
                                        style={{ lineHeight: "24px" }}
                                    >
                                        {formatTime(new Date(), "dd/MM/yyyy")}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1 items-center">
                                    <span className="text-nao-white text-[1.375rem] font-semibold">
                                        {formatNumber(numberOfNao, 2)}
                                    </span>
                                    <img
                                        onClick={() => onNavigate(false)}
                                        className="cursor-pointer h-[24px]"
                                        src={getS3Url("/images/nao/ic_nao.png")}
                                    />
                                </div>
                            </div>
                        </CardNao>
                        {numberOfNao > 0.1 ? (
                            <div className=" w-full flex justify-between gap-2">
                                <ButtonNao
                                    className="w-full py-2 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                                    onClick={() => handleSubmitVote(false)}
                                >
                                    {t("nao:vote:reject")}
                                </ButtonNao>
                                <ButtonNao
                                    className="w-full py-2 !rounded-md text-sm font-semibold leading-6"
                                    onClick={() => handleSubmitVote(true)}
                                >
                                    {t("nao:vote:vote")}
                                </ButtonNao>
                            </div>
                        ) : (
                            <div className=" w-full flex justify-between gap-2">
                                <ButtonNao className="w-full py-2 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]">
                                    {t("nao:vote:nao_too_small")}
                                </ButtonNao>
                            </div>
                        )}
                        {/* <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                            onClick={handleSubmitVote}
                        >
                            {type ? t("nao:vote:vote") : t("nao:vote:reject")}
                        </ButtonNao> */}
                        <p className="text-nao-grey">
                            {t("nao:vote:vote_remind")}
                        </p>
                    </div>
                </div>
            </div>
        </Portal>
    );
};
const VoteSuccessModal = ({ onClose, handleSubmitVote, summary, type }) => {
    const wrapperRef = useRef(null);
    const { t } = useTranslation();
    useOutsideAlerter(wrapperRef, onClose);
    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    "flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden",
                    "ease-in-out transition-all flex items-end duration-300 z-30"
                )}
            >
                <div
                    ref={wrapperRef}
                    className="w-[500px] min-h-0 bg-nao-bgModal mx-auto mt-[200px] rounded"
                >
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between gap-8">
                        {/* <div className="w-full items-center"> */}
                        <div className="m-auto">
                            <SvgSuccessfulCircle className="w-[80px] h-[80px]" />
                        </div>
                        <h3 className="text-[1.5rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                            {type
                                ? t("nao:vote:voted_successfully")
                                : t("nao:vote:rejected_successfully")}
                        </h3>
                        <p className="text-nao-grey text-center">{summary}</p>
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                            onClick={handleSubmitVote}
                            onClick={onClose}
                        >
                            {t("common:close")}
                        </ButtonNao>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                "common",
                "nao",
                "error",
            ])),
        },
    };
};
