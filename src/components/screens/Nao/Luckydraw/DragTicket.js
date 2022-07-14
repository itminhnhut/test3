import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { TextTicket } from 'components/screens/Nao/NaoStyle';
import { formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const DragTicket = ({ ticket, onOpen, xs, last, index }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { t } = useTranslation();

    const handleDrag = (e, data) => {
    }

    const handleStop = (e, data) => {
        if (data.y < -123) {
            data.node.style.transform = 'translate(0, -100vh)'
            setPosition({ x: 0, y: data.y });
            if (onOpen) onOpen(ticket);
        }
    }


    return (
        <Draggable
            axis="y"
            position={position}
            onDrag={handleDrag}
            onStop={handleStop}
            defaultClassName={`animation`}
        >

            <Ticket>
                {/* <div className={`${!last ? 'rotate-[-10deg]' : ''}`}> */}
                    <img src={getS3Url("/images/nao/luckydraw/ic_ticket.png")} width={181} height={390} />
                {/* </div> */}
            </Ticket>
        </Draggable>
    );
};


const Ticket = styled.div.attrs({
    className: 'relative'
})`
    transition: transform 0.3s;
`


export default DragTicket;