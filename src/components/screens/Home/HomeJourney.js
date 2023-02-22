import React from 'react';
import { ArrowRightIcon } from 'components/svg/SvgIcon';
import { getS3Url } from 'redux/actions/utils';
import Link from 'next/link';
import Image from 'next/image';

const JOURNEY_DESCRIPTIONS = [
    {
        key: 1,
        image: 'maxium_performance_1',
        localized: 'journey.reason_1',
        href: '/futures'
    },
    {
        key: 2,
        image: 'crypto_knowledge_1',
        localized: 'journey.reason_4',
        href: '#'
    },
    {
        key: 3,
        image: 'token_saving_cost_1',
        localized: 'journey.reason_3',
        href: '#'
    },
    {
        key: 4,
        image: 'master_revenue_1',
        localized: 'journey.reason_2',
        href: '#'
    }
];

const HomeJourney = ({ t, width, currentTheme }) => {
    return (
        <section className="homepage-journey z-10">
            {/* <img src="/images/screen/homepage/journey_background.png" className="absolute w-full z-0 left-0" /> */}
            <div className="homepage-journey__wrapper mal-container">
                <div className="homepage-journey__title">{t('home:journey.title')}</div>
                <div className="homepage-journey__description">
                    {t('home:journey.description_desktop1')}
                    <br />
                    {t('home:journey.description_desktop2')}
                </div>

                <div className="homepage-journey__group_content">
                    <div className="homepage-journey__group_content___left -m-2">
                        {JOURNEY_DESCRIPTIONS.map((item) => (
                            // <Link key={item.key} href={item.href} passHref>
                            <div key={item.key} className="p-2 w-full md:w-1/2 relative group">
                                <div className="homepage-journey__group_content___left__item ">
                                    <div className="homepage-journey__group_content___left__item___icon">
                                        <Image
                                            src={getS3Url(`/images/screen/homepage/${item.image}${item.image === 'token_saving_cost_1' ? `_${currentTheme}` : ''}.png`)}
                                            width={width >= 1366 ? '52' : '44'}
                                            height={width >= 1366 ? '52' : '44'}
                                        />
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content">
                                        <div className="homepage-journey__group_content___left__item___content__title">{t(`home:${item.localized}`)}</div>
                                        <div className="homepage-journey__group_content___left__item___content__description">
                                            {t(`home:${item.localized}_description`)}
                                        </div>
                                    </div>
                                    {/* <div className="text-txtPrimary hidden lg:block group-hover:opacity-100 ease-in-out group-hover:right-0 right-4 relative opacity-0 transition-all dark:text-txtPrimary-dark">
                                            <ArrowRightIcon size={16} color="currentColor" />
                                        </div> */}
                                </div>
                            </div>
                            // {/* </Link> */}
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeJourney;
