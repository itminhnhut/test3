import React from 'react';
import styled from 'styled-components';

const AvatarFrame = ({ children, ...props }) => {
    return <Wrapper {...props}>{children}</Wrapper>;
};

const Wrapper = styled.div.attrs({
    className: 'relative'
})`
    &::after {
        content: '';
        position: absolute;
        display: ${({ frame }) => (frame ? 'block' : 'none')};
        top: 0;
        width: 100%;
        height: 100%;
        background-image: ${({ frame }) => `url(${frame})`};
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center top;
    }
`;

export default AvatarFrame;
