import { X } from 'react-feather';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import ModalV2 from 'components/common/V2/ModalV2';

import { WrapperLevelItems } from './ListFilter';

const DarkCheckCircle = ({ color = '#47CC85', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);

const CheckCircle = ({ color = '#30BF73', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);

const Detail = ({ isModal, onCloseModal, id = '1' }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    return (
        <ModalV2
            isVisible={isModal}
            onBackdropCb={onCloseModal}
            className="!max-w-[800px] bg-[#ffffff] dark:bg-dark-dark border-divider dark:border-divider-dark"
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
            <section>
                <div className="text-2xl font-semibold text-gray-15 dark:text-gray-4">Chi tiết Shark</div>
                <section className="flex flex-row gap-4 mt-8">
                    <div className="w-[146px] h-[146px] rounded-xl bg-white">2</div>
                    <div className="bg-gray-13 dark:bg-dark-4 w-full rounded-xl px-4 py-4">
                        <div className="text-2xl font-semibold text-gray-15 dark:text-gray-4">Shark</div>
                        <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                            <p>Cấp độ:</p>
                            <p className="rate">Siêu hiếm</p>
                        </WrapperLevelItems>
                        <div className="h-[1px] bg-divider dark:bg-divider-dark my-4" />
                        <div className="flex flex-row justify-between">
                            <div className="text-gray-1 dark:text-gray-7 text-sm">Thời hạn sử dụng</div>
                            <div className="text-gray-15 dark:text-gray-4 font-semibold">07:00:00 20/07/2023</div>
                        </div>
                    </div>
                </section>
                <div className="mt-6">Tính năng</div>
                <div className="bg-gray-13 dark:bg-dark-4 w-full rounded-xl px-4 py-4 mt-4 flex flex-col gap-3">
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">1,5% phí giao dịch NAO Futures trong tuần 55</p>
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">Giảm 50% phí giao dịch trong vòng 3 ngày</p>
                    </div>
                    <div className="flex flex-row items-center">
                        {isDark ? <DarkCheckCircle /> : <CheckCircle />}
                        <p className="ml-2 dark:text-gray-4 text-gray-15">APY Booster 100% trong 3 ngày</p>
                    </div>
                </div>
            </section>
        </ModalV2>
    );
};

export default Detail;
