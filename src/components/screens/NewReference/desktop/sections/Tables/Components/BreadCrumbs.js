import { BreadCrumbIcon } from 'src/components/common/Icons';

import classNames from 'classNames';
import PropTypes from 'prop-types';

const BreadCrumbs = ({ level, parentName, breadcrumbs, language, onChangeBreadCrumb }) => {
    const renderBreadCrumbs = () => {
        return (
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    {breadcrumbs?.map((value, index) => {
                        return (
                            index <= level && (
                                <li>
                                    <div className="flex items-center">
                                        {index > 0 && <BreadCrumbIcon />}
                                        <a
                                            onClick={() => onChangeBreadCrumb(value, index)}
                                            className={classNames('ml-0 text-gray-1 dark:text-gray-7 cursor-pointer', {
                                                'font-semibold': index === level,
                                                'dark:text-green-2 text-green-3 !cursor-none': index === level && level > 0,
                                                'hover:text-blue-6 dark:hover:text-white': index !== level
                                            })}
                                        >
                                            {value?.name?.[language]}
                                        </a>
                                    </div>
                                </li>
                            )
                        );
                    })}
                </ol>
            </nav>
        );
    };

    if (level === 0) {
        return <div className="mb-8 mx-6 text-gray-15 dark:text-gray-4 font-semibold text-2xl">Danh sách bạn bè F1</div>;
    } else {
        return (
            <>
                <div className="mx-6 mb-8">{renderBreadCrumbs()}</div>
                <div className="mb-8 mx-6 text-gray-15 dark:text-gray-4 font-semibold text-2xl">{`Chi tiết bạn bè ${parentName}`}</div>
            </>
        );
    }
};

BreadCrumbs.propTypes = {
    level: PropTypes.number,
    language: PropTypes.string,
    breadcrumbs: PropTypes.array,
    onChangeBreadCrumb: PropTypes.func
};

export default BreadCrumbs;
