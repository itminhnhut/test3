import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { TextTicket } from 'components/screens/Nao/NaoStyle'

const DragTicket = ({ onOpen, xs }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleDrag = (e, data) => {
    }

    const handleStop = (e, data) => {
        if (data.y < -123) {
            data.node.style.transform = 'translate(0, -100vh)'
            setPosition({ x: 0, y: data.y });
            if (onOpen) onOpen();
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
                <TextTicket xs={xs} className="top-[8%]">
                    <div className="leading-4">ID: #123456789</div>
                    <div className="leading-4">Thời gian: 2022-06-09 10:31</div>
                </TextTicket>
                <img src="/images/nao/luckydraw/ic_ticket.png" width={181} height={390} />
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