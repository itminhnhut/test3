
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



const acceptIcon = <svg width="68" height="61" viewBox="0 0 68 61" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M43.1666 40C46.3883 40 49 42.6117 49 45.8333L48.9964 49.0402C49.3852 56.3372 43.9598 60.0301 34.2226 60.0301C24.5262 60.0301 19 56.3974 19 49.1667V45.8333C19 42.6117 21.6116 40 24.8333 40H43.1666ZM43.1666 45H24.8333C24.3731 45 24 45.3731 24 45.8333V49.1667C24 53.0872 26.9555 55.0301 34.2226 55.0301C41.4489 55.0301 44.2084 53.1518 44 49.1733V45.8333C44 45.3731 43.6269 45 43.1666 45ZM6.49996 23.3333L21.0866 23.3336C20.8124 24.3989 20.6666 25.5158 20.6666 26.6667C20.6666 27.2304 20.7016 27.7859 20.7695 28.3311L6.49996 28.3333C6.03972 28.3333 5.66663 28.7064 5.66663 29.1667V32.5C5.66663 36.4206 8.62218 38.3635 15.8893 38.3635C17.4289 38.3635 18.7658 38.2782 19.9144 38.1055C18.0305 39.299 16.6182 41.1632 16.004 43.3606L15.8893 43.3635C6.19283 43.3635 0.666626 39.7307 0.666626 32.5V29.1667C0.666626 25.945 3.2783 23.3333 6.49996 23.3333ZM61.5 23.3333C64.7216 23.3333 67.3333 25.945 67.3333 29.1667L67.3298 32.3736C67.7185 39.6705 62.2931 43.3635 52.5559 43.3635L51.9951 43.3576C51.3635 41.1008 49.8898 39.1957 47.9342 38.0025C49.2231 38.2445 50.7575 38.3635 52.5559 38.3635C59.7822 38.3635 62.5417 36.4852 62.3333 32.5066V29.1667C62.3333 28.7064 61.9602 28.3333 61.5 28.3333L47.2305 28.3307C47.2983 27.7856 47.3333 27.2302 47.3333 26.6667C47.3333 25.5158 47.1875 24.3989 46.9133 23.3336L61.5 23.3333ZM34 16.6667C39.5228 16.6667 44 21.1438 44 26.6667C44 32.1895 39.5228 36.6667 34 36.6667C28.4771 36.6667 24 32.1895 24 26.6667C24 21.1438 28.4771 16.6667 34 16.6667ZM34 21.6667C31.2385 21.6667 29 23.9052 29 26.6667C29 29.4281 31.2385 31.6667 34 31.6667C36.7614 31.6667 39 29.4281 39 26.6667C39 23.9052 36.7614 21.6667 34 21.6667ZM15.6666 0C21.1895 0 25.6666 4.47715 25.6666 10C25.6666 15.5228 21.1895 20 15.6666 20C10.1438 20 5.66663 15.5228 5.66663 10C5.66663 4.47715 10.1438 0 15.6666 0ZM52.3333 0C57.8561 0 62.3333 4.47715 62.3333 10C62.3333 15.5228 57.8561 20 52.3333 20C46.8104 20 42.3333 15.5228 42.3333 10C42.3333 4.47715 46.8104 0 52.3333 0ZM15.6666 5C12.9052 5 10.6666 7.23858 10.6666 10C10.6666 12.7614 12.9052 15 15.6666 15C18.428 15 20.6666 12.7614 20.6666 10C20.6666 7.23858 18.428 5 15.6666 5ZM52.3333 5C49.5719 5 47.3333 7.23858 47.3333 10C47.3333 12.7614 49.5719 15 52.3333 15C55.0947 15 57.3333 12.7614 57.3333 10C57.3333 7.23858 55.0947 5 52.3333 5Z" fill="#49E8D5"/>
</svg>

