import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading, href = '' }) => {
    if (href) {
        return (
            <Link href={href} prefetch={false}>
                <a
                    className={classNames(
                        'flex items-center justify-center rounded-md font-semibold text-base w-full py-3 px-6',
                        {
                            'dark:bg-bgBtnV2 dark:hover:bg-bgBtnV2-dark_pressed dark:active:bg-bgBtnV2-pressed dark:disabled:bg-bgBtnV2-dark_disabled':
                                variants === 'primary',
                            'dark:bg-dark-2 dark:hover:bg-hover-dark dark:active:bg-hover-dark dark:text-txtSecondary-dark': variants === 'secondary',
                            'px-0 text-sm dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                                variants === 'blank',
                            'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1]': disabled
                        },
                        className
                    )}
                >
                    {children}
                </a>
            </Link>
        );
    } else {
        return (
            <button
                className={classNames(
                    'flex items-center justify-center rounded-md font-semibold text-base w-full py-3 px-6',
                    {
                        'dark:bg-bgBtnV2 dark:hover:bg-bgBtnV2-dark_pressed dark:active:bg-bgBtnV2-pressed dark:disabled:bg-bgBtnV2-dark_disabled':
                            variants === 'primary',
                        'dark:bg-dark-2 dark:hover:bg-hover-dark dark:active:bg-hover-dark dark:text-txtSecondary-dark': variants === 'secondary',
                        'px-0 text-sm dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                            variants === 'blank',
                        'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1]': disabled
                    },
                    className
                )}
                onClick={onClick}
                disabled={disabled || loading}
            >
                {children}
            </button>
        );
    }
};

export default Button;
