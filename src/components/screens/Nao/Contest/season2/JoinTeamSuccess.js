
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

const JoinTeamSuccess = ({ visible = true, onClose, onBack }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [loading, setLoading] = useState(true)
    const wrapperRef = useRef(null);

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

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose} containerClassName="!bg-nao-bgModal2/[0.9]" onusClassName="!px-6 pb-[3.75rem] !bg-nao-tooltip">
            <div ref={wrapperRef} className="bg-[#0E1D32] w-full sm:px-10 sm:py-[11] overflow-y-auto">
                {width <= 640 ?
                    <div className="flex nao-table flex-col justify-center items-center align-middle my-3">
                        {successIcon}
                        <div className="mt-[24px] text-center font-semibold text-2xl leading-8">
                            {t('nao:contest:join_success')}
                        </div>
                    </div>
                    :
                    <div>
                        Please view this in mobile screen
                    </div>
                }

                <div className="flex py-[8px] min-h-[56px] mt-[4px] px-3 gap-4 sm:gap-6 text-nao-white text-sm font-medium border-nao-grey/[0.2] h-full w-full justify-between">
                    <ButtonNao border className="py-2 px-2 !rounded-md font-semibold w-full text-sm leading-6" onClick={() => onClose()}>
                        {t('nao:contest:confirm_close')}
                    </ButtonNao>
                    
                </div>
            </div>
        </Modal>
    );
};

export default JoinTeamSuccess;

const successIcon = <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M57 26L37.1667 52L23 41.0526" stroke="#49E8D5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M77 40C77 60.4345 60.4345 77 40 77C19.5655 77 3 60.4345 3 40C3 19.5655 19.5655 3 40 3C60.4345 3 77 19.5655 77 40Z" stroke="#49E8D5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

