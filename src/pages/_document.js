import Document, { Head, Html, Main, NextScript } from 'next/document';

// import {getLoginUrl} from "src/redux/actions/utils";

class MyDocument extends Document {
    render() {
        return (
            <Html className="">
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&display=swap" rel="stylesheet" />

                    <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-PTWQXJB');` }}
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
                        src="https://www.googletagmanager.com/gtag/js?id=AW-802059455"
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
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            function initFreshChat() {
                                window.fcWidget.init({
                                    token: "b3aa7848-6b0c-4d20-856d-8585973b1d7c",
                                    host: "https://wchat.freshchat.com"
                                    // config: {
                                    //     showFAQOnOpen: true,
                                    //     hideFAQ: false,
                                    // }
                                });
                            }
                            function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"freshchat-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
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
