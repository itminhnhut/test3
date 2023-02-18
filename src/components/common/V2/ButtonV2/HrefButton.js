import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const HrefButton = ({ className = '', disabled = false, href = '/', children, variants = 'primary', target }) => {
    console.log(href);
    return (
        <Link href={href} prefetch={false}>
            <a
                target={target}
                className={classNames(
                    'flex whitespace-nowrap items-center justify-center rounded-md font-semibold text-base w-full py-3 px-6',
                    {
                        'bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white hover:text-white': variants === 'primary',
                        'dark:bg-dark-2 dark:hover:bg-hover-dark dark:active:bg-hover-dark dark:text-txtSecondary-dark': variants === 'secondary',
                        'px-0 text-sm text-txtTextBtn hover:text-txtTextBtn-pressed active:text-txtTextBtn-pressed dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed disabled:text-txtTextBtn-disabled':
                            variants === 'blank',
                        'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1] pointer-events-none': disabled
                    },
                    className
                )}
            >
                {children}
            </a>
        </Link>
    );
};

export default HrefButton;
