import { Switch } from '@headlessui/react';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSecurityGoogleAuthenticator } from 'src/components/common/Icons';
import GoogleAuthModal from 'src/components/security/GoogleAuthModal';
import * as Error from 'src/redux/actions/apiError';
import { SECURITY_VERIFICATION } from 'src/redux/actions/const';
import { enable2FA, generate2FASecret, get2FACheckPassId } from 'src/redux/actions/user';
import AuthSelector from 'src/redux/selectors/authSelectors';
import showNotification from 'src/utils/notificationService';
import MyPage from '../my';

const Security = () => {
    const user = useSelector(AuthSelector.userSelector);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [activeModal, setActiveModal] = useState(false);
    const [activeGoogleAuth, setActiveGoogleAuth] = useState(false);
    // const [activeSMS, setActiveSMS] = useState(true);
    // const [activeEmail, setActiveEmail] = useState(true);
    const [checkPassId, setCheckPassId] = useState('');
    const [securityMethods, setSecurityMethods] = useState([]);
    const [googleSecretKey, setGoogleSecretKey] = useState('');
    const [googleSecretKeyQr, setGoogleSecretKeyQr] = useState('');

    // const pageCount = 10;

    useEffect(() => {
        setActiveGoogleAuth(!!user?.totpSet);
    }, [user]);

    // const dummyData = [
    //     {
    //         id: 0,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 1,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 2,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 3,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 4,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 5,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 6,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    //     {
    //         id: 7,
    //         device: 'Chrome V90.0.4430.212 (Windows)',
    //         time: new Date(),
    //         location: 'Hanoi, VN',
    //         ip: '123.16.147.112',
    //     },
    // ];

    // const customStyles = {
    //     ...tableStyle,
    //     rows: {
    //         style: {
    //             borderBottom: 'none !important',
    //             '&:nth-child(odd)': {
    //                 background: '#F6F9FC',
    //             },
    //             height: '53px',
    //         },
    //     },
    //     cells: {
    //         style: {
    //             fontSize: '0.875rem',
    //             lineHeight: '1.3125rem',
    //             fontWeight: '500 !important',
    //             color: '#02083D',
    //         },
    //     },
    // };

    // const columns = useMemo(() => [
    //     {
    //         name: 'Thiết bị',
    //         selector: 'device',
    //         width: '240px',
    //         cell: (row) => row?.device,
    //         sortable: true,
    //         ignoreRowClick: true,
    //     },
    //     {
    //         name: 'Thời gian',
    //         selector: 'time',
    //         width: '160px',
    //         cell: (row) => format(row?.time, 'dd/MM/yyyy H:mm'),
    //         sortable: true,
    //         ignoreRowClick: true,
    //         right: true,
    //     },
    //     {
    //         name: 'Địa điểm',
    //         selector: 'location',
    //         width: '140px',
    //         cell: (row) => row?.location,
    //         sortable: true,
    //         ignoreRowClick: true,
    //         right: true,
    //     },
    //     {
    //         name: 'Địa chỉ IP',
    //         selector: 'ip',
    //         width: '140px',
    //         cell: (row) => row?.ip,
    //         sortable: true,
    //         ignoreRowClick: true,
    //         right: true,
    //     },
    //     {
    //         name: '',
    //         selector: 'action',
    //         width: '80px',
    //         cell: (row) => <span className="text-[#4021D0]">Xoá</span>,
    //         sortable: true,
    //         ignoreRowClick: true,
    //         right: true,
    //     },
    // ], [dummyData]);

    // const handlePageClick = (page) => {
    //     setCurrentPage(page.selected + 1);
    // };

    const handleOnClose = () => {
        setActiveModal(false);
        setActiveGoogleAuth(false);
    };

    const renderErrorNotification = (errorCode) => {
        const error = find(Error, { code: errorCode });
        const description = error
            ? t(`error:${error.message}`)
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const handleToggleGoogleAuth = async () => {
        if (activeModal || activeGoogleAuth) return setActiveModal(false);
        setActiveModal(true);
        setActiveGoogleAuth(true);
        const faSecret = await dispatch(await generate2FASecret());
        if (faSecret?.secret && faSecret?.url) {
            setGoogleSecretKey(faSecret?.secret);
            setGoogleSecretKeyQr(faSecret?.url);
            const result = await dispatch(await get2FACheckPassId({ secretKey: faSecret?.secret }));
            if (result?._id) {
                setCheckPassId(result?._id);
                return setSecurityMethods(result?.securityMethods);
            }
            renderErrorNotification(result);
            return setActiveGoogleAuth(false);
        }
        renderErrorNotification(faSecret);
        return setActiveGoogleAuth(false);
    };

    const handleConfirmSecure = async () => {
        const result = await dispatch(await enable2FA({ secretKey: googleSecretKey, checkpassId: checkPassId }));
        if (result) {
            setActiveGoogleAuth(false);
            return renderErrorNotification(result);
        }
        showNotification({ message: t('profile:google_auth_enable'), title: t('common:success'), type: 'success' });
        setActiveModal(false);
        setActiveGoogleAuth(true);
    };

    return (
        <div className="relative">
            <MyPage>
                <div className="px-[70px] py-12 rounded-lg bg-white mb-[10px]">
                    <p className="text-2xl text-[#02083D] font-bold mb-[10px]">{t('security:title')}</p>
                    <p className="text-base text-[#52535C] mb-6">{t('security:desc')}
                    </p>
                    <div className="flex flex-row items-center justify-between border border-[#EEF2FA] rounded-[12px] mb-[10px] px-10 py-5">
                        <p className="flex flex-row items-center"><span className="mr-3"><IconSecurityGoogleAuthenticator /></span> {t('security:google_auth')}</p>
                        <Switch
                            checked={activeGoogleAuth}
                            onChange={handleToggleGoogleAuth}
                            className={`${activeGoogleAuth ? 'bg-[#4021D0]' : 'bg-[#E1E2ED]'}
          relative inline-flex flex-shrink-0 ml-2 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${activeGoogleAuth ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
                            />
                        </Switch>
                    </div>
                    {/* <div className="flex flex-row items-center justify-between border border-[#EEF2FA] rounded-[12px] mb-[10px] px-10 py-5">
                        <p className="flex flex-row items-center"><span className="mr-3"><IconSecuritySMS /></span> Xác nhận SMS</p>
                        <Switch
                            checked={activeSMS}
                            onChange={() => {}}
                            className={`${activeSMS ? 'bg-[#4021D0]' : 'bg-[#E1E2ED]'}
          relative inline-flex flex-shrink-0 ml-2 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${activeSMS ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
                            />
                        </Switch>
                    </div>
                    <div className="flex flex-row items-center justify-between border border-[#EEF2FA] rounded-[12px] px-10 py-5">
                        <p className="flex flex-row items-center"><span className="mr-3"><IconSecurityEmail /></span> Xác nhận Email</p>
                        <Switch
                            checked={activeEmail}
                            onChange={() => {}}
                            className={`${activeEmail ? 'bg-[#4021D0]' : 'bg-[#E1E2ED]'}
          relative inline-flex flex-shrink-0 ml-2 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${activeEmail ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
                            />
                        </Switch>
                    </div> */}
                </div>
                {/* <div className="px-[70px] py-12 rounded-lg bg-white">
                    <p className="text-2xl text-[#02083D] font-bold mb-[10px]">Quản lý thiết bị</p>
                    <p className="text-base text-[#52535C] mb-6">Các thiết bị được phép đăng nhập vào tài khoản của bạn gần đây
                    </p>
                    <DataTable
                        data={dummyData}
                        columns={columns}
                        noHeader
                        customStyles={customStyles}
                        overflowY // prevent clipping menu
                        noDataComponent={<TableNoData />}
                        sortIcon={<div className="mx-1"><IconSort /></div>}
                        className="ats-table"
                        style={{
                            padding: 0,
                            margin: 0,
                        }}
                        progressComponent={<TableLoader />}
                    // onRowClicked={(row) => handleToggleDetailModal(row)}
                    />
                    <div className="flex items-center justify-center mt-10">
                        {
                            dummyData && dummyData.length > 0 && (
                                <ReactPaginate
                                    previousLabel={<IconPaginationPrev isActive={currentPage !== 1} />}
                                    nextLabel={<IconPaginationNext isActive={currentPage !== pageCount} />}
                                    breakLabel="..."
                                    pageCount={pageCount}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={2}
                                    onPageChange={handlePageClick}
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
                </div> */}
            </MyPage>
            {activeModal && <GoogleAuthModal
                user={user}
                closeModal={handleOnClose}
                authType={SECURITY_VERIFICATION.ENABLE_GA_VERIFICATION}
                securityMethods={securityMethods}
                checkPassId={checkPassId}
                googleSecretKey={googleSecretKey}
                googleSecretKeyQr={googleSecretKeyQr}
                confirmSecure={handleConfirmSecure}
            />}
        </div>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'account', 'profile', 'security', 'error']),
        },
    };
}

export default Security;
