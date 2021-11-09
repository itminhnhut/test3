import { useTranslation } from 'next-i18next';
import Image from 'next/image';

const TableNoData = ({ bgColor, width }) => {
    const { t } = useTranslation();
    return (
        <div className={`flex items-center justify-center flex-col md:py-[3rem] ${bgColor && bgColor} ${width && width}`}>
            <Image src="/images/icons/icon-search-folder.svg" width={80} height={80} />
            <div className="text-sm text-black-400 mt-2">{t('common:no_data')}</div>
        </div>
    );
};

export default TableNoData;
