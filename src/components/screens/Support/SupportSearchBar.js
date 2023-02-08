import { Search } from 'react-feather';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import { useRouter } from 'next/router';
import { appUrlHandler } from 'constants/faqHelper';

const SupportSearchBar = ({ containerClassNames = '', simpleMode = false, resetPage }) => {
    const [type, setType] = useState(0);
    const [query, setQuery] = useState('');
    const [searchKey, setSearchKey] = useState();
    const [focus, setFocus] = useState(false);
    const { t } = useTranslation();
    const isApp = useApp();
    const router = useRouter();

    const onSearch = (type, searchKey) => {
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
            Object.keys(router.query).length &&
            router.query?.query &&
            router.query?.type
        ) {
            setType(+router.query?.type);
            setQuery(router.query.query);
            if (router.query.query?.length) {
                setSearchKey(router.query.query);
            }
        }
    }, [router]);

    return (
        <div className='flex space-x-4'>
            <div
                className={classNames(
                    'flex space-x-2 items-center bg-dark-2 p-3 rounded-md  w-[368px]',
                    containerClassNames,
                    {
                        '!w-full': simpleMode
                    }
                )}
                style={{ letterSpacing: '0.005em;' }}
            >
                <Search
                    strokeWidth={2}
                    className="text-gray-1 w-4 h-4"
                />
                <input
                    id="my-custom-input"
                    className="flex-grow text-gray-4"
                    placeholder={t('support-center:search_articles')}
                    style={{ outline: 'none' }}
                    value={searchKey}
                    onChange={({ target: { value } }) => setSearchKey(value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onKeyPress={(e) =>
                        focus && e.nativeEvent.code === 'Enter' && onSearch(type, searchKey)
                    }
                />

            </div>
            {!simpleMode && (
                <button
                    onClick={() => onSearch(type, searchKey)}
                    className="px-6 py-3 bg-teal font-medium text-base rounded-md text-white"
                >
                    {t('common:search')}
                </button>
            )}
        </div>
    );
};

export default SupportSearchBar;
