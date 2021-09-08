import Document, { Head, Html, Main, NextScript } from 'next/document';

// import {getLoginUrl} from "src/redux/actions/utils";

class MyDocument extends Document {
    render() {
        return (
            <Html className="">
                <Head>
                    <link rel="preload" href="/css/fonts/MarkPro-Medium.woff2" as="font" crossOrigin="anonymous" />
                    <link rel="preload" href="/css/fonts/MarkPro-Regular.woff2" as="font" crossOrigin="anonymous" />
                    <link rel="preload" href="/css/fonts/MarkPro-Black.woff2" as="font" crossOrigin="anonymous" />
                    <link rel="preload" href="/css/fonts/MarkPro-Light.woff2" as="font" crossOrigin="anonymous" />
                    <link rel="preload" href="/css/fonts/MarkPro-Bold.woff2" as="font" crossOrigin="anonymous" />
                    <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-TV5NQ44');` }}
                    />
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '927448334500314');
                    ` }}
                    />
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-RGS9ZWC4NW"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'G-RGS9ZWC4NW', {
                                  page_path: window.location.pathname,
                                });
                                `,
                        }}
                    />
                </Head>
                <body>
                    <noscript>
                        <img
                            height="1"
                            width="1"
                            style={{ display: 'none' }}
                            src="https://www.facebook.com/tr?id=927448334500314&ev=PageView&noscript=1"
                        />
                    </noscript>
                    <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TV5NQ44"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>` }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
