import { Transition } from '@headlessui/react';
import { IconFilter, IconPaginationNext, IconPaginationPrev } from 'components/common/Icons';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import TableNoData from 'components/common/table/TableNoData';
import SignalConfigLoader from 'components/loader/SignalConfigLoader';
import SignalFilter from 'components/signals/SignalFilter';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useEffect, useState } from 'react';

import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { getSignalNotification } from 'redux/actions/signal';
import { getLoginUrl } from 'redux/actions/utils';
import AuthSelector from 'redux/selectors/authSelectors';
import NotificationItem from 'src/components/signals/NotificationItem';
import { useComponentVisible } from 'utils/customHooks';
import FetchApi from 'utils/fetch-api';

const Signals = () => {
    const { t } = useTranslation();
    const tabs = ['signalList'];
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);
    const [currentSignalPage, setCurrentSignalPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
    const [selectedCategories, setSelectedCategories] = useState('');

    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const getSignalNotifications = async (pageNumb, categories) => {
        setLoading(true);
        const result = await getSignalNotification({ page: pageNumb ?? currentSignalPage, pageSize: 10, category: categories });
        if (result?.histories && result?.histories.length > 0) {
            const newHistories = result?.histories;
            newHistories.forEach(history => {
                filteredTemplates.forEach(template => {
                    if (history?.category === template?.category) {
                        Object.assign(history, { backgroundColor: template?.backgroundColor, s3LogoUrl: template?.s3LogoUrl });
                    }
                });
            });
            setNotifications(result?.histories);
            await setPageCount(Math.ceil(result?.total / 10)); // pageSize = 10
            return setLoading(false);
        }
        setNotifications([]);
        await setPageCount(0);
        return setLoading(false);
    };

    const getSignalTemplate = async () => {
        setLoading(true);
        const result = await FetchApi({
            url: '/api/v1/signal/template',
            options: {
                method: 'GET',
            },
        });

        if (result?.data && result?.data.length > 0) {
            setTemplates(result?.data);
            setFilteredTemplates(result?.data);
        }
    };

    const handlePageClick = async (page) => {
        await setLoading(true);
        await setCurrentSignalPage(+page.selected + 1);
        getSignalNotifications(+page.selected + 1, selectedCategories);
    };

    useEffect(() => {
        getSignalTemplate();
    }, []);

    useEffect(() => {
        if (filteredTemplates?.length > 0 && isAuth) {
            let cat = [];
            filteredTemplates.forEach(temp => {
                cat = [...cat, temp?.category];
            });
            getSignalNotifications(1, cat.join());
            setSelectedCategories(cat.join());
        }
    }, [filteredTemplates, isAuth]);

    const toggleFilter = (status) => {
        setIsComponentVisible(status ?? !isComponentVisible);
    };

    const renderTabs = () => {
        if (!isAuth) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <TableNoData />
                    <a href={getLoginUrl('sso')} className="btn button-common block text-center">
                        {t('common:sign_in_to_continue')}
                    </a>
                </div>
            );
        }
        if (loading) {
            const loader = [];
            for (let i = 0; i < 10; i++) {
                loader.push(<SignalConfigLoader />);
            }
            return loader.map((load, index) => <Fragment key={index}>{load}</Fragment>);
        }
        if (notifications?.length > 0) {
            return notifications.map(notification => {
                return (
                    <Fragment key={notification?._id}>
                        <NotificationItem
                            notification={notification}
                        />
                    </Fragment>
                );
            });
        }
        return <TableNoData />;
    };

    const selectFilter = (category) => {
        const newTemplates = templates.filter(template => category.includes(template.category));
        setFilteredTemplates(newTemplates);
    };

    return (
        <LayoutWithHeader>
            <div className="ats-container">
                <div className="text-4xl text-[#02083D] font-bold mt-20 mb-16 ">
                    Signals
                </div>

                <div className="card xl:max-w-screen-xl bg-white w-full rounded-3xl mb-12">
                    <div className="card-header xl:px-[110px] flex items-center justify-between !pb-7 lg:!px-[70px] !border-[#EEF2FA]" ref={ref}>
                        <ul className="tabs !border-b-0">
                            {
                                tabs.map((tab, index) => (
                                    <li className="!text-lg md:!text-3xl" key={index} style={{ fontWeight: 500 }}>
                                        {t(`signals:${tab}`)}
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="relative w-[80px]">
                            <button type="button" className="flex items-center justify-between w-full" onClick={() => toggleFilter(true)}>
                                <IconFilter /> <p className="text-[#4021D0] font-bold text-left">{t('signals:signal_filter')}</p>
                            </button>
                            <Transition
                                as="div"
                                show={isComponentVisible}
                                enter="transform transition duration-[300ms]"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="transform duration-400 transition ease-in-out"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-90"
                                className="absolute top-8 -right-10 sm:right-0 z-auto"
                            >
                                <div>
                                    <SignalFilter
                                        templates={templates}
                                        filteredTemplates={filteredTemplates}
                                        toggleFilter={toggleFilter}
                                        selectFilter={selectFilter}
                                        setCurrentSignalPage={setCurrentSignalPage}
                                    />
                                </div>
                            </Transition>
                        </div>
                    </div>
                    <div className="card-body lg:!px-[40px] xl:!px-[70px] lg:!py-12 !px-[10px]">
                        <div className="tab-content">
                            {renderTabs()}
                        </div>
                        <div className="flex items-center justify-center mt-5">
                            {
                                notifications && notifications.length > 0 && (
                                    <ReactPaginate
                                        previousLabel={<IconPaginationPrev isActive={currentSignalPage !== 1} />}
                                        nextLabel={<IconPaginationNext isActive={currentSignalPage !== pageCount} />}
                                        breakLabel="..."
                                        pageCount={pageCount}
                                        marginPagesDisplayed={1}
                                        pageRangeDisplayed={2}
                                        onPageChange={handlePageClick}
                                        forcePage={currentSignalPage - 1}
                                        containerClassName="flex flex-row items-center text-sm"
                                        activeClassName="bg-[#02083D] box-border px-[10px] py-[10px] w-[40px] h-[40px] text-center rounded"
                                        activeLinkClassName="text-white"
                                        pageClassName="text-[#8B8C9B] box-border px-[10px] py-[10px] w-[40px] h-[40px] text-center rounded"
                                        nextClassName="ml-[24px]"
                                        previousClassName="mr-[24px]"
                                        breakLinkClassName="text-[#8B8C9B]"
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'signals']),
    },
});

export default Signals;
