import InfoCard, { CardContent } from 'components/screens/WithdrawDeposit/components/common/InfoCard';
import React from 'react';

const ReceiverInfor = ({ user }) => {
    return (
        <CardContent
            imgSize={52}
            contentClass="bg-dark-12 dark:bg-dark-4 p-4 rounded-xl"
            mainContent={user?.name || user?.username || user?.email}
            subContent={user?.code}
        />
    );
};

export default ReceiverInfor;
