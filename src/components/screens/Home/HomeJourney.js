import { useTranslation } from 'next-i18next';
import React from 'react';
import { useWindowSize } from 'react-use';
import { getS3Url } from 'redux/actions/utils';

const HomeJourney = ({ t, width }) => {
    return (
        <section className="homepage-journey z-10">
            {/* <img src="/images/screen/homepage/journey_background.png" className="absolute w-full z-0 left-0" /> */}
            <div className="homepage-journey__wrapper mal-container">
                <div className="homepage-journey__title">{t('home:journey.title')}</div>
                <div className="homepage-journey__description">
                    {width >= 992 ? (
                        <>
                            {t('home:journey.description_desktop1')}
                            <br />
                            {t('home:journey.description_desktop2')}
                        </>
                    ) : (
                        <>{t('home:journey.description_mobile')}</>
                    )}
                </div>
                <div className="homepage-journey__group_content">
                    <div className="homepage-journey__group_content___left">
                        <div className="homepage-journey__group_content___left__item">
                            <div className="homepage-journey__group_content___left__item___icon">
                                <img
                                    // src={getS3Url('/images/screen/homepage/maxium_performance.png')}
                                    src={'/images/screen/homepage/maxium_performance_1.png'}
                                    width={width >= 1366 ? '52' : '44'}
                                    height={width >= 1366 ? '52' : '44'}
                                />
                            </div>
                            <div className="homepage-journey__group_content___left__item___content">
                                <div className="homepage-journey__group_content___left__item___content__title">{t('home:journey.reason_1')}</div>
                                <div className="homepage-journey__group_content___left__item___content__description">
                                    {t('home:journey.reason_1_description')}
                                </div>
                                {/* <div className="homepage-journey__group_content___left__item___content__viewmore">
                            <Button title={t('common:read_more')} type="primary" href={getV1Url('/futures')} />
                        </div> */}
                            </div>
                        </div>
                        <div className="homepage-journey__group_content___left__item">
                            <div className="homepage-journey__group_content___left__item___icon">
                                <img
                                    // src={getS3Url('/images/screen/homepage/crypto_knowledge.png')}
                                    src={'/images/screen/homepage/crypto_knowledge_1.png'}
                                    width={width >= 1366 ? '52' : '44'}
                                    height={width >= 1366 ? '52' : '44'}
                                />
                            </div>
                            <div className="homepage-journey__group_content___left__item___content">
                                <div className="homepage-journey__group_content___left__item___content__title">{t('home:journey.reason_4')}</div>
                                <div className="homepage-journey__group_content___left__item___content__description">
                                    {t('home:journey.reason_4_description')}
                                </div>
                                {/* <div className="homepage-journey__group_content___left__item___content__viewmore">
                            <Button title={t('common:read_more')} type="primary" href="https://explained.nami.exchange/" />
                        </div> */}
                            </div>
                        </div>

                        <div className="homepage-journey__group_content___left__item">
                            <div className="homepage-journey__group_content___left__item___icon">
                                <img
                                    // src={getS3Url('/images/screen/homepage/token_saving_cost.png')}
                                    src={'/images/screen/homepage/token_saving_cost_1.png'}
                                    width={width >= 1366 ? '52' : '44'}
                                    height={width >= 1366 ? '52' : '44'}
                                />
                            </div>
                            <div className="homepage-journey__group_content___left__item___content">
                                <div className="homepage-journey__group_content___left__item___content__title">{t('home:journey.reason_3')}</div>
                                <div className="homepage-journey__group_content___left__item___content__description">
                                    {t('home:journey.reason_3_description')}
                                </div>
                                {/* <div className="homepage-journey__group_content___left__item___content__viewmore">
                            <Button title={t('common:read_more')} type="primary" href="https://launchpad.nami.exchange" />
                        </div> */}
                            </div>
                        </div>
                        <div className="homepage-journey__group_content___left__item">
                            <div className="homepage-journey__group_content___left__item___icon">
                                <img
                                    // src={getS3Url('/images/screen/homepage/master_revenue.png')}
                                    src={'/images/screen/homepage/master_revenue_1.png'}
                                    width={width >= 1366 ? '52' : '44'}
                                    height={width >= 1366 ? '52' : '44'}
                                />
                            </div>
                            <div className="homepage-journey__group_content___left__item___content">
                                <div className="homepage-journey__group_content___left__item___content__title">{t('home:journey.reason_2')}</div>
                                <div className="homepage-journey__group_content___left__item___content__description">
                                    {t('home:journey.reason_2_description')}
                                </div>
                                {/*<div className="homepage-journey__group_content___left__item___content__viewmore">
                          <Button title={null} type="primary" />
                        </div>*/}
                            </div>
                        </div>
                    </div>
                    {/* <div className="homepage-journey__group_content___right">
                <img src={getS3Url('/images/screen/homepage/journey_graphics2.png')} alt="Nami Exchange" />
            </div> */}
                </div>
            </div>
        </section>
    );
};

export default HomeJourney;
