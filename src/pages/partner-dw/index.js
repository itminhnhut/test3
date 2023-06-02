import React from 'react';

import { PATHS } from 'constants/paths';

const index = () => {
    return null;
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: PATHS.PARNER_WITHDRAW_DEPOSIT.OPEN_ORDER,
            permanent: false
        }
    };
};
