import React from 'react'
import styledComponents from 'styled-components'
import { Line } from '..'
import RefCard from '../RefCard'

const Info = () => {
    return (
        <div className='w-full px-4'>
            <RefCard>
                <div className='flex h-12 gap-4'>
                    <div className='bg-red h-full w-12 rounded-full'>

                    </div>
                    <div className='h-full flex flex-col justify-center'>
                        <div className='font-semibold text-base text-darkBlue'>
                            Nguyen Ngoc Hoan My
                        </div>
                        <div className='font-medium text-xs text-gray-1'>
                            CAP BAC: <span className='text-teal font-semibold'>VANG</span>
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-1' >
                    <div className='h-6 flex items-center w-full justify-between font-medium text-sm'>
                        <div className='font-medium text-sm text-gray-1'>
                            Giao dich Spot
                        </div>
                        <div className='text-darkBlue'>
                            500, 000 USDT
                        </div>
                    </div>
                    <div className='flex w-full justify-between font-medium text-sm'>
                        <div className='text-gray-1'>
                            Giao dich Spot
                        </div>
                        <div className='text-darkBlue'>
                            500, 000 USDT
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex h-6 items-center justify-between text-gray-1 font-medium text-xs'>
                        <div>
                            Volume hien tai
                        </div>
                        <div>
                            Cap tiep theo
                        </div>
                    </div>
                    <div className='w-full bg-[#f2f4f7]'>
                        <Progressbar
                            background='#00C8BC'
                            percent={
                                ((50) / 100) * 100
                            }
                            height={4}
                        />
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between font-medium text-xs text-darkBlue-1'>
                            <div>
                                Spot: 500K USDT
                            </div>
                            <div>
                                Spot: 1M USDT
                            </div>

                        </div>
                        <div className='w-full flex justify-between font-medium text-xs text-darkBlue-1'>

                            <div>
                                Futures: 500K USDT
                            </div>
                            <div>
                                Futures: 1M USDT
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 text-center leading-6 font-medium text-sm text-teal underline cursor-pointer'>
                            Quản lý Referral
                    </div>
                </div>
            </RefCard>
        </div>
    )
}


const Progressbar = styledComponents.div.attrs(({ height = 10 }) => ({
    className: `rounded-lg transition-all`,
}))`
    background: ${({ background }) =>
        background
            ? background
            : "linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)"};
    width: ${({ percent }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height || 6}px`};
`;

export default Info