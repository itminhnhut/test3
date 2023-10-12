import { useTranslation } from 'next-i18next';
import { HideIcon, SeeIcon } from 'components/svg/SvgIcon';

const EstBalance = ({ className, onClick, isHide, isSmallScreen }) => {
    const { t } = useTranslation();

    return (
        <div className={`flex items-center text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark ${className}`}>
            <div className="mr-3">{t('wallet:est_balance')}</div>
            <div className="flex items-center cursor-pointer hover:opacity-80 select-none" onClick={onClick}>
                {isHide ? <HideIcon size={isSmallScreen ? 16 : 24} /> : <SeeIcon size={isSmallScreen ? 16 : 24} />}
            </div>
        </div>
    );
};

export default EstBalance;
