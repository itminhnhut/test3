import React from 'react';
import Card from './components/Card';
import { Clock } from 'react-feather';
import SelectCard from './components/SelectCard';

const CardPartner = () => {
    return (
        <Card className="min-h-[300px] ">
            <div className="txtSecond-2 mb-4">Thông tin thanh toán</div>
            <div className="space-y-4">
                <SelectCard
                    title="Đối tác kinh doanh"
                    info={{
                        name: 'Nguyễn Hoàng Thị Thuỳ Linh',
                        subInfo: (
                            <div className="flex items-center space-x-3">
                                <span>0901201031</span>
                                <div className="flex space-x-1 items-center">
                                    <Clock size={12} />
                                    <span>1 Phút</span>
                                </div>
                            </div>
                        )
                    }}
                />
                {/* <SelectCard title="Phương thức thanh toán" /> */}
            </div>
        </Card>
    );
};

export default CardPartner;
