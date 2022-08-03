import React, { useState, useEffect, useRef } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl, useOutsideAlerter } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_POST_ACCEPT_INVITATION } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import useWindowSize from 'hooks/useWindowSize';
import Modal from 'components/common/ReModal';
import ConfirmJoiningTeam from './ConfirmJoiningTeam'

const InvitationDetail = ({ visible = true, onClose, onAccept,sortName = 'volume', data }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [dataSource, setDataSource] = useState(null)
    const [loading, setLoading] = useState(true)
    const wrapperRef = useRef(null);

    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }

    console.log('INVITE', data)

    useOutsideAlerter(wrapperRef, handleOutside);

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        }
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [visible])
   
    return (
        <>
            <Modal onusMode={true} isVisible={true} onBackdropCb={onClose} containerClassName="!bg-nao-bgModal2/[0.9]" onusClassName="!px-6 pb-[3.75rem] !bg-nao-tooltip">
                <div ref={wrapperRef} className="bg-[#0E1D32] w-full sm:px-10 sm:py-[11] overflow-y-auto">
                    <div className="flex sm:items-center sm:justify-between min-h-[32px] mb-5 gap-2 flex-wrap lg:flex-row flex-col">
                        <div className="flex items-center gap-7">
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <div className="text-[24px] leading-8 font-semibold capitalize">
                                        {t('nao:contest:team_invitations')} ({data.length})
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex nao-table flex-col overflow-y-auto mt-3 max-h-[390px]">
                        {Array.isArray(data) && data.length > 0 &&
                            data?.map((item, index) => {
                                return (
                                    <CardNao noBg className="mb-5 p-[4px] !max-w-[330px]" key={item._id}>
                                        <div className="flex px-3 py-[4px] gap-4 sm:gap-6 text-nao-white text-sm font-medium pb-2 border-nao-grey/[0.2] items-center w-full min-h-[56px]">
                                            <div className='h-[48px] w-[48px] flex justify-center items-center'>
                                                <img src={item.avatar} className="rounded-[50%] h-full w-full object-cover" />
                                            </div>
                                            <div className='items-center'>
                                                <div className='h-auto font-normal flex items-center text-xs leading-6'>
                                                    {LeaderFlag} {t('nao:contest:team_lead')}: {item.leader_name}
                                                </div>
                                                <div className='h-auto flex items-center leading-8 text-nao-green font-semibold text-base'>
                                                    {item.group_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex py-[8px] min-h-[56px] px-3 gap-4 sm:gap-6 text-nao-white text-sm font-medium border-nao-grey/[0.2] h-full w-full justify-between">
                                            <ButtonNao className="py-2 px-2 !rounded-md font-semibold w-full max-w-[250px] text-sm leading-6" onClick={() => onAccept(item)}>
                                                {t('nao:contest:accept_invite')}
                                            </ButtonNao>
                                            <ButtonNao border className="py-2 px-2 !rounded-md font-semibold w-full max-w-[250px] text-sm leading-6">
                                                {t('nao:contest:team_detail')}
                                            </ButtonNao>
                                        </div>
                                    </CardNao>
                                )
                            })
                        }
                    </div>


                    <div className="w-full mt-5 sm:mt-10 m-auto">
                        <ButtonNao onClick={onClose} border className="py-2 px-11 !rounded-md font-semibold">{t('common:close')}</ButtonNao>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default InvitationDetail;

const LeaderFlag = <svg className="mr-1" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5333 2.83289C5.41681 2.26486 3.46274 1.75932 1.4426 2.63339C1.30268 2.69394 1.21173 2.8316 1.21173 2.98404V10.4204C1.21173 10.686 1.47686 10.8713 1.72552 10.7779C3.6458 10.057 5.51576 10.3934 7.5333 10.9348C9.64982 11.5029 11.6039 11.9143 13.624 11.0403C13.7639 10.9797 13.8549 7.10084 13.8549 6.9484V5.41218C13.8549 5.14658 13.5897 2.95922 13.3411 3.05256C11.4208 3.77353 9.55084 3.37438 7.5333 2.83289Z" fill="url(#paint0_linear_14907_6988)" />
    <path d="M1.02351 16.0002C0.624984 16.0002 0.301941 15.6772 0.301941 15.2787V2.16493C0.301941 1.7664 0.624984 1.44336 1.02351 1.44336C1.42204 1.44336 1.74508 1.7664 1.74508 2.16493V15.2787C1.74508 15.6772 1.42204 16.0002 1.02351 16.0002Z" fill="url(#paint1_linear_14907_6988)" />
    <path d="M1.02351 1.75686C1.50866 1.75686 1.90194 1.36358 1.90194 0.878431C1.90194 0.393287 1.50866 0 1.02351 0C0.538368 0 0.145081 0.393287 0.145081 0.878431C0.145081 1.36358 0.538368 1.75686 1.02351 1.75686Z" fill="url(#paint2_linear_14907_6988)" />
    <path d="M1.02351 1.75734C1.50866 1.75734 1.90194 1.36405 1.90194 0.878906H0.145081C0.145081 1.36405 0.538367 1.75734 1.02351 1.75734Z" fill="url(#paint3_linear_14907_6988)" />
    <defs>
        <linearGradient id="paint0_linear_14907_6988" x1="0.526894" y1="1.7257" x2="17.3724" y2="6.24598" gradientUnits="userSpaceOnUse">
            <stop stop-color="#093DD1" />
            <stop offset="1" stop-color="#49E8D5" />
        </linearGradient>
        <linearGradient id="paint1_linear_14907_6988" x1="1.02351" y1="1.44336" x2="1.02351" y2="16.0002" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFBD5" />
            <stop offset="1" stop-color="#49E8D5" />
        </linearGradient>
        <linearGradient id="paint2_linear_14907_6988" x1="1.02351" y1="0" x2="1.02351" y2="1.75686" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFBD5" />
            <stop offset="1" stop-color="#49E8D5" />
        </linearGradient>
        <linearGradient id="paint3_linear_14907_6988" x1="1.02351" y1="0.878906" x2="1.02351" y2="1.75734" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFBD5" />
            <stop offset="1" stop-color="#49E8D5" />
        </linearGradient>
    </defs>
</svg>

