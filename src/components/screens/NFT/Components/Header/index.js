import { Swiper, SwiperSlide } from 'swiper/react';

// ** NEXT
import Image from 'next/image';

// ** Import Swiper styles
import 'swiper/css/pagination';
import 'swiper/css';

const ITEMS = [
    { src: '/images/nft/banner/banner_1.png', title: '2', id: 1 },
    { src: '/images/nft/banner/banner_1.png', title: '2', id: 1 },
    { src: '/images/nft/banner/banner_1.png', title: '2', id: 1 },
    { src: '/images/nft/banner/banner_1.png', title: '2', id: 1 }
];

// import required modules
import { Autoplay, Pagination } from 'swiper';

const HeaderNFT = ({ isMobile }) => {
    return (
        <section className="mt-12 max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
            <Swiper
                pagination={{
                    clickable: true
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
                // spaceBetween={16}
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
                        <SwiperSlide key={`career_new_${index}_${item.src}`}>
                            <Image src={item.src} width="1216" height="460" />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
};
export default HeaderNFT;
