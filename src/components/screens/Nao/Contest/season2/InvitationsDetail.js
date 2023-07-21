import React, { useState, useEffect, useRef, useContext } from 'react';
import { CardNao, ButtonNao, capitalize, ImageNao, ButtonNaoVariants } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_POST_ACCEPT_INVITATION } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import useWindowSize from 'hooks/useWindowSize';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import ModalV2 from 'components/common/V2/ModalV2';

const InvitationDetail = ({ visible = true, onClose, sortName = 'volume', data, onShowDetail, getInfo, contest_id }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const isMobile = width <= 640;

    const acceptInvite = async (group) => {
        if (!group) return;
        const action = 'ACCEPT';
        const group_displaying_id = group?.group_displaying_id;
        setLoading(true);
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_POST_ACCEPT_INVITATION,
                options: { method: 'POST' },
                params: { contest_id: contest_id, action, group_displaying_id }
            });
            if (status === ApiStatus.SUCCESS) {
                getInfo();
                setTimeout(
                    () => context.alertV2.show('success', t('nao:contest:join_success'), t('nao:contest:join_message', { teamname: group.group_name })),
                    500
                );
            } else {
                setTimeout(() => context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`)), 500);
            }
        } catch (error) {
            console.log('Error when accept invite', error);
        } finally {
            setLoading(false);
        }
    };

    const onAccept = (item) => {
        if (loading) return;
        context.alertV2.show(
            'team',
            t('nao:contest:confirm_title'),
            t('nao:contest:confirm_description', { value: item.group_name }),
            null,
            () => {
                acceptInvite(item);
            },
            null,
            { confirmTitle: t('nao:contest:confirm_accept'), timer: 1000, icon: item?.group_avatar }
        );
    };

    return (
        <>
            <ModalV2 isMobile={isMobile} isVisible={true} onBackdropCb={onClose} className="!max-w-[884px]">
                <div className="h-full w-full mt-6">
                    <div className="text-xl sm:text-2xl font-semibold capitalize !px-4 sm:px-[0px] mb-[32px]">
                        {t('nao:contest:team_invitations')} ({data.length})
                    </div>

                    <div className="flex flex-col px-4 scrollbar-nao overflow-y-auto h-[calc(100%-84px)] text-sm sm:text-base space-y-4">
                        {Array.isArray(data) &&
                            data.length > 0 &&
                            data?.map((item, index) => {
                                return isMobile ? (
                                    <CardNao className="mb-[16px] px-[4px] py-[16px] !max-w-[330px] border dark:border-none border-divider" key={item._id}>
                                        <div className="flex px-3 gap-4 sm:gap-6 font-medium items-center align-middle w-full h-full min-h-[56px]">
                                            <div className="h-[48px] w-[48px] flex justify-center items-center">
                                                <ImageNao src={item.group_avatar} className="rounded-[50%] h-full w-full object-cover" />
                                            </div>
                                            <div className="items-center">
                                                <div className="h-auto font-normal capitalize flex items-center">
                                                    {LeaderFlag} {t('nao:contest:team_lead')}: {capitalize(item.leader_name)}
                                                </div>
                                                <div className="uppercase h-auto flex items-center font-semibold text-base sm:text-2xl">{item.group_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex pt-[8px] px-3 gap-4 sm:gap-6 h-full w-full justify-between">
                                            <ButtonNao
                                                className="py-2 px-2 !rounded-md font-semibold w-full !text-xs sm:!text-sm"
                                                onClick={() => onAccept(item)}
                                            >
                                                {t('nao:contest:accept_invite')}
                                            </ButtonNao>
                                            <ButtonNao
                                                onClick={() => onShowDetail({ displaying_id: item?.group_displaying_id, isPending: true, ...item })}
                                                variant={ButtonNaoVariants.SECONDARY}
                                                className="py-2 px-2 w-full !rounded-md font-semibold !text-xs sm:!text-sm"
                                            >
                                                {t('nao:contest:team_detail')}
                                            </ButtonNao>
                                        </div>
                                    </CardNao>
                                ) : (
                                    <CardNao
                                        customHeight="min-h-max"
                                        className="!flex !flex-row !py-4 !px-6 border dark:border-none border-divider"
                                        key={item._id}
                                    >
                                        <div className="flex gap-4 sm:gap-6 items-center align-middle h-full">
                                            <div className="h-[48px] w-[48px] flex justify-center items-center">
                                                <ImageNao src={item.group_avatar} className="rounded-[50%] h-full w-full object-cover" />
                                            </div>
                                            <div className="items-center">
                                                <div className="h-auto font-normal capitalize flex items-center">
                                                    {LeaderFlag} {t('nao:contest:team_lead')}: {capitalize(item.leader_name)}
                                                </div>
                                                <div className="uppercase h-auto flex items-center font-semibold text-base sm:text-2xl">{item.group_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-[8px] gap-[16px] font-medium h-full justify-evenly">
                                            <ButtonNao
                                                className="py-[8px] px-[16px] !rounded-md font-semibold max-w-[250px] !text-xs sm:!text-sm"
                                                onClick={() => onAccept(item)}
                                            >
                                                {t('nao:contest:accept_invite')}
                                            </ButtonNao>
                                            <ButtonNao
                                                onClick={() => onShowDetail({ displaying_id: item?.group_displaying_id, isPending: true, ...item })}
                                                variant={ButtonNaoVariants.SECONDARY}
                                                className="py-[8px] px-[16px] !rounded-md font-semibold  max-w-[250px] !text-xs sm:!text-sm"
                                            >
                                                {t('nao:contest:team_detail')}
                                            </ButtonNao>
                                        </div>
                                    </CardNao>
                                );
                            })}
                    </div>

                    {/* <div className="mx-[16px] mt-5 sm:mt-10">
                        <ButtonNao onClick={onClose} variant={ButtonNaoVariants.SECONDARY} className="py-2 px-11 !rounded-md font-semibold">{t('common:close')}</ButtonNao>
                    </div> */}
                </div>
            </ModalV2>
        </>
    );
};

export default InvitationDetail;

const LeaderFlag = (
    <svg className="mr-1" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.5333 2.83289C5.41681 2.26486 3.46274 1.75932 1.4426 2.63339C1.30268 2.69394 1.21173 2.8316 1.21173 2.98404V10.4204C1.21173 10.686 1.47686 10.8713 1.72552 10.7779C3.6458 10.057 5.51576 10.3934 7.5333 10.9348C9.64982 11.5029 11.6039 11.9143 13.624 11.0403C13.7639 10.9797 13.8549 7.10084 13.8549 6.9484V5.41218C13.8549 5.14658 13.5897 2.95922 13.3411 3.05256C11.4208 3.77353 9.55084 3.37438 7.5333 2.83289Z"
            fill="url(#paint0_linear_14907_6988)"
        />
        <path
            d="M1.02351 16.0002C0.624984 16.0002 0.301941 15.6772 0.301941 15.2787V2.16493C0.301941 1.7664 0.624984 1.44336 1.02351 1.44336C1.42204 1.44336 1.74508 1.7664 1.74508 2.16493V15.2787C1.74508 15.6772 1.42204 16.0002 1.02351 16.0002Z"
            fill="url(#paint1_linear_14907_6988)"
        />
        <path
            d="M1.02351 1.75686C1.50866 1.75686 1.90194 1.36358 1.90194 0.878431C1.90194 0.393287 1.50866 0 1.02351 0C0.538368 0 0.145081 0.393287 0.145081 0.878431C0.145081 1.36358 0.538368 1.75686 1.02351 1.75686Z"
            fill="url(#paint2_linear_14907_6988)"
        />
        <path
            d="M1.02351 1.75734C1.50866 1.75734 1.90194 1.36405 1.90194 0.878906H0.145081C0.145081 1.36405 0.538367 1.75734 1.02351 1.75734Z"
            fill="url(#paint3_linear_14907_6988)"
        />
        <defs>
            <linearGradient id="paint0_linear_14907_6988" x1="0.526894" y1="1.7257" x2="17.3724" y2="6.24598" gradientUnits="userSpaceOnUse">
                <stop stopColor="#47cc85" />
                <stop offset="1" stopColor="#47cc85" />
            </linearGradient>
            <linearGradient id="paint1_linear_14907_6988" x1="1.02351" y1="1.44336" x2="1.02351" y2="16.0002" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00dc68" />
                <stop offset="1" stopColor="#47cc85" />
            </linearGradient>
            <linearGradient id="paint2_linear_14907_6988" x1="1.02351" y1="0" x2="1.02351" y2="1.75686" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00dc68" />
                <stop offset="1" stopColor="#47cc85" />
            </linearGradient>
            <linearGradient id="paint3_linear_14907_6988" x1="1.02351" y1="0.878906" x2="1.02351" y2="1.75734" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00dc68" />
                <stop offset="1" stopColor="#47cc85" />
            </linearGradient>
        </defs>
    </svg>
);
