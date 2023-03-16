import Image from 'next/image';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import useDarkMode from 'hooks/useDarkMode';
import User from 'components/svg/User';
import CreditCard from 'components/svg/CreditCard';
import IDCard from 'components/svg/IDCard';
import PlayFilled from 'components/svg/PlayFilled';
import { createElement, useState, useEffect, useMemo } from 'react';
import colors from 'styles/colors';
import { KYC_STATUS } from 'redux/actions/const';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_DEFAULT_BANK_USER, API_GET_USER_BANK_LIST, API_GET_BANK_ACCOUNT_NAME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import ModalNeedKyc from 'components/common/ModalNeedKyc';

const index = () => {
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth?.user);

    const isOpenModalKyc = useMemo(() => {
        return user ? user?.kyc_status !== 2 : false;
    }, [user]);

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        setLoading(true);

        // Fetch list bank accounts
        fetchAPI({
            url: API_GET_USER_BANK_LIST,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) {
                    // setKyc(data);
                    if (data) setDataTable(data);
                    else setDataTable([]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="mt-[58px] text-gray-15 dark:text-gray-4 font-semibold text-base">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] leading-[38px]">{t('identification:payment_method')}</h1>
                <div className="flex gap-x-4">
                    <SearchBoxV2
                        wrapperClassname="w-[360px]"
                        value={search}
                        onChange={(value) => {
                            setSearch('');
                        }}
                    />
                    <ButtonV2 className="w-auto whitespace-nowrap px-6">Thêm mới</ButtonV2>
                </div>
            </div>

            {/* Popup if user have not KYC yet */}
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
        </div>
    );
};

export default index;
