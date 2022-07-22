import React, { useEffect, useRef, useState } from "react";
import LayoutNaoToken from "components/common/layouts/LayoutNaoToken";
import { CardNao, ButtonNao } from "src/components/screens/Nao/NaoStyle";
import Portal from "components/hoc/Portal";
import classNames from "classnames";
import { formatNumber, getLoginUrl } from "redux/actions/utils";
import { getS3Url } from "redux/actions/utils";
import {
    Progressbar,
    useOutsideAlerter,
} from "components/screens/Nao/NaoStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SvgSuccessfulCircle from "src/components/svg/SuccessfulCircle";
import FetchApi from "utils/fetch-api";
import { API_USER_VOTE } from "redux/actions/apis";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const getAssetNao = createSelector(
    [(state) => state.utils.assetConfig, (utils, params) => params],
    (assets, params) => {
        return assets.find((rs) => rs.assetCode === params);
    }
);
export default function vote() {
    const [isShowProposalModal, setIsShowProposalModal] = useState(false);
    const [isShowSuccessModal, setIsShowSuccessModal] = useState(false);
    const [dataUserVote, setDataUserVote] = useState("");
    const [data, setData] = useState({});
    const { id } = useRouter().query;
    const auth = useSelector((state) => state.auth?.user);
    const router = useRouter();

    const assetNao = useSelector((state) => getAssetNao(state, "NAO"));
    const {
        t,
        i18n: { language },
    } = useTranslation();

    async function fetchData(params) {
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

        try {
            const res = await FetchApi({
                url: API_USER_VOTE + "/",
                options: { method: "POST" },
                params: {
                    voteId: id,
                },
            });
            setIsShowSuccessModal(true);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <LayoutNaoToken>
            <div className="flex flex-row gap-4 pr-3 justify-between pt-10 items-start flex-wrap">
                <div className="left mr-7 min-w-[528px]">
                    <h3 className="text-[2.5rem] sm:text-3xl leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                        {data?.voteName && data.voteName[language]}
                    </h3>
                    <h5 className="text-nao-white text-[1.5rem] pt-10 font-semibold mb-2">
                        Description
                    </h5>
                    <div
                        className="description"
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
                            <span className="text-[0.8rem]">Voted For</span>
                            <div className="flex flex-row">
                                <span className="mr-2 text-[1.1rem] font-semibold">
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
                        <div className="bg-black mt-3 rounded-lg">
                            <Progressbar percent={50} height={6} />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span className="text-[0.8rem]">status</span>
                        <div className="flex flex-row items-center">
                            <img
                                src={getS3Url("/images/nao/ic_checked.png")}
                                alt=""
                                className="w-[15px] h-[12px] mr-2"
                            />
                            <span className="mr-2 font-semibold text-[1.1rem]">
                                {data && data.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span className="text-[0.8rem]">Your Vote</span>
                        <div className="flex flex-row">
                            <span className="mr-2 text-[1.1rem] font-semibold">
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
                                console.log(222);
                            } else setIsShowProposalModal(true);
                        }}
                    >
                        {auth ? "Vote" : "Login to vote"}
                    </ButtonNao>
                    {auth && (
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                            onClick={() => {
                                setIsShowProposalModal(true);
                            }}
                        >
                            {"Reject"}
                        </ButtonNao>
                    )}
                </CardNao>
                {isShowProposalModal && (
                    <VoteProposalModal
                        onClose={() => setIsShowProposalModal(false)}
                        numberOfNao={(
                            dataUserVote.amount - dataUserVote.lockAmount
                        ).toLocaleString()}
                        handleSubmitVote={handleSubmitVote}
                        summary={data.voteSummary[language]}
                    />
                )}
                {isShowSuccessModal && (
                    <VoteSuccessModal
                        onClose={() => {
                            setIsShowSuccessModal(false);
                        }}
                        summary={data.voteSummary[language]}
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
}) => {
    const wrapperRef = useRef(null);
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
                        <div className="w-full flex flex-row items-center">
                            <h3 className="text-[1.5rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                                Vote for proposal
                            </h3>
                            <img
                                src={getS3Url("/images/nao/ic_info.png")}
                                className="w-[16px] h-[16px] ml-3"
                            />
                        </div>
                        <p className="text-nao-grey">{summary}</p>
                        <CardNao className="!min-h-0 w-full">
                            <div className="flex flex-row justify-between">
                                <div className="">
                                    <span className="font-semibold text-nao-white leading-6">
                                        Voting power
                                    </span>
                                    <p className="text-sm text-nao-text leading-6">
                                        as of{" "}
                                        {new Date().toISOString().slice(0, 10)}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1 items-center">
                                    <span className="text-nao-white text-[1.375rem] font-semibold">
                                        {numberOfNao.toLocaleString()}
                                    </span>
                                    <img
                                        onClick={() => onNavigate(false)}
                                        className="cursor-pointer h-[24px]"
                                        src={getS3Url("/images/nao/ic_nao.png")}
                                    />
                                </div>
                            </div>
                        </CardNao>
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                            onClick={handleSubmitVote}
                        >
                            Vote
                        </ButtonNao>
                        <p className="text-nao-grey">
                            Your vote cannot be changed once cast.
                        </p>
                    </div>
                </div>
            </div>
        </Portal>
    );
};
const VoteSuccessModal = ({ onClose, handleSubmitVote, summary }) => {
    const wrapperRef = useRef(null);
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
                            <SvgSuccessfulCircle />
                        </div>
                        <h3 className="text-[1.5rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                            Voted sucessfully
                        </h3>
                        <p className="text-nao-grey text-center">{summary}</p>
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                            onClick={handleSubmitVote}
                            onClick={onClose}
                        >
                            Close
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
