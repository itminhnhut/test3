import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const HrefButton = ({ className = '', disabled = false, href = '/', children, variants = 'primary', target }) => {
    return (
        <Link href={href} prefetch={false}>
            <a
                target={target}
                className={classNames(
                    className,
                    'flex whitespace-nowrap items-center justify-center rounded-md font-semibold text-[14px] leading-[18px] md:text-base w-full py-3 px-6',
                    {
                        'bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white hover:text-white': variants === 'primary',
                        'whitespace-nowrap text-gray-15 dark:text-gray-7 bg-gray-10 dark:bg-dark-2 hover:bg-gray-6 dark:hover:bg-dark-5':
                            variants === 'secondary',
                        'px-0 text-sm text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark':
                            variants === 'blank',
                        'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1] pointer-events-none': disabled
                    }
                )}
            >
                {children}
            </a>
        </Link>
    );
};

export default HrefButton;
