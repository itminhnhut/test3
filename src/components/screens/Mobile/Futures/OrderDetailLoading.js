import React from 'react';
import Skeletor from 'components/common/Skeletor';

const OrderDetailLoading = () => {
    return (
        <div className="min-h-screen bg-onus">
            <div className="flex flex-col items-center mt-2">
                <Skeletor width={100} height={15} />
                <Skeletor width={100} height={10} />
            </div>
            <div>
                <Skeletor width={'100%'} height={350} />
            </div>
            <div className="mt-5 px-[16px]">
                <div className="py-[10px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <div className="flex">
                                    <Skeletor width={100} height={21} />
                                </div>
                                <div className="flex">
                                    <Skeletor width={50} height={10} />&nbsp;&nbsp;
                                    <Skeletor width={50} height={10} />
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                                <Skeletor width={80} height={8} />
                                <Skeletor width={80} height={8} />
                            </div>
                            <div className="ml-[16px]"> <Skeletor width={30} height={30} /></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap mt-[5px]">
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor width={'100%'} height={10} /></div>
                    </div>
                    <div className="h-[1px]"> <Skeletor width={'100%'} height={1} className="mt-[15px]" /></div>
                </div>
            </div>
            <div className="mt-5 px-[16px]">
                <Skeletor width={200} height={20} />
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor width={100} height={10} />
                    <Skeletor width={100} height={10} />
                </div>
            </div>
        </div>
    );
};

export default OrderDetailLoading;