import classNames from 'classnames';
import React from 'react';
import { IconLoading } from '../Icons';
import useInsuranceLoginLink from 'hooks/useInsuranceLoginLink';

const InsuranceRedirectLink = ({ children, className, params = '', targetType, useLoading = true, ...props }) => {
    const { loading, onCreatInsuranceLink } = useInsuranceLoginLink({ params, targetType });

    return (
        <div {...props} className={classNames(className)} onClick={onCreatInsuranceLink}>
            {useLoading && loading && (
                <div className="bg-bgPrimary z-10 text-txtPrimary dark:text-txtPrimary-dark opacity-50 rounded-[inherit] absolute w-full h-full top-0 left-0 dark:bg-bgPrimary-dark flex justify-center items-center">
                    <IconLoading color="currentColor" />
                </div>
            )}
            {children}
        </div>
    );
};

export default InsuranceRedirectLink;
