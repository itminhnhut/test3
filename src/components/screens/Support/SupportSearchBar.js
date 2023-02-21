import { Search } from 'react-feather';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import { useRouter } from 'next/router';
import { appUrlHandler } from 'constants/faqHelper';
import InputV2 from 'components/common/V2/InputV2'
import { CloseIcon } from 'components/svg/SvgIcon';

const SupportSearchBar = ({ containerClassNames = '', simpleMode = false, resetPage }) => {
    const [type, setType] = useState(0);
    const [query, setQuery] = useState('');
    const [searchKey, setSearchKey] = useState();
    const [focus, setFocus] = useState(false);
    const { t } = useTranslation();
    const isApp = useApp();
    const router = useRouter();

    const onSearch = (searchKey) => {
        if(!searchKey.length) {
            router.push({
                pathname: PATHS.SUPPORT.DEFAULT,
            });
            return
        }
        resetPage && resetPage();
        router.push({
            pathname: PATHS.SUPPORT.SEARCH,
            query: appUrlHandler(
                {
                    type,
                    query: searchKey
                },
                isApp
            )
        });
    };

    useEffect(() => {
        if (
            router?.query &&
            Object.keys(router?.query).length &&
            router?.query?.query &&
            router?.query?.type
        ) {
            setType(+router.query?.type);
            setQuery(router.query?.query);
            if (router?.query?.query?.length) {
                setSearchKey(router?.query?.query);
            }
        }
    }, [router]);

    return (
        <div className='flex space-x-4'>
            <InputV2
                className={classNames('w-[368px] tracking-[0.005em] pb-0', {
                    '!w-full': simpleMode
                }, containerClassNames)}
                prefix={(<Search
                    strokeWidth={2}
                    className="text-gray-1 w-4 h-4"
                />)}
                value={searchKey}
                onChange={(value) => setSearchKey(value.toString())}
                onHitEnterButton={(value) => onSearch(value.toString())}
                placeholder={t('support-center:search_placeholder')}
                suffix={searchKey?.length ? <CloseIcon size={16} onClick={() => setSearchKey("")} className='cursor-pointer' /> : null}
            />

            {!simpleMode && (
                <button
                    onClick={() => onSearch(searchKey)}
                    className="px-6 py-3 bg-teal font-medium text-base rounded-md text-white"
                >
                    {t('common:search')}
                </button>
            )}
        </div>
    );
};

export default SupportSearchBar;
