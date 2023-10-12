import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
class MyDocument extends Document {
    render() {
        return (
            <Html className=''>
                <Head>
                    <link
                        rel='preconnect'
                        href='https://fonts.googleapis.com'
                    />
                    <link
                        rel='preconnect'
                        href='https://fonts.gstatic.com'
                        crossOrigin='true'
                    />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700&display=swap'
                        rel='stylesheet'
                    />
                    <link
                        href='/css/coolicons/coolicons.css'
                        rel='stylesheet'
                    />
                    <script src='/library/trading_view/tv.js' />
                    <script src="/library/timesync/timesync.min.js" />
                    <script
                        type='text/javascript'
                        src='/library/trading_view/datafeeds/udf/dist/polyfills.js'
                    />
                    <script
                        type='text/javascript'
                        src='/library/trading_view/datafeeds/udf/dist/bundle.js'
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                               (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','GTM-KB63ZHRH');
                                `,
                        }}
                    />
                </Head>
                <body>
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KB63ZHRH"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }
}

export default MyDocument
