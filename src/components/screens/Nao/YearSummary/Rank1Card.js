import classNames from 'classnames';
import React from 'react';
import { ImageNao } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';

export default function Rank1Card({
    record,
    information = []
}) {
    return (
        <div className="flex gap-4 text-sm sm:text-base">
            <img className="hidden lg:block" width={253} height={150} src={getS3Url('/images/nao/year_summary/rank_1.png')} alt="Nami NAO rank 1" />
            {/*
                to do: make it beauty
                <div className="w-64 h-[9.5rem] flex items-center justify-center text-[6rem] text-teal font-semibold bg-white dark:bg-darkBlue-3 rounded-lg">#1</div>
            */}
            <div
                className={classNames(
                    'bg-white dark:bg-darkBlue-3 relative flex flex-col justify-between flex-1 px-4 pt-8 pb-6',
                    'lg:py-6 lg:px-[3.75rem] md:flex-row'
                )}
            >
                <img
                    className="absolute top-[14px] left-[14px] md:top-[-22px] md:left-[-16px]"
                    width={36}
                    height={36}
                    src={getS3Url('/images/nao/year_summary/bxs-crown.png')}
                    alt="Nami NAO"
                />
                <div className="flex justify-between items-center flex-1">
                    <div className="flex items-center space-x-4">
                        <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                            <ImageNao
                                className="object-cover"
                                src={record?.avatar}
                                alt=""
                            />
                        </div>

                        <div className="ml-4 md:ml-6 flex flex-1 min-w-0 flex-col justify-center">
                            <p className="text-base sm:text-lg font-semibold">{record.name}</p>
                            <span className="text-sm lg:text-base text-txtSecondary dark:text-txtSecondary-dark w-full mr-1 break-words">
                                {record.onus_user_id}
                            </span>
                        </div>
                    </div>
                    <div className="text-6xl pb-0 font-semibold lg:hidden">#1</div>
                </div>
                <div className="md:w-[1px] md:h-auto h-0 bg-divider dark:bg-divider-dark md:mx-8 md:my-0 my-4" />
                <div className="flex-1 flex flex-col justify-around space-y-3">
                    {information.map((item, index) => {
                        const value = record[item.valueKey];
                        return (
                            <div key={index} className="flex justify-between">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark !font-normal">{item.label}</span>
                                {item.render ? item.render(value, '!font-semibold') : value}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
