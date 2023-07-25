import { useMemo } from 'react';
import { X } from 'react-feather';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

const BxsErrorIcon = ({ size = '80' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.666A3.333 3.333 0 0 0 10 70h60c1.17 0 2.254-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.276L42.948 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.334V30h6.666l.004 16.666h-6.67z"
                fill="#FFC632"
            />
        </svg>
    );
};

const BxsErrorDarkIcon = ({ size = '80' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
            <path
                d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.666A3.333 3.333 0 0 0 10 70h60c1.17 0 2.254-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.276L42.948 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.334V30h6.666l.004 16.666h-6.67z"
                fill="#FFC632"
            />
        </svg>
    );
};

const Use = ({ isModal, onCloseModal, onUseSubmit }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const renderIcon = useMemo(() => {
        return isDark ? <BxsErrorDarkIcon /> : <BxsErrorIcon />;
    }, [isDark]);

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
            <main className="flex flex-col justify-center items-center">
                {renderIcon}
                <section className="dark:text-gray-4 text-gray-15 text-2xl font-semibold mt-6">Lưu ý</section>
                <section className="mt-4 text-gray-1 dark:text-gray-7">
                    Có WNFT cùng loại đang được sử dụng, nếu bạn tiếp tục sử dụng WNFT này thì WNFT cùng loại đang sử dụng sẽ bị huỷ tác dụng.
                </section>
                <ButtonV2 className="mt-10" onClick={onUseSubmit}>
                    Tiếp tục sử dụng
                </ButtonV2>
            </main>
        </ModalV2>
    );
};
export default Use;
