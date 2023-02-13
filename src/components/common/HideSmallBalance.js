import { Check } from 'react-feather';
import { useTranslation } from 'next-i18next';

const HideSmallBalance = ({ onClick, isHide, className }) => {
    const { t } = useTranslation();

    return (
        <div
            className={`flex items-center select-none cursor-pointer text-base font-normal text-txtSecondary dark:text-txtSecondary-dark ${className}`}
            onClick={onClick}
        >
            <span className={`w-6 h-6 p-0.5  rounded-[3px] ${isHide ? 'bg-bgBtnV2-dark' : 'border dark:border-divider-dark'}`}>
                {isHide ? <Check size={20} color="#FFFFFF" /> : null}
            </span>
            <span className="ml-3">{t('wallet:hide_small_balance')}</span>
        </div>
    );
};

export default HideSmallBalance;
