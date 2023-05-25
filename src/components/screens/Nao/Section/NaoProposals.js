import { CardNao, Progressbar, TextLiner, VoteStatus } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { API_USER_POOL } from 'redux/actions/apis';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import SvgCancelCircle from 'components/svg/CancelCircle';
import SvgChecked from 'components/svg/Checked';
import SvgTimeIC from 'components/svg/TimeIC';
import FetchApi from 'utils/fetch-api';
import SvgProgress from 'components/svg/SvgEdit';
import CheckCircle from 'components/svg/CheckCircle';
import CrossCircle from 'components/svg/CrossCircle';
import { useSelector } from 'react-redux';

export default function NaoProposals({ listProposal, assetNao }) {
    const [dataUserVote, setDataUserVote] = useState('');

    async function fetchData() {
        try {
            const useVoteRes = await FetchApi({
                url: API_USER_POOL,
                options: { method: 'GET' }
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
        i18n: { language }
    } = useTranslation();
    return (
        <section id="nao_proposal" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div className="space-y-2 flex flex-col">
                    <TextLiner className="normal-case">
                        {t('nao:vote:title')}
                        {/* Proposals */}
                    </TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                        {t('nao:vote:description')}
                        {/* Track proposal statuses and vote on changes. */}
                    </span>
                </div>
            </div>
            <div className="space-y-6 mt-6 sm:mt-8">
                {Array.isArray(listProposal) &&
                    listProposal.map((proposal, index) => {
                        return <Proposal key={index} proposal={proposal} language={language} assetNao={assetNao} />;
                    })}
            </div>
        </section>
    );
}
const Proposal = ({ proposal, language, assetNao }) => {
    const isAuth = useSelector((state) => state.auth?.user);
    const { voteName, totalPool, _id, totalVoteYes, totalVoteNo, status } = proposal;
    const router = useRouter();
    const { t } = useTranslation();
    const statusText = t(`nao:vote:status:${status.toLowerCase()}`);
    return (
        <CardNao className="!px-6 sm:!px-8 !py-6 !sm:min-h-0 !min-h-0 cursor-pointer" onClick={() => isAuth && router.push(`/nao/vote/${_id}`)}>
            <div className="flex flex-col xl:flex-row flex-wrap xl:items-center justify-between gap-4">
                <div className="flex flex-row flex-1 items-center xl:max-w-[520px]">
                    <VoteStatus
                        iconClassName="w-5 h-5 min-w-[20px]"
                        status={status}
                        statusText={voteName && voteName[language]}
                        className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-sm sm:text-base !space-x-3 sm:!space-x-4"
                    />
                </div>
                <div className="xl:min-w-[450px] pt-2 sm:pt-0">
                    <div className="flex flex-row justify-between mb-3">
                        <div>
                            <span className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark leading-6">{t('nao:vote:voted_for')}:</span>
                            <span className="font-semibold ml-1 text-sm sm:text-base">
                                {totalVoteYes && formatNumber(totalVoteYes, assetNao?.assetDigit ?? 0)}
                            </span>
                        </div>
                        <VoteStatus status={status} statusText={statusText} className="text-sm" textClassName="!font-normal whitespace-nowrap" />
                    </div>
                    <div className="bg-gray-11 dark:bg-dark-1 relative rounded-lg mb-3">
                        <img src={getS3Url('/images/nao/ic_caret_down.png')} className="absolute bottom-2 inset-x-1/2" />
                        <img src={getS3Url('/images/nao/ic_caret_up.png')} className="absolute top-2 inset-x-1/2" />
                        <Progressbar percent={Math.ceil((totalVoteYes / totalPool) * 100)} height={6} />
                    </div>
                    <div className="flex flex-row justify-between">
                        <span className="text-txtSecondary dark:text-gray-4 text-xs sm:text-sm">{t('nao:vote:vote_rating')}</span>
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
