import classNames from 'classnames';
import React from 'react';
import { ImageNao } from 'components/screens/Nao/NaoStyle';

export default function Rank1Card({
    record,
    information = []
}) {
    return <div className='flex gap-4'>
        <img
            className='hidden lg:block'
            width={253}
            height={150}
            src='/images/nao/year_summary/rank_1.png'
            alt='Nami NAO rank 1'
        />
        <div
            className={classNames(
                'nao-gradient-border-mask relative flex flex-col justify-between flex-1 px-4 pt-8 pb-6',
                'lg:py-6 lg:px-[3.75rem] md:flex-row'
            )}>
            <img
                className='absolute top-[14px] left-[14px] md:top-[-22px] md:left-[-16px]'
                width={36}
                height={36}
                src='/images/nao/year_summary/bxs-crown.png'
                alt='Nami NAO'
            />
            <div className='flex justify-between items-center flex-1'>
                <div className='flex'>
                    <ImageNao
                        className='rounded-full h-[80px] w-[80px] md:w-[100px] md:h-[100px]'
                        width={80}
                        height={80}
                        src={record.avatar}
                        alt={record.name}
                    />

                    <div className='ml-4 md:ml-6 flex flex-1 min-w-0 flex-col justify-center'>
                        <p className='text-lg font-bold'>{record.name}</p>
                        <span className='text-sm text-onus-textSecondary w-full mr-1 break-words'>{record.onus_user_id}</span>
                    </div>
                </div>
                <div className='nao-hashtag-rank1 lg:hidden'>#1</div>
            </div>
            <div className='md:w-[1px] md:h-auto h-[1px] bg-onus-2 md:mx-8 md:my-0 my-4' />
            <div className='flex-1 flex flex-col justify-around space-y-1'>
                {information.map((item, index) => {
                    const value = record[item.valueKey]
                    return <div key={index} className='flex justify-between'>
                        <span className='text-sm text-nao-text'>{item.label}</span>
                        {item.render ? item.render(value, '!text-base'): value}
                    </div>;
                })}
            </div>
        </div>
    </div>;
}
