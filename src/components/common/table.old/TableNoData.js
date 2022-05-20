import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';

const TableNoData = ({ bgColor, width, className = '', title }) => {
    const { t } = useTranslation();
    return (
        <div className={`flex items-center justify-center flex-col md:py-[3rem] ${bgColor && bgColor} ${width && width} ${className}`}>
            <Image src={getS3Url('/images/icon/icon-search-folder.png')} width={80} height={80} />
            <div className="text-xs text-black-400 mt-2">{title ?? t('common:no_data')}</div>
        </div>
    );
};

export default TableNoData;
