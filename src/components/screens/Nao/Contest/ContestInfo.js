import React, { useEffect, useState } from 'react';
import { CardNao, TextLiner } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

import { getS3Url } from 'redux/actions/utils';
import fetchApi from 'utils/fetch-api';
import { formatNumber } from 'redux/actions/utils';
import { API_CONTEST_GET_USER_DETAIL } from 'redux/actions/apis';

import Tooltip from 'components/common/Tooltip';
const ContestInfo = ({ onShowDetail }) => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user) || null;
    const [userData, setUserData] = useState(null);
    useEffect(() => {

        if (user) {
            getData();
        }

    }, [user]);

    const getData = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_CONTEST_GET_USER_DETAIL,
                options: { method: 'GET' },
                params: { contest_id: 4 },
            });
            setUserData(data);
        } catch (e) {
            console.error('__ error', e);
        } finally {
        }
    };

    if (!(user && userData)) return null;

    return (
        <section className="contest_info pt-[70px]">
            <TextLiner>{t('nao:contest:personal')}</TextLiner>
            <div className="flex flex-col lg:flex-row flex-wrap gap-5 mt-8 ">
                <CardNao className="!min-h-[136px] !px-6 !py-9 lg:!max-w-[375px]">
                    <label className="text-2xl text-nao-green font-semibold left-8">{userData?.name}</label>
                    <div
                        className=" text-nao-grey2 text-sm font-medium mt-4 flex sm:flex-col items-center sm:items-start">
                        <div onClick={() => onShowDetail({ displaying_id: userData?.onus_user_id })} className="leading-6 mt-1 cursor-pointer">ID: {userData?.onus_user_id}</div>
                        <span className="text-nao-white mx-2 sm:hidden">•</span>
                        <div className="flex text-nao-grey2 leading-6 ">{t('nao:contest:team_label')}:&nbsp;<span
                            className="text-nao-green font-medium">{userData?.group_name || '-'}</span></div>
                    </div>
                </CardNao>
                <CardNao className="!min-h-[136px] !py-7 !px-[35px] w-full lg:w-max">
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:trades')}</label>
                            <div
                                className="font-semibold leading-8 text-right">{formatNumber(userData?.total_order)}</div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:total_pnl')}</label>
                            <div
                                className={`font-semibold leading-8 text-right ${userData?.total_pnl < 0 ? 'text-nao-red' : 'text-nao-green2'}`}>{formatNumber(userData?.total_pnl, 0, 0, true)} VNDC
                            </div>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:volume')}</label>
                            <div
                                className="font-semibold leading-8 text-right">{formatNumber(userData?.total_volume, 0, 0, true)} VNDC
                            </div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="flex items-center text-nao-grey2 text-sm leading-6 ">{t('nao:contest:per_pnl')}
                                <div className="px-2 cursor-pointer" data-tip="" data-for="liquidate-fee" id="tooltip-liquidate-fee">
                                    <img src={getS3Url('/images/icon/ic_help.png')} height={16} width={16} />
                                </div>
                                <Tooltip id="liquidate-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                                    arrowColor="transparent" className="!mx-[20px] !bg-darkBlue-4"
                                >
                                    <div>{t('nao:contest:per_pnl_tooltip')}</div>
                                </Tooltip>

                            </label>
                            <div
                                className={`font-semibold leading-8 text-right ${userData?.pnl < 0 ? 'text-nao-red' : 'text-nao-green2'}`}>{formatNumber(userData?.pnl, 2, 0, true)}%
                            </div>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:volume_rank')}</label>
                            <div
                                className="font-semibold leading-8 text-right">#{userData?.individual_rank_volume}</div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:pnl_rank')}</label>
                            <div className="font-semibold leading-8 text-right">#{userData?.individual_rank_pnl}</div>
                        </div>
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

export default ContestInfo;
