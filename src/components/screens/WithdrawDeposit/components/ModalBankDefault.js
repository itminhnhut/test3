import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SearchBox from 'components/common/SearchBoxV2';

import InfoCard from './common/InfoCard';
import CheckCircle from 'components/svg/CheckCircle';
import { X } from 'react-feather';
import { setAccountDefaultBank } from 'redux/actions/withdrawDeposit';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import { filterSearch } from 'redux/actions/utils';
import NoData from 'components/common/V2/TableV2/NoData';

const ModalBankDefault = ({ isVisible, onClose, className, banks, toggleRefetch, t }) => {
    const [search, setSearch] = useState('');
    const [bankAccountId, setBankAccountId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState([]);

    useEffect(() => {
        if (banks && banks.length) {
            setFilter(filterSearch(banks, ['bankName', 'bankKey'], search));
        }
    }, [search, banks]);

    const onSetBankHandler = async () => {
        try {
            setLoading(true);
            const res = await setAccountDefaultBank({ bankAccountId });
            if (res && res.status === ApiStatus.SUCCESS) {
                toast({ text: `Bạn đã điều chỉnh tài khoản mặc định thành công`, type: 'success' });
                toggleRefetch();
            }
        } catch (error) {
            toast({ text: 'Điều chỉnh tài khoản mặc định không thành công', type: 'warning' });
            console.log('error:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName="!px-0"
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
            customHeader={() => (
                <div className="px-8 pt-8 flex justify-end">
                    <X onClick={onClose} size={24} />
                </div>
            )}
        >
            <div className="px-8 my-6">
                <div className="txtPri-3 mb-6">Chỉnh sửa mặc định</div>
                <SearchBox isValueTrim={false} inputClassname="text-base" width="100%" onChange={(value) => setSearch(value)} value={search} />
            </div>

            <div className="max-h-[300px] px-4 space-y-3 overflow-y-auto">
                {!filter.length ? (
                    <NoData isSearch />
                ) : (
                    filter.map((bank) => (
                        <button
                            onClick={() => setBankAccountId(bank._id)}
                            key={bank._id}
                            className={classNames('px-4 py-3 w-full flex rounded-xl border ', {
                                'border-teal': bank._id === bankAccountId,
                                'border-transparent ': bank._id !== bankAccountId
                            })}
                        >
                            <InfoCard
                                content={{
                                    mainContent: bank.bankName,
                                    subContent: (
                                        <div className="flex space-x-2 items-center">
                                            <span>{bank.accountNumber}</span>
                                            {bank.isDefault && (
                                                <TagV2 icon={false} type="success">
                                                    <span className="text-sm">Mặc định</span>
                                                </TagV2>
                                            )}
                                        </div>
                                    )
                                }}
                                endIcon={
                                    bank._id === bankAccountId && (
                                        <div className="text-dominant">
                                            <CheckCircle size={16} color="currentColor " />
                                        </div>
                                    )
                                }
                                endIconPosition="center"
                                imgSize={40}
                            />
                        </button>
                    ))
                )}
            </div>
            <div className="px-8 mt-10">
                <ButtonV2
                    className="disabled:!cursor-default"
                    onClick={onSetBankHandler}
                    disabled={!filter.length || !bankAccountId || (filter.length && bankAccountId === filter.find((bank) => bank.isDefault)?._id)}
                    loading={loading}
                >
                    {t('dw_partner:set_as_default')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default ModalBankDefault;
