import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';

const TransferSmallBalanceToNami = ({ width, className }) => {
    const { t } = useTranslation();

    return (
        <a
            href="/"
            className={`bg-gray-10 dark:bg-dark-2 flex items-center justify-between text-txtTabHover dark:text-white 
           text-sm gap-3 rounded-md px-4 py-3 cursor-pointer ${className}`}
        >
            <LogoIcon />
            <div className="flex items-center gap-3">
                {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}
                <BxChevronDown size={24} />
            </div>
        </a>
    );
};

export default TransferSmallBalanceToNami;
