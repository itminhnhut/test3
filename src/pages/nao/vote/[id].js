import React, { useCallback, useEffect, useRef, useState } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import { ButtonNao, CardNao } from 'src/components/screens/Nao/NaoStyle';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { Progressbar, useOutsideAlerter, } from 'components/screens/Nao/NaoStyle';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SvgSuccessfulCircle from 'src/components/svg/SuccessfulCircle';
import FetchApi from 'utils/fetch-api';
import { API_USER_VOTE } from 'redux/actions/apis';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import SvgCancelCircle from 'src/components/svg/CancelCircle';
import SvgTimeIC from 'src/components/svg/TimeIC';
import LoadingPage from 'components/screens/Mobile/LoadingPage';

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
    const [dataUserVote, setDataUserVote] = useState('');
    const [data, setData] = useState({});
    const { id } = useRouter().query;
    const auth = useSelector((state) => state.auth?.user);
    const router = useRouter();

    const assetNao = useSelector((state) => getAssetNao(state, 'NAO'));
    const {
        t,
        i18n: { language },
    } = useTranslation();

    async function fetchData() {
        try {
            const res = await FetchApi({
                url: API_USER_VOTE + '/' + id,
                options: { method: 'GET' },
            });
            const useVoteRes = await FetchApi({
                url: API_USER_VOTE + '/getuserpool',
                options: { method: 'GET' },
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

    async function handleSubmitVote(votedYes) {
        setIsShowProposalModal(false);
        try {
            const data = await FetchApi({
                url: API_USER_VOTE + '/',
                options: { method: 'POST' },
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

    const description = useCallback(() => {
        if (!data) return null;
        return <>
            <div className="lg:col-span-2 sm:col-span-3">
                <h5 className="text-nao-white sm:text-xl lg:text-2xl pt-10 font-semibold mb-5">
                    {t('nao:vote:nao_description')}
                </h5>
                <div
                    className="description text-nao-grey leading-7 mb-5"
                    dangerouslySetInnerHTML={{
                        __html:
                            data?.vote?.voteDescription &&
                            data?.vote?.voteDescription[language],
                    }}
                ></div>
                <div className="description text-nao-grey leading-7"
                     dangerouslySetInnerHTML={{ __html: t('nao:vote:vote_notice') }}></div>

            </div>
        </>;
    }, [data]);

    const _renderButtonVote = () => {
        if (!data) return null;

        if (!auth) {
            return <ButtonNao
                className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                onClick={() => {
                    emitWebViewEvent('login');
                }}
            >
                {t('nao:vote:login_to_vote')}


            </ButtonNao>;
        }

        if (data?.userInfo?.votedForThisVote) {
            return <ButtonNao
                disabled
                className="w-full py-2 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                onClick={() => {
                    setTypeModal(true);
                    setIsShowProposalModal(true);
                }}
            >
                {t('nao:vote:voted')}
            </ButtonNao>;
        } else {
            return <ButtonNao
                className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                onClick={() => {
                    setTypeModal(true);
                    setIsShowProposalModal(true);
                }}
            >
                {t('nao:vote:vote')}
            </ButtonNao>;
        }

    };

    if (!data || Object.keys(data).length < 1) return <LoadingPage/>;
    const statusText = t(`nao:vote:status:${(data?.vote?.status).toLowerCase()}`);

    return (
        <LayoutNaoToken>
            <div className="grid lg:grid-cols-3 gap-4 pr-3 justify-between pt-10 items-start flex-wrap">
                <div className="lg:col-span-2 sm:col-span-3">
                    <h3 className="lg:text-3xl text-2xl leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                        {data?.vote?.voteName && data?.vote?.voteName[language]}
                    </h3>


                    <div className="hidden lg:block">
                        {description()}
                    </div>
                </div>
                <div className="lg:col-span-1 sm:col-span-3">
                    <CardNao className="!min-h-0 gap-7">
                        <div>
                            <div className="flex flex-row justify-between">
                                <span className="text-[0.875rem]">
                                    {t('nao:vote:voted_for')}
                                </span>
                                <div className="flex flex-row">
                                    <span className="mr-2   font-semibold">
                                        {data?.vote?.totalVoteYes &&
                                        formatNumber(
                                            data?.vote?.totalVoteYes,
                                            assetNao?.assetDigit ?? 0
                                        )}
                                    </span>
                                    <img
                                        src={getS3Url('/images/nao/ic_nao.png')}
                                        alt=""
                                        className="w-[20px] h-[20px]"
                                    />
                                </div>
                            </div>
                            <div className="bg-black mt-3 rounded-lg">
                                <Progressbar
                                    percent={
                                        (data?.vote?.totalVoteYes / data?.vote?.totalPool) * 100
                                    }
                                    height={6}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row justify-between">
                                <span className="text-[0.875rem]">
                                    {t('nao:vote:rejected')}
                                </span>
                                <div className="flex flex-row">
                                    <span className="mr-2 text-[1.1rem] font-semibold">
                                        {data?.vote?.totalVoteNo &&
                                        formatNumber(
                                            data?.vote?.totalVoteNo,
                                            assetNao?.assetDigit ?? 0
                                        )}
                                    </span>
                                    <img
                                        src={getS3Url('/images/nao/ic_nao.png')}
                                        alt=""
                                        className="w-[20px] h-[20px]"
                                    />
                                </div>
                            </div>
                            <div className="bg-black mt-3 rounded-lg">
                                <Progressbar
                                    percent={
                                        (data?.vote?.totalVoteNo / data?.vote?.totalPool) * 100
                                    }
                                    height={6}
                                    background="red"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-[0.875rem]">
                                {t('common:status')}
                            </span>
                            <div className="flex flex-row items-center">
                                {data?.vote?.status === 'Processing' && (
                                    <div className="flex flex-row justify-start items-center gap-2">
                                        <span className="  font-semibold">
                                            {statusText}
                                        </span>
                                    </div>
                                )}
                                {data?.vote?.status === 'Executed' && (
                                    <div className="flex flex-row justify-start items-center gap-2">
                                        <img
                                            src={getS3Url(
                                                '/images/nao/ic_checked.png'
                                            )}
                                            alt=""
                                            className="w-[15px] h-[12px] mr-2"
                                        />
                                        <span className="  font-semibold">
                                            {statusText}
                                        </span>
                                    </div>
                                )}
                                {data?.vote?.status === 'Failed' && (
                                    <div className="flex flex-row justify-start items-center gap-2">
                                        <SvgTimeIC/>
                                        <span className="  font-semibold">
                                            {data?.vote?.status}
                                        </span>
                                    </div>
                                )}
                                {data?.vote?.status === 'Canceled' && (
                                    <div className="flex flex-row justify-start items-center gap-2">
                                        <SvgCancelCircle className="w-[12px] h-[12px]"/>
                                        <span className="  font-semibold">
                                            {statusText}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-[0.875rem]">
                                {' '}
                                {t('nao:vote:your_vote')}
                            </span>
                            <div className="flex flex-row">
                                <span className="mr-2   font-semibold">
                                    {auth && dataUserVote.amount
                                        ? formatNumber(
                                            dataUserVote.amount -
                                            dataUserVote.lockAmount,
                                            assetNao?.assetDigit ?? 0
                                        )
                                        : '-'}
                                </span>
                                <img
                                    src={getS3Url('/images/nao/ic_nao.png')}
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                />
                            </div>
                        </div>
                        {_renderButtonVote()}
                    </CardNao>
                </div>

                <div className="block    lg:hidden">
                    {description()}
                </div>

                {isShowProposalModal && (
                    <VoteProposalModal
                        onClose={() => setIsShowProposalModal(false)}
                        numberOfNao={(
                            dataUserVote.amount - dataUserVote.lockAmount
                        ).toLocaleString()}
                        handleSubmitVote={handleSubmitVote}
                        summary={data?.vote?.voteSummary?.[language] ?? ''}
                        type={typeModal}
                    />
                )}
                {isShowSuccessModal && (
                    <VoteSuccessModal
                        onClose={() => {
                            setIsShowSuccessModal(false);
                        }}
                        type={typeModal}
                        summary={data?.vote?.voteSummary?.[language] ?? ''}
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
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden rounded-lg',
                    'ease-in-out transition-all flex items-end duration-300 z-30'
                )}
            >
                <div
                    ref={wrapperRef}
                    className="w-[500px] min-h-0 bg-nao-bgModal mx-auto mt-[200px] rounded-lg"
                >
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between gap-5">
                        <div className="w-full flex flex-row items-center">
                            <h3 className="text-[1.375rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                                {t('nao:vote:vote_for_proposal')}
                            </h3>
                        </div>
                        <p className="text-nao-grey text-[0.875rem] leading-6">
                            {summary}
                        </p>
                        <CardNao className="!min-h-0 w-full">
                            <div className="flex flex-row justify-between">
                                <div className="">
                                    <span className="font-semibold text-nao-white leading-6">
                                        {t('nao:vote:voting_power')}
                                    </span>
                                    <p
                                        className="text-sm text-nao-text leading-6"
                                        style={{ lineHeight: '24px' }}
                                    >
                                        {formatTime(new Date(), 'dd/MM/yyyy')}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1 items-center">
                                    <span className="text-nao-white text-[1.375rem] font-semibold">
                                        {numberOfNao.toLocaleString()}
                                    </span>
                                    <img
                                        onClick={() => onNavigate(false)}
                                        className="cursor-pointer h-[24px]"
                                        src={getS3Url('/images/nao/ic_nao.png')}
                                    />
                                </div>
                            </div>
                        </CardNao>
                        <div className=" w-full flex justify-between gap-2">
                            <ButtonNao
                                className="w-full py-2 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                                onClick={() => handleSubmitVote(false)}
                            >
                                {t('nao:vote:reject')}
                            </ButtonNao>
                            <ButtonNao
                                className="w-full py-2 !rounded-md text-sm font-semibold leading-6"
                                onClick={() => handleSubmitVote(true)}
                            >
                                {t('nao:vote:vote')}
                            </ButtonNao>
                        </div>
                        <p className="text-nao-grey text-sm">
                            {t('nao:vote:vote_remind')}
                        </p>
                    </div>
                </div>
            </div>
        </Portal>
    );
};
const VoteSuccessModal = ({
    onClose,
    summary,
    type
}) => {
    const wrapperRef = useRef(null);
    const { t } = useTranslation();
    useOutsideAlerter(wrapperRef, onClose);
    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30'
                )}
            >
                <div
                    ref={wrapperRef}
                    className="w-[500px] min-h-0 bg-nao-bgModal mx-auto mt-[200px] rounded"
                >
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between gap-8">
                        {/* <div className="w-full items-center"> */}
                        <div className="m-auto">
                            <SvgSuccessfulCircle className="w-[80px] h-[80px]"/>
                        </div>
                        <h3 className="text-[1.5rem] leading-8 font-semibold pb-[6px] max-w-[700px] text-nao-white">
                            {type
                                ? t('nao:vote:voted_successfully')
                                : t('nao:vote:rejected_successfully')}
                        </h3>
                        <p className="text-nao-grey text-center">{summary}</p>
                        <ButtonNao
                            className="py-2 px-7 !rounded-md text-sm font-semibold leading-6 !bg-[#1A2E41]"
                            onClick={onClose}
                        >
                            {t('common:close')}
                        </ButtonNao>
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
                'common',
                'nao',
                'error',
            ])),
        },
    };
};
