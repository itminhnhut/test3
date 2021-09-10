import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Footer from 'components/common/Footer';
import { useTranslation } from 'next-i18next';

const About = () => {
    const { t } = useTranslation();
    return (
        <LayoutWithHeader>
            <div className="bg-white pt-[40px] pb-[70px] lg:pt-[120px] lg:pb-[350px]">
                <div className="nami-container text-center">
                    <div className="mb-12">
                        <svg className="mx-auto" width="146" height="81" viewBox="0 0 146 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.2451 79.6185L24.8437 70.8655H9.20195L5.80052 79.6185H0L13.6451 45.2891H20.6057L34.2508 79.6185H28.2451ZM22.7918 65.6185L17.0149 50.8106L11.238 65.6185H22.7918Z" fill="#020A3A" />
                            <path d="M45.5915 60.7882V71.0156C45.5915 74.1764 47.2724 75.4078 49.3401 75.4078C50.9422 75.4078 52.6942 74.6941 54.1068 73.8156L56.1587 77.9097C54.2568 79.1882 51.8655 80.2392 48.9061 80.2392C43.5554 80.2392 40.4223 77.3686 40.4223 71.1176V60.7882H35.7108V56.1294H40.4223V49.0156H45.5994V56.1294H54.6514V60.7882H45.5915Z" fill="#020A3A" />
                            <path d="M67.5073 60.7882V71.0156C67.5073 74.1764 69.1803 75.4078 71.2559 75.4078C72.858 75.4078 74.61 74.6941 76.0147 73.8156L78.0666 77.9097C76.1647 79.1882 73.7734 80.2392 70.814 80.2392C65.4554 80.2392 62.3223 77.3686 62.3223 71.1176V60.7882H57.6108V56.1294H62.3223V49.0156H67.5073V56.1294H76.5593V60.7882H67.5073Z" fill="#020A3A" />
                            <path d="M82.8569 79.6184V44.3086H88.034V79.6184H82.8569Z" fill="#020A3A" />
                            <path d="M113.675 79.6176V76.7941C112.049 78.8804 109.603 80.2294 106.249 80.2294C99.6351 80.2294 94.4265 75.0529 94.4265 67.8686C94.4265 60.6843 99.6351 55.5078 106.249 55.5078C109.603 55.5078 112.049 56.8804 113.675 58.9666V56.1196H118.836V79.6098H113.675V79.6176ZM99.7377 67.8686C99.7377 71.9862 102.429 75.398 106.872 75.398C111.142 75.398 114.006 72.1588 114.006 67.8686C114.006 63.5784 111.142 60.3392 106.872 60.3392C102.429 60.347 99.7377 63.7509 99.7377 67.8686Z" fill="#020A3A" />
                            <path d="M135.717 60.0018C132.907 60.0018 131.25 61.1313 131.25 62.794C131.25 64.4332 132.978 64.9038 135.149 65.2254L137.587 65.594C142.749 66.3313 145.803 68.5116 145.803 72.5352C145.803 77.045 141.857 80.2136 135.046 80.2136C132.6 80.2136 128.362 79.7509 124.905 77.194L127.296 73.343C129.001 74.645 131.242 75.743 135.093 75.743C138.621 75.743 140.468 74.6371 140.468 72.8724C140.468 71.5469 139.189 70.6685 136.372 70.2763L133.902 69.9548C128.669 69.2411 125.884 66.8411 125.884 63.0607C125.884 58.4018 129.632 55.5312 135.654 55.5312C139.355 55.5312 142.788 56.4411 145.227 58.0097L143.009 62.0097C141.588 61.1313 138.653 60.0018 135.717 60.0018Z" fill="#020A3A" />
                            <path d="M93.8663 20.6431C93.7558 20.5646 93.4559 20.4235 93.448 20.5411C93.3849 21.7725 91.8696 26.7843 85.4062 30.9176C76.4883 36.6117 57.7608 37.7254 55.6695 33.4196C55.3854 33.1529 54.6278 32.6666 54.6278 32.6666C54.4463 32.5019 54.5646 37.1058 63.885 37.6392C89.36 39.0901 94.5607 22.2666 93.8663 20.6431Z" fill="#3A2BC7" />
                            <path d="M82.9754 30.6345C85.0983 29.6541 92.4536 23.5443 92.0037 20.3913C91.9327 20.1168 91.7275 19.9913 91.4513 20.0384C90.6621 20.1796 88.6576 22.5874 87.7184 22.9953C87.5606 23.0658 87.4185 23.1835 87.2844 23.0188C87.1265 22.8305 87.2765 22.6894 87.4028 22.5717C87.7421 22.2423 89.4467 20.3286 89.7545 19.5129C89.8887 19.1443 89.8177 18.8619 89.5336 18.6345C89.2573 18.4149 89.3442 18.1639 89.2889 17.8502C89.1705 17.1678 80.6157 20.5247 61.9672 19.5051C61.4069 19.4737 60.8544 19.3717 60.2941 19.3482C59.9942 19.3325 59.6233 19.1286 59.4102 19.4815C59.2603 19.7404 59.1892 20.0462 59.1024 20.3364C59.0866 20.3835 59.2129 20.4698 59.2603 20.5325C59.2603 20.5325 60.4914 20.8619 61.5884 22.5482C64.4215 26.9168 62.1803 30.807 61.178 31.1756C61.1622 31.1835 61.9041 30.4462 62.275 28.7129C63.0642 25.0266 60.7202 22.4384 59.789 21.6776C59.7101 21.6149 59.1971 21.2384 58.9209 21.2854C57.1137 21.6227 56.577 22.3129 56.4034 22.407C55.4485 22.9325 54.9829 23.8031 54.8487 24.8384C54.683 26.109 54.8881 27.3482 55.2591 28.5639C55.2906 28.6658 55.2748 28.807 55.2275 28.8933C54.9907 29.3404 54.7145 29.7717 54.4778 30.2266C54.3594 30.4462 54.4146 30.6737 54.5488 30.8854C55.0144 31.6698 64.0427 39.4972 82.9754 30.6345ZM71.3822 20.8698C72.1793 20.7913 72.9922 20.7051 73.7892 20.7129C81.3891 20.6502 83.3148 22.6188 84.1987 24.556C84.3486 24.909 84.609 26.3129 84.3249 26.5404C83.9066 26.8855 83.4884 27.2462 83.0227 27.5129C81.6417 28.3207 80.1975 28.9953 78.6743 29.4972C77.6484 29.8345 76.6382 30.2658 75.5254 30.2972C75.265 30.3051 75.2019 30.2345 75.1624 29.9678C75.1151 29.6305 75.0204 29.3011 74.9099 28.9717C74.3259 27.2854 73.5209 25.709 72.3608 24.3286C70.9639 22.7129 69.6618 22.6737 69.3619 22.6188C68.8568 22.5325 68.3754 22.6188 67.894 22.7286C67.6809 22.7756 67.4678 22.8462 67.2705 22.9247L66.1972 22.2737C67.8624 21.607 69.5671 21.0423 71.3822 20.8698ZM64.9661 25.4109C65.1476 25.0345 65.3765 24.6658 65.6685 24.2894C65.6764 24.2815 65.6764 24.2815 65.6843 24.2737C65.7395 24.2266 65.9763 24.0305 66.3156 23.8266C66.576 23.709 66.8601 23.6305 67.1837 23.6305C68.5885 23.5992 69.6381 24.4776 70.3484 26.156C71.0586 27.8345 71.0981 29.9992 70.301 32.0149C69.5592 33.8972 67.7598 33.8894 67.1995 33.5364C66.6313 33.1835 64.8556 31.7011 64.6425 27.356C64.6189 26.7051 64.7372 26.007 64.9661 25.4109ZM59.3313 23.9678C60.2704 25.4031 60.8623 29.1443 59.7732 30.9717C58.8972 32.4462 57.4451 31.6462 57.1452 31.3168C56.3087 30.3992 55.5984 29.3874 55.3617 28.1482C54.2173 22.1325 57.7766 21.5913 59.3313 23.9678Z" fill="#3A2BC7" />
                            <path d="M72.637 22.5744C73.3315 23.2253 73.9944 23.892 74.4364 24.7547C74.468 24.8096 74.6258 24.8253 74.7205 24.8175C75.8806 24.6528 77.0328 24.4489 78.2008 24.3234C78.9979 24.2371 79.8108 24.2606 80.6158 24.2528C81.0025 24.2528 81.3892 24.3077 81.839 24.3391C81.7443 24.0567 81.6496 23.8214 81.6022 23.5861C81.5707 23.3979 81.4681 23.3038 81.3024 23.2489C80.6079 23.0371 79.9213 22.7783 79.2189 22.6293C78.3666 22.4567 77.4906 22.3077 76.6146 22.2763C75.3992 22.2371 74.176 22.3155 72.9606 22.3547C72.8186 22.3626 72.6765 22.4018 72.495 22.4332C72.566 22.5116 72.5976 22.543 72.637 22.5744Z" fill="#3A2BC7" />
                            <path d="M61.1544 18.6039C73.4815 19.2314 87.6001 17.2627 87.0319 12.7294C86.2269 13.0902 85.1536 13.2157 84.2066 13.2314C85.2562 12.3137 86.1717 11.2941 86.803 10.0235C86.3295 10.2353 85.9191 10.4157 85.5087 10.5961C85.485 10.5725 85.4693 10.5569 85.4456 10.5333C86.9135 8.8549 87.5764 6.90196 88.413 4.9098C87.0871 6.03137 85.856 7.10588 84.246 7.6C84.3171 7.50588 84.4118 7.44314 84.5065 7.38824C85.4377 6.81569 86.3374 6.21176 87.1187 5.45882C88.5155 4.10196 89.2337 2.59608 88.8865 0.854902C88.8154 0.501961 88.6655 0.219608 88.4524 0L87.5212 0.619608C85.7376 2.43137 84.4512 4.3451 83.5594 6.3451C83.2516 4.50196 82.5414 3.24706 82.5335 3.24706C82.2652 2.90196 82.06 2.68235 81.9732 2.65882C81.5707 2.57255 81.1761 2.48627 80.7736 2.43137C80.4658 2.39216 77.5458 2.97255 76.4173 3.32549C69.646 5.42745 61.1859 11.051 59.6865 12.6039C59.5365 12.7608 59.4734 12.8863 59.5444 13.1059C59.9232 14.3686 61.1544 18.6039 61.1544 18.6039Z" fill="#3A2BC7" />
                        </svg>
                    </div>
                    <div className="text-xl mb-2.5 text-black-600">
                        { t('about:question_1') }
                    </div>
                    <div className="text-3xl font-bold">
                        { t('about:question_2') }
                    </div>
                </div>
            </div>
            <div className="bg-white lg:bg-[#F6F5FB] lg:py-[100px] py-[30px]">
                <div className="nami-container relative">
                    <div className="grid lg:grid-cols-3 ">
                        <div className="lg:col-span-2">
                            <img
                                src="/images/about/md-section-1.svg"
                                alt=""
                                className="absolute top-[-300px] left-[40px] xl:top-[-330] xl:left-[120px] 2xl:top-[-330px] 2xl:left-[60px] invisible lg:visible hidden lg:block"
                            />
                            <img src="/images/about/section-1.svg" alt="" className="mx-auto lg:invisible lg:hidden mb-[30px]" />
                        </div>
                        <div>
                            <div className="text-3xl mb-5 font-bold">
                                { t('about:platform') }
                            </div>
                            <div className="text-lg text-black-600">
                                { t('about:platform_desc') }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white lg:py-[70px]">
                &nbsp;
            </div>
            <div className="bg-white lg:bg-[#F6F5FB] lg:py-[100px] py-[30px]">
                <div className="nami-container relative">
                    <div className="grid lg:grid-cols-3 ">
                        <div className="order-2 lg:order-1">
                            <div className="text-3xl mb-5 font-bold">
                                { t('about:ui') }
                            </div>
                            <div className="text-lg text-black-600">
                                VNDC & USDT
                            </div>
                        </div>
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <img
                                src="/images/about/md-section-2.svg"
                                alt=""
                                className="absolute top-[-320px] right-[0px] xl:top-[-310px] xl:right-[80px] 2xl:top-[-315px] 2xl:right-[20px] invisible lg:visible hidden lg:block"
                            />
                            <img src="/images/about/section-1.svg" alt="" className="mx-auto lg:invisible lg:hidden mb-[30px]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white lg:py-[70px]">
                &nbsp;
            </div>
            <div className="bg-white lg:bg-[#F6F5FB] lg:py-[48px] py-[30px]">
                <div className="nami-container relative">
                    <div className="grid lg:grid-cols-3 ">
                        <div className="lg:col-span-2">
                            <img
                                src="/images/about/md-section-3.svg"
                                alt=""
                                className="absolute top-[-185px] left-[20px] xl:top-[-140px] xl:left-[70px] 2xl:top-[-140px] 2xl:left-[60px] invisible lg:visible hidden lg:block"
                            />
                            <img src="/images/about/section-1.svg" alt="" className="mx-auto lg:invisible lg:hidden mb-[30px]" />
                        </div>
                        <div>
                            <div className="text-3xl mb-5 font-bold">
                                { t('about:ecosystem') }
                            </div>
                            <div className="text-lg text-black-600 mb-5">
                                { t('about:ecosystem_desc') }
                            </div>
                            <a href="/whitepaper/Whitepaper.pdf" target="_blank">
                                <button className="btn btn-primary" type="button">
                                    White paper
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white lg:py-[70px]">
                &nbsp;
            </div>
            <div className="bg-white lg:bg-[#F6F5FB] lg:py-[66px] py-[30px]">
                <div className="nami-container relative">
                    <div className="grid lg:grid-cols-12 ">
                        <div className="order-2 lg:order-1 lg:col-span-5">
                            <div className="lg:max-w-[440px]">
                                <div className="text-3xl mb-5 font-bold">
                                    { t('about:journey') }
                                </div>
                                <div className="text-lg text-black-600 mb-5">
                                    { t('about:journey_desc') }
                                </div>
                                <button className="btn btn-primary" type="button">
                                    { t('about:join_us') }
                                </button>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 lg:col-span-7">
                            <img
                                src="/images/about/md-section-4.svg"
                                alt=""
                                className="absolute top-[-170px] right-[20px] xl:top-[-120px] xl:right-[150px] 2xl:top-[-90px] 2xl:right-[60px] invisible lg:visible hidden lg:block"
                            />
                            <img src="/images/about/section-1.svg" alt="" className="mx-auto lg:invisible lg:hidden mb-[30px]" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'footer', 'navbar', 'about']),
    },
});

export default About;
