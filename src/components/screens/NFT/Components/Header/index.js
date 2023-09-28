import { Swiper, SwiperSlide } from 'swiper/react';

// ** NEXT
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

// ** Import Swiper styles
import 'swiper/css/pagination';
import 'swiper/css';

const ITEMS = [
    {
        src: { vi: '/images/nft/banner/banner_1_vi.png', en: '/images/nft/banner/banner_1_en.png' },
        title: {
            vi: 'Bộ sưu tập các tài sản số độc đáo và sáng tạo - nơi kết nối nghệ thuật và công nghệ. Sở hữu ngay các vật phẩm để tận hưởng những ưu đãi độc quyền trên Nami Exchange!',
            en: 'Unique and innovative digital asset collection, where art, technology and cryptocurrency are being connected. Becoming the NTFs’ owner now to enjoy exclusive offers on Nami Exchange!'
        },
        id: 1
    }
];

// import required modules
import { Autoplay, Pagination } from 'swiper';

const HeaderNFT = ({ isMobile }) => {
    const {
        i18n: { language }
    } = useTranslation();

    return (
        <section className="mt-12 max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
            <Swiper
                pagination={{
                    clickable: true
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper mySwiper_nft"
                loop={true}
                speed={3000}
                centeredSlides={!!isMobile}
                // autoplay={{
                //     delay: 100,
                //     disableOnInteraction: false
                // }}
            >
                {ITEMS?.map((item, index) => {
                    return (
                        <SwiperSlide key={`career_new_${index}_${item.src?.[language]}`}>
                            <Image src={item.src?.[language]} width="1216" height="460" title={item.title?.[language]} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
};
export default HeaderNFT;
