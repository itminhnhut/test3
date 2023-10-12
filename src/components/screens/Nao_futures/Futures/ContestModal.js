import React, { useContext, useState, useMemo, useEffect } from 'react';
import Modal from 'components/common/ReModal';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import startOfDay from 'date-fns/startOfDay';

const ContestModal = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const ended = new Date('2023-01-17T17:00:00.000Z').getTime();
        const today = startOfDay(new Date()).valueOf();
        let store = localStorage.getItem('contest_v4');
        if (ended <= today) return;
        if (!store) {
            setVisible(true);
            localStorage.setItem(
                'contest_v4',
                JSON.stringify({
                    expired: today
                })
            );
        } else {
            store = JSON.parse(store);
            if (store?.expired !== today) {
                setVisible(true);
                localStorage.setItem(
                    'contest_v4',
                    JSON.stringify({
                        expired: today
                    })
                );
            }
        }
    }, []);

    const onClose = () => {
        setVisible(false);
    };

    const onClick = () => {
        window.open('https://bit.ly/giai-dau-nao-futures-vndc-nami-championship-mua-4', '_blank');
        // window.open('http://localhost:3245/vi/contest?individual=volume&team=volume&utm_source=app&utm_medium=onus&utm_campaign=loc-popup-giai-iphone')
        onClose();
    };

    const className = useMemo(() => {
        return typeof window !== 'undefined' ? (window.innerWidth < 360 ? 'w-[288px] h-[488px]' : 'w-[325px] h-[531px]') : 'w-[288px] h-[488px]';
    }, []);

    return (
        <Modal isVisible={visible} onBackdropCb={onClose} containerClassName={`${className} !p-0 !top-[50%] !border-0 !rounded-[20px]`}>
            <Background language={language}>
                <Button
                    onusMode={true}
                    title={t('common:join_now')}
                    type="primary"
                    className={`!h-9 !text-sm !font-semibold mx-5`}
                    componentType="button"
                    onClick={onClick}
                />
            </Background>
        </Modal>
    );
};
const Background = styled.div.attrs({
    className: 'h-full w-full !rounded-[20px] select-none px-5 py-[23px] flex items-end'
})`
    background-image: ${({ language }) => `url(${getS3Url(`/images/nao/contest/bg_contest_v4_${language}.png`)})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;
export default ContestModal;
