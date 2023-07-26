import { useTranslation } from 'next-i18next';

import { NoResultIcon } from 'components/svg/SvgIcon';

const NoResult = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center flex-col m-auto pt-20">
            <NoResultIcon />
            <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Không tìm thấy kết quả</div>
        </div>
    );
};
export default NoResult;
