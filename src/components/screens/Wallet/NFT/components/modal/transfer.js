import { useState } from 'react';
import { X } from 'react-feather';

import Image from 'next/image';

import { useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

import { WrapperLevelItems } from 'components/screens/NFT/ListFilter';
import { WrapperStatus } from 'components/screens/Wallet/NFT/index';

import classNames from 'classnames';

const Transfer = ({ isModal, onCloseModal }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();

    const [refCode, setRefCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(true);

    const isDark = currentTheme === THEME_MODE.DARK;

    const onChange = (e) => {
        setError(false);
        setRefCode(String(e.target.value).trim().toUpperCase());
    };

    const onPaste = async () => {
        const pasteCode = await navigator.clipboard.readText();
        setRefCode(pasteCode);
    };

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
            <main className="flex flex-col">
                <section className="text-gray-15 dark:text-gray-4 text-2xl font-semibold ">Chuyển WNFT</section>
                <section className="mt-8 dark:bg-dark-4 bg-white border-[1px] border-divider dark:border-dark-4 rounded-xl px-3 py-3 w-full flex flex-row gap-4">
                    <section className="w-full max-w-[148px] max-h-[148px]">
                        <Image width={148} height={148} src="/images/nft/Banner-2.png" sizes="100vw" />
                    </section>
                    <section className="my-[21px]">
                        <p className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Whale</p>
                        <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                            <p>Cấp độ:</p>
                            <p className="rate">Siêu hiếm</p>
                        </WrapperLevelItems>
                        <WrapperStatus status="active" className="h-7 py-1 px-4 mt-5 rounded-[80px] text-sm">
                            Đã kích hoạt
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
                                value={refCode}
                                onChange={onChange}
                                maxLength={8}
                                placeholder="Nhập NamiID"
                                className="w-full text-gray-1 dark:text-gray-4"
                            />
                            <span onClick={onPaste} className="text-teal font-semibold cursor-pointer select-none">
                                paste
                            </span>
                        </div>
                        {error && (
                            <div className="text-red text-xs absolute bottom-0">
                                {refCode.length < 6 ? t('profile:ref_error_format') : t('profile:ref_error')}
                            </div>
                        )}
                    </div>
                    <ButtonV2 disabled={refCode.length < 6 || error || loading} type="primary" className="mt-10">
                        Chuyển
                    </ButtonV2>
                </form>
            </main>
        </ModalV2>
    );
};
export default Transfer;
