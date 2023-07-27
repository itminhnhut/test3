import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { useDebounce } from 'react-use';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Trans, useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';

import { API_GET_CHECK_NAMI_CODE_NFT, API_POST_TRANSFER_NFT } from 'redux/actions/apis';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

import { WrapperStatus, WrapperLevelItems } from 'components/screens/NFT/Components/Lists/CardItems';
import { LIST_TIER, STATUS } from 'components/screens/NFT/Constants';

import classNames from 'classnames';

const MAX_LENGTH = 14;

const Transfer = ({ isModal, onCloseModal, detail, idNFT }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);
    const [error, setError] = useState();
    const [debouncedValue, setDebouncedValue] = useState('');

    useDebounce(
        () => {
            setDebouncedValue(code);
        },
        600,
        [code]
    );

    // ** submit transfer
    const handleTransferSubmit = async () => {
        try {
            setLoading(true);
            const { statusCode } = await FetchApi({
                url: API_POST_TRANSFER_NFT,
                options: {
                    method: 'POST'
                },
                params: { id: idNFT, code }
            });
            if (statusCode === 201) {
                toast({ text: 'Sử dụng WNFT thành công', type: 'success', duration: 1500 });
                setTimeout(() => router.push('/wallet/NFT'), 3000);
            }
        } catch (err) {
            throw new Error('call api submit transfer failed', { cause: err });
        } finally {
            setLoading(false);
        }
    };

    // ** handle check nami code
    const handleCheckNamiCode = async () => {
        try {
            setLoading(true);
            const { statusCode } = await FetchApi({ url: API_GET_CHECK_NAMI_CODE_NFT, params: { code } });
            if (statusCode !== 200) {
                setError(statusCode);
            } else {
                setIsSubmit(false);
            }
        } catch (err) {
            throw new Error('call api check nami code failed', { cause: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(debouncedValue);
        if (debouncedValue.length === MAX_LENGTH) {
            error && setError('');
            handleCheckNamiCode();
            return;
        }
        if (debouncedValue.length > 0 && debouncedValue.length < MAX_LENGTH) {
            setError('code_error_format');
        }
    }, [debouncedValue]);

    const onChange = (e) => {
        setCode(String(e.target.value).trim());
    };

    const onPaste = async () => {
        const pasteCode = await navigator.clipboard.readText();
        setCode(pasteCode);
    };

    const tier = LIST_TIER.find((item) => item.active === detail?.tier);

    return (
        <ModalV2
            isVisible={isModal}
            onBackdropCb={onCloseModal}
            className="!max-w-[488px] bg-[#ffffff] dark:bg-dark-dark border-divider dark:border-divider-dark"
            wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                        onClick={onCloseModal}
                    >
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            <section className="flex flex-col">
                <section className="text-gray-15 dark:text-gray-4 text-2xl font-semibold ">Chuyển WNFT</section>
                <section className="mt-8 dark:bg-dark-4 bg-white border-[1px] border-divider dark:border-dark-4 rounded-xl px-3 py-3 w-full flex flex-row gap-4">
                    <section className="w-full max-w-[148px] max-h-[148px]">
                        <Image width={148} height={148} src={detail?.image} sizes="100vw" />
                    </section>
                    <section className="my-[21px]">
                        <p className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{detail?.name}</p>
                        <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                            <p>Cấp độ:</p>
                            <p className="rate">{tier?.name?.[language]}</p>
                        </WrapperLevelItems>
                        <WrapperStatus status={STATUS?.[detail?.status]?.key} className={classNames('h-7 mt-5 py-1 px-4 rounded-[80px] text-sm')}>
                            {STATUS?.[detail?.status]?.[language]}
                        </WrapperStatus>
                    </section>
                </section>
                <form className="mt-6">
                    <label className="dark:text-gray-7 text-gray-1 text-sm">NamiID</label>
                    <div className="space-y-2 flex flex-col relative pb-6">
                        <div
                            className={classNames(
                                'px-3 py-2 bg-gray-5 dark:bg-darkBlue-3 rounded-md hover:ring-teal hover:ring-1 flex items-center space-x-3',
                                'text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap mt-2',
                                {
                                    '!ring-red ring-1': error
                                }
                            )}
                        >
                            <input
                                value={code}
                                onChange={onChange}
                                maxLength={MAX_LENGTH}
                                placeholder="Nhập NamiID"
                                className="w-full text-gray-1 dark:text-gray-4"
                            />
                            <span onClick={onPaste} className="text-teal font-semibold cursor-pointer select-none">
                                paste
                            </span>
                        </div>
                        {error && (
                            <Trans
                                values={{ category: 'NFT' }}
                                i18nKey={`nft:status_code:${error}`}
                                components={[<div className="text-red text-xs absolute bottom-0" />]}
                            />
                        )}
                    </div>
                    <ButtonV2 disabled={isSubmit || loading} type="primary" className="mt-10" onClick={handleTransferSubmit}>
                        Chuyển
                    </ButtonV2>
                </form>
            </section>
        </ModalV2>
    );
};
export default Transfer;
