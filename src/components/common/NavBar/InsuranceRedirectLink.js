import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { getInsuranceLoginLink } from 'redux/actions/utils';
import { IconLoading } from '../Icons';

const InsuranceRedirectLink = ({ children, isVertical, ...props }) => {
    const timer = useRef();
    const [loading, setLoading] = useState(false);
    const onCreatLinkInsurance = (e) => {
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            e.preventDefault();
            await getInsuranceLoginLink();
            setLoading(false);
        }, 200);
    };
    return (
        <div
            {...props}
            className={classNames('relative !pt-0 !pr-0 mal-navbar__link__group___item___childen__lv1___col2 w-1/2 flex', {
                '!w-full': isVertical,
                'w-[48%]': !isVertical
            })}
            onClick={onCreatLinkInsurance}
        >
            {loading && (
                <div className="bg-bgPrimary z-10 text-txtPrimary dark:text-txtPrimary-dark opacity-50 rounded-xl absolute w-full h-full top-0 left-0 dark:bg-bgPrimary-dark flex justify-center items-center">
                    <IconLoading color="currentColor" />
                </div>
            )}
            {children}
        </div>
    );
};

export default InsuranceRedirectLink;
