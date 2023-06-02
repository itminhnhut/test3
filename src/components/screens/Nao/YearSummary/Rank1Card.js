import classNames from 'classnames';
import React from 'react';
import { ImageNao } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';
import styled from 'styled-components';
import TickFbIcon from 'components/svg/TickFbIcon';

const BackgroundTop1 = styled.div.attrs({
    className: 'rounded-xl'
})`
    background-image: ${() => `url(${getS3Url('/images/contest/bg_top.png')})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

export default function Rank1Card({ record, information = [] }) {
    return (
        <div className="flex gap-4 text-sm md:text-base">
            <BackgroundTop1 className="hidden lg:flex relative min-h-[152px] min-w-[286px] items-center justify-center">
                <span className="text-[5rem] font-semibold text-white italic">#1</span>
            </BackgroundTop1>
            <BackgroundTop1
                className={classNames(
                    'bg-white dark:bg-darkBlue-3 relative flex flex-col justify-between flex-1 pl-3 pr-4 pt-5 pb-6',
                    'lg:py-6 lg:px-[3.75rem] md:flex-row lg:!bg-none'
                )}
            >
                <div className="flex justify-between items-center flex-1">
                    <div className="flex items-center space-x-4">
                        <div className="w-[4.25rem] h-[4.25rem] lg:w-[6.75rem] lg:h-[6.75rem] rounded-full p-1 border-[1.5px] border-teal flex items-center relative">
                            <img
                                className="absolute top-[-18px] left-[-7px] lg:-top-7 lg:-left-3 w-[30px] h-[30px] lg:w-[50px] lg:h-[50px]"
                                src={getS3Url('/images/contest/ic_crown.png')}
                                alt="Nami NAO"
                            />
                            <ImageNao className="object-cover" src={record?.avatar} alt="" />
                        </div>

                        <div className="ml-3 md:ml-6 flex flex-1 min-w-0 flex-col justify-center text-white lg:text-txtPrimary dark:text-white">
                            <div className="text-base md:text-lg font-semibold">
                                <span>{record.name}</span>
                                {record?.is_group_master && <TickFbIcon size={16} />}
                            </div>
                            <span className="mt-0.5 sm_only:text-white text-sm lg:text-base text-txtSecondary dark:text-txtSecondary-dark w-full break-words">
                                {record.onus_user_id}
                            </span>
                        </div>
                    </div>
                    <div className="text-5xl pb-0 font-semibold lg:hidden italic text-white">#1</div>
                </div>
                <div className="md:w-[1px] md:h-auto h-0 bg-divider dark:bg-divider-dark md:mx-8 md:my-0 my-[14px]" />
                <div className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4">
                    {information.map((item, index) => {
                        const value = record[item.valueKey];
                        return (
                            <div key={index} className="flex justify-between">
                                <span className="text-white md:text-txtSecondary md:dark:text-txtSecondary-dark !font-normal">{item.label}</span>
                                {item.render ? item.render(value, `!font-semibold text-white ${item.valueKey === 'pnl_rate' ? 'md:text-teal' : ''}`) : value}
                            </div>
                        );
                    })}
                </div>
            </BackgroundTop1>
        </div>
    );
}
