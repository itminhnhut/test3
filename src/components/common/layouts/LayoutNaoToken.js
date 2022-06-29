import React from 'react';
import { PORTAL_MODAL_ID } from 'constants/constants';

const LayoutNaoToken = ({ children }) => {
    return (
        <div className="bg-nao-bg2 text-nao-white">
            {children}
            <div id={`${PORTAL_MODAL_ID}`} />
        </div>
    );
};

export default LayoutNaoToken;