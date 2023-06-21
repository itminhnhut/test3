import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Image from 'next/image';

const HeaderStaking = ({ isMobile }) => {
    const handleScroller = () => {
        document.getElementById('asset_digital').scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="flex flex-col lg:flex-row justify-between gap-x-[99px]">
            <div className="w-full mt-[42px] lg:mt-[120px]">
                <h1 className="text-gray-15 dark:text-gray-4 text-2xl lg:text-6xl font-semibold text-center lg:text-left">
                    Nhận lãi suất không kỳ hạn với chương trình Staking của Nami
                </h1>
                <div className="text-gray-1 dark:text-gray-7 mt-3 text-sm lg:text-base text-center lg:text-left">
                    Chương trình Nhận lãi ngày từ Nami Exchange là công cụ tối ưu lợi nhuận từ tài sản số nhàn rỗi với mức lãi suất lên đến 12,79%/năm với VNDC
                    và 6%/năm với USDT
                </div>
                <div className="flex flex-row gap-3 mt-7 lg:mt-9 justify-center lg:justify-start">
                    <ButtonV2 className="w-[151px]" onClick={handleScroller}>
                        Bắt đầu ngay
                    </ButtonV2>
                    <ButtonV2 className="w-[151px] hidden" variants="secondary">
                        Thống kê
                    </ButtonV2>
                </div>
            </div>
            <div className="w-full text-center lg:mt-0 mt-12">
                <Image width="596px" height="582px" src="/images/staking/bg_header.png" />
            </div>
        </div>
    );
};

export default HeaderStaking;
