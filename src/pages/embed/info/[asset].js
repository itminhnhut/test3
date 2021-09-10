import find from 'lodash/find';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import { getMarketWatch } from 'redux/actions/market';
import { formatAbbreviateNumber, formatBalance, formatPercentage, getExchange24hPercentageChange } from 'redux/actions/utils';
import { getS3Url } from 'src/redux/actions/utils';
import FetchApi from 'utils/fetch-api';

const AssetInfo = () => {
    const { query } = useRouter();
    const assetConfig = useSelector(state => state.utils.assetConfig);

    const [percentage, setPercentage] = useState(0);
    const [assetCode, setAssetCode] = useState('');
    const [assetQuote, setAssetQuote] = useState('VNDC');
    const [assetName, setAssetName] = useState('');
    const [decimalLimit, setDecimalLimit] = useState(0);
    const [assetData, setAssetData] = useState(null);
    const [multiValue, setMultiValue] = useState(24000);

    function makeBG(elem, color) {
        const existingWrapper = document.getElementById('text-percentage-wrapper');

        if (existingWrapper) {
            existingWrapper.remove();
        }

        const svgns = 'http://www.w3.org/2000/svg';
        const bounds = elem.getBBox();
        const bg = document.createElementNS(svgns, 'rect');
        const style = window.getComputedStyle(elem);
        const padding_top = window.parseInt(style['padding-top']);
        const padding_left = window.parseInt(style['padding-left']) + (percentage > 0 ? 24 : 0);
        const padding_right = window.parseInt(style['padding-right']) + (percentage > 0 ? 24 : 0);
        const padding_bottom = window.parseInt(style['padding-bottom']);
        bg.setAttribute('x', bounds.x - window.parseInt(style['padding-left']) - (percentage > 0 ? 24 : 0));
        bg.setAttribute('y', bounds.y - window.parseInt(style['padding-top']));
        bg.setAttribute('width', bounds.width + padding_left + padding_right);
        bg.setAttribute('height', bounds.height + padding_top + padding_bottom);
        bg.setAttribute('fill', color);
        bg.setAttribute('fill-opacity', 0.15);
        bg.setAttribute('rx', 8);
        bg.setAttribute('id', 'text-percentage-wrapper');
        if (elem.hasAttribute('transform')) {
            bg.setAttribute('transform', elem.getAttribute('transform'));
        }
        elem.parentNode.insertBefore(bg, elem);
    }

    const getLogoUrl = (asset) => {
        const filter = {};
        if (asset !== undefined) {
            filter.assetCode = asset;
        }
        const config = find(assetConfig, filter);
        let logoUrl = '/images/coins/no_logo.png';
        if (config) {
            logoUrl = config?.s3LogoUrl ? getS3Url(config?.s3LogoUrl) : '/images/coins/no_logo.png';
        }
        return logoUrl;
    };

    const fetchAssetData = async (asset, quote = 'VNDC') => {
        const result = await getMarketWatch(`${asset}${quote}`);
        if (result && result.length > 0) {
            setAssetData(result?.[0]);
            setPercentage(getExchange24hPercentageChange(result?.[0]));
        } else {
            setPercentage(0);
        }
    };

    useEffect(() => {
        if (query?.asset && query?.quote && assetConfig?.length > 0) {
            const filter = {};
            filter.assetCode = query?.asset;
            const config = find(assetConfig, filter);
            if (config) {
                setAssetName(config?.assetName);
                setDecimalLimit(config?.displayDigit);
            }
            setAssetCode(query?.asset);
            setAssetQuote(query?.quote);
            setMultiValue(query?.quote === 'VNDC' ? 24000 : 1);

            fetchAssetData(query?.asset, query?.quote);

            const texts = document.getElementById('text-percentage');
            let color = '#05B169';
            if (percentage < 0) {
                color = '#E95F67';
            }
            makeBG(texts, color);
            document.querySelector('body').classList.add('bg-transparent');
            document.querySelector('html').classList.add('bg-transparent');
        }
    }, [query, assetConfig, percentage]);

    const renderPercentage = () => {
        if (percentage >= 0) {
            return (
                <>
                    <text
                        fill="#05B169"
                        xmlSpace="preserve"
                        style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 500 }}
                        fontFamily="Barlow"
                        fontSize="21"
                        letterSpacing="-0.02em"
                        id="text-percentage"
                    >
                        {`+${formatPercentage(percentage, 2, true)}%`}
                    </text>
                </>
            );
        }
        return (
            <>
                <text
                    fill="#E95F67"
                    xmlSpace="preserve"
                    style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 500, padding: '0 24px' }}
                    fontFamily="Barlow"
                    fontSize="21"
                    letterSpacing="-0.02em"
                    id="text-percentage"
                >
                    {formatPercentage(percentage, 2, true)}%
                </text>
            </>
        );
    };

    const formatAssetLatestPrice = () => {
        return assetData?.p ? formatBalance(assetData?.p, 2, true) + ' ' + assetQuote : '-';
    };

    const formatAssetMarketCap = () => {
        return ((Number.isNaN(assetData?.sp * assetData?.p) || assetData?.sp * assetData?.p === 'NaN') ? '-' : '$' + (formatAbbreviateNumber(assetData?.sp * assetData?.p / multiValue, 1)));
    };

    const formatAsset24hVolume = () => {
        return assetData?.vb ? `$${formatAbbreviateNumber(+assetData?.vb, 1)}` : '-';
    };

    const formatAsset24hHighLow = () => {
        return `${assetData?.h ? (formatAbbreviateNumber(assetData?.h, 1) + ' ' + assetQuote) : '-'}/${assetData?.l ? (formatAbbreviateNumber(assetData?.l, 1) + ' ' + assetQuote) : '-'}`;
    };

    const formatAssetATH = () => {
        return assetData?.ath ? (formatAbbreviateNumber(assetData?.ath, 1, true) + ' ' + assetQuote) : '-';
    };

    return (
        <div className="absolute inset-0 bg-transparent">
            <svg
                width="500"
                height="519"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 559"
                fill="none"
                className="w-full h-full"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <g clipPath="url(#clip0)">
                    <path xmlns="http://www.w3.org/2000/svg" d="M32 59.75H468C485.259 59.75 499.25 73.7411 499.25 91V558.25H0.75V91C0.75 73.7411 14.7411 59.75 32 59.75Z" fill="white" stroke="#EEF2FA" strokeWidth="1.5" />
                    <image href="/images/logo/Attlas_Dark.png" width="167" height="161" x="363" y="110" />
                    <g>
                        <path
                            d="M250 5C220.177 5 196 29.1766 196 59C196 88.8234 220.177 113 250 113C279.823 113 304 88.8234 304 59C304 29.1766 279.823 5 250 5Z"
                            fill="url(#pattern1)"
                            stroke="white"
                            strokeWidth="8"
                        />
                        <g transform="translate(199, 8)">
                            <circle cx="51" cy="51" r="55" stroke="white" strokeWidth="3" fill="white" />
                            <image
                                id="image0"
                                width="102"
                                height="102"
                                href={getLogoUrl(assetCode)}
                            />
                        </g>
                    </g>
                    <g transform="translate(250, 137)">
                        <text
                            fill=" #02083D"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 600 }}
                            fontFamily="Barlow"
                            fontSize="28"
                            letterSpacing="-0.02em"
                        >
                            {assetName}
                        </text>
                    </g>
                    <g transform="translate(250, 163)">
                        <text
                            fill=" #8B8C9B"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle' }}
                            fontFamily="Barlow"
                            fontSize="16"
                            letterSpacing="-0.01em"
                        >
                            {assetCode}
                        </text>
                    </g>
                    <g transform="translate(250, 200)">
                        <text
                            fill=" #02083D"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 600 }}
                            fontFamily="Barlow"
                            fontSize="28"
                            letterSpacing="-0.02em"
                        >
                            {formatAssetLatestPrice()}
                        </text>
                    </g>
                    <g transform="translate(250, 240)">
                        {renderPercentage()}
                    </g>
                    <rect x="32" y="280" width="436" height="1" fill="#EEF2FA" />
                    <g transform="translate(32, 320)">
                        <g transform="translate(0, 20)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'start', fontWeight: 600 }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                Market Cap
                            </text>
                        </g>
                        <g transform="translate(0, 65)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'start', fontWeight: 600 }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                24H Volume
                            </text>
                        </g>
                        <g transform="translate(0, 105)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'start', fontWeight: 600 }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                24H High/Low
                            </text>
                        </g>
                        <g transform="translate(0, 145)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'start', fontWeight: 600 }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                ATH
                            </text>
                        </g>
                    </g>
                    <g transform="translate(468, 320)">
                        <g transform="translate(0, 20)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'end' }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                {formatAssetMarketCap()}
                            </text>
                        </g>
                        <g transform="translate(0, 65)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'end' }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                {formatAsset24hVolume()}
                            </text>
                        </g>
                        <g transform="translate(0, 105)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'end' }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                {formatAsset24hHighLow()}
                            </text>
                        </g>
                        <g transform="translate(0, 145)">
                            <text
                                fill="#02083D"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'end' }}
                                fontFamily="Barlow"
                                fontSize="16"
                                letterSpacing="-0.01em"
                            >
                                {formatAssetATH()}
                            </text>
                        </g>
                    </g>
                    <rect x="1" y="513" width="498" height="45" fill="#4021D0" fillOpacity="0.15" />
                    <a href={`https://nami.exchange/spot/${assetCode}_${assetQuote}`} target="_blank" rel="noopener noreferrer">
                        <g transform="translate(484, 540.823)">
                            <text
                                fill="#4021D0"
                                xmlSpace="preserve"
                                style={{ whiteSpace: 'pre', textAnchor: 'end' }}
                                fontFamily="Barlow"
                                fontSize="14"
                                letterSpacing="-0.01em"
                            >
                                <tspan>View Price Chart</tspan>
                            </text>
                        </g>
                    </a>
                    <text
                        fill="#02083D"
                        xmlSpace="preserve"
                        style={{ whiteSpace: 'pre' }}
                        fontFamily="Barlow"
                        fontSize="14"
                        letterSpacing="-0.01em"
                    >
                        <tspan x="16.1661" y="540.823">Powered by</tspan>
                    </text>
                    <a href="https://nami.exchange" target="_blank" rel="noreferrer noopener">
                        <text
                            fill="#4021D0"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', fontWeight: 600 }}
                            fontFamily="Barlow"
                            fontSize="14"
                            fontWeight="bold"
                            letterSpacing="-0.01em"
                        >
                            <tspan x="98.438" y="540.823">Nami Exchange</tspan>
                        </text>
                    </a>
                </g>
                <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image0" transform="translate(-0.00120647) scale(0.000873182)" />
                    </pattern>
                    <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image1" transform="scale(0.00166667)" />
                    </pattern>
                    <clipPath id="clip0">
                        <rect width="500" height="560" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common']),
        },
    };
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: { asset: 'BTC' } },
        ],
        fallback: true,
    };
}

export default AssetInfo;
