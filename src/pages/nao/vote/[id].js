import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LayoutNaoToken, { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import { emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { ButtonNaoVariants, Progressbar, ButtonNao, CardNao, VoteStatus, Tooltip } from 'components/screens/Nao/NaoStyle';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FetchApi from 'utils/fetch-api';
import { API_USER_POOL, API_USER_VOTE } from 'redux/actions/apis';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import LoadingPage from 'components/screens/Nao_futures/LoadingPage';
import colors from 'styles/colors';
import ModalV2 from 'components/common/V2/ModalV2';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
import { useWindowSize } from 'utils/customHooks';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import AlertModal from 'components/screens/Nao_futures/AlertModal';
// import Tooltip from 'components/common/Tooltip';

const getAssetNao = createSelector([(state) => state.utils.assetConfig, (utils, params) => params], (assets, params) => {
    return assets.find((rs) => rs.assetCode === params);
});
export default function Vote() {
    const [isShowProposalModal, setIsShowProposalModal] = useState(false);
    const [isShowSuccessModal, setIsShowSuccessModal] = useState(false);
    const [typeModal, setTypeModal] = useState(true);
    const [dataUserVote, setDataUserVote] = useState('');
    const [data, setData] = useState({});
    const [userVoteData, setUserVoteData] = useState(null);
    const { id } = useRouter().query;
    const auth = useSelector((state) => state.auth?.user);
    const { totalVoteNo, totalVoteYes, totalPool, status, voteSummary, voteName, voteDescription } = data;
    const assetNao = useSelector((state) => getAssetNao(state, 'NAO'));
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width < 820;
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            const res = await FetchApi({
                url: API_USER_VOTE + '/' + id,
                options: { method: 'GET' }
            });
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUserData() {
        try {
            const useVoteRes = await FetchApi({
                url: API_USER_POOL,
                options: { method: 'GET' }
            });
            setDataUserVote(useVoteRes);
            const res = await FetchApi({
                url: API_USER_VOTE + '/getUserVoteInfo/' + id,
                options: { method: 'GET' }
            });
            setUserVoteData(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(async () => {
        fetchData();
    }, []);
    useEffect(async () => {
        if (auth) {
            fetchUserData();
        }
    }, [auth]);

    async function handleSubmitVote(votedYes) {
        if (loading) return;
        setLoading(true);
        setIsShowProposalModal(false);
        try {
            const data = await FetchApi({
                url: API_USER_VOTE + '/',
                options: { method: 'POST' },
                params: {
                    voteId: id,
                    votedYes
                }
            });
            setIsShowSuccessModal(true);
        } catch (error) {
            console.log(error);
        } finally {
            fetchUserData();
            fetchData();
            setLoading(false);
        }
    }

    const description = useCallback(() => {
        if (!data) return null;
        return (
            <>
                <div className="lg:col-span-2 sm:col-span-3">
                    <h5 className="text-xl lg:text-2xl font-semibold mb-5 sm:mb-8">{t('nao:vote:nao_description')}</h5>
                    <div
                        className="description text-sm sm:text-base"
                        dangerouslySetInnerHTML={{
                            __html: voteDescription && voteDescription[language]
                        }}
                    ></div>
                    <div
                        className="description text-sm sm:text-base sm:mt-8 mt:6"
                        dangerouslySetInnerHTML={{
                            __html: t('nao:vote:vote_notice')
                        }}
                    ></div>
                </div>
            </>
        );
    }, [data]);

    const _renderButtonVote = () => {
        if (!data) return null;

        if (status !== 'Processing') {
            return (
                <ButtonNao disabled className="w-full">
                    {t('nao:vote:vote_ended')}
                </ButtonNao>
            );
        }
        if (!auth) {
            return (
                <ButtonNao
                    className="w-full"
                    onClick={() => {
                        emitWebViewEvent('login');
                    }}
                >
                    {t('nao:vote:login_to_vote')}
                </ButtonNao>
            );
        }

        if (userVoteData) {
            return (
                <ButtonNao disabled className="w-full">
                    {t('nao:vote:voted')}
                </ButtonNao>
            );
        } else {
            return (
                <ButtonNao
                    className="py-2 px-7 !rounded-md text-sm font-semibold leading-6"
                    onClick={() => {
                        setTypeModal(true);
                        setIsShowProposalModal(true);
                    }}
                >
                    {t('nao:vote:title')}
                </ButtonNao>
            );
        }
    };

    if (!data || Object.keys(data).length < 1) return <LoadingPage />;
    const statusText = t(`nao:vote:status:${status?.toLowerCase()}`);

    return (
        <LayoutNaoToken>
            <div className="flex flex-col sm:flex-row sm:space-x-12 justify-between pt-12 sm:pt-20">
                <div className="w-full">
                    <h3 className="text-5xl font-semibold mb-8 sm:mb-12">{voteName && voteName[language]}</h3>
                    <div className="hidden lg:block">{description()}</div>
                </div>
                <div className="w-full sm:max-w-[470px]">
                    <CardNao className="!min-h-0 space-y-4 sm:space-y-6 lg:w-full !min-w-[280px] !px-4 !py-6 sm:!p-8 text-sm sm:text-base border border-divider dark:border-none">
                        <div>
                            <div className="flex flex-row justify-between">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:vote:voted_for')}</span>
                                <div className="flex flex-row">
                                    <span className="mr-2 font-semibold">{totalVoteYes && formatNumber(totalVoteYes, assetNao?.assetDigit ?? 0)}</span>
                                    <img src={getS3Url('/images/nao/ic_nao.png')} alt="" className="w-[20px] h-[20px]" />
                                </div>
                            </div>
                            <div className="bg-gray-11 dark:bg-dark-1 mt-3 rounded-lg mb-3">
                                <Progressbar percent={(totalVoteYes / totalPool) * 100} height={6} />
                            </div>
                            <div className="flex flex-row justify-between">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:vote:vote_rating')}</span>
                                <span className="text-teal font-semibold">{`${formatNumber((totalVoteYes / totalPool) * 100, 2)}%`}</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row justify-between">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:vote:rejected')}</span>
                                <div className="flex flex-row">
                                    <span className="mr-2 font-semibold">{data?.totalVoteNo && formatNumber(totalVoteNo, assetNao?.assetDigit ?? 0)}</span>
                                    <img src={getS3Url('/images/nao/ic_nao.png')} alt="" className="w-[20px] h-[20px]" />
                                </div>
                            </div>
                            <div className="bg-gray-11 dark:bg-dark-1 mt-3 rounded-lg mb-3 ">
                                <Progressbar percent={(totalVoteNo / totalPool) * 100} height={6} background={colors.red[2]} />
                            </div>
                            <div className="flex flex-row justify-between">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:vote:vote_rating')}</span>
                                <span className="text-red-2 font-semibold">{`${formatNumber((totalVoteNo / totalPool) * 100, 2)}%`}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:status')}</span>
                            <div className="flex flex-row items-center">
                                <VoteStatus status={status} statusText={statusText} />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark"> {t('nao:vote:your_vote')}</span>
                            <div className="flex flex-row">
                                <span className="mr-2 font-semibold">
                                    {auth && dataUserVote.amount ? formatNumber(dataUserVote.amount - dataUserVote.lockAmount, assetNao?.assetDigit ?? 0) : '-'}
                                </span>
                                <img src={getS3Url('/images/nao/ic_nao.png')} alt="" className="w-[20px] h-[20px]" />
                            </div>
                        </div>
                        <div className="!mt-6 sm:!mt-10">{_renderButtonVote()}</div>
                    </CardNao>
                </div>
                <div className="block sm:hidden mt-8 mb-11">{description()}</div>
                {isShowProposalModal && (
                    <VoteProposalModal
                        onClose={() => setIsShowProposalModal(false)}
                        numberOfNao={dataUserVote.amount - dataUserVote.lockAmount}
                        handleSubmitVote={handleSubmitVote}
                        summary={voteSummary?.[language] ?? ''}
                        type={typeModal}
                        isMobile={isMobile}
                    />
                )}
                {isShowSuccessModal && (
                    <VoteSuccessModal
                        onClose={() => {
                            setIsShowSuccessModal(false);
                        }}
                        type={typeModal}
                        summary={voteSummary?.[language] ?? ''}
                    />
                )}
            </div>
        </LayoutNaoToken>
    );
}
const VoteProposalModal = ({ onClose, numberOfNao, handleSubmitVote, summary, isMobile }) => {
    const { t } = useTranslation();

    return (
        <>
            {/* <Tooltip isV3={true} id={'voting'} place="top" effect="solid" className="w-[400px]" /> */}
            <ModalV2 isVisible onBackdropCb={onClose} className="!max-w-[488px]" isMobile={isMobile}>
                <div className="flex flex-col">
                    <div
                        data-tip=""
                        data-for="voting"
                        className="text-2xl text-txtPrimary dark:text-txtPrimary-dark py-0.5 font-semibold mb-4 w-max flex space-x-2 items-center"
                    >
                        {t('nao:vote:vote_for_proposal')}
                        {/* <QuestionMarkIcon isFilled /> */}
                    </div>
                    <p className="text-txtSecondary dark:text-txtSecondary-dark mb-6">{summary}</p>
                    <CardNao className="!bg-gray-13 dark:!bg-darkBlue-3 !min-h-0 w-full !p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('nao:vote:voting_power')}</span>
                                <p className="text-txtSecondary dark:text-txtSecondary-dark ">{formatTime(new Date(), 'dd/MM/yyyy')}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">{formatNumber(numberOfNao, 2)}</span>
                                <img onClick={() => onNavigate(false)} className="cursor-pointer w-5 h-5" src={getS3Url('/images/nao/ic_nao.png')} />
                            </div>
                        </div>
                    </CardNao>
                    <CardNao className="!bg-gray-13 dark:!bg-darkBlue-3 !min-h-0 w-full !p-4 mt-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2 text-txtSecondary-dark">
                                <BxsInfoCircle className="" size={16} color={'currentColor'} />
                                <span className="font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('nao:note')}</span>
                            </div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:vote:vote_remind')}</span>
                        </div>
                    </CardNao>
                    <div className="w-full flex-col justify-between space-y-3 mt-10">
                        {numberOfNao > 0.1 ? (
                            <>
                                <ButtonNao className="w-full" onClick={() => handleSubmitVote(true)}>
                                    {t('nao:vote:vote')}
                                </ButtonNao>
                                <ButtonNao className="w-full" variant={ButtonNaoVariants.SECONDARY} onClick={() => handleSubmitVote(false)}>
                                    {t('nao:vote:reject')}
                                </ButtonNao>
                            </>
                        ) : (
                            <ButtonNao className="w-full" disabled>
                                {t('nao:vote:nao_too_small')}
                            </ButtonNao>
                        )}
                    </div>
                </div>
            </ModalV2>
        </>
    );
};
const VoteSuccessModal = ({ onClose, summary, type }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);

    useEffect(() => {
        console.log({type})
        context.alertV2.show(
            'success',
            type ? t('nao:vote:voted_successfully') : t('nao:vote:rejected_successfully'),
            summary,
            null,
            null,
            onClose
        );
    }, []);

    return (
        // <AlertModalV2
        //     isVisible
        //     onClose={onClose}
        //     type="success"
        //     title={type ? t('nao:vote:voted_successfully') : t('nao:vote:rejected_successfully')}
        //     message={summary}
        //     isButton={false}
        // />
        <></>
    );
};

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'nao', 'error']))
        }
    };
};
