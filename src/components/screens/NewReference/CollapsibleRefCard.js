import classNames from 'classnames'
import React, { useState } from 'react'

const CollapsibleRefCard = ({ wrapperClassName = '', children, title, isTitle = true, isBlack = false }) => {
    return (
        <div className={classNames('bg-white px-4 py-6 rounded-xl', wrapperClassName, {'!bg-namiapp-black-1': isBlack, })}>
            {isTitle && (
                <div className="text-base font-semibold leading-5 flex w-full justify-between items-center text-gray-6">
                    <div>{title}</div>
                </div>
            )}
            <div className="mt-4">{children}</div>
        </div>
    );
};

const UpArrow = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m15 12.5-5-5-5 5" stroke="#718096" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const DownArrow = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m5 7.5 5 5 5-5" stroke="#718096" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
</svg>


export const FilterIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#wxdsk0dsia)">
        <path d="M6.667 12h2.666v-1.333H6.667V12zM2 4v1.333h12V4H2zm2 4.667h8V7.333H4v1.334z" fill="#718096" />
    </g>
    <defs>
        <clipPath id="wxdsk0dsia">
            <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
    </defs>
</svg>

export const FilterContainer = ({ children, onClick }) => <div onClick={onClick} className='text-gray-7 border-[1px] border-[#222940] text-xs leading-5 font-medium flex gap-2 items-center py-1 px-2 rounded-[800px]'>
    {children}
</div>



export default CollapsibleRefCard