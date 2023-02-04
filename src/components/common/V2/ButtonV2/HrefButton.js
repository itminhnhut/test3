import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const HrefButton = ({ className = '', disabled = false, href = '/', children, variants = 'primary' }) => {
    return (
        <>
            <Link href={href} prefetch={false}>
                <a
                    className={classNames(
                        'flex items-center justify-center rounded-lg px-auto py-auto font-semibold h-[2.75rem] sm:h-[3rem] text-sm sm:text-base w-full py-3',
                        {
                            'bg-teal text-white': variants === 'primary',
                            'bg-namiv2-gray text-txtSecondary dark:text-txtSecondary-dark': variants === 'secondary',
                            'text-teal !text-sm active:text-txtTextBtn-pressed dark:active:text-txtTextBtn-dark_pressed': variants === 'blank',
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
