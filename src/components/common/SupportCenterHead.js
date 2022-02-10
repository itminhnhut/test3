import NextHead from 'next/head';
import { config as configFont } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/router';

configFont.autoAddCss = false;

const SupportCenterHead = ({ article }) => {
    const router = useRouter();
    const { route } = router;
    return (
        <>
            {/* <DefaultSeo {...config} /> */}
            <NextHead>
                <title data-shuvi-head="true">{article?.title}</title>
                <meta name="description" content={article?.excerpt}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="manifest" href="/site.webmanifest" key="site-manifest"/>
                <>
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:creator" content="@Nami"/>
                    <meta name="twitter:site" content="@Nami"/>
                    <meta property="og:title" content="Nami Exchange"/>
                    <meta property="og:description" content={article?.title}/>
                    <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`} key="og-url" />
                    <meta name="twitter:title" content="Nami Exchange"/>
                    <meta name="twitter:description" content={article?.title}/>
                    <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`} />
                    <meta name="description" content={article?.title}/>
                    <meta
                        property="og:image"
                        content={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                        key="fb-image"
                    />
                    <meta
                        name="twitter:image"
                        content={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                        key="twitter-image"
                    />
                </>
                <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
            </NextHead>
        </>
    );
};

export default SupportCenterHead;
