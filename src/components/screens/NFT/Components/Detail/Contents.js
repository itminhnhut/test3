import { useEffect } from 'react';

// ** NEXT
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// ** Redux
import { formatTime, formatNumber } from 'redux/actions/utils';

// ** Components
import Tooltip from 'components/common/Tooltip';
import { WrapperLevelItems } from 'components/screens/NFT/Components/Lists/CardItems';
import { WrapperStatus } from 'components/screens/NFT/Components/Lists/CardItems';
import { LIST_TIER, TABS, STATUS } from 'components/screens/NFT/Constants';
import { BoltCircleIcon, RocketIcon, TimeIcon } from 'components/svg/SvgIcon';

// ** Third party
import styled from 'styled-components';
import Image from 'next/image';
import classNames from 'classnames';

// ** Default
const DEFAULT_PATH_NAME = '/nft';

const Contents = ({ detail, wallet, isDark }) => {
    const router = useRouter();

    const {
        t,
        i18n: { language }
    } = useTranslation();

    useEffect(() => {
        [...document.querySelectorAll('.main-text')].map((element, key) => {
            console.log('----', element?.clientWidth, element?.scrollWidth, element?.clientHeight, element?.scrollHeight);
        });
    }, [detail]);

    const collection_description = language === 'en' ? detail?.collection?.description_en : detail?.collection?.description_vi;

    const handleRouterCollection = (nft_collection) => {
        router.push(
            {
                pathname: DEFAULT_PATH_NAME,
                query: { collection: nft_collection }
            },
            DEFAULT_PATH_NAME
        );
    };

    const renderContent = () => {
        if (!detail?._id) return;

        const tier = LIST_TIER.find((item) => item.active === detail?.tier);
        const category = TABS.find((item) => item.value === detail?.category);
        const expired_time = detail?.expired_time ? formatTime(new Date(detail?.expired_time), 'HH:mm:ss dd/MM/yyyy') : '-';

        return (
            <section>
                <WrapperStatus
                    status={STATUS?.[detail.status]?.key}
                    className={classNames('h-7 mb-4 py-1 px-4 rounded-[80px] text-sm w-max', { hidden: !wallet })}
                >
                    {STATUS?.[detail.status]?.[language]}
                </WrapperStatus>

                <h3 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">{detail?.name}</h3>
                <WrapperLevelItems isDark={isDark} className="dark:text-gray-7 text-gray-1 flex flex-row gap-1  mt-1 text-base">
                    <p>{t('nft:tier')}:</p>
                    <p className={tier?.key}>{tier?.name?.[language]}</p>
                </WrapperLevelItems>
                <section className="mt-6 flex flex-col gap-2">
                    <section className="dark:text-gray-7 text-gray-1 flex flex-row items-center">
                        <BoltCircleIcon />
                        <span className="ml-2 mr-1">{t('nft:detail:type')}:</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">{category?.label}</span>
                    </section>

                    <section className={classNames('dark:text-gray-7 text-gray-1 flex flex-row items-center', { hidden: wallet })}>
                        <RocketIcon />
                        <span className="ml-2 mr-1">{t('nft:detail:total')}:</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">{formatNumber(detail?.quantity || 0)}</span>
                    </section>

                    <section className="dark:text-gray-7 text-gray-1 flex flex-row items-center">
                        <TimeIcon />
                        <span
                            data-tip={t('nft:detail:tooltip_exp')}
                            data-for={'exp'}
                            className="ml-2 mr-1 text-gray-1 dark:text-gray-7 border-b border-darkBlue-5 border-dashed cursor-pointer"
                        >
                            {t('nft:detail:exp')}:
                        </span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">{expired_time} (UTC+7)</span>
                    </section>
                </section>
                <section className="mt-8 dark:bg-dark-4 bg-dark-13 p-4 rounded-xl flex flex-row items-center gap-3">
                    <div className="w-full max-w-[68px] max-h-[68px]">
                        <Image alt={detail?.collection?.name} src={detail?.collection?.thumbnail} width={68} height={68} />
                    </div>
                    <section className="text-gray-15 dark:text-gray-4">
                        <div className="font-semibold">{detail?.nft_collection_name}</div>
                        <WrapperCollection isDark={isDark} isLanguage={language === 'en'}>
                            <div className="container">
                                <div className="main-text">
                                    {/* {collection_description} */}
                                    Ocean Eyes là bộ sưu tập đầu tiên của Nami Infinity. Đây là bộ sưu tập thể hiện cho tầm nhìn và niềm khát khao, hy vọng của
                                    cộng đồng Nami khi đứng trước
                                    <span
                                        data-class={t('nft:collection:read_more')}
                                        className="dark:bg-dark-4 bg-dark-13 cursor-pointer font-semibold text-sm ml-1 dark:after:text-green-2 after:text-green-3"
                                        onClick={() => handleRouterCollection(detail?.nft_collection)}
                                    ></span>
                                </div>
                            </div>
                        </WrapperCollection>
                    </section>
                </section>
                <Tooltip id={'exp'} place="top" effect="solid" isV3 className="max-w-[300px]" />
            </section>
        );
    };

    return <>{renderContent()}</>;
};

const WrapperCollection = styled.section`
    width: 100%;
    .container {
        width: 100%;
    }

    .main-text {
        line-height: 1.2em; /* the height of a line */
        max-height: calc(2 * 1.2em); /* restrict the height to 2 lines*/
        overflow: hidden;
        display: inline-block;
        position: relative;
    }

    /* this will replace the ellipsis */
    .main-text span {
        position: absolute;
        /* position at the bottom right */
        top: 1.2em; /* height of one line */
        right: 0;
        padding: 2px 4px;
    }

    .main-text span:before {
        //  content: '...'; /* the dots*/
    }

    /* the text after the dots */
    .main-text span:after {
        // content: attr(data-class);
    }
`;

Contents.defaultProps = {
    detail: {},
    wallet: false
};

export default Contents;
