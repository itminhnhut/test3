import React from 'react';
import { PORTAL_MODAL_ID } from 'constants/constants';

const LayoutNaoToken = ({ children }) => {
    return (
        <>
            {children}
            <div id={`${PORTAL_MODAL_ID}`} />
        </>
    );
};

export default LayoutNaoToken;