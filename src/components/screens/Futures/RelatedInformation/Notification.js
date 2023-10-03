import { useTranslation } from 'next-i18next';
import React, { useEffect, useRef, useState, memo } from 'react';
import { useMemo } from 'react';
import { X } from 'react-feather';
import { API_BLOG_FUTURES } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import Link from 'next/link';
import { BxChevronDown, PriceAlertIcon, PriceAlertV2Icon } from 'components/svg/SvgIcon';
import SwiperCore, { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import classNames from 'classnames';

SwiperCore.use([Autoplay, Navigation]);

const index = memo(({ platform, symbol }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const KEY = `WARNING_SYMBOL_${platform}`;

    const [visible, setVisible] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [index, setIndex] = useState(0);
    const list = useRef();

    const getExpire = () => {
        const store = localStorage.getItem(KEY);
        return store ? JSON.parse(store)?.[symbol] : null;
    };

    const getArticle = async () => {
        try {
            const { data } = await FetchApi({
                url: API_BLOG_FUTURES,
                params: {
                    symbol,
                    language
                }
            });
            if (data) setDataSource(data);
        } catch (error) {}
    };

    useEffect(() => {
        getArticle();
    }, [language, symbol]);

    useEffect(() => {
        const expire = getExpire();
        const now = Date.now();
        const _dataFilter = !expire
            ? dataSource
            : dataSource.filter((item) => {
                  const time = expire[item.id];
                  const diffTimeStamp = now - time;
                  // const diffHours = diffTimeStamp / (1000 * 60 * 60);
                  // isShowAlert = diffHours >= 8;
                  const diffMinutes = diffTimeStamp / (1000 * 60);
                  if (time) console.log(`${symbol}_${item.id}_${diffMinutes}`);
                  return diffMinutes >= 5 || !time;
              });
        if (_dataFilter.length > 0) setVisible(true);
        setDataFilter(_dataFilter);
    }, [dataSource]);

    const rowData = useMemo(() => {
        if (!dataFilter || !dataFilter.length) return null;
        return dataFilter[index];
    }, [dataFilter, index]);

    const onHidden = (key) => {
        const store = localStorage.getItem(KEY);
        const _dataSource = JSON.parse(JSON.stringify(dataSource));
        const old = store ? JSON.parse(store) : {};
        const oldSymbol = store ? JSON.parse(store)?.[symbol] ?? {} : {};
        if (key === 'all') {
            const obj = _dataSource.reduce((acc, item) => {
                return (acc[item?.id] = Date.now()), acc;
            }, {});
            localStorage.setItem(
                KEY,
                JSON.stringify({
                    ...old,
                    [symbol]: obj
                })
            );
            setDataSource([]);
        } else {
            localStorage.setItem(
                KEY,
                JSON.stringify({
                    ...old,
                    [symbol]: {
                        ...oldSymbol,
                        [rowData?.id]: Date.now()
                    }
                })
            );
            _dataSource.slice(index, 1);
            if (platform === 'FUTURES') setIndex(0);
            setDataSource(_dataSource);
        }
    };

    const templateNAO = () => {
        const renderDots = () => {
            const dot = [];
            for (let i = 0; i < dataFilter.length; i++) {
                dot.push(
                    <div key={i} className={classNames('w-1 h-1 bg-gray-1 dark:bg-dark-2 rounded-full transition-all', { '!w-6 !bg-teal': i === index })} />
                );
            }
            return dot;
        };

        return (
            <div className="absolute top-0 px-4 w-full z-20 text-sm">
                <div className="p-3 bg-gray-13 dark:bg-dark-4 rounded-md">
                    <Swiper
                        loop
                        lazy
                        grabCursor
                        className={`mySwiper`}
                        slidesPerView={1}
                        spaceBetween={16}
                        onSlideChange={({ activeIndex }) => setIndex(activeIndex)}
                    >
                        {dataFilter.map((item) => {
                            return (
                                <SwiperSlide key={item?.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <PriceAlertIcon />
                                            <span className="font-semibold">{item?.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                onClick={() => onHidden('all')}
                                                className="text-xs leading-5 px-1 rounded-[3px] bg-gray-11 dark:bg-dark-2 font-medium"
                                            >
                                                {t('futures:close_all_blog')}
                                            </div>
                                            <X size={16} className="cursor-pointer" onClick={onHidden} />
                                        </div>
                                    </div>
                                    <div className="mt-2 line-clamp-2 relative flex items-end space-x-1">
                                        <span className="text-txtSecondary dark:text-txtSecondary-dark ">{item?.content}</span>
                                        <Link href={`/support/announcement/${language === 'vi' ? 'thong-bao' : 'announcement'}/${item?.slug}`}>
                                            <a target="_blank">
                                                <span className="text-teal font-semibold">{t('futures:read_more')}</span>
                                            </a>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <div className={classNames('flex items-center justify-center space-x-2 mt-3')}>{renderDots()}</div>
                </div>
            </div>
        );
    };

    if (!visible || !dataFilter.length) return null;
    if (platform === 'NAO_FUTURES') return templateNAO();
    return (
        <div className="mx-6 mt-2 text-sm flex items-center justify-between space-x-4">
            <div className="flex items-center justify-between bg-teal/10 px-6 py-4 rounded-md w-full">
                <div ref={list} className="text-white flex items-center space-x-2">
                    <PriceAlertV2Icon />
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">{rowData?.title}:</span>
                        <span>{rowData?.content}</span>
                        <Link href={`/support/announcement/${language === 'vi' ? 'thong-bao' : 'announcement'}/${rowData?.slug}`}>
                            <a target="_blank">
                                <span className="text-teal font-semibold">{t('futures:read_more')}</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center">
                    <div onClick={() => onHidden('all')} className="font-semibold cursor-pointer">
                        {t('futures:close_all_blog')}
                    </div>
                    <div className="w-[1px] h-[18px] bg-gray-7 mx-2" />
                    <X size={18} className="cursor-pointer" onClick={onHidden} />
                </div>
            </div>
            <div className="flex items-center space-x-2 select-none">
                <BxChevronDown onClick={() => setIndex(!index ? dataFilter.length - 1 : index - 1)} className="!rotate-180 cursor-pointer" size={20} />
                <span>
                    {index + 1}/{dataFilter.length}
                </span>
                <BxChevronDown className="cursor-pointer" onClick={() => setIndex(index + 1 >= dataFilter.length ? 0 : index + 1)} size={20} />
            </div>
        </div>
    );
});

export default index;
