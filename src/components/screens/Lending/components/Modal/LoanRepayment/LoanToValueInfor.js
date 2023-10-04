import React from 'react';
import { formatNumber } from 'redux/actions/utils';

const LoanToValueInfor = ({ initialLTV, adjustLTV }) => (
    <section className="flex flex-col space-y-3">
        <section className="flex flex-row justify-between ">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">LTV ban đầu</div>
            <div className="font-semibold">{initialLTV * 100}%</div>
        </section>
        <section className="flex flex-row justify-between ">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">LTV ước tính</div>
            <div className="font-semibold">{(adjustLTV * 100).toFixed(2)}%</div>
        </section>
    </section>
);

export default LoanToValueInfor;
