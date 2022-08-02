
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
import JoinTeamSuccess from './JoinTeamSuccess';

const ConfirmJoiningTeam = ({ visible = true, onClose, sortName = 'volume', data, onBack }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [dataSource, setDataSource] = useState(null)
    const [loading, setLoading] = useState(true)
    const wrapperRef = useRef(null);
    const [showSuccess, showShowSuccess] = useState(true)

    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }

    useOutsideAlerter(wrapperRef, handleOutside);

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        }
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [visible])

    const acceptInvite = async () => {
        const contest_id = 5
        const action = 'ACCEPT'
        const group_displaying_id = data.group_displaying_id
        console.log( { contest_id, action, group_displaying_id })
        try {
            const data = await fetchApi({
                url: API_CONTEST_POST_ACCEPT_INVITATION,
                options: { method: 'POST' },
                params: { contest_id, action, group_displaying_id },
            });

            console.log(data)

            if (data?.message === 'USER_JOIN_GROUP_CONTEST_BEFORE' || data?.status === 'UNINVITED_USER')
                aler('You are already joined a team or not invited')

            if(data?.status === 'ok') showShowSuccess(true)

        } catch (error) {
            console.log('Error when accept invite', error)

        }
    }

    return (
        <>
            {showSuccess && <JoinTeamSuccess onClose={() => showShowSuccess(false)}/>}
            <Modal onusMode={true} isVisible={true} onBackdropCb={onClose} containerClassName="!bg-nao-bgModal2/[0.9]" onusClassName="!px-6 pb-[3.75rem] !bg-nao-tooltip">
                <div ref={wrapperRef} className="bg-[#0E1D32] w-full sm:px-10 sm:py-[11] overflow-y-auto">
                    {width <= 640 ?
                        <div className="flex nao-table flex-col justify-center items-center align-middle my-3">
                            {acceptIcon}
                            <div className="mt-[24px] text-center font-semibold text-2xl leading-8">
                                {t('nao:contest:confirm_title')}
                            </div>
                            <div className="mt-[8px] text-center text-sm leading-6 font-normal" dangerouslySetInnerHTML={{ __html: t('nao:contest:confirm_description', {value: data.group_name}) }}>
                            </div>
                        </div>
                        :
                        <div>
                            Please view this in mobile screen
                        </div>
                    }

                    <div className="flex py-[8px] min-h-[56px] mt-[4px] px-3 gap-4 sm:gap-6 text-nao-white text-sm font-medium border-nao-grey/[0.2] h-full w-full justify-between">
                        <ButtonNao border className="py-2 px-2 !rounded-md font-semibold w-full max-w-[250px] text-sm leading-6" onClick={() => onBack()}>
                            {t('nao:contest:confirm_back')}
                        </ButtonNao>
                        <ButtonNao className="py-2 px-2 !rounded-md font-semibold w-full max-w-[250px] text-sm leading-6" onClick={() => acceptInvite()}>
                            {t('nao:contest:confirm_accept')}
                        </ButtonNao>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmJoiningTeam;



const acceptIcon = <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34.3333 25.6667C33.0333 26.9667 33.0333 29.0333 34.3333 30.3333L40.6666 36.6667H9.99996C8.16663 36.6667 6.66663 38.1667 6.66663 40C6.66663 41.8333 8.16663 43.3333 9.99996 43.3333H40.6666L34.3333 49.6667C33.0333 50.9667 33.0333 53.0333 34.3333 54.3333C35.6333 55.6333 37.7 55.6333 39 54.3333L50.9666 42.3667C52.2666 41.0667 52.2666 38.9667 50.9666 37.6667L39 25.6667C37.7 24.3667 35.6333 24.3667 34.3333 25.6667ZM66.6666 63.3333H43.3333C41.5 63.3333 40 64.8333 40 66.6667C40 68.5 41.5 70 43.3333 70H66.6666C70.3333 70 73.3333 67 73.3333 63.3333V16.6667C73.3333 13 70.3333 10 66.6666 10H43.3333C41.5 10 40 11.5 40 13.3333C40 15.1667 41.5 16.6667 43.3333 16.6667H66.6666V63.3333Z" fill="#49E8D5" />
</svg>
