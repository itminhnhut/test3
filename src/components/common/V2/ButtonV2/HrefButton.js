import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const HrefButton = ({ className = '', disabled = false, href = '/', children, variants = 'primary' }) => {
    return (
        <>
            <Link href={href} prefetch={false}>
                <a
                    className={classNames(
                        'py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 rounded-md font-medium text-xs xl:text-sm cursor-pointer',
                        {
                            'bg-teal text-white': variants === 'primary',
                            'bg-namiv2-gray text-txtSecondary dark:text-txtSecondary-dark': variants === 'secondary',
                            'text-teal': variants === 'blank',
                            'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1]': disabled
                        },
                        className
                    )}
                >
                    {children}
                </a>
            </Link>
        </>
    );
};

export default HrefButton;
