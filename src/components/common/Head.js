import NextHead from 'next/head';
import {config as configFont, dom} from '@fortawesome/fontawesome-svg-core';
import {useRouter} from 'next/router';
import seoConfigs from '../../config/seo.json'

configFont.autoAddCss = false;

const Head = ({language = 'vi'}) => {
    const router = useRouter();
    const {route} = router;
    const seoConfig = seoConfigs.find(config => {
        const regex = new RegExp(config.page)
        return regex.test(route)
    })
    return (
        <>
            <NextHead>
                <title data-shuvi-head="true">{seoConfig.title[language]}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="description" content={seoConfig.description[language]}/>
                <meta name="keywords" content={seoConfig.keywords[language]}/>
                <link rel="manifest" href="/site.webmanifest" key="site-manifest"/>
                <>
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:creator" content="@Nami"/>
                    <meta name="twitter:site" content="@Nami"/>
                    <meta property="og:title" content="Nami Exchange"/>
                    <meta property="og:description" content="Sàn giao dịch Spot và Futures an toàn"/>
                    <meta property="og:url" content="https://nami.exchange" key="og-url"/>
                    <meta name="twitter:title" content="Nami Exchange"/>
                    <meta name="twitter:description" content="Sàn giao dịch Spot và Futures an toàn"/>
                    <meta name="twitter:url" content="https://nami.exchange"/>
                    <meta
                        property="og:image"
                        content="https://static.namifutures.com/nami.exchange/images/common-featured.png"
                        key="fb-image"
                    />
                    <meta
                        name="twitter:image"
                        content="https://static.namifutures.com/nami.exchange/images/common-featured.png"
                        key="twitter-image"
                    />
                </>
                <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
                {/* fix fontawesome always huge */}
                <style>{dom.css()}</style>
            </NextHead>
        </>
    );
};

export default Head;
