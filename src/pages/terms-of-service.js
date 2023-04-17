/* eslint-disable */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useWindowSize } from 'utils/customHooks';
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { WIDTH_MD } from 'components/screens/Wallet';

const Title1 = styled.div.attrs({
    className: 'text-sm sm:text-[22px] sm:leading-[30px] font-semibold mt-12 mb-6'
})``;

const Title2 = styled.div.attrs({
    className: 'text-xl font-semibold my-6 sm:my-8 sm:ml-4 md:ml-8 lg:ml-10'
})``;

const Title3 = styled.div.attrs({
    className: 'text-lg font-semibold my-6 sm:my-8 sm:ml-8 md:ml-16 lg:ml-20'
})``;

const Paragraph = styled.div.attrs({
    className: 'mt-6 sm:mt-8'
})``;

const Strong = styled.span.attrs({
    className: 'font-semibold'
})``;

const Terms = () => {
    const { width } = useWindowSize();
    const dispath = useDispatch();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'table']);

    useEffect(() => {
        // document.body.classList.add('hidden-scrollbar');
        document.body.classList.add('no-scrollbar');
        // document.body.classList.add('!bg-onus');

        const intervalReloadData = setInterval(() => {
            dispath(reloadData());
        }, 5 * 60 * 1000);

        return () => {
            document.body.classList.remove('hidden-scrollbar');
            // document.body.classList.remove('bg-onus');
            clearInterval(intervalReloadData);
        };
    }, []);

    const Content = () => {
        return (
            <div className="px-4 bg-white dark:bg-dark">
                <div
                    className={`max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-txtPrimary dark:text-txtPrimary-dark font-SF-Pro txtPri-2 text-left ${
                        width < WIDTH_MD ? 'pb-20' : 'pb-[120px]'
                    }`}
                >
                    <div className={`w-full txtPri-4 pb-8 sm:pb-12 bg-white dark:bg-dark ${width < WIDTH_MD ? 'sticky top-0 pt-6' : 'pt-20'}`}>
                        {t('common:terms_and_privacy')}
                    </div>
                    {language === 'en' && (
                        <div className="text-left">
                            <p className="text-right pb-8">
                                <Strong>Last revised: Jan 10th 2021</Strong>
                            </p>
                            <p>
                                These Nami.Exchange Terms of Use are entered into between you (hereinafter referred to as &ldquo;you&rdquo; or
                                &ldquo;your&rdquo;) and Nami.Exchange operators (as defined below). By accessing, downloading, using or clicking on &ldquo;I
                                agree&rdquo; to accept any Nami.Exchange Services (as defined below) provided by Nami.Exchange (as defined below), you agree
                                that you have read, understood and accepted all of the terms and conditions stipulated in these Terms of Use (hereinafter
                                referred to as &ldquo;these Terms&rdquo;) as well as our Privacy Policy at&nbsp;{' '}
                                <a className="text-teal" href="https://nami.exchange/privacy">
                                    https://nami.exchange/privacy
                                </a>
                                . In addition, when using some features of the Services, you may be subject to specific additional terms and conditions
                                applicable to those features.
                            </p>
                            <Paragraph>
                                Please read the terms carefully as they govern your use of Nami.Exchange Services.{' '}
                                <Strong>
                                    THESE TERMS CONTAIN IMPORTANT PROVISIONS INCLUDING AN ARBITRATION PROVISION THAT REQUIRES ALL CLAIMS TO BE RESOLVED BY WAY
                                    OF LEGALLY BINDING ARBITRATION
                                </Strong>
                                . The terms of the arbitration provision are set forth in Article 10, &ldquo;Resolving Disputes: Forum, Arbitration, Class
                                Action Waiver&rdquo;, hereunder. As with any asset, the values of Digital Currencies (as defined below) may fluctuate
                                significantly and there is a substantial risk of economic losses when purchasing, selling, holding or investing in Digital
                                Currencies and their derivatives. <Strong>BY MAKING USE OF</Strong> Nami.Exchange{' '}
                                <Strong>
                                    SERVICES, YOU ACKNOWLEDGE AND AGREE THAT: (1) YOU ARE AWARE OF THE RISKS ASSOCIATED WITH TRANSACTIONS OF DIGITAL CURRENCIES
                                    AND THEIR DERIVATIVES; (2) YOU SHALL ASSUME ALL RISKS RELATED TO THE USE OF Nami.Exchange SERVICES AND TRANSACTIONS OF
                                    DIGITAL CURRENCIES AND THEIR DERIVATIVES; AND (3) Nami.Exchange SHALL NOT BE LIABLE FOR ANY SUCH RISKS OR ADVERSE OUTCOMES
                                </Strong>
                                .
                            </Paragraph>
                            <Paragraph>
                                By accessing, using or attempting to use Nami.Exchange Services in any capacity, you acknowledge that you accept and agree to be
                                bound by these Terms. If you do not agree, do not access Nami.Exchange or utilize Nami.Exchange services.
                            </Paragraph>

                            <Title1>I. Definitions</Title1>
                            <p>
                                <Strong>1. Nami.Exchange</Strong> refers to an ecosystem comprising Nami.Exchange websites (whose domain names include but are
                                not limited to <a href="https://nami.exchange">https://nami.exchange</a> ), mobile applications, clients, applets and other
                                applications that are developed to offer Nami.Exchange Services, and includes independently-operated platforms, websites and
                                clients within the ecosystem (e.g. Nami.Exchange&rsquo;s Open Platform, Nami.Exchange Launchpad, Nami Academy, Nami Wallet). In
                                case of any inconsistency between relevant terms of use of the above platforms and the contents of these Terms, the respective
                                applicable terms of such platforms shall prevail.
                            </p>

                            <Paragraph>
                                <Strong>2. Nami.Exchange Operators</Strong> refer to all parties that run Nami.Exchange, including but not limited to legal
                                persons, unincorporated organizations and teams that provide Nami.Exchange Services and are responsible for such services. For
                                convenience, unless otherwise stated, references to &ldquo;Nami.Exchange&rdquo; and &ldquo;we&rdquo; in these Terms specifically
                                mean Nami.Exchange Operators. <Strong>UNDER THESE TERMS</Strong>, Nami.Exchange{' '}
                                <Strong>
                                    OPERATORS MAY CHANGE AS Nami.Exchange&rsquo;S BUSINESS ADJUSTS, IN WHICH CASE, THE CHANGED OPERATORS SHALL PERFORM THEIR
                                    OBLIGATIONS UNDER THESE TERMS WITH YOU AND PROVIDE SERVICES TO YOU, AND SUCH CHANGE DOES NOT AFFECT YOUR RIGHTS AND
                                    INTERESTS UNDER THESE TERMS. ADDITIONALLY, THE SCOPE OF Nami.Exchange OPERATORS MAY BE EXPANDED DUE TO THE PROVISION OF NEW
                                    Nami.Exchange SERVICES, IN WHICH CASE, IF YOU CONTINUE TO USE Nami.Exchange SERVICES, IT IS DEEMED THAT YOU HAVE AGREED TO
                                    JOINTLY EXECUTE THESE TERMS WITH THE NEWLY ADDED Nami.Exchange OPERATORS. IN CASE OF A DISPUTE, YOU SHALL DETERMINE THE
                                    ENTITIES BY WHICH THESE TERMS ARE PERFORMED WITH YOU AND THE COUNTERPARTIES OF THE DISPUTE, DEPENDING ON THE SPECIFIC
                                    SERVICES YOU USE AND THE PARTICULAR ACTIONS THAT AFFECT YOUR RIGHTS OR INTERESTS
                                </Strong>
                                .
                            </Paragraph>

                            <Paragraph>
                                <Strong>3. Nami.Exchange Services</Strong> refer to various services provided to you by Nami.Exchange that are based on Internet
                                and/or blockchain technologies and offered via Nami.Exchange websites, mobile applications, clients and other forms (including
                                new ones enabled by future technological development). Nami.Exchange Services include but are not limited to such Nami.Exchange
                                ecosystem components as Digital Asset Trading Platforms, the financing sector, Nami Labs, Nami Academy, Nami Today, Nami
                                Launchpad, Nami Mining, Nami Newsroom&nbsp; and novel services to be provided by Nami Foundation.
                            </Paragraph>

                            <Paragraph>
                                <Strong>4. Nami.Exchange Platform Rules</Strong> refer to all rules, interpretations, announcements, statements, letters of
                                consent and other contents that have been and will be subsequently released by Nami.Exchange, as well as all regulations,
                                implementation rules, product process descriptions, and announcements published in the Help Center or within products or service
                                processes.
                            </Paragraph>

                            <Paragraph>
                                <Strong>5. Users</Strong> refer to all individuals, institutions or organizations that access, download or use Nami.Exchange or
                                Nami.Exchange Services and who meet the criteria and conditions stipulated by Nami.Exchange. If there exist other agreements for
                                such entities as developers, distributors, market makers, and Digital Currencies exchanges, such agreements shall be followed.
                            </Paragraph>

                            <Paragraph>
                                <Strong>6. Digital Currencies</Strong> refer to encrypted or digital tokens or cryptocurrencies with a certain value that are
                                based on blockchain and cryptography technologies and are issued and managed in a decentralized form.
                            </Paragraph>

                            <Paragraph>
                                7. Digital Assets refer to Digital Currencies, their derivatives or other types of digitalized assets with a certain value.
                            </Paragraph>

                            <Paragraph>
                                <Strong>8. Nami.Exchange Accounts</Strong> refer to the foundational virtual accounts, including main accounts and subaccounts,
                                which are opened by Nami.Exchange for Users to record on Nami.Exchange their usage of Nami.Exchange Services, transactions,
                                asset changes and basic information. Nami.Exchange Accounts serve as the basis for Users to enjoy and exercise their rights on
                                Nami.Exchange.
                            </Paragraph>

                            <Paragraph>
                                <Strong>9. Crypto-to-crypto Trading</Strong> refers to spot transactions in which one digital currency is exchanged for another
                                digital currency.
                            </Paragraph>

                            <Paragraph>
                                <Strong>10. Collateral Accounts</Strong> refer to special accounts opened by Users on Nami.Exchange to deposit and withdraw
                                collateral (such as margins) in accordance with these Terms (including the Nami.Exchange Contract Services Agreement and
                                Nami.Exchange Platform Rules), as required for contract transactions, leveraged trading and/or currency borrowing services.
                            </Paragraph>

                            <Paragraph>
                                <Strong>11. Loan/Lending</Strong> refers to Nami.Exchange&rsquo;s lending of Digital Currencies to Users at an interest
                                collected in certain ways (in the form of Digital Currencies), including but not limited to the leveraged trading and currency
                                lending services currently offered, and other forms of loan/lending services to be launched by Nami.Exchange.
                            </Paragraph>

                            <Title1>II. General Provisions</Title1>
                            <Title2>1. About These Terms</Title2>
                            <Title3>a. Contractual Relationship</Title3>
                            <p>These Terms constitute a legal agreement and create a binding contract between you and Nami.Exchange Operators.</p>
                            <Title3>b. Supplementary Terms</Title3>
                            <p>
                                Due to the rapid development of Digital Currencies and Nami.Exchange, these Terms between you and Nami.Exchange Operators do not
                                enumerate or cover all rights and obligations of each party, and do not guarantee full alignment with needs arising from future
                                development. Therefore,{' '}
                                <Strong>
                                    THE PRIVACY POLICY (
                                    <a className="text-teal" href="https://nami.exchange/privacy">
                                        https://nami.exchange/privacy
                                    </a>
                                    ), Nami.Exchange PLATFORM RULES, AND ALL OTHER AGREEMENTS ENTERED INTO SEPARATELY BETWEEN YOU AND Nami.Exchange ARE DEEMED
                                    SUPPLEMENTARY TERMS THAT ARE AN INTEGRAL PART OF THESE TERMS AND SHALL HAVE THE SAME LEGAL EFFECT. YOUR USE OF Nami.Exchange
                                    SERVICES IS DEEMED YOUR ACCEPTANCE OF THE ABOVE SUPPLEMENTARY TERMS
                                </Strong>
                                .
                            </p>
                            <Title3>c. Changes to These Terms</Title3>
                            <p>
                                Nami.Exchange reserves the right to change or modify these Terms in its discretion at any time. Nami.Exchange will notify such
                                changes by updating the terms on its website (
                                <a className="text-teal" href="https://nami.exchange/terms-of-service">
                                    https://nami.exchange/terms-of-service
                                </a>
                                ) and modifying the [Last revised] date displayed on this page.{' '}
                                <Strong>
                                    ANY AND ALL MODIFICATIONS OR CHANGES TO THESE TERMS WILL BECOME EFFECTIVE UPON PUBLICATION ON THE WEBSITE OR RELEASE TO
                                    USERS. THEREFORE, YOUR CONTINUED USE OF NAMI.EXCHANGE SERVICES IS DEEMED YOUR ACCEPTANCE OF THE MODIFIED AGREEMENT AND
                                    RULES. IF YOU DO NOT AGREE TO ANY CHANGES TO THESE TERMS, YOU MUST STOP USING NAMI.EXCHANGE SERVICES IMMEDIATELY. YOU ARE
                                    RECOMMENDED TO FREQUENTLY REVIEW THESE TERMS TO ENSURE YOUR UNDERSTANDING OF THE TERMS AND CONDITIONS THAT APPLY TO YOUR
                                    ACCESS TO AND USE OF NAMI.EXCHANGE SERVICES
                                </Strong>
                                .
                            </p>
                            <Title3>d. Prohibition of Use</Title3>
                            <p>
                                <Strong>
                                    BY ACCESSING AND USING Nami.Exchange SERVICES, YOU REPRESENT AND WARRANT THAT YOU HAVE NOT BEEN INCLUDED IN ANY TRADE
                                    EMBARGOES OR ECONOMIC SANCTIONS LIST (SUCH AS THE UNITED NATIONS SECURITY COUNCIL SANCTIONS LIST), THE LIST OF SPECIALLY
                                    DESIGNATED NATIONALS MAINTAINED BY OFAC (THE OFFICE OF FOREIGN ASSETS CONTROL OF THE U.S. DEPARTMENT OF THE TREASURY), OR
                                    THE DENIED PERSONS OR ENTITY LIST OF THE U.S. DEPARTMENT OF COMMERCE. Nami.Exchange RESERVES THE RIGHT TO CHOOSE MARKETS AND
                                    JURISDICTIONS TO CONDUCT BUSINESS, AND MAY RESTRICT OR REFUSE, IN ITS DISCRETION, THE PROVISION OF Nami.Exchange SERVICES IN
                                    CERTAIN COUNTRIES OR REGIONS.
                                </Strong>
                            </p>
                            <Title2>2. About Nami.Exchange</Title2>
                            <p>
                                As an important part of the Nami.Exchange Ecosystem, Nami.Exchange mainly serves as a global online platform for Digital Assets
                                trading, and provides Users with a trading platform, financing services, technical services and other Digital Assets-related
                                services. As further detailed in Article 3 below, Users must register and open an account with Nami.Exchange, and deposit
                                Digital Assets into their account prior to trading. Users may, subject to the restrictions set forth in these Terms, apply for
                                the withdrawal of Digital Assets.
                            </p>
                            <Paragraph>
                                Although Nami.Exchange has been committed to maintaining the accuracy of the information provided through Nami.Exchange
                                Services, Nami.Exchange cannot and does not guarantee its accuracy, applicability, reliability, integrity, performance or
                                appropriateness, nor shall Nami.Exchange be liable for any loss or damage that may be caused directly or indirectly by your use
                                of these contents. The information about Nami.Exchange Services may change without notice, and the main purpose of providing
                                such information is to help Users make independent decisions. Nami.Exchange does not provide investment or consulting advice of
                                any kind, and is not responsible for the use or interpretation of information on Nami.Exchange or any other communication
                                medium. All Users of Nami.Exchange Services must understand the risks involved in Digital Assets trading, and are recommended to
                                exercise prudence and trade responsibly within their own capabilities.
                            </Paragraph>
                            <Title2>3. Nami.Exchange Account Registration and Requirements</Title2>
                            <Title3>a. Registration</Title3>
                            <p>
                                All Users must apply for a Nami.Exchange Account before using Nami.Exchange Services. When you register a Nami.Exchange Account,
                                you must provide your email address and password, and accept these Terms, the Privacy Policy, and other Nami.Exchange Platform
                                Rules. Nami.Exchange may refuse, in its discretion, to open a Nami.Exchange Account for you. You agree to provide complete and
                                accurate information when opening a Nami.Exchange Account, and agree to timely update any information you provide to
                                Nami.Exchange to maintain the integrity and accuracy of the information. Only one User can be registered at a time, but each
                                individual User (including any User that is a business or legal entity) may maintain only one main account at any given time.
                                Institutional Users (including Users that are businesses and other legal entities) can open one or more sub accounts under the
                                main account with the consent of Nami.Exchange. For certain Nami.Exchange Services, you may be required to set up a special
                                account independent from your Nami.Exchange Account, based on the provisions of these Terms or the Supplementary Terms. The
                                registration, use, protection and management of such trading accounts are equally governed by the provisions of this article and
                                article 6, unless otherwise stated in these Terms or the Supplementary Terms.
                            </p>
                            <Title3>b. Eligibility</Title3>
                            <p>
                                By registering to use a Nami Exchange Account, you represent and warrant that: (i) as an individual, you are at least 18 or are of legal age to form a binding contract under applicable laws; (ii) as an individual, legal person, or other organization, you have full legal capacity and sufficient authorizations to enter into these Terms; (iii) you have not been previously suspended or removed from using the Nami Exchange Platform or the Nami Exchange Services; (iv) you do not have an existing Nami Exchange Account; (v) you are not resident, located in or otherwise attempting to access the Nami Exchange Platform or the Nami Exchange Services from, or otherwise acting on behalf of a person or legal entity that is resident or located in, a Restricted Location. For the purposes hereof, “Restricted Location” shall include the United States, Malaysia, Mainland China, Iran, North Korea, Cuba, Ontario (Canada), and such other locations as designated by Nami Exchange Operators from time to time as a “Restricted Location” for the purposes hereof; (vi) if you act as an employee or agent of a legal entity, and enter into these Terms on their behalf, you represent and warrant that you have all the necessary rights and authorizations to bind such legal entity and to access and use the Nami Exchange Platform and Nami Exchange Services on behalf of such legal entity; and (vii) your use of the Nami Exchange Platform and the Nami Exchange Services will not violate any and all laws and regulations applicable to you or the legal entity on whose behalf you are acting, including but not limited to regulations on anti-money laundering, anti-corruption, and counter-terrorist financing.
                            </p>
                            <Title3>c. User Identity Verification</Title3>
                            <p>
                                Your registration of an account with Nami.Exchange will be deemed your agreement to provide required personal information for
                                identity verification. Such information will be used to verify Users&rsquo; identity, identify traces of money laundering,
                                terrorist financing, fraud and other financial crimes through Nami.Exchange, or for other lawful purposes stated by
                                Nami.Exchange. We will collect, use and share such information in accordance with our Privacy Policy. In addition to providing
                                such information, you agree to allow us to keep a record of that information during the period for which your account is active
                                and within five (5) years after your account is closed, in compliance with global industry standards on data storage. You also
                                authorize us to conduct necessary investigations directly or through a third party to verify your identity or protect you and/or
                                us from financial crimes, such as fraud. The information we require to verify your identity may include, but is not limited to,
                                your name, email address, contact information, phone number, username, government-issued ID, date of birth, and other
                                information collected during account registration. When providing the required information, you confirm it is true and accurate.{' '}
                                <Strong>
                                    AFTER REGISTRATION, YOU MUST ENSURE THAT THE INFORMATION IS TRUE, COMPLETE, AND TIMELY UPDATED WHEN CHANGED. IF THERE ARE
                                    ANY GROUNDS FOR BELIEVING THAT ANY OF THE INFORMATION YOU PROVIDED IS INCORRECT, FALSE, OUTDATED OR INCOMPLETE,
                                    NAMI.EXCHANGE RESERVES THE RIGHT TO SEND YOU A NOTICE TO DEMAND CORRECTION, DIRECTLY DELETE THE RELEVANT INFORMATION, AND,
                                    AS THE CASE MAY BE, TERMINATE ALL OR PART OF NAMI.EXCHANGE SERVICES WE PROVIDE FOR YOU. IF WE ARE UNABLE TO REACH YOU WITH
                                    THE CONTACT INFORMATION YOU PROVIDED, YOU SHALL BE FULLY LIABLE FOR ANY LOSS OR EXPENSE CAUSED TO NAMI.EXCHANGE DURING YOUR
                                    USE OF NAMI.EXCHANGE SERVICES. YOU HEREBY ACKNOWLEDGE AND AGREE THAT YOU HAVE THE OBLIGATION TO UPDATE ALL THE INFORMATION
                                    IF THERE IS ANY CHANGE
                                </Strong>
                                .
                            </p>
                            <Paragraph>
                                <Strong>
                                    BY REGISTERING AN ACCOUNT, YOU HEREBY AUTHORIZE NAMI.EXCHANGE TO CONDUCT INVESTIGATIONS THAT NAMI.EXCHANGE CONSIDERS
                                    NECESSARY, EITHER DIRECTLY OR THROUGH A THIRD PARTY, TO VERIFY YOUR IDENTITY OR PROTECT YOU, OTHER USERS AND/OR
                                    NAMI.EXCHANGE FROM FRAUD OR OTHER FINANCIAL CRIMES, AND TO TAKE NECESSARY ACTIONS BASED ON THE RESULTS OF SUCH
                                    INVESTIGATIONS. YOU ALSO ACKNOWLEDGE AND AGREE THAT YOUR PERSONAL INFORMATION MAY BE DISCLOSED TO CREDIT BUREAUS AND
                                    AGENCIES FOR FRAUD PREVENTION OR FINANCIAL CRIME PREVENTION, WHICH MAY RESPOND TO OUR INVESTIGATIONS IN FULL
                                </Strong>
                                .
                            </Paragraph>
                            <Title3>d. Account Usage Requirements</Title3>
                            <p>
                                The Nami.Exchange Account can only be used by the account registrant. Nami.Exchange reserves the right to suspend, freeze or
                                cancel the use of Nami.Exchange Accounts by persons other than account registrants. If you suspect or become aware of any
                                unauthorized use of your username and password, you should notify Nami.Exchange immediately. Nami.Exchange assumes no liability
                                for any loss or damage arising from the use of Nami.Exchange Account by you or any third party with or without your
                                authorization.
                            </p>
                            <Title3>e. Account Security</Title3>
                            <p>
                                Nami.Exchange has been committed to maintaining the security of User entrusted funds, and has implemented industry standard
                                protection for Nami.Exchange Services. However, the actions of individual Users may pose risks. You shall agree to treat your
                                access credentials (such as username and password) as confidential information, and not to disclose such information to any
                                third party. You also agree to be solely responsible for taking the necessary security measures to protect your Nami.Exchange
                                Account and personal information.
                            </p>
                            <Paragraph>
                                You should be solely responsible for keeping your Nami.Exchange Account and password safety, and be responsible for all the
                                transactions under your Nami.Exchange Account. Nami.Exchange assumes no liability for any loss or consequences caused by
                                authorized or unauthorized use of your account credentials, including but not limited to information disclosure, information
                                release, consent or submission of various rules and agreements by clicking on the website, online agreement renewal, etc.
                            </Paragraph>
                            <Paragraph>By creating a Nami.Exchange Account, you hereby agree that:</Paragraph>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <p role="presentation">
                                        you will notify Nami.Exchange immediately if you are aware of any unauthorized use of your Nami.Exchange Account and
                                        password or any other violation of security rules;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        you will strictly abide by all mechanisms or procedures of Nami.Exchange regarding security, authentication, trading,
                                        charging, and withdrawal; and
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">you will take appropriate steps to logout from Nami.Exchange at the end of each visit.</p>
                                </li>
                            </ol>
                            <Title3>f. Personal Data</Title3>
                            <p>
                                Your personal data will be properly protected and kept confidential, but Nami.Exchange has the right to collect, process, use or
                                disclose your personal data in accordance with the Terms (including the Privacy Policy) or applicable laws. Depending on the
                                products or services concerned, your personal data may be disclosed to the following third parties:
                            </p>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <p role="presentation">your transaction counterparty;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Nami.Exchange Operators, and the shareholders, partners, investors, directors, supervisors, senior managers and
                                        employees of such entities;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">our joint ventures, alliance partners and business partners;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        our agents, contractors, suppliers, third-party service providers and professional advisers, including the parties who
                                        have been contracted to provide us with administrative, financial, research, operations, IT and other services, in such
                                        areas as telecommunications, information technology, payroll, information processing, training, market research, storage
                                        and archival;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        third-party business partners who provide goods and services or sponsor contests or other promotional activities,
                                        whether or not in cooperation with us;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">insurance companies or insurance investigators and credit providers;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        credit bureaus, or any debt collection agencies or dispute resolution centers in the event of violation or dispute;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        business partners, investors, trustees or assignees (actual or expected) that promote business asset transactions (which
                                        can be broadened to include any merger, acquisition or asset sale) of Nami.Exchange Operators;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">professional consultants such as auditors and lawyers;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        relevant government regulatory agencies or law enforcement agencies to comply with laws or regulations formulated by
                                        government authorities;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">assignees of our rights and obligations;</p>
                                </li>
                                <li>
                                    <p role="presentation">banks, credit card companies and their respective service providers;</p>
                                </li>
                                <li>
                                    <p role="presentation">persons with your consent as determined by you or the applicable contract.</p>
                                </li>
                            </ol>
                            <Title1>III. Nami.Exchange Services</Title1>
                            <p>
                                Upon completion of the registration and identity verification for your Nami.Exchange Account, you may use various Nami.Exchange
                                Services, including but not limited to, Crypto-to-crypto Trading, contract trading, leveraged trading, Nami.Exchange Savings
                                services, staking, acquiring market-related data, research and other information released by Nami.Exchange, participating in
                                User activities held by Nami.Exchange, etc., in accordance with the provisions of these Terms (including Nami.Exchange Platform
                                Rules and other individual agreements). Nami.Exchange has the right to:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    <p role="presentation">
                                        Provide, modify or terminate, in its discretion, any Nami.Exchange Services based on its development plan; and
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Allow or prohibit some Users&rsquo; use of any Nami.Exchange Services in accordance with relevant Nami.Exchange Platform
                                        Rules.
                                    </p>
                                </li>
                            </ul>
                            <Title2>1. Service Usage Guidelines</Title2>
                            <Title3>a. License</Title3>
                            <p>
                                Provided that you constantly comply with the express terms and conditions stated in these Terms, Nami.Exchange grants you a
                                revocable, limited, royalty-free, non-exclusive, non-transferable, and non-sublicensable license to access and use Nami.Exchange
                                Services through your computer or Internet compatible devices for your personal/internal purposes. You are prohibited to use
                                Nami.Exchange Services for resale or commercial purposes, including transactions on behalf of other persons or entities. All the
                                above actions are expressly prohibited and constitute a material violation of these Terms. The content layout, format, function
                                and access rights regarding Nami.Exchange Services should be stipulated at the discretion of Nami.Exchange. Nami.Exchange
                                reserves all rights not expressly granted in these Terms. Therefore, you are hereby prohibited from using Nami.Exchange Services
                                in any way not expressly authorized by these Terms.
                            </p>
                            <Paragraph>
                                These Terms only grant a limited license to access and use Nami.Exchange Services. Therefore, you hereby agree that when you use
                                Nami.Exchange Services, Nami.Exchange does not transfer Nami.Exchange Services or the ownership of intellectual property rights
                                of any Nami.Exchange intellectual property to you or anyone else. All the text, graphics, user interfaces, visual interface,
                                photos, sounds, process flow diagrams, computer code (including html code), programs, software, products, information and
                                documents, as well as the design, structure, selection, coordination, expression, look and feel, and layout of any content
                                included in the services or provided through Nami.Exchange Services, are exclusively owned, controlled and/or licensed by
                                Nami.Exchange Operators or its members, parent companies, licensors or affiliates.
                            </Paragraph>
                            <Paragraph>
                                Nami.Exchange owns any feedback, suggestions, ideas, or other information or materials (hereinafter collectively referred to as
                                &ldquo;Feedback&rdquo;) about Nami.Exchange or Nami.Exchange Services that you provide through email, Nami.Exchange Services, or
                                other ways. You hereby transfer all rights, ownership and interests of the Feedback and all related intellectual property rights
                                to Nami.Exchange. You have no right and hereby waive any request for acknowledgment or compensation based on any Feedback, or
                                any modifications based on any Feedback.
                            </Paragraph>
                            <Title3>b. Restrictions</Title3>
                            <p>When you use Nami.Exchange Services, you agree and undertake to comply with the following provisions:</p>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <p role="presentation">
                                        During the use of Nami.Exchange Services, all activities you carry out should comply with the requirements of applicable
                                        laws and regulations, these Terms, and various guidelines of Nami.Exchange;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Your use of Nami.Exchange Services should not violate public interests, public morals, or the legitimate interests of
                                        others, including any actions that would interfere with, disrupt, negatively affect, or prohibit other Users from using
                                        Nami.Exchange Services;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You agree not to use the services for market manipulation (such as pump and dump schemes, wash trading, self-trading,
                                        front running, quote stuffing, and spoofing or layering, regardless of whether prohibited by law);
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Without written consent from Nami.Exchange, the following commercial uses of Nami.Exchange data are prohibited: 1)
                                        Trading services that make use of Nami.Exchange quotes or market bulletin board information. 2) Data feeding or
                                        streaming services that make use of any market data of Nami.Exchange. 3) Any other websites/apps/services that charge
                                        for or otherwise profit from (including through advertising or referral fees) market data obtained from Nami.Exchange.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Without prior written consent from Nami.Exchange, you may not modify, replicate, duplicate, copy, download, store,
                                        further transmit, disseminate, transfer, disassemble, broadcast, publish, remove or alter any copyright statement or
                                        label, or license, sub-license, sell, mirror, design, rent, lease, private label, grant security interests in the
                                        properties or any part of the properties, or create their derivative works or otherwise take advantage of any part of
                                        the properties.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You may not (i) use any deep linking, web crawlers, bots, spiders or other automatic devices, programs, scripts,
                                        algorithms or methods, or any similar or equivalent manual processes to access, obtain, copy or monitor any part of the
                                        properties, or replicate or bypass the navigational structure or presentation of Nami.Exchange Services in any way, in
                                        order to obtain or attempt to obtain any materials, documents or information in any manner not purposely provided
                                        through Nami.Exchange Services; (ii) attempt to access any part or function of the properties without authorization, or
                                        connect to Nami.Exchange Services or any Nami.Exchange servers or any other systems or networks of any Nami.Exchange
                                        Services provided through the services by hacking, password mining or any other unlawful or prohibited means; (iii)
                                        probe, scan or test the vulnerabilities of Nami.Exchange Services or any network connected to the properties, or violate
                                        any security or authentication measures on Nami.Exchange Services or any network connected to Nami.Exchange Services;
                                        (iv) reverse look-up, track or seek to track any information of any other Users or visitors of Nami.Exchange Services;
                                        (v) take any actions that imposes an unreasonable or disproportionately large load on the infrastructure of systems or
                                        networks of Nami.Exchange Services or Nami.Exchange, or the infrastructure of any systems or networks connected to
                                        Nami.Exchange services; (vi) use any devices, software or routine programs to interfere with the normal operation of
                                        Nami.Exchange Services or any transactions on Nami.Exchange Services, or any other person&rsquo;s use of Nami.Exchange
                                        Services; (vii) forge headers, impersonate, or otherwise manipulate identification, to disguise your identity or the
                                        origin of any messages or transmissions you send to Nami.Exchange, or (viii) use Nami.Exchange Services in an illegal
                                        way.
                                    </p>
                                </li>
                            </ol>
                            <Paragraph>
                                By accessing Nami.Exchange Services, you agree that Nami.Exchange has the right to investigate any violation of these Terms,
                                unilaterally determine whether you have violated these Terms, and take actions under relevant regulations without your consent
                                or prior notice. Examples of such actions include, but are not limited to:
                            </Paragraph>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    <p role="presentation">Blocking and closing order requests;</p>
                                </li>
                                <li>
                                    <p role="presentation">Freezing your account;</p>
                                </li>
                                <li>
                                    <p role="presentation">Reporting the incident to the authorities;</p>
                                </li>
                                <li>
                                    <p role="presentation">Publishing the alleged violations and actions that have been taken;</p>
                                </li>
                                <li>
                                    <p role="presentation">Deleting any information you published that are found to be violations.</p>
                                </li>
                            </ul>
                            <Title2>2. Crypto-to-crypto Trading</Title2>
                            <p>
                                Upon completion of the registration and identity verification for your Nami.Exchange Account, you may conduct Crypto-to-crypto
                                Trading on Nami.Exchange in accordance with the provisions of these Terms and Nami.Exchange Platform Rules.
                            </p>
                            <Title3>a. Orders</Title3>
                            <p>
                                Upon sending an instruction of using Nami.Exchange Services for Crypto-to-crypto Trading (an &ldquo;Order&rdquo;), your account
                                will be immediately updated to reflect the open Orders, and your Orders will be included in Nami.Exchange&rsquo;s order book to
                                match other users&rsquo; Orders. If one of your Orders fully or partially matches another user&rsquo;s Order, Nami.Exchange will
                                execute an exchange (a &ldquo;Transaction&rdquo;). Once the Transaction is executed, your account will be updated to reflect
                                that the Order has been fully executed and closed, or the Order has been partially executed. The Order will remain incomplete
                                until it is fully executed or cancelled under paragraph (b) below. To conclude a Transaction, you authorize Nami.Exchange to
                                temporarily control the Digital Currencies involved in your Transaction.
                            </p>
                            <Title3>b. Cancellation</Title3>
                            <p>
                                For Orders initiated through Nami.Exchange Services, you may only cancel them before they have been matched with other
                                Users&rsquo; Orders. Once your Order has been matched with another user&rsquo;s Order, you may not change, revoke or cancel
                                Nami.Exchange&rsquo;s authorization to complete the Order. For any partially matched Order, you may cancel the unmatched part of
                                the Order unless such portion has been matched. Nami.Exchange reserves the right to reject any cancellation request related to
                                the Order you have submitted. If your account does not have sufficient amount of Digital Currencies to execute an Order,
                                Nami.Exchange may cancel the entire Order, or execute part of the Order with the amount of Digital Currencies you have in your
                                account (in each case, any Transaction related fees payable to Nami.Exchange are deducted as stated in paragraph (c) below).
                            </p>
                            <Title3>c. Fees</Title3>
                            <p>
                                You agree to pay Nami.Exchange the fees specified in{' '}
                                <a href="https://nami.exchange/fee-schedule">https://nami.exchange/fee-schedule</a>. Nami.Exchange may, in its discretion,
                                update the fees at any time. Any updated fees will apply to any sales or other Transactions that occur following the effective
                                date of the updated fees. You authorize Nami.Exchange to deduct from your account any applicable fees that you owe under these
                                Terms.
                            </p>
                            <Title3>d. Other Types of Crypto-to-crypto Trading</Title3>
                            <p>
                                In addition to the Crypto-to-crypto Trading that allows users to directly place orders as mentioned in paragraph (a) above,
                                Nami.Exchange may, in its discretion, provide technical and platform services for other types of Crypto-to-crypto Trading under
                                its separately formulated Nami.Exchange Platform Rules, such as One Cancels the Other (OCO) and block trade.
                            </p>
                            <Title2>3. Futures Trading</Title2>
                            <p>
                                Unless otherwise specified by Nami.Exchange, to conduct Futures Trading, you must conclude with Nami.Exchange a separate
                                Nami.Exchange Futures Service Agreement (
                                <a href="https://nami.exchange/terms-of-futures">https://nami.exchange/terms-of-futures</a>) and open a special Collateral
                                Account, following the completion of registration and identity verification for your Nami.Exchange Account. You acknowledge and
                                agree that:
                            </p>
                            <Paragraph>
                                a. You fully understand the high risks of Futures Trading, including but not limited to the risk of major fluctuations of
                                Digital Assets in Futures Trading, and the risk of exacerbated adverse outcome when leverage is used;
                            </Paragraph>
                            <Paragraph>
                                b. You have sufficient investment knowledge and experience and the capacity to take risks arising from Futures Trading, and
                                agree to independently assume all the risks arising from the investment of Futures Trading;
                            </Paragraph>
                            <Paragraph>
                                c. Before performing Futures Trading, you have read and understood all the contents of the Nami.Exchange Futures Service
                                Agreement and the relevant Nami.Exchange Platform Rules, and have consulted relevant professionals to make informed decisions on
                                whether and how to complete Futures Trading according to their recommendations and your own reasonable judgment;
                            </Paragraph>
                            <Paragraph>
                                d. You agree and authorize Nami.Exchange to take various reasonable measures in its discretion (including but not limited to
                                forced liquidation and forced position reduction under specific circumstances) in accordance with the Nami.Exchange Futures
                                Service Agreement and the relevant Nami.Exchange Platform Rules to protect the legitimate interests of you, Nami.Exchange and
                                other Users.
                            </Paragraph>
                            <Title2>4. Margins Trading</Title2>
                            <p>
                                Unless otherwise specified by Nami.Exchange, prior to conducting Margins Trading, you must open a special Collateral Account
                                and/or complete other related procedures, following the completion of registration and identity verification for your
                                Nami.Exchange Account.
                            </p>
                            <Title3>a. Risks of Margins Trading</Title3>
                            <p>
                                Margins Trading is highly risky. As a leveraged trader, you acknowledge and agree that you access and use Margins Trading and
                                borrowing services at your own risk, which include but are not limited to:
                            </p>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <p role="presentation">
                                        The liquidity, market depth and dynamics of the trading market fluctuate violently and change rapidly. The use of
                                        leverage may work to your advantage or disadvantage, which may result in major gains or losses as the case may be.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You are not eligible to receive forked currencies split from any blockchain assets in your Collateral Account, even if
                                        you have not engaged in any Margins Trading or borrowing at all.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Loans carry risk, and the value of your blockchain assets may decline. If the value of your assets drops to a certain
                                        level, you are responsible for dealing with these market circumstances.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        In some market situations, you may find it difficult or impossible to liquidate a position. This may occur, for example,
                                        as a result of insufficient market liquidity or technical issues on Nami.Exchange.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Placing contingent Orders does not necessarily limit your losses to the expected amount, as market conditions may
                                        prevent you from executing such orders.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Margins Trading does not have guaranteed measures against losses. As a borrower, you may suffer losses that exceed the
                                        amount you deposited into your Collateral Account.
                                    </p>
                                </li>
                            </ol>
                            <Title3>b. To start Margins Trading:</Title3>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <p role="presentation">
                                        You represent and warrant that you are neither from the U.S. nor on any list of trade embargoes or economic sanctions,
                                        such as the Specially Designated National by OFAC (The Office of Foreign Assets Control of the U.S. Department of the
                                        Treasury).
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You should fully understand the risks associated with Margins Trading and Lending, and be fully responsible for any
                                        trading and non-trading activities under your Nami.Exchange Account and Collateral Account. You should not engage in
                                        Transactions or invest in funds that are beyond your financial capacities;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You are fully responsible for knowing the true status of any position, even if Nami.Exchange may present it incorrectly
                                        at any time;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You agree to keep enough Digital Assets in your Collateral Account, as required by Nami.Exchange for Users&rsquo;
                                        engagement in Margins Trading, and promptly repay your loan in full. Failure to keep enough assets or to timely repay
                                        the outstanding loan may result in forced liquidation of the assets in your Collateral Account;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Even if with the ability to forcefully liquidate any position, Nami.Exchange cannot guarantee to stop losses. If your
                                        assets are insufficient to repay the outstanding loan after the liquidation of your position, you are still liable for
                                        any further shortfall of assets;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        Nami.Exchange may take measures, in its discretion and on your behalf, to reduce your potential losses, including but
                                        not limited to, transferring assets from your Collateral Account into your Nami.Exchange Account and/or vice versa;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        During Nami.Exchange system maintenance, you agree to be fully responsible for managing your Collateral Account under
                                        risks, including but not limited to, closing positions and repaying your loan.
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        You agree to conduct all Transactions, Margins Trading and/or borrowing on your own, and be fully responsible for your
                                        activities. Nami.Exchange assumes no liability for any loss or damage caused by your use of any Nami.Exchange services
                                        or your unawareness of the risks associated with the use of Digital Assets or with your use of Nami.Exchange Services.
                                    </p>
                                </li>
                            </ol>
                            <Title2>5. Lending Services</Title2>
                            <p>
                                Unless otherwise provided by Nami.Exchange, to borrow currencies, you must conclude with Nami.Exchange a separate Lending
                                Services User Agreement and open a special Collateral Account and/or finish other relevant procedures, following the completion
                                of registration and identity verification for your Nami.Exchange Account. You understand and agree that:
                            </p>
                            <Paragraph>
                                a. There are considerable risks involved in Lending Services, which include without limitation the risks of fluctuation of the
                                borrowed Digital Assets&rsquo; value, derivative risks and technical risks. You shall carefully consider and exercise clear
                                judgment to evaluate your financial situation and the aforesaid risks to make any decision on using Lending Services, and you
                                shall be responsible for all losses arising therefrom;
                            </Paragraph>
                            <Paragraph>
                                b. you shall cooperate to provide the information and materials related to identity verification and Lending Services as
                                required by Nami.Exchange, and be solely responsible for taking necessary security measures to protect the security of your
                                Collateral Account and personal information;
                            </Paragraph>
                            <Paragraph>
                                c. you shall carefully read relevant Nami.Exchange Platform Rules before using Lending Services, and be aware of, understand and
                                observe the specific information and rules regarding the operations of Lending Services, and you undertake that the use of the
                                assets borrowed shall conform to requirements of these Terms and related laws and regulations;
                            </Paragraph>
                            <Paragraph>
                                d. Nami.Exchange has the full right to manage your Collateral Account and collateral during the period in which Lending Services
                                are offered, and reserves the right, under the circumstances specified in the Lending Services User Agreement or these Terms, to
                                implement various risk control measures, which include but are not limited to forced liquidation. Such steps may cause major
                                losses to you and you shall be solely responsible for the outcomes of such measures;
                            </Paragraph>
                            <Paragraph>
                                e. Nami.Exchange has the right to temporarily or permanently prohibit you from using Lending Services when it deems it necessary
                                or reasonable, and to the maximum extent permitted by law, without liability of any kind to you.
                            </Paragraph>
                            <Title2>6. Nami.Exchange Savings Service</Title2>
                            <p>
                                Nami.Exchange offers Nami.Exchange Savings, a service to provide Users with value-added services for their idle Digital Assets.
                                To use Nami.Exchange Savings service, you must conclude with Nami.Exchange a separate Nami.Exchange Savings Service User
                                Agreement (<a href="https://nami.exchange/saving-terms">https://nami.exchange/saving-terms</a>) and open a special Nami.Exchange
                                Savings service account, following the completion of registration and identity verification for your Nami.Exchange Account. When
                                using Nami.Exchange Savings service, you should note that:
                            </p>
                            <Paragraph>a. Nami.Exchange Savings assets will be used in cryptocurrency leveraged borrowing and other businesses.</Paragraph>
                            <Paragraph>
                                b. When you use Nami.Exchange Savings service, you will unconditionally authorize Nami.Exchange to distribute and grant the
                                leveraged interest according to Nami.Exchange Platform Rules.
                            </Paragraph>
                            <Paragraph>
                                c. You shall abide by relevant laws and regulations to ensure that the sources of Digital Assets are legitimate and compliant
                                when using Nami.Exchange Savings service.
                            </Paragraph>
                            <Paragraph>
                                d. When you use Nami.Exchange Savings service, you should fully recognize the risks of investing in Digital Assets and operate
                                cautiously.
                            </Paragraph>
                            <Paragraph>
                                e. You agree that all investment operations conducted on Nami.Exchange represent your true investment intentions and that
                                unconditionally accept the potential risks and benefits of your investment decisions.
                            </Paragraph>
                            <Paragraph>
                                f. Nami.Exchange reserves the right to suspend or terminate Nami.Exchange Savings service. If necessary, Nami.Exchange can
                                suspend and terminate Nami.Exchange Savings service at any time.
                            </Paragraph>
                            <Paragraph>
                                g. Due to network delay, computer system failures and other force majeure, which may lead to delay, suspension, termination or
                                deviation of execution of Nami.Exchange Savings service, Nami.Exchange will use reasonable effort to ensure but not promise that
                                Nami.Exchange Savings service execution system runs stably and effectively. Nami.Exchange does not take any responsibility if
                                the final execution fails to match your expectations due to the above factors.
                            </Paragraph>
                            <Title2>7. Staking Programs</Title2>
                            <p>
                                Nami.Exchange will from time to time launch Staking Programs for specific types of Digital Currencies to reward, as per certain
                                rules, users who hold such Digital Currencies in their Nami.Exchange Accounts. When participating in Staking Programs, you
                                should note that:
                            </p>
                            <Paragraph>
                                a. Unless otherwise stipulated by Nami.Exchange, Staking Programs are free of charge and Users may trade during the staking
                                period;
                            </Paragraph>
                            <Paragraph>b. Nami.Exchange does not guarantee Users&rsquo; proceeds under any Staking Program;</Paragraph>
                            <Paragraph>
                                c. Nami.Exchange has the right to initiate or terminate Staking Program for any Digital Currencies or modify rules on such
                                programs in its sole discretion;
                            </Paragraph>
                            <Paragraph>
                                d. Users shall ensure that sources of the Digital Currencies they hold in Nami.Exchange Accounts are legal and compliant and
                                undertake to observe related laws and regulations. Otherwise, Nami.Exchange has the right to take necessary steps in accordance
                                with these Terms or Nami.Exchange Platform Rules, including, without limitation, freezing Nami.Exchange Accounts or deducting
                                the Digital Currencies awarded to Users who violate the rules of respective Staking Programs.
                            </Paragraph>
                            <Title1>IV. Liabilities</Title1>
                            <Title2>1. Disclaimer of Warranties</Title2>
                            <p>
                                <Strong>
                                    TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, Nami.Exchange SERVICES, NAMI.EXCHANGE MATERIALS AND ANY PRODUCT,
                                    SERVICE OR OTHER ITEM PROVIDED BY OR ON BEHALF OF NAMI.EXCHANGE ARE OFFERED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
                                    AVAILABLE&rdquo; BASIS, AND NAMI.EXCHANGE EXPRESSLY DISCLAIMS, AND YOU WAIVE, ANY AND ALL OTHER WARRANTIES OF ANY KIND,
                                    WHETHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                                    TITLE OR NON-INFRINGEMENT OR WARRANTIES ARISING FROM COURSE OF PERFORMANCE, COURSE OF DEALING OR USAGE IN TRADE. WITHOUT
                                    LIMITING THE FOREGOING, NAMI.EXCHANGE DOES NOT REPRESENT OR WARRANT THAT THE SITE, NAMI.EXCHANGE SERVICES OR NAMI.EXCHANGE
                                    MATERIALS ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                                    NAMI.EXCHANGE DOES NOT GUARANTEE THAT ANY ORDER WILL BE EXECUTED, ACCEPTED, RECORDED OR REMAIN OPEN. EXCEPT FOR THE EXPRESS
                                    STATEMENTS, AGREEMENTS AND RULES SET FORTH IN THESE TERMS, YOU HEREBY ACKNOWLEDGE AND AGREE THAT YOU HAVE NOT RELIED UPON
                                    ANY OTHER STATEMENT OR AGREEMENT, WHETHER WRITTEN OR ORAL, WITH RESPECT TO YOUR USE AND ACCESS OF NAMI.EXCHANGE SERVICES.
                                    WITHOUT LIMITING THE FOREGOING, YOU HEREBY UNDERSTAND AND AGREE THAT NAMI.EXCHANGE WILL NOT BE LIABLE FOR ANY LOSSES OR
                                    DAMAGES ARISING OUT OF OR RELATING TO: (A) ANY INACCURACY, DEFECT OR OMISSION OF DIGITAL ASSETS PRICE DATA, (B) ANY ERROR OR
                                    DELAY IN THE TRANSMISSION OF SUCH DATA, (C) INTERRUPTION IN ANY SUCH DATA, (D) REGULAR OR UNSCHEDULED MAINTENANCE CARRIED
                                    OUT BY NAMI.EXCHANGE AND SERVICE INTERRUPTION AND CHANGE RESULTING FROM SUCH MAINTENANCE, (E) ANY DAMAGES INCURRED BY OTHER
                                    USERS&rsquo; ACTIONS, OMISSIONS OR VIOLATION OF THESE TERMS, (F) ANY DAMAGE CAUSED BY ILLEGAL ACTIONS OF OTHER THIRD PARTIES
                                    OR ACTIONS WITHOUT AUTHORIZED BY NAMI.EXCHANGE; AND (G) OTHER EXEMPTIONS MENTIONED IN DISCLAIMERS AND PLATFORM RULES ISSUED
                                    BY NAMI.EXCHANGE.
                                </Strong>
                            </p>
                            <Paragraph>
                                <Strong>
                                    THE DISCLAIMER OF IMPLIED WARRANTIES CONTAINED HEREIN MAY NOT APPLY IF AND TO THE EXTENT IT IS PROHIBITED BY APPLICABLE LAW
                                    OF THE JURISDICTION IN WHICH YOU RESIDE.
                                </Strong>
                            </Paragraph>
                            <Title2>2. Disclaimer of Damages and Limitation of Liability</Title2>
                            <p>
                                <Strong>
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL NAMI.EXCHANGE, ITS AFFILIATES AND THEIR RESPECTIVE
                                    SHAREHOLDERS, MEMBERS, DIRECTORS, OFFICERS, EMPLOYEES, ATTORNEYS, AGENTS, REPRESENTATIVES, SUPPLIERS OR CONTRACTORS BE
                                    LIABLE FOR ANY INCIDENTAL, INDIRECT, SPECIAL, PUNITIVE, CONSEQUENTIAL OR SIMILAR DAMAGES OR LIABILITIES WHATSOEVER
                                    (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA, INFORMATION, REVENUE, PROFITS OR OTHER BUSINESSES OR FINANCIAL
                                    BENEFITS) ARISING OUT OF NAMI.EXCHANGE SERVICES, ANY PERFORMANCE OR NON-PERFORMANCE OF NAMI.EXCHANGE SERVICES, OR ANY OTHER
                                    PRODUCT, SERVICE OR OTHER ITEM PROVIDED BY OR ON BEHALF OF NAMI.EXCHANGE AND ITS AFFILIATES, WHETHER UNDER CONTRACT,
                                    STATUTE, STRICT LIABILITY OR OTHER THEORY EVEN IF NAMI.EXCHANGE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES EXCEPT
                                    TO THE EXTENT OF A FINAL JUDICIAL DETERMINATION THAT SUCH DAMAGES WERE A RESULT OF NAMI.EXCHANGE&rsquo;S GROSS NEGLIGENCE,
                                    FRAUD, WILLFUL MISCONDUCT OR INTENTIONAL VIOLATION OF LAW. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
                                    INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
                                </Strong>
                            </p>
                            <Paragraph>
                                <Strong>
                                    NOTWITHSTANDING THE FOREGOING, IN NO EVENT WILL THE LIABILITY OF NAMI.EXCHANGE, ITS AFFILIATES AND THEIR RESPECTIVE
                                    SHAREHOLDERS, MEMBERS, DIRECTORS, OFFICERS, EMPLOYEES, ATTORNEYS, AGENTS, REPRESENTATIVES, SUPPLIERS OR CONTRACTORS ARISING
                                    OUT OF SERVICES OFFERED BY OR ON BEHALF OF NAMI.EXCHANGE AND ITS AFFILIATES, ANY PERFORMANCE OR NON-PERFORMANCE OF
                                    NAMI.EXCHANGE SERVICES, OR ANY OTHER PRODUCT, SERVICE OR OTHER ITEM, WHETHER UNDER CONTRACT, STATUTE, STRICT LIABILITY OR
                                    OTHER THEORY, EXCEED THE AMOUNT OF THE FEES PAID BY YOU TO NAMI.EXCHANGE UNDER THESE TERMS IN THE TWELVE-MONTH PERIOD
                                    IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM FOR LIABILITY.
                                </Strong>
                            </Paragraph>
                            <Title2>3. Indemnification</Title2>
                            <p>
                                You agree to indemnify and hold harmless Nami.Exchange Operators, their affiliates, contractors, licensors, and their respective
                                directors, officers, employees and agents from and against any claims, actions, proceedings, investigations, demands, suits,
                                costs, expenses and damages (including attorneys&rsquo; fees, fines or penalties imposed by any regulatory authority) arising
                                out of or related to (i) your use of, or conduct in connection with, Nami.Exchange Services, (ii) your breach or our enforcement
                                of these Terms, or (iii) your violation of any applicable law, regulation, or rights of any third party during your use of
                                Nami.Exchange Services. If you are obligated to indemnify Nami.Exchange Operators, their affiliates, contractors, licensors, and
                                their respective directors, officers, employees or agents pursuant to these Terms, Nami.Exchange will have the right, in its
                                sole discretion, to control any action or proceeding and to determine whether Nami.Exchange wishes to settle, and if so, on what
                                terms.
                            </p>
                            <Title1>V. Announcements</Title1>
                            <p>
                                Please be aware that all official announcements, news, promotions, competitions and airdrops will be listed on{' '}
                                <a href="https://nami.io/">https://nami.io/</a>.{' '}
                                <Strong>
                                    USERS UNDERTAKE TO REFER TO THESE MATERIALS REGULARLY AND PROMPTLY. NAMI.EXCHANGE WILL NOT BE HELD LIABLE OR RESPONSIBLE IN
                                    ANY MANNER OF COMPENSATION SHOULD USERS INCUR PERSONAL LOSSES ARISING FROM IGNORANCE OR NEGLIGENCE OF THE ANNOUNCEMENTS
                                </Strong>{' '}
                                .
                            </p>
                            <Title1>VI. Termination of Agreement</Title1>
                            <Title2>1. Suspension of Nami.Exchange Accounts</Title2>
                            <p>
                                You agree that Nami.Exchange shall have the right to immediately suspend your Nami.Exchange Account (and any accounts
                                beneficially owned by related entities or affiliates), freeze or lock the Digital Assets or funds in all such accounts, and
                                suspend your access to Nami.Exchange for any reason including if Nami.Exchange suspects any such accounts to be in violation of
                                these Terms, our Privacy Policy, or any applicable laws and regulations. You agree that Nami.Exchange shall not be liable to you
                                for any permanent or temporary modification of your Nami.Exchange Account, or suspension or termination of your access to all or
                                any portion of Nami.Exchange Services. Nami.Exchange shall reserve the right to keep and use the transaction data or other
                                information related to such Nami.Exchange Accounts. The above account controls may also be applied in the following cases:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    <p role="presentation">
                                        The Nami.Exchange Account is subject to a governmental proceeding, criminal investigation or other pending litigation;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">We detect unusual activities in the Nami.Exchange Account;</p>
                                </li>
                                <li>
                                    <p role="presentation">We detect unauthorized access to the Nami.Exchange Account;</p>
                                </li>
                                <li>
                                    <p role="presentation">We are required to do so by a court order or command by a regulatory/government authority.</p>
                                </li>
                            </ul>
                            <Title2>2. Cancellation of Nami.Exchange Accounts</Title2>
                            <p>
                                In case of any of the following events, Nami.Exchange shall have the right to directly terminate these Terms by cancelling your
                                Nami.Exchange Account, and shall enjoy the right but not the obligation to permanently freeze (cancel) the authorizations of
                                your Nami.Exchange Account on Nami.Exchange and withdraw the corresponding Nami.Exchange Account thereof:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    <p role="presentation">after Nami.Exchange terminates services to you;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        you allegedly register or register in any other person&rsquo;s name as a Nami.Exchange User again, directly or
                                        indirectly;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">the information that you have provided is untruthful, inaccurate, outdated or incomplete;</p>
                                </li>
                                <li>
                                    <p role="presentation">
                                        when these Terms are amended, you state your unwillingness to accept the amended Terms by applying for cancellation of
                                        your Nami.Exchange Account or by other means;
                                    </p>
                                </li>
                                <li>
                                    <p role="presentation">you request that Nami.Exchange Services be terminated; and</p>
                                </li>
                                <li>
                                    <p role="presentation">any other circumstances where Nami.Exchange deems it should terminate Nami.Exchange Services.</p>
                                </li>
                            </ul>
                            <Paragraph>
                                Should your Nami.Exchange Account be terminated, the account and transactional information that meet data retention standards
                                will be securely stored for 5 years. In addition, if a transaction is unfinished during the account termination process,
                                Nami.Exchange shall have the right to notify your counterparty of the situation at that time. You acknowledge that a
                                user-initiated account exit (right to erasure under GDPR or other equivalent regulations) will also be subjected to the
                                termination protocol stated above.
                            </Paragraph>
                            <Paragraph>
                                If Nami.Exchange is informed that any Digital Assets or funds held in your Nami.Exchange Account are stolen or otherwise are not
                                lawfully possessed by you, Nami.Exchange may, but has no obligation to, place an administrative hold on the affected funds and
                                your Nami.Exchange Account. If Nami.Exchange does lay down an administrative hold on some or all of your funds or Nami.Exchange
                                Account, Nami.Exchange may continue such hold until such time as the dispute has been resolved and evidence of the resolution
                                acceptable to Nami.Exchange has been provided to Nami.Exchange in a form acceptable to Nami.Exchange. Nami.Exchange will not
                                involve itself in any such dispute or the resolution of the dispute. You agree that Nami.Exchange will have no liability or
                                responsibility for any such hold, or for your inability to withdraw Digital Assets or funds or execute trades during the period
                                of any such hold.
                            </Paragraph>
                            <Title2>3. Remaining Funds After Nami.Exchange Account Termination</Title2>
                            <p>
                                Except as set forth in paragraph 4 below, once a Nami.Exchange Account is closed/withdrawn, all remaining account balance (which
                                includes charges and liabilities owed to Nami.Exchange) will be payable immediately to Nami.Exchange. Upon payment of all
                                outstanding charges to Nami.Exchange (if any), Users will have 5 business days to withdraw all Digital Assets or funds from the
                                account.
                            </p>
                            <Title2>
                                4. Remaining Funds After Nami.Exchange Account Termination Due to Fraud, Violation of Law, or Violation of These Terms
                            </Title2>
                            <p>
                                Nami.Exchange maintains full custody of the Digital Assets, funds and User data/information which may be turned over to
                                governmental authorities in the event of Nami.Exchange Accounts&rsquo; suspension/closure arising from fraud investigations,
                                investigations of violation of law or violation of these Terms.
                            </p>
                            <Title1>VII. No Financial Advice</Title1>
                            <p>
                                Nami.Exchange is not your broker, intermediary, agent, or advisor and has no fiduciary relationship or obligation to you in
                                connection with any trades or other decisions or activities affected by you using Nami.Exchange Services. No communication or
                                information provided to you by Nami.Exchange is intended as, or shall be considered or construed as, investment advice,
                                financial advice, trading advice, or any other sort of advice. Unless otherwise specified in these Terms, all trades are
                                executed automatically, based on the parameters of your order instructions and in accordance with posted trade execution
                                procedures, and you are solely responsible for determining whether any investment, investment strategy or related transaction is
                                appropriate for you according to your personal investment objectives, financial circumstances and risk tolerance, and you shall
                                be solely responsible for any loss or liability therefrom. You should consult legal or tax professionals regarding your specific
                                situation. Nami.Exchange does not recommend that any Digital Asset should be bought, earned, sold, or held by you. Before making
                                the decision to buy, sell or hold any Digital Asset, you should conduct your own due diligence and consult your financial
                                advisors prior to making any investment decision. Nami.Exchange will not be held responsible for the decisions you make to buy,
                                sell, or hold Digital Asset based on the information provided by Nami.Exchange.
                            </p>
                            <Title1>VIII. Compliance with Local Laws</Title1>
                            <p>
                                It is Users&rsquo; responsibility to abide by local laws in relation to the legal usage of Nami.Exchange Services in their local
                                jurisdiction as well as other laws and regulations applicable to Users. Users must also factor, to the extent of their local
                                laws all aspects of taxation, the withholding, collection, reporting and remittance to their appropriate tax authorities.{' '}
                                <Strong>
                                    ALL USERS OF Nami.Exchange SERVICES ACKNOWLEDGE AND DECLARE THAT THEIR FUNDS COME FROM LEGITIMATE SOURCES AND DO NOT
                                    ORIGINATE FROM ILLEGAL ACTIVITIES; USERS AGREE THAT Nami.Exchange WILL REQUIRE THEM TO PROVIDE OR OTHERWISE COLLECT THE
                                    NECESSARY INFORMATION AND MATERIALS AS PER RELEVANT LAWS OR GOVERNMENT ORDERS TO VERIFY THE LEGALITY OF THE SOURCES AND USE
                                    OF THEIR FUNDS
                                </Strong>{' '}
                                .Nami.Exchange maintains a stance of cooperation with law enforcement authorities globally and will not hesitate to seize,
                                freeze, terminate Users&rsquo; accounts and funds which are flagged out or investigated by legal mandate.
                            </p>
                            <Title1>IX. Privacy Policy</Title1>
                            <p>
                                Access to Nami.Exchange Services will require the submission of certain personally identifiable information. Please review
                                Nami.Exchange&rsquo;s Privacy Policy at&nbsp;
                                <a className="font-bold" href="https://nami.exchange/en/privacy">
                                    https://www.Nami.Exchange.com/en/privacy
                                </a>{' '}
                                for a summary of Nami.Exchange&rsquo;s guidelines regarding the collection and use of personally identifiable information.
                            </p>
                            <Title1>X. Resolving Disputes: Forum, Arbitration, Class Action Waiver</Title1>
                            <p>
                                <Strong>
                                    PLEASE READ THIS SECTION CAREFULLY, AS IT INVOLVES A WAIVER OF CERTAIN RIGHTS TO BRING LEGAL PROCEEDINGS, INCLUDING AS A
                                    CLASS ACTION.
                                </Strong>
                            </p>
                            <Paragraph>
                                1. Notice of Claim and Dispute Resolution Period. Please contact Nami.Exchange first! Nami.Exchange wants to address your
                                concerns without resorting to formal legal proceedings, if possible. If you have a dispute with Nami.Exchange, then you should
                                contact Nami.Exchange and a ticket number will be assigned. Nami.Exchange will attempt to resolve your dispute internally as
                                soon as possible. The parties agree to negotiate in good faith to resolve the dispute (which discussions shall remain
                                confidential and be subject to applicable rules protecting settlement discussions from use as evidence in any legal proceeding).
                            </Paragraph>
                            <Paragraph>
                                In the event the dispute cannot be resolved satisfactorily, and you wish to assert a legal claim against Nami.Exchange, then you
                                agree to set forth the basis of such claim in writing in a &ldquo;Notice of Claim,&rdquo; as a form of prior notice to
                                Nami.Exchange. The Notice of Claim must (1) describe the nature and basis of the claim or dispute, (2) set forth the specific
                                relief sought, (3) provide the original ticket number, and (4) include your Nami.Exchange account email. The Notice of Claim
                                should be submitted to an email address or hyperlink provided in your correspondence with Nami.Exchange. After you have provided
                                the Notice of Claim to Nami.Exchange, the dispute referenced in the Notice of Claim may be submitted by either Nami.Exchange or
                                you to arbitration in accordance with paragraph 2 of this Section, below. For the avoidance of doubt, the submission of a
                                dispute to Nami.Exchange for resolution internally and the delivery of a Notice of Claim to Nami.Exchange are prerequisites to
                                commencement of an arbitration proceeding (or any other legal proceeding). During the arbitration, the amount of any settlement
                                offer made by you or Nami.Exchange shall not be disclosed to the arbitrator.
                            </Paragraph>
                            <Paragraph>
                                2. Agreement to Arbitrate. You and Nami.Exchange agree that, subject to paragraph 1 above, any dispute, claim, or controversy
                                between you and Nami.Exchange arising in connection with or relating in any way to these Terms or to your relationship with
                                Nami.Exchange as a user of Nami.Exchange Services (whether based in contract, tort, statute, fraud, misrepresentation, or any
                                other legal theory, and whether the claims arise during or after the termination of these Terms) will be determined by mandatory
                                final and binding individual (not class) arbitration, except as set forth below under Exceptions to Agreement to Arbitrate. You
                                and Nami.Exchange further agree that the arbitrator shall have the exclusive power to rule on his or her own jurisdiction,
                                including without limitation any objections with respect to the existence, scope or validity of the Agreement to Arbitrate, or
                                to the arbitrability of any claim or counterclaim. Arbitration is more informal than a lawsuit in court. THERE IS NO JUDGE OR
                                JURY IN ARBITRATION, AND COURT REVIEW OF AN ARBITRATION AWARD IS LIMITED. There may be more limited discovery than in court. The
                                arbitrator must follow this agreement and can award the same damages and relief as a court (including, if applicable, attorney
                                fees), except that the arbitrator may not award declaratory or injunctive relief benefiting anyone but the parties to the
                                arbitration. The arbitration provisions set forth in this Section will survive termination of these Terms. Arbitration Rules.
                                The arbitration shall be subject to the Rules of Arbitration of the International Chamber of Commerce (the &ldquo;ICC&rdquo;)
                                then in force (the &ldquo;ICC Rules&rdquo;), as modified by this Section X. The arbitration will be administered by the
                                International Court of Arbitration of the ICC. Unless the parties agree otherwise, there shall be only one arbitrator appointed
                                in accordance with the ICC Rules. Any arbitration will be conducted in the English language, unless otherwise required by a
                                mandatory law of a member state of the European Union or any other jurisdiction. Regardless of the manner in which the
                                arbitration is conducted, the arbitrator shall issue a reasoned written decision sufficient to explain the essential findings
                                and conclusions on which the decision and award, if any, are based.{' '}
                                <Strong>
                                    JUDGMENT ON ANY ARBITRAL AWARD MAY BE GIVEN IN ANY COURT HAVING JURISDICTION OVER THE PARTY (OR OVER THE ASSETS OF THE
                                    PARTY) AGAINST WHOM SUCH AN AWARD IS RENDERED. Time for Filing: ANY ARBITRATION AGAINST Nami.Exchange MUST BE COMMENCED BY
                                    FILING A REQUEST FOR ARBITRATION WITHIN ONE (1) YEAR, AFTER THE DATE THE PARTY ASSERTING THE CLAIM FIRST KNOWS OR REASONABLY
                                    SHOULD KNOW OF THE ACT, OMISSION OR DEFAULT GIVING RISE TO THE CLAIM; AND THERE SHALL BE NO RIGHT TO ANY REMEDY FOR ANY
                                    CLAIM NOT ASSERTED WITHIN THAT TIME PERIOD. THIS ONE YEAR LIMITATION PERIOD IS INCLUSIVE OF THE INTERNAL DISPUTE RESOLUTION
                                    PROCEDURE SET FORTH IN PARAGRAPH 1 OF THIS SECTION, ABOVE. THERE SHALL BE NO RIGHT TO ANY REMEDY FOR ANY CLAIM NOT ASSERTED
                                    WITHIN THAT TIME PERIOD
                                </Strong>{' '}
                                . If applicable law prohibits a one-year limitation period for asserting claims, any claim must be asserted within the shortest
                                time period permitted by applicable law. Process; Notice: The party who intends to seek arbitration after the expiration of the
                                Dispute Resolution Period set forth in paragraph 1, above, must submit a request to the ICC in accordance with the ICC Rules. If
                                we request arbitration against you, we will give you notice at the email address or mailing address you have provided. You agree
                                that any notice sent to this email or mailing address shall be deemed effective for all purposes, including without limitation
                                to determinations of adequacy of service. It is your obligation to ensure that the email address and/or mailing address on file
                                with Nami.Exchange is up-to-date and accurate. Seat of Arbitration: The seat of the arbitration shall be Switzerland. Place of
                                Hearing: The location of any in-person arbitration hearing shall be Switzerland, unless otherwise agreed to by the parties.
                                Governing Law / Jurisdiction: The governing law of the arbitration shall be determined in accordance with the ICC Rules.
                                Confidentiality. The parties agree that the arbitration shall be kept confidential. The existence of the arbitration, any
                                nonpublic information provided in the arbitration, and any submissions, orders or awards made in the arbitration (together, the
                                &ldquo;Confidential Information&rdquo;) shall not be disclosed to any non-party except the tribunal, the ICC, the parties, their
                                counsel, experts, witnesses, accountants and auditors, insurers and reinsurers, and any other person necessary to the conduct of
                                the arbitration. Notwithstanding the foregoing, a party may disclose Confidential Information to the extent that disclosure may
                                be required to fulfill a legal duty, protect or pursue a legal right, or enforce or challenge an award in bona fide legal
                                proceedings. This confidentiality provision shall survive termination of these Terms and of any arbitration brought pursuant to
                                these Terms.
                            </Paragraph>
                            <Paragraph>
                                3. Class Action Waiver. You and Nami.Exchange agree that any claims relating to these Terms or to your relationship with
                                Nami.Exchange as a user of Nami.Exchange Services (whether based in contract, tort, statute, fraud, misrepresentation, or any
                                other legal theory, and whether the claims arise during or after the termination of these Terms) shall be brought against the
                                other party in an arbitration on an individual basis only and not as a plaintiff or class member in a purported class or
                                representative action. You and Nami.Exchange further agree to waive any right for such claims to be brought, heard, or
                                arbitrated as a class, collective, representative, or private attorney general action, to the extent permissible by applicable
                                law. Combining or consolidating individual arbitrations into a single arbitration is not permitted without the consent of all
                                parties, including Nami.Exchange.
                            </Paragraph>
                            <Paragraph>
                                4. Modifications. Nami.Exchange reserves the right to update, modify, revise, suspend, or make any future changes to Section X
                                regarding the parties&rsquo; Agreement to Arbitrate, subject to applicable law. You hereby consent and agree that it is your
                                responsibility to ensure that your understanding of this Section is up to date. Subject to the applicable law, your continued
                                use of your Nami.Exchange account shall be deemed to be your acceptance of any modifications to Section X regarding the
                                parties&rsquo; Agreement to Arbitrate. You agree that if you object to the modifications to Section X, Nami.Exchange may block
                                access to your account pending closure of your account. In such circumstances, the Terms of Use prior to modification shall
                                remain in full force and effect pending closure of your account.
                            </Paragraph>
                            <Paragraph>
                                5. Severability. If any portion of these Terms are adjudged to be invalid or unenforceable for any reason or to any extent, the
                                remainder of these Terms will remain valid and enforceable and the invalid or unenforceable portion will be given effect to the
                                greatest extent permitted by law. pending closure of your account.
                            </Paragraph>
                            <Title1>XI. Miscellaneous</Title1>
                            <p>
                                1. Independent Parties. Nami.Exchange is an independent contractor but not an agent of you in the performance of these Terms.
                                These Terms shall not be interpreted as facts or evidence of an association, joint venture, partnership, or franchise between
                                the parties.
                            </p>
                            <Paragraph>
                                2. Entire Agreement. These Terms constitute the entire agreement between the parties regarding use of Nami.Exchange Services and
                                will supersede all prior written or oral agreements between the parties. No usage of trade or other regular practice or method
                                of dealing between the parties will be used to modify, interpret, supplement, or alter the terms herein.
                            </Paragraph>
                            <Paragraph>
                                3. Interpretation and Revision. Nami.Exchange reserves the right to alter, revise, modify, and/or change these Terms at any
                                time. All changes will take effect immediately upon being published on Nami.Exchange websites. It is your responsibility to
                                regularly check relevant pages on our websites/applications to confirm the latest version of these Terms. If you do not agree to
                                any such modifications, your only remedy is to terminate your usage of Nami.Exchange Services and cancel your account. You agree
                                that, unless otherwise expressly provided in these Terms, Nami.Exchange will not be responsible for any modification or
                                termination of Nami.Exchange Services by you or any third party, or suspension or termination of your access to Nami.Exchange
                                Services.
                            </Paragraph>
                            <Paragraph>
                                4. Force Majeure. Nami.Exchange will not be liable for any delay or failure to perform as required by these Terms because of any
                                cause or condition beyond Nami.Exchange&rsquo;s reasonable control.
                            </Paragraph>
                            <Paragraph>
                                5. Severability. If any portion of these Terms is held invalid or unenforceable, such invalidity or enforceability will not
                                affect the other provisions of these Terms, which will remain in full force and effect, and the invalid or unenforceable portion
                                will be given effect to the greatest extent possible.
                            </Paragraph>
                            <Paragraph>
                                6. Assignment. You may not assign or transfer any right to use Nami.Exchange Services or any of your rights or obligations under
                                these Terms without prior written consent from Nami.Exchange, including any right or obligation related to the enforcement of
                                laws or the change of control. Nami.Exchange may assign or transfer any or all of its rights or obligations under these Terms,
                                in whole or in part, without notice or obtaining your consent or approval.
                            </Paragraph>
                            <Paragraph>
                                7. Waiver. The failure of one party to require performance of any provision will not affect that party&rsquo;s right to require
                                performance at any time thereafter. At the same time, the waiver of one party to seek recovery for the other party&rsquo;s
                                violation of these Terms or any provision of applicable terms shall not constitute a waiver by that party of any subsequent
                                breach or violation by the other party or of the provision itself.
                            </Paragraph>
                            <Paragraph>
                                8. Third-Party Website Disclaimer. Any links to third-party websites from Nami.Exchange Services does not imply endorsement by
                                Nami.Exchange of any product, service, information or disclaimer presented therein, nor does Nami.Exchange guarantee the
                                accuracy of the information contained on them. If you suffer loss from using such third-party product and service, Nami.Exchange
                                will not be liable for such loss. In addition, since Nami.Exchange has no control over the terms of use or privacy policies of
                                third-party websites, you should read and understand those policies carefully.
                            </Paragraph>
                            <Paragraph>
                                9. Matters Related to Apple Inc. If you use any device manufactured by Apple Inc. to participate in any commercial activities or
                                reward programs through Nami.Exchange Services, such activities and programs are provided by Nami.Exchange and are not
                                associated with Apple Inc. in any manner.
                            </Paragraph>
                            <Paragraph>
                                10. Contact Information. For more information on Nami.Exchange, you may refer to the company and license information found on
                                Nami.Exchange websites. If you have questions regarding these Terms, please feel free to contact Nami.Exchange for clarification
                                via our Customer Support team at&nbsp; support@nami.exchange
                            </Paragraph>
                        </div>
                    )}
                    {language === 'vi' && (
                        <div className="text-left">
                            {/* Overview */}
                            <div>
                                <p>
                                    Các Điều khoản Sử dụng Nami.Exchange này được ký kết giữa bạn (sau đây được gọi là &ldquo;bạn&rdquo; hoặc &ldquo;của
                                    bạn&rdquo;) và các nhà khai thác Nami.Exchange (như được định nghĩa bên dưới). Bằng cách truy cập, tải xuống, sử dụng hoặc
                                    nhấp vào &ldquo;Tôi đồng ý&rdquo; để chấp nhận bất kỳ Dịch vụ nào từ Nami.Exchange (như được định nghĩa bên dưới) do
                                    Nami.Exchange cung cấp (như được định nghĩa bên dưới), bạn đồng ý rằng bạn đã đọc, hiểu và chấp nhận tất cả các điều khoản
                                    và các điều kiện được quy định trong các Điều khoản Sử dụng này (sau đây được gọi là &ldquo;các Điều khoản này&rdquo;).
                                    Ngoài ra, khi sử dụng một số tính năng của Dịch vụ, bạn có thể phải tuân theo các điều khoản và điều kiện bổ sung cụ thể áp
                                    dụng cho các tính năng đó.
                                </p>
                                <Paragraph>
                                    Vui lòng đọc kỹ các điều khoản vì chúng chi phối việc sử dụng Dịch vụ Nami.Exchange của bạn.{' '}
                                    <Strong>
                                        CÁC ĐIỀU KHOẢN NÀY CHỨA CÁC ĐIỀU KHOẢN QUAN TRỌNG BAO GỒM MỘT ĐIỀU KHOẢN QUY ĐỊNH TẤT CẢ CÁC Y&Ecirc;U CẦU ĐƯỢC GIẢI
                                        QUYẾT QUA H&Igrave;NH THỨC PHÁP L&Yacute;
                                    </Strong>
                                    . Các điều khoản của điều khoản trọng tài được quy định trong Điều 10, &ldquo;Giải quyết tranh chấp: Nơi phán xử, Phán quyết
                                    trọng tài, Từ bỏ Hành động Tập thể&rdquo;, dưới đây. Như với bất kỳ tài sản nào, giá trị của Tiền tệ kỹ thuật số (như được
                                    định nghĩa bên dưới) có thể dao động đáng kể và có rủi ro thiệt hại kinh tế đáng kể khi mua, bán, nắm giữ hoặc đầu tư vào
                                    Tiền tệ kỹ thuật số và các sản phẩm phái sinh của chúng.
                                </Paragraph>
                                <Paragraph>
                                    Bằng cách sử dụng dịch vụ <Strong>Nami.exchange</Strong>, bạn xác nhận và đồng ý rằng:
                                </Paragraph>
                                <ul className="ml-4 list-disc mt-8 space-y-1">
                                    <li>Bạn nhận thức rủi ro liên quan đến giao dịch tiền tệ kỹ thuật số và các giao dịch phái sinh của chúng.</li>
                                    <li>Bạn sẽ đánh giá tất cả rủi ro liên quan đến việc sử dụng các dịch vụ chuyển đổi và giao dịch của nami.</li>
                                    <li>Nami.exchange sẽ không chịu trách nhiệm pháp lý đối với bất kỳ rủi ro nào.</li>
                                </ul>
                                <Paragraph>
                                    Bằng cách truy cập, sử dụng hoặc cố gắng sử dụng Dịch vụ Nami.Exchange với bất kỳ khả năng nào, bạn xác nhận rằng bạn chấp
                                    nhận và đồng ý bị ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý, vui lòng không truy cập Nami.Exchange hoặc sử dụng
                                    các dịch vụ của Nami.Exchange.
                                </Paragraph>
                            </div>

                            {/* Terms 1*/}
                            <Title1>I. Định nghĩa</Title1>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <Strong>Nami.Exchange</Strong> đề cập đến một hệ sinh thái bao gồm các trang web Nami.Exchange (có tên miền bao gồm nhưng
                                    không giới hạn ở https://nami.exchange), ứng dụng di động, ứng dụng khách, applet và các ứng dụng khác được phát triển để
                                    cung cấp Nami.Exchange Dịch vụ và bao gồm các nền tảng, trang web và ứng dụng khách được vận hành độc lập trong hệ sinh thái
                                    (ví dụ: Nền tảng mở của Nami.Exchange, Nami.Exchange Launchpad, Nami Wallet&hellip;). Trong trường hợp có bất kỳ sự mâu
                                    thuẫn nào giữa các điều khoản sử dụng có liên quan của các nền tảng trên và nội dung của các Điều khoản này, các điều khoản
                                    áp dụng tương ứng của các nền tảng đó sẽ được ưu tiên áp dụng.
                                </li>
                                <li>
                                    <Strong> Nhà điều hành Nami.Exchange</Strong> đề cập đến tất cả các bên điều hành Nami.Exchange, bao gồm nhưng không giới
                                    hạn pháp nhân, các tổ chức chưa hợp nhất và các nhóm cung cấp Dịch vụ Nami.Exchange và chịu trách nhiệm về các dịch vụ đó.
                                    Để thuận tiện, trừ khi có quy định khác, các tham chiếu đến &ldquo;Nami.Exchange&rdquo; và &ldquo;chúng tôi&rdquo; trong các
                                    Điều khoản này có nghĩa cụ thể là Nhà điều hành Nami.Exchange. THEO CÁC ĐIỀU KHOẢN NÀY, Nami.Exchange C&Oacute; QUYỀN THAY
                                    ĐỔI CÁC H&Igrave;NH THỨC ĐIỀU HÀNH, VẬN HÀNH NHƯ ĐƯỢC QUY ĐỊNH, VÀ NHỮNG THAY ĐỔI TR&Ecirc;N KH&Ocirc;NG ẢNH HƯỞNG TỚI QUYỀN
                                    LỢI VÀ NGHĨA VỤ CỦA BẠN ĐƯỢC QUY ĐỊNH TRONG THỎA THUẬN NÀY. TRONG TRƯỜNG HỢP C&Oacute; TRANH CHẤP, BẠN H&Atilde;Y XÁC ĐỊNH
                                    CÁC QUYỀN HẠN BẰNG ĐIỀU KHOẢN NÀY ĐƯỢC THỰC HIỆN VỚI BẠN VÀ CÁC QUỐC GIA CỦA TRANH CHẤP, PHỤ THUỘC VÀO CÁC DỊCH VỤ CỤ THỂ
                                    BẠN SỬ DỤNG VÀ CÁC HÀNH ĐỘNG CỤ THỂ ẢNH HƯỞNG ĐẾN QUYỀN HOẶC LỢI &Iacute;CH CỦA BẠN.
                                </li>
                                <li>
                                    <Strong> Dịch vụ Nami.Exchange</Strong> đề cập đến các dịch vụ khác nhau do Nami cung cấp cho bạn. Các dịch vụ của
                                    Nami.Exchange bao gồm nhưng không giới hạn ở các thành phần của hệ sinh thái Nami.Exchange như Nền tảng giao dịch tài sản kỹ
                                    thuật số, lĩnh vực tài chính, Nami Labs, Nami Academy, Nami Today, Nami Launchpad, Nami Mining, Nami Newsroom và các dịch vụ
                                    mới sẽ được cung cấp bởi Nami Foundation.
                                </li>
                                <li>
                                    <Strong> Quy tắc nền tảng Nami.Exchange </Strong>đề cập đến tất cả các quy tắc, diễn giải, thông báo, tuyên bố, thư đồng ý
                                    và các nội dung khác đã và sẽ được Nami.Exchange phát hành sau đó, cũng như tất cả các quy định, quy tắc thực hiện, mô tả
                                    quy trình sản phẩm, và các thông báo được xuất bản trong Trung tâm trợ giúp hoặc trong các sản phẩm hoặc quy trình dịch vụ.
                                </li>
                                <li>
                                    <Strong> Người dùng</Strong> đề cập đến tất cả các có nhân, tổ chức hoặc tổ chức truy cập, tải xuống hoặc sử dụng
                                    Nami.Exchange hoặc Dịch vụ Nami.Exchange và những người đáp ứng các tiêu chí và điều kiện do Nami.Exchange quy định. Nếu tồn
                                    tại các thỏa thuận khác cho các thực thể như nhà phát triển, nhà phân phối, nhà tạo lập thị trường và sàn giao dịch Tiền tệ
                                    kỹ thuật số, thì các thỏa thuận đó sẽ được tuân theo.
                                </li>
                                <li>
                                    <Strong> Tiền tệ kỹ thuật số</Strong> đề cập đến các mã thông báo hoặc tiền điện tử được mã hóa hoặc kỹ thuật số với một giá
                                    trị nhất định dựa trên công nghệ blockchain và mật mã và được phát hành và quản lý theo hình thức phi tập trung.
                                </li>
                                <li>
                                    <Strong> Tài sản kỹ thuật số</Strong> đề cập đến Tiền tệ kỹ thuật số, các sản phẩm phái sinh của chúng hoặc các loại tài sản
                                    số hóa khác có giá trị nhất định.
                                </li>
                                <li>
                                    <Strong> Tài khoản Nami.Exchange</Strong> đề cập đến các tài khoản cơ bản, bao gồm tài khoản chính và tài khoản phụ, được mở
                                    bởi Nami.Exchange để Người dùng ghi lại trên Nami.Exchange việc sử dụng Dịch vụ Nami.Exchange, các giao dịch, các thay đổi
                                    về tài sản và các thông tin cơ bản. Tài khoản Nami.Exchange là cơ sở để Người dùng tận hưởng và thực hiện các quyền của mình
                                    trên Nami.Exchange.
                                </li>
                                <li>
                                    <Strong> Giao dịch tiền điện tử</Strong> đề cập đến các giao dịch giao ngay trong đó một loại tiền kỹ thuật số được trao đổi
                                    cho một loại tiền kỹ thuật số khác.
                                </li>
                                <li>
                                    <Strong> tài khoản ký quỹ</Strong> đề cập đến các tài khoản đặc biệt do Người dùng mở trên Nami.Exchange để gửi và rút tài
                                    sản thế chấp (chẳng hạn như tiền ký quỹ) theo các Điều khoản này (bao gồm Thỏa thuận dịch vụ hợp đồng Nami.Exchange và Quy
                                    tắc nền tảng Nami.Exchange), theo yêu cầu giao dịch hợp đồng, giao dịch đòn bẩy và / hoặc dịch vụ cho vay.
                                </li>
                                <li>
                                    <Strong> Cho vay</Strong> đề cập đến việc Nami.Exchange cho vay tiền tệ kỹ thuật số cho người dùng với lãi suất thu được
                                    theo những cách nhất định (dưới hình thức tiền tệ kỹ thuật số), bao gồm nhưng không giới hạn ở các dịch vụ giao dịch đòn bẩy
                                    và cho vay tiền tệ hiện đang được cung cấp và các hình thức khác của các dịch vụ cho vay / cho vay do Nami.Exchange triển
                                    khai.
                                </li>
                            </ol>

                            {/* Privacy */}
                            <Title1>II. Các quy định chung</Title1>
                            <Title2>1. Giới thiệu về các Điều khoản này</Title2>
                            <Title3>a. Quan hệ hợp đồng</Title3>
                            <p>Các Điều khoản này tạo thành một thỏa thuận pháp lý và tạo ra một hợp đồng ràng buộc giữa bạn và Nami.Exchange Operator.</p>
                            <Title3>b. Điều khoản bổ sung</Title3>
                            <p>
                                Do sự phát triển nhanh cháng của Tiền tệ kỹ thuật số và Nami.Exchange, các Điều khoản này giữa bạn và Nhà điều hành
                                Nami.Exchange không liệt kê hoặc bao gồm tất cả các quyền và nghĩa vụ của mỗi bên và không đảm bảo hoàn toàn phù hợp với các nhu
                                cầu phát sinh từ sự phát triển trong tương lai. Do đó, CH&Iacute;NH SÁCH RI&Ecirc;NG TƯ (https://nami.exchange/privacy), QUY TẮC
                                NỀN TẢNG CỦA NAMi.Exchange, VÀ TẤT CẢ CÁC THỎA THUẬN KHÁC ĐƯỢC THAM GIA RI&Ecirc;NG GIỮA BẠN VÀ Nami. C&Oacute; HIỆU LỰC PHÁP
                                L&Yacute; C&Ugrave;NG NHAU. VIỆC BẠN SỬ DỤNG DỊCH VỤ Nami.Exchange LÀ BẠN Đ&Atilde; CHẤP NHẬN CÁC ĐIỀU KHOẢN BỔ SUNG TR&Ecirc;N.
                            </p>
                            <Title3>c. Các thay đổi đối với các Điều khoản này</Title3>
                            <p>
                                Nami.Exchange có quyền thay đổi hoặc chỉnh sửa các Điều khoản này theo quyết định của mình bất kỳ lúc nào. Nami.Exchange sẽ
                                thông báo những thay đổi đó bằng cách cập nhật các điều khoản trên trang web của mình (https://nami.exchange/terms-of-service)
                                và sửa đổi ngày [Sửa đổi lần cuối] hiển thị trên trang này. BẤT KỲ VÀ TẤT CẢ CÁC SỬA ĐỔI HOẶC THAY ĐỔI ĐIỀU KHOẢN NÀY SẼ TRỞ
                                THÀNH C&Ocirc;NG BỐ HIỆU QUẢ TR&Ecirc;N TRANG WEB HOẶC LI&Ecirc;N QUAN ĐẾN NGƯỜI D&Ugrave;NG. V&Igrave; VẬY, VIỆC BẠN TIẾP TỤC
                                SỬ DỤNG DỊCH VỤ NAMI.EXCHANGE LÀ BẰNG CHỨNG BẠN Đ&Atilde; CHẤP NHẬN CÁC QUY TẮC VÀ THỎA THUẬN Đ&Atilde; SỬA ĐỔI. NẾU BẠN
                                KH&Ocirc;NG ĐỒNG &Yacute; VỚI BẤT KỲ THAY ĐỔI NÀO ĐỐI VỚI CÁC ĐIỀU KHOẢN NÀY, BẠN PHẢI NGỪNG SỬ DỤNG DỊCH VỤ NAMI.EXCHANGE NGAY
                                LẬP TỨC. BẠN ĐƯỢC KHUYẾN NGHỊ THƯỜNG XUY&Ecirc;N XEM LẠI CÁC ĐIỀU KHOẢN NÀY ĐỂ ĐẢM BẢO BẠN HIỂU VỀ CÁC ĐIỀU KHOẢN VÀ ĐIỀU KIỆN
                                ÁP DỤNG CHO VIỆC BẠN TRUY CẬP VÀ SỬ DỤNG CÁC DỊCH VỤ CỦA NAMI.EXCHANGE.
                            </p>
                            <Title3>d. Cấm sử dụng</Title3>
                            <p>
                                BẰNG CÁCH TRUY CẬP VÀ SỬ DỤNG DỊCH VỤ Nami.Exchange, BẠN TUY&Ecirc;N BỐ VÀ BẢO ĐẢM RẰNG BẠN KH&Ocirc;NG NẰM TRONG BẤT KỲ DANH
                                SÁCH TRỪNG PHẠT KINH TẾ HOẶC DANH SÁCH CẤM VẬN KINH TẾ NÀO (NHƯ DANH SÁCH TRỪNG PHẠT CỦA HỘI ĐỒNG BẢO AN LI&Ecirc;N HỢP QUỐC),
                                DANH SÁCH CÁC QUỐC GIA DIỆN THEO D&Otilde;I ĐẶC BIỆT CỦA VĂN PH&Ograve;NG KIỂM SOÁT TÀI SẢN NƯỚC NGOÀI CỦA BỘ NG&Acirc;N KHỐ HOA
                                KỲ), HOẶC DANH SÁCH NHỮNG CÁ NH&Acirc;N VÀ TÀI SẢN BỊ TỪ CHỐI CỦA BỘ THƯƠNG MẠI HOA KỲ. Nami.Exchange BẢO LƯU QUYỀN LỰA CHỌN THỊ
                                TRƯỜNG VÀ CÁC L&Yacute; DO ĐỂ KẾT TH&Uacute;C KINH DOANH, VÀ C&Oacute; THỂ HẠN CHẾ HOẶC TỪ CHỐI, TRONG QUY ĐỊNH CỦA N&Oacute;,
                                VIỆC CUNG CẤP DỊCH VỤ NAMi.Exchange TẠI CÁC QUỐC GIA HOẶC KHU VỰC LI&Ecirc;N QUAN.
                            </p>
                            <Title2>2. Giới thiệu về Nami.Exchange</Title2>
                            <p>
                                Là một phần quan trọng của Hệ sinh thái Nami, Nami.Exchange chủ yếu đáng vai trò là nền tảng trực tuyến toàn cầu để giao dịch
                                Tài sản kỹ thuật số và cung cấp cho Người dùng nền tảng giao dịch, dịch vụ tài chính, dịch vụ kỹ thuật và các dịch vụ liên quan
                                đến Tài sản kỹ thuật số khác. Như được trình bày chi tiết hơn trong Điều 3 bên dưới, Người dùng phải đăng ký và mở tài khoản với
                                Nami.Exchange, đồng thời gửi Tài sản kỹ thuật số vào tài khoản của họ trước khi giao dịch. Người dùng có thể, tuân theo các hạn
                                chế được quy định trong các Điều khoản này, đăng ký rút Tài sản kỹ thuật số.
                            </p>
                            <Paragraph>
                                Mặc dù Nami.Exchange đã cam kết duy trì tính chính xác của thông tin được cung cấp thông qua các dịch vụ của Nami.Exchange,
                                Nami.Exchange không thể và không đảm bảo tính chính xác, khả năng ứng dụng, độ tin cậy, tính toàn vẹn, hiệu suất hoặc tính thích
                                hợp, Nami.Exchange cũng không phải chịu trách nhiệm pháp lý đối với bất kỳ tổn thất hoặc thiệt hại nào có thể gây ra trực tiếp
                                hoặc gián tiếp do bạn sử dụng các nội dung này. Thông tin về dịch vụ Nami.Exchange có thể thay đổi mà không cần thông báo trước
                                và mục đích chính của việc cung cấp thông tin đó là giúp Người dùng đưa ra quyết định độc lập. Nami.Exchange không cung cấp lời
                                khuyên đầu tư hoặc tư vấn dưới bất kỳ hình thức nào, và không chịu trách nhiệm về việc sử dụng hoặc giải thích thông tin trên
                                Nami.Exchange hoặc bất kỳ phương tiện giao tiếp nào khác. Tất cả Người dùng của Dịch vụ Nami.Exchange phải hiểu những rủi ro
                                liên quan đến giao dịch Tài sản kỹ thuật số và được khuyến nghị thực hiện thận trọng và giao dịch có trách nhiệm trong khả năng
                                của mình.
                            </Paragraph>

                            <Title2>3. Yêu cầu và đăng ký tài khoản Nami.Exchange</Title2>

                            <Title3>a. Đăng ký tài khoản</Title3>
                            <p>
                                Tất cả Người dùng phải đăng ký Tài khoản Nami.Exchange trước khi sử dụng Dịch vụ Nami.Exchange. Khi bạn đăng ký Tài khoản
                                Nami.Exchange, bạn phải cung cấp địa chỉ email và mật khẩu của mình, đồng thời chấp nhận các Điều khoản này, Chính sách quyền
                                riêng tư và các Quy tắc nền tảng Nami.Exchange khác. Nami.Exchange có thể tùy ý từ chối mở Tài khoản Nami.Exchange cho bạn. Bạn
                                đồng ý cung cấp thông tin đầy đủ và chính xác khi mở Tài khoản Nami.Exchange, đồng thời đồng ý cập nhật kịp thời bất kỳ thông
                                tin nào bạn cung cấp cho Nami.Exchange để duy trì tính toàn vẹn và chính xác của thông tin. Chỉ có thể đăng ký một Người dùng
                                tại một thời điểm, nhưng mỗi Người dùng có nhân (bao gồm bất kỳ Người dùng nào là doanh nghiệp hoặc pháp nhân) chỉ có thể duy
                                trì một tài khoản chính tại bất kỳ thời điểm nào. Người dùng là tổ chức (bao gồm Người dùng là doanh nghiệp và các pháp nhân
                                khác) có thể mở một hoặc nhiều tài khoản phụ dưới tài khoản chính với sự đồng ý của Nami.Exchange. Đối với một số Dịch vụ
                                Nami.Exchange nhất định, bạn có thể được yêu cầu thiết lập một tài khoản đặc biệt độc lập với Tài khoản Nami.Exchange của mình,
                                dựa trên các quy định của Điều khoản này hoặc Điều khoản bổ sung. Việc đăng ký, sử dụng, bảo vệ và quản lý các tài khoản giao
                                dịch đó đều chịu sự điều chỉnh của các quy định của điều này và điều 6, trừ khi có quy định khác trong Điều khoản này hoặc Điều
                                khoản bổ sung.
                            </p>
                            <Title3>b. Điều kiện đăng ký tài khoản</Title3>
                            <p>
                                Bằng cách đăng ký sử dụng Tài khoản Nami Exchange, bạn đại diện và đảm bảo rằng: (i) với tư cách cá nhân, bạn ít nhất 18 tuổi hoặc đủ tuổi hợp pháp để ký kết hợp đồng ràng buộc theo luật hiện hành; (ii) với tư cách là một cá nhân, pháp nhân hoặc tổ chức khác, bạn có đầy đủ năng lực pháp lý và đủ quyền hạn để tham gia vào các Điều khoản này; (iii) trước đó bạn chưa từng bị đình chỉ hoặc xóa quyền sử dụng Nền tảng Nami Exchange hoặc Dịch vụ Nami Exchange; (iv) bạn không có Tài khoản Nami Exchange; (v) bạn không phải là cư dân, sinh sống tại hoặc cố gắng truy cập Nền tảng Nami Exchange hoặc Dịch vụ Nami Exchange từ, hoặc hành động thay mặt cho một người hoặc pháp nhân cư trú hoặc sinh sống tại một Địa điểm bị hạn chế. Đối với các mục đích của tài liệu này, “Địa điểm bị hạn chế” sẽ bao gồm Hoa Kỳ, Malaysia, Trung Quốc đại lục, Iran, Bắc Triều Tiên, Cuba, Ontario (Canada) và các địa điểm khác do Nhà điều hành Nami Exchange chỉ định tùy từng thời điểm; (vi) nếu bạn đóng vai trò là nhân viên hoặc đại lý của một pháp nhân và thay mặt họ ký kết các Điều khoản này, bạn đại diện và đảm bảo rằng bạn có tất cả các quyền và ủy quyền cần thiết để ràng buộc pháp nhân đó và để truy cập và sử dụng Nami Exchange Platform và Nami Exchange Services thay mặt cho pháp nhân đó; và (vii) việc bạn sử dụng Nền tảng Nami Exchange và các Dịch vụ của Nami Exchange sẽ không vi phạm bất kỳ và tất cả các luật và quy định áp dụng cho bạn hoặc pháp nhân mà bạn đang đại diện, bao gồm nhưng không giới hạn ở các quy định về chống rửa tiền chống tham nhũng, chống tài trợ khủng bố.
                            </p>
                            <Title3>c. Xác minh danh tính người dùng</Title3>
                            <p>
                                Việc bạn đăng ký tài khoản với Nami.Exchange sẽ được coi là bạn đồng ý cung cấp thông tin có nhân cần thiết để xác minh danh
                                tính. Thông tin đó sẽ được sử dụng để xác minh danh tính của Người dùng, xác định dấu vết rửa tiền, tài trợ khủng bố, gian lận
                                và các tội phạm tài chính khác thông qua Nami.Exchange hoặc cho các mục đích hợp pháp khác do Nami.Exchange nêu. Chúng tôi sẽ
                                thu thập, sử dụng và chia sẻ những thông tin đó theo Chính sách Bảo mật của chúng tôi. Ngoài việc cung cấp thông tin như vậy,
                                bạn đồng ý cho phép chúng tôi lưu giữ hồ sơ về thông tin đó trong khoảng thời gian tài khoản của bạn hoạt động và trong vòng năm
                                (5) năm sau khi tài khoản của bạn bị đáng, tuân thủ các tiêu chuẩn ngành toàn cầu về lưu trữ dữ liệu . Bạn cũng cho phép chúng
                                tôi thực hiện các cuộc điều tra cần thiết trực tiếp hoặc thông qua bên thứ ba để xác minh danh tính của bạn hoặc bảo vệ bạn và /
                                hoặc chúng tôi khỏi các tội phạm tài chính, chẳng hạn như gian lận. Thông tin chúng tôi yêu cầu để xác minh danh tính của bạn có
                                thể bao gồm, nhưng không giới hạn, tên, địa chỉ email, thông tin liên hệ, số điện thoại, tên người dùng, ID do chính phủ cấp,
                                ngày sinh và các thông tin khác được thu thập trong quá trình đăng ký tài khoản. Khi cung cấp thông tin được yêu cầu, bạn xác
                                nhận đó là sự thật và chính xác. SAU KHI ĐĂNG Ý, BẠN PHẢI ĐẢM BẢO RẰNG TH&Ocirc;NG TIN LÀ THẬT, ĐẦY ĐỦ VÀ ĐƯỢC CẬP NHẬT KỊP THỜI
                                KHI THAY ĐỔI. NẾU C&Oacute; BẤT KỲ BẰNG CHỨNG NÀO CHO THẤY BẤT KỲ TH&Ocirc;NG TIN NÀO BẠN CUNG CẤP LÀ KH&Ocirc;NG CH&Iacute;NH
                                XÁC, SAI LẦM, H&Atilde;Y CHẤM DỨT TẤT CẢ HOẶC MỘT PHẦN DỊCH VỤ CỦA NAMI.EXCHANGE CH&Uacute;NG T&Ocirc;I CUNG CẤP CHO BẠN. NẾU
                                CH&Uacute;NG T&Ocirc;I KH&Ocirc;NG THỂ TIẾP CẬN ĐƯỢC VỚI BẠN BẰNG TH&Ocirc;NG TIN LI&Ecirc;N HỆ BẠN Đ&Atilde; CUNG CẤP, BẠN SẼ
                                HOÀN TOÀN CHỊU TRÁCH NHIỆM ĐỐI VỚI BẤT KỲ KHOẢN THIỆT HẠI NÀO ĐỐI VỚI NAMI.EXCHANGE TRONG KHI BẠN SỬ DỤNG DỊCH VỤ NAMI.EXCHANGE.
                                BẠN SAU Đ&Acirc;Y ĐỒNG &Yacute; RẰNG BẠN C&Oacute; NGHĨA VỤ CẬP NHẬT TẤT CẢ TH&Ocirc;NG TIN NẾU C&Oacute; BẤT KỲ THAY ĐỔI NÀO.
                            </p>
                            <Paragraph>
                                BẰNG VIỆC ĐĂNG Ý TÀI KHOẢN, BẠN CHO PHÉP NAMI.EXCHANGE THỰC HIỆN CÁC CUỘC ĐIỀU TRA MÀ NAMI.EXCHANGE CẦN THIẾT, LÀ TRỰC TIẾP HOẶC
                                TH&Ocirc;NG QUA B&Ecirc;N THỨ BA, ĐỂ XÁC MINH NHẬN DIỆN CỦA BẠN HOẶC BẢO VỆ BẠN, NHỮNG NGƯỜI D&Ugrave;NG KHÁC VÀ / HOẶC NAMI.
                                CÁC TỘI PHẠM VÀ ĐỂ THỰC HIỆN CÁC HÀNH VI CẦN THIẾT DỰA TR&Ecirc;N KẾT QUẢ ĐIỀU TRA NHƯ VẬY. BẠN CŨNG ĐỒNG &Yacute; RẰNG
                                TH&Ocirc;NG TIN CÁ NH&Acirc;N CỦA BẠN C&Oacute; THỂ ĐƯỢC TIẾT LỘ CHO T&Iacute;N DỤNG VÀ CÁC CƠ QUAN ĐỂ PH&Ograve;NG NGỪA HOẶC
                                PH&Ograve;NG NGỪA TỘI PHẠM TÀI CH&Iacute;NH, MÀ C&Oacute; THỂ TRẢ LỜI ĐẦY ĐỦ ĐIỀU TRA CỦA CH&Uacute;NG T&Ocirc;I.
                            </Paragraph>
                            <Title3>d. Yêu cầu sử dụng tài khoản</Title3>
                            <p>
                                Tài khoản Nami.Exchange chỉ có thể được sử dụng bởi người đăng ký tài khoản. Nami.Exchange có quyền đình chỉ, đáng băng hoặc hủy
                                bỏ việc sử dụng Tài khoản Nami.Exchange bởi những người không phải là người đăng ký tài khoản. Nếu bạn nghi ngờ hoặc biết về
                                việc sử dụng trái phép tên người dùng và mật khẩu của mình, bạn nên thông báo cho Nami.Exchange ngay lập tức. Nami.Exchange
                                không chịu trách nhiệm pháp lý đối với bất kỳ tổn thất hoặc thiệt hại nào phát sinh từ việc bạn hoặc bất kỳ bên thứ ba nào sử
                                dụng Tài khoản Nami.Exchange có hoặc không có sự cho phép của bạn.
                            </p>
                            <Title3>e. Bảo mật tài khoản</Title3>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    Nami.Exchange đã cam kết duy trì tính bảo mật của các khoản tiền do Người dùng ủy thác và đã thực hiện biện pháp bảo vệ tiêu
                                    chuẩn ngành cho các dịch vụ của Nami.Exchange. Tuy nhiên, các hành động của Người dùng có nhân có thể gây ra rủi ro. Bạn sẽ
                                    đồng ý coi thông tin xác thực truy cập của mình (chẳng hạn như tên người dùng và mật khẩu) là thông tin bí mật và không tiết
                                    lộ thông tin đó cho bất kỳ bên thứ ba nào. Bạn cũng đồng ý tự chịu trách nhiệm thực hiện các biện pháp bảo mật cần thiết để
                                    bảo vệ Tài khoản Nami.Exchange và thông tin có nhân của bạn.
                                </li>
                                <li>
                                    Bạn phải tự chịu trách nhiệm về việc giữ an toàn cho Tài khoản Nami.Exchange và mật khẩu của mình, đồng thời chịu trách
                                    nhiệm cho tất cả các giao dịch trong Tài khoản Nami.Exchange của bạn. Nami.Exchange không chịu trách nhiệm về bất kỳ tổn
                                    thất hoặc hậu quả nào gây ra bởi việc sử dụng được ủy quyền hoặc trái phép thông tin đăng nhập tài khoản của bạn, bao gồm
                                    nhưng không giới hạn ở việc tiết lộ thông tin, tiết lộ thông tin, đồng ý hoặc gửi các quy tắc và thỏa thuận khác nhau bằng
                                    cách nhấp vào trang web, gia hạn thỏa thuận trực tuyến , vân vân.
                                </li>
                                <li>Bằng cách tạo Tài khoản Nami.Exchange, bạn đồng ý rằng:</li>
                            </ol>
                            <ul className="ml-9 list-disc">
                                <li>
                                    Bạn sẽ thông báo cho Nami.Exchange ngay lập tức nếu bạn biết về bất kỳ hành vi sử dụng trái phép nào đối với Tài khoản và
                                    mật khẩu Nami.Exchange của mình hoặc bất kỳ vi phạm nào khác về quy tắc bảo mật;
                                </li>
                                <li>
                                    Bạn sẽ tuân thủ nghiêm ngặt tất cả các cơ chế hoặc quy trình của Nami.Exchange về bảo mật, xác thực, giao dịch, tính phí và
                                    rút tiền; và
                                </li>
                                <li>Bạn sẽ thực hiện các bước thích hợp để đăng xuất khỏi Nami.Exchange vào cuối mỗi lần truy cập.</li>
                            </ul>
                            <Title3>f. Dữ liệu có nhân</Title3>
                            <p>
                                Dữ liệu có nhân của bạn sẽ được bảo vệ và giữ bí mật một cách hợp lý, nhưng Nami.Exchange có quyền thu thập, xử lý, sử dụng hoặc
                                tiết lộ dữ liệu có nhân của bạn theo các Điều khoản (bao gồm Chính sách Bảo mật) hoặc luật hiện hành. Tùy thuộc vào các sản phẩm
                                hoặc dịch vụ có liên quan, dữ liệu có nhân của bạn có thể được tiết lộ cho các bên thứ ba sau:
                            </p>
                            <ul className="mt-6 list-disc ml-8 gap-2 space-y-2">
                                <li>đối tác giao dịch của bạn;</li>
                                <li>
                                    Nhà điều hành Nami.Exchange, và các cổ đông, đối tác, nhà đầu tư, giám đốc, người giám sát, quản lý cấp cao và nhân viên của
                                    các tổ chức đ&oacute;;
                                </li>
                                <li>các liên doanh, đối tác liên minh và đối tác kinh doanh của chúng tôi;</li>
                                <li>
                                    các đại lý, nhà thầu, nhà cung cấp, nhà cung cấp dịch vụ bên thứ ba và cố vấn chuyên nghiệp của chúng tôi, bao gồm các bên
                                    đã ký hợp đồng cung cấp cho chúng tôi các dịch vụ hành chính, tài chính, nghiên cứu, vận hành, CNTT và các dịch vụ khác,
                                    trong các lĩnh vực như viễn thông, công nghệ thông tin, bảng lương, xử lý thông tin, đào tạo, nghiên cứu thị trường, lưu
                                    trữ;
                                </li>
                                <li>
                                    các đối tác kinh doanh bên thứ ba cung cấp hàng hóa và dịch vụ hoặc tài trợ cho các cuộc thi hoặc các hoạt động quảng bá
                                    khác, có hợp tác với chúng tôi;
                                </li>
                                <li>công ty bảo hiểm hoặc nhà điều tra bảo hiểm và nhà cung cấp tín dụng;</li>
                                <li>
                                    văn phòng tín dụng, hoặc bất kỳ cơ quan đòi nợ hoặc trung tâm giải quyết tranh chấp trong trường hợp vi phạm hoặc tranh
                                    chấp;
                                </li>
                                <li>
                                    các đối tác kinh doanh, nhà đầu tư, người được ủy thác hoặc người được chuyển nhượng (hiện tại hoặc dự kiến) thúc đẩy các
                                    giao dịch tài sản kinh doanh (có thể được mở rộng để bao gồm bất kỳ hoạt động sáp nhập, mua lại hoặc bán tài sản) của nhà
                                    điều hành Nami.Exchange;
                                </li>
                                <li>các nhà tư vấn chuyên nghiệp như kiểm toán viên và luật sư;</li>
                                <li>
                                    các cơ quan quản lý chính phủ hoặc cơ quan thực thi pháp luật có liên quan để tuân thủ các luật hoặc quy định do cơ quan
                                    chính phủ xây dựng;
                                </li>
                                <li>những người được giao quyền và nghĩa vụ của chúng tôi;</li>
                                <li>ngân hàng, công ty thẻ tín dụng và các nhà cung cấp dịch vụ tương ứng của họ;</li>
                                <li>những người có sự đồng ý của bạn như được xác định bởi bạn hoặc hợp đồng hiện hành.</li>
                            </ul>
                            <Title1>III. Dịch vụ của Nami.Exchange</Title1>
                            <p>
                                Sau khi hoàn tất việc đăng ký và xác minh danh tính cho Tài khoản Nami.Exchange của mình, bạn có thể sử dụng các dịch vụ khác
                                nhau của Nami.Exchange, bao gồm nhưng không giới hạn ở giao dịch tiền điện tử, giao dịch hợp đồng tương lai, giao dịch đòn bẩy,
                                dịch vụ tiết kiệm, staking, thu thập dữ liệu liên quan đến thị trường, nghiên cứu và thông tin khác do Nami.Exchange phát hành,
                                tham gia vào các hoạt động của người dùng do Nami.Exchange tổ chức, v.v., tuân theo các quy định của Điều khoản này (bao gồm Quy
                                tắc nền tảng Nami.Exchange và các thỏa thuận có nhân khác). Nami.Exchange có quyền:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    Cung cấp, sửa đổi hoặc chấm dứt, theo quyết định của mình, bất kỳ dịch vụ nào dựa trên kế hoạch phát triển của n&oacute;; và
                                </li>
                                <li>Cho phép hoặc cấm một số người dùng sử dụng bất kỳ dịch vụ nào theo Quy tắc nền tảng Nami.Exchange có liên quan.</li>
                            </ul>
                            <Title2>1. Nguyên tắc sử dụng dịch vụ</Title2>
                            <Title3>a. Giấy phép</Title3>
                            <p>
                                Với điều kiện bạn liên tục tuân thủ các điều khoản và điều kiện r&otilde; ràng được nêu trong các Điều khoản này, Nami.Exchange
                                cấp cho bạn giấy phép có thể thu hồi, có giới hạn, miễn phí bản quyền, không độc quyền, không thể chuyển nhượng và không thể cấp
                                phép lại để truy cập và sử dụng các dịch vụ của Nami.Exchange thông qua máy tính của bạn hoặc các thiết bị tương thích với
                                Internet cho các mục đích có nhân / nội bộ của bạn. Bạn bị cấm sử dụng Dịch vụ Nami.Exchange cho các mục đích bán lại hoặc
                                thương mại, bao gồm cả các giao dịch thay mặt cho có nhân hoặc tổ chức khác. Tất cả các hành động trên đều bị nghiêm cấm và cấu
                                thành vi phạm nghiêm trọng đối với các Điều khoản này. Bố cục nội dung, định dạng, chức năng và quyền truy cập liên quan đến
                                Dịch vụ Nami.Exchange phải được quy định theo quyết định của Nami.Exchange. Nami.Exchange bảo lưu tất cả các quyền không được
                                cấp r&otilde; ràng trong các Điều khoản này. Do đó, bạn bị cấm sử dụng Dịch vụ Nami.Exchange theo bất kỳ cách nào không được các
                                Điều khoản này cho phép r&otilde; ràng.
                            </p>
                            <p className="mt-6">
                                Các Điều khoản này chỉ cấp một giấy phép hạn chế để truy cập và sử dụng Dịch vụ Nami.Exchange. Do đó, bạn đồng ý rằng khi bạn sử
                                dụng Dịch vụ Nami.Exchange, Nami.Exchange không chuyển giao Dịch vụ Nami.Exchange hoặc quyền sở hữu quyền sở hữu trí tuệ của bất
                                kỳ tài sản trí tuệ nào của Nami.Exchange cho bạn hoặc bất kỳ ai khác. Tất cả văn bản, đồ họa, giao diện người dùng, giao diện
                                trực quan, hình ảnh, âm thanh, sơ đồ quy trình, mã máy tính (bao gồm mã html), chương trình, phần mềm, sản phẩm, thông tin và
                                tài liệu, cũng như thiết kế, cấu trúc, lựa chọn, điều phối, cách diễn đạt, giao diện và bố cục của bất kỳ nội dung nào có trong
                                các dịch vụ hoặc được cung cấp thông qua Dịch vụ Nami.Exchange, được sở hữu độc quyền, kiểm soát và / hoặc cấp phép bởi Nhà điều
                                hành Nami.Exchange hoặc các thành viên, công ty mẹ, người cấp phép hoặc chi nhánh của Nami.Exchange.
                            </p>
                            <p className="mt-6">
                                Nami.Exchange sở hữu bất kỳ phản hồi, đề xuất, ý tưởng hoặc thông tin hoặc tài liệu khác (sau đây gọi chung là &ldquo;Phản
                                hồi&rdquo;) về Nami.Exchange hoặc Dịch vụ Nami.Exchange mà bạn cung cấp thông qua email, Dịch vụ Nami.Exchange hoặc các cách
                                khác. Theo đây, bạn chuyển tất cả các quyền, quyền sở hữu và lợi ích của Phản hồi và tất cả các quyền sở hữu trí tuệ liên quan
                                cho Nami.Exchange. Bạn không có quyền và từ bỏ mọi yêu cầu xác nhận hoặc bồi thường dựa trên bất kỳ Phản hồi nào, hoặc bất kỳ
                                sửa đổi nào dựa trên bất kỳ Phản hồi nào.
                            </p>
                            <Title3>b. Những hạn chế</Title3>
                            <p>Khi bạn sử dụng Dịch vụ Nami.Exchange, bạn đồng ý và cam kết tuân thủ các quy định sau:</p>
                            <ol className="list-decimal ml-4 space-y-4">
                                <li>
                                    Trong quá trình sử dụng Dịch vụ Nami.Exchange, tất cả các hoạt động bạn thực hiện phải tuân thủ các yêu cầu của luật và quy
                                    định hiện hành, các Điều khoản này và các hướng dẫn khác nhau của Nami.Exchange;
                                </li>
                                <li>
                                    Việc bạn sử dụng Dịch vụ Nami.Exchange không được vi phạm lợi ích công cộng, đạo đức công cộng hoặc lợi ích hợp pháp của
                                    người khác, bao gồm bất kỳ hành động nào có thể gây trở ngại, làm gián đoạn, ảnh hưởng tiêu cực hoặc ngăn cấm Người dùng
                                    khác sử dụng Dịch vụ Nami.Exchange;
                                </li>
                                <li>
                                    Bạn đồng ý không sử dụng các dịch vụ để thao túng thị trường (chẳng hạn như các kế hoạch bơm và bán phá giá, giao dịch rửa,
                                    tự giao dịch, vận hành trước, nhồi nhét báo giá và giả mạo hoặc phân lớp, hoặc bất kể hành động nào bị pháp luật cấm);
                                </li>
                                <li>
                                    Nếu không có sự đồng ý bằng văn bản từ Nami.Exchange, việc sử dụng dữ liệu Nami.Exchange cho mục đích thương mại sau đây sẽ
                                    bị nghiêm cấm:
                                </li>
                                <ul className="ml-4 list-disc mt-8 space-y-1">
                                    <li>(1) Dịch vụ giao dịch sử dụng báo giá Nami.Exchange hoặc thông tin bảng thông báo thị trường.</li>
                                    <li>(2) Các dịch vụ cung cấp hoặc phát trực tuyến dữ liệu sử dụng bất kỳ dữ liệu thị trường nào của Nami.Exchange.</li>
                                    <li>
                                        (3) Bất kỳ trang web / ứng dụng / dịch vụ nào khác tính phí hoặc sinh lợi từ (bao gồm cả phí quảng cáo hoặc phí giới
                                        thiệu) dữ liệu thị trường thu được từ Nami.Exchange.
                                    </li>
                                </ul>
                                <li>
                                    Nếu không có sự đồng ý trước bằng văn bản từ Nami.Exchange, bạn không được sửa đổi, sao chép, nhân bản, sao chép, tải xuống,
                                    lưu trữ, truyền tải thêm, phổ biến, chuyển giao, tháo rời, phát sáng, xuất bản, xáa hoặc thay đổi bất kỳ tuyên bố bản quyền
                                    hoặc nhãn, hoặc giấy phép, phụ - cấp phép, bán, nhân bản, thiết kế, thuê, cho thuê, nhãn hiệu riêng, cấp quyền lợi bảo đảm
                                    trong tài sản hoặc bất kỳ phần nào của tài sản hoặc tạo ra các sản phẩm phái sinh của chúng hoặc lợi dụng bất kỳ phần nào
                                    của tài sản.
                                </li>
                                <li>
                                    Bạn không được (i) sử dụng bất kỳ liên kết sâu nào, trình thu thập thông tin web, bot, trình thu thập dữ liệu hoặc các thiết
                                    bị, chương trình, tập lệnh, thuật toán hoặc phương pháp tự động khác hoặc bất kỳ quy trình thủ công tương tự hoặc tương
                                    đương nào để truy cập, lấy, sao chép hoặc giám sát bất kỳ phần nào của thuộc tính , hoặc sao chép hoặc bỏ qua cấu trúc điều
                                    hướng hoặc cách trình bày của Dịch vụ Nami.Exchange theo bất kỳ cách nào, để lấy hoặc cố lấy bất kỳ tài liệu, tài liệu hoặc
                                    thông tin nào theo bất kỳ cách nào không được cung cấp có chủ đích thông qua Dịch vụ Nami.Exchange; (ii) cố gắng truy cập
                                    vào bất kỳ phần hoặc chức năng nào của các thuộc tính mà không được phép, hoặc kết nối với Nami.Exchange Services hoặc bất
                                    kỳ máy chủ Nami.Exchange nào hoặc bất kỳ hệ thống hoặc mạng nào khác của bất kỳ Dịch vụ Nami.Exchange nào được cung cấp
                                    thông qua các dịch vụ bằng cách hack, khai thác mật khẩu hoặc bất kỳ phương tiện bất hợp pháp hoặc bị cấm nào khác; (iii)
                                    thăm dò, quét hoặc kiểm tra các lỗ hổng của Dịch vụ Nami.Exchange hoặc bất kỳ mạng nào được kết nối với các thuộc tính hoặc
                                    vi phạm bất kỳ biện pháp bảo mật hoặc xác thực nào trên Dịch vụ Nami.Exchange hoặc bất kỳ mạng nào được kết nối với Dịch vụ
                                    Nami.Exchange; (iv) tra cứu ngược lại, theo d&otilde;i hoặc tìm cách theo d&otilde;i bất kỳ thông tin nào của bất kỳ Người
                                    dùng hoặc khách truy cập nào khác của Dịch vụ Nami.Exchange; (v) thực hiện bất kỳ hành động nào gây ra tải trọng lớn bất hợp
                                    lý hoặc không tương xứng lên cơ sở hạ tầng của hệ thống hoặc mạng của Nami.Exchange Services hoặc Nami.Exchange, hoặc cơ sở
                                    hạ tầng của bất kỳ hệ thống hoặc mạng nào được kết nối với dịch vụ Nami.Exchange; (vi) sử dụng bất kỳ thiết bị, phần mềm
                                    hoặc chương trình thông thường nào để can thiệp vào hoạt động bình thường của Dịch vụ Nami.Exchange hoặc bất kỳ giao dịch
                                    nào trên Dịch vụ Nami.Exchange, hoặc việc sử dụng Dịch vụ Nami.Exchange của bất kỳ người nào khác; (vii) giả mạo tiêu đề,
                                    mạo danh hoặc thao túng thông tin nhận dạng, để che giấu danh tính của bạn hoặc nguồn gốc của bất kỳ tin nhắn hoặc đường
                                    truyền nào bạn gửi đến Nami.Exchange, hoặc (viii) sử dụng Dịch vụ Nami.Exchange theo cách bất hợp pháp.
                                </li>
                            </ol>

                            <Paragraph>
                                Bằng cách truy cập Dịch vụ Nami.Exchange, bạn đồng ý rằng Nami.Exchange có quyền điều tra bất kỳ vi phạm nào đối với các Điều
                                khoản này, đơn phương xác định xem bạn có vi phạm các Điều khoản này hay không và thực hiện các hành động theo quy định có liên
                                quan mà không cần sự đồng ý của bạn hoặc thông báo trước. Ví dụ về các hành động như vậy bao gồm, nhưng không giới hạn ở:
                            </Paragraph>
                            <ul className="list-disc ml-8 mt-4 space-y-1">
                                <li>Chặn và đáng yêu cầu đặt lệnh;</li>
                                <li>Đáng băng tài khoản của bạn;</li>
                                <li>Báo cáo sự việc với cơ quan chức năng;</li>
                                <li>Công bố các vi phạm bị cáo buộc và các hành động đã được thực hiện;</li>
                                <li>Xáa bất kỳ thông tin nào bạn đã xuất bản bị phát hiện là vi phạm.</li>
                            </ul>
                            <Title2>2. Giao dịch tiền điện tử với tiền điện tử</Title2>
                            <p>
                                Sau khi hoàn tất việc đăng ký và xác minh danh tính cho Tài khoản Nami.Exchange, bạn có thể tiến hành Giao dịch tiền điện tử
                                trên Nami.Exchange theo các quy định của Điều khoản này và Quy tắc nền tảng Nami.Exchange.
                            </p>
                            <Title3>a. Lệnh giao dịch</Title3>
                            <p>
                                Khi gửi yêu cầu sử dụng Nami.Exchange Services cho Giao dịch tiền điện tử (một &ldquo;Lệnh&rdquo;), tài khoản của bạn sẽ được
                                cập nhật ngay lập tức để phản ánh các Lệnh đang mở và Lệnh của bạn sẽ được đưa vào sổ lệnh của Nami.Exchange để khớp với Lệnh
                                của người dùng khác. Nếu một trong các Lệnh của bạn khớp hoàn toàn hoặc một phần Lệnh của người dùng khác, Nami.Exchange sẽ thực
                                hiện trao đổi (&ldquo;Giao dịch&rdquo;). Sau khi Giao dịch được thực hiện, tài khoản của bạn sẽ được cập nhật để phản ánh rằng
                                Lệnh đã được thực hiện đầy đủ và đã đáng, hoặc Lệnh đã được thực hiện một phần. Lệnh sẽ vẫn chưa hoàn thành cho đến khi ná được
                                thực hiện đầy đủ hoặc bị hủy bỏ theo đoạn (b) bên dưới. Để kết thúc một Giao dịch, bạn ủy quyền cho Nami.Exchange tạm thời kiểm
                                soát các Đơn vị tiền tệ kỹ thuật số liên quan đến Giao dịch của bạn.
                            </p>
                            <Title3>b. Hủy bỏ</Title3>
                            <p>
                                Đối với các Lệnh được thực hiện thông qua Dịch vụ Nami.Exchange, bạn chỉ có thể hủy chúng trước khi chúng được khớp với các Lệnh
                                của Người dùng khác. Khi Lệnh của bạn đã được khớp với Lệnh của người dùng khác, bạn không được thay đổi, thu hồi hoặc hủy bỏ ủy
                                quyền của Nami.Exchange để hoàn tất Lệnh. Đối với bất kỳ Lệnh nào được khớp một phần, bạn có thể hủy phần chưa khớp của Lệnh trừ
                                khi phần đó đã được khớp. Nami.Exchange có quyền từ chối mọi yêu cầu hủy bỏ liên quan đến Lệnh mà bạn đã gửi. Nếu tài khoản của
                                bạn không có đủ số lượng Đơn vị tiền tệ kỹ thuật số để thực hiện một Lệnh, Nami.Exchange có thể hủy toàn bộ Lệnh hoặc thực hiện
                                một phần Lệnh với số lượng Đơn vị tiền tệ kỹ thuật số bạn có trong tài khoản của mình (trong mỗi trường hợp, bất kỳ Giao dịch
                                nào liên quan đến phí phải trả cho Nami.Exchange được khấu trừ như đã nêu trong đoạn (c) bên dưới).
                            </p>
                            <Title3>c. Phí</Title3>
                            <p>
                                Bạn đồng ý thanh toán cho Nami.Exchange các khoản phí được chỉ định trong https://nami.exchange/fee-schedule. Nami.Exchange có
                                thể, theo quyết định của mình, cập nhật phí bất kỳ lúc nào. Mọi khoản phí cập nhật sẽ áp dụng cho bất kỳ giao dịch mua bán hoặc
                                Giao dịch nào khác diễn ra sau ngày phí cập nhật có hiệu lực. Bạn cho phép Nami.Exchange khấu trừ từ tài khoản của bạn bất kỳ
                                khoản phí áp dụng nào mà bạn nợ theo các Điều khoản này.
                            </p>
                            <Title3>d. Các loại giao dịch tiền điện tử khác</Title3>
                            <p>
                                Ngoài Giao dịch tiền điện tử cho phép người dùng trực tiếp đặt lệnh như đã đề cập trong đoạn (a) ở trên, Nami.Exchange có thể,
                                theo quyết định của mình, cung cấp các dịch vụ kỹ thuật và nền tảng cho các loại Giao dịch tiền điện tử khác theo Quy tắc nền
                                tảng Nami.Exchange được xây dựng riêng biệt, chẳng hạn như dạng lệnh đặt 1 hủy bỏ 1 (OCO) và hoặc lệnh chặn.
                            </p>
                            <Title3>3. Giao dịch hợp đồng tương lai</Title3>
                            <p>
                                Trừ khi được Nami.Exchange quy định khác, để tiến hành Giao dịch hợp đồng tương lai, bạn phải ký kết với Nami.Exchange một Thỏa
                                thuận dịch vụ hợp đồng tương lai Nami.Exchange riêng biệt (https://nami.exchange/futures-terms) và nếu cần, mở một Tài khoản ký
                                quỹ đặc biệt, sau hoàn thành đăng ký và xác minh danh tính cho Tài khoản Nami.Exchange của bạn. Bạn thừa nhận và đồng ý rằng:
                            </p>
                            <ol className="mt-8 list-disc ml-8 space-y-2">
                                <li>
                                    Bạn hoàn toàn hiểu những rủi ro cao của Giao dịch hợp đồng tương lai, bao gồm nhưng không giới hạn ở rủi ro biến động lớn
                                    của Tài sản kỹ thuật số trong Giao dịch hàng hóa kỳ hạn và rủi ro về kết quả bất lợi trầm trọng hơn khi sử dụng đòn bẩy;
                                </li>
                                <li>
                                    Bạn có đủ kiến thức và kinh nghiệm đầu tư và khả năng chấp nhận rủi ro phát sinh từ Giao dịch hợp đồng tương lai và đồng ý
                                    chịu mọi rủi ro một cách độc lập từ việc đầu tư vào Giao dịch hợp đồng kỳ hạn;
                                </li>
                                <li>
                                    Trước khi thực hiện Giao dịch hợp đồng kỳ hạn, bạn đã đọc và hiểu tất cả nội dung của Thỏa thuận dịch vụ hàng hóa kỳ hạn
                                    Nami.Exchange và các Quy tắc nền tảng Nami.Exchange có liên quan, đồng thời đã tham khảo ý kiến của các chuyên gia có liên
                                    quan để đưa ra quyết định sáng suốt về việc liệu và cách hoàn thành Giao dịch hàng hóa kỳ hạn theo quy định của họ. khuyến
                                    nghị và đánh giá hợp lý của riêng bạn;
                                </li>
                                <li>
                                    Bạn đồng ý và cho phép Nami.Exchange thực hiện các biện pháp hợp lý khác nhau theo quyết định của mình (bao gồm nhưng không
                                    giới hạn ở việc buộc thanh lý và buộc phải giảm vị thế trong các trường hợp cụ thể) theo Thỏa thuận dịch vụ tương lai
                                    Nami.Exchange và các Quy tắc nền tảng Nami.Exchange có liên quan để bảo vệ lợi ích hợp pháp của bạn, Nami.Exchange và những
                                    Người dùng khác.
                                </li>
                            </ol>
                            <Title2>4. Giao dịch ký quỹ</Title2>
                            <p>
                                Trừ khi được Nami.Exchange quy định khác, trước khi thực hiện Giao dịch ký quỹ, bạn phải mở Tài khoản ký quỹ đặc biệt và / hoặc
                                hoàn thành các thủ tục liên quan khác, sau khi hoàn tất đăng ký và xác minh danh tính cho Tài khoản Nami.Exchange của bạn.
                            </p>
                            <Title3>a. Rủi ro giao dịch ký quỹ</Title3>

                            <p>
                                Biên lợi nhuận Giao dịch có rủi ro cao. Với tư cách là một nhà giao dịch đòn bẩy, bạn thừa nhận và đồng ý rằng bạn truy cập và
                                sử dụng các dịch vụ Giao dịch và vay ký quỹ với rủi ro của riêng bạn, bao gồm nhưng không giới hạn ở:
                            </p>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    Tính thanh khoản, độ sâu thị trường và động lực của thị trường giao dịch biến động dữ dội và thay đổi nhanh cháng. Việc sử
                                    dụng đòn bẩy có thể mang lại lợi thế hoặc bất lợi cho bạn, điều này có thể dẫn đến lãi hoặc lỗ lớn tùy từng trường hợp.
                                </li>
                                <li>
                                    Bạn không đủ điều kiện để nhận các loại tiền được phân tách từ bất kỳ tài sản nào trong Tài khoản ký quỹ của mình, ngay cả
                                    khi bạn chưa tham gia vào bất kỳ Giao dịch ký quỹ hoặc vay nợ nào.
                                </li>
                                <li>
                                    Các khoản cho vay có rủi ro và giá trị tài sản của bạn có thể giảm. Nếu giá trị tài sản của bạn giảm xuống một mức nhất
                                    định, bạn có trách nhiệm đối phá với những trường hợp thị trường này.
                                </li>
                                <li>
                                    Trong một số tình huống thị trường, bạn có thể thấy khá hoặc không thể thanh lý một vị thế. Điều này có thể xảy ra, chẳng
                                    hạn như do thanh khoản thị trường không đủ hoặc các vấn đề kỹ thuật trên Nami.Exchange.
                                </li>
                                <li>
                                    Việc đặt các Lệnh dự phòng không nhất thiết giới hạn khoản lỗ của bạn ở mức dự kiến, vì các điều kiện thị trường có thể ngăn
                                    cản bạn thực hiện các lệnh đó.
                                </li>
                                <li>
                                    Giao dịch ký quỹ không có các biện pháp đảm bảo chống lại tổn thất. Là một người đi vay, bạn có thể bị thiệt hại vượt quá số
                                    tiền bạn gửi vào Tài khoản ký quỹ của mình.
                                </li>
                            </ol>
                            <Title3>b. Để bắt đầu Giao dịch Ký quỹ:</Title3>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    Bạn tuyên bố và đảm bảo rằng bạn không đến từ Hoa Kỳ cũng như không thuộc bất kỳ danh sách cấm vận thương mại hoặc trừng
                                    phạt kinh tế nào, chẳng hạn như Quốc gia được Chỉ định Đặc biệt bởi OFAC (Văn phòng Kiểm soát Tài sản Nước ngoài của Bộ Tài
                                    chính Hoa Kỳ).
                                </li>
                                <li>
                                    Bạn nên hiểu đầy đủ các rủi ro liên quan đến Giao dịch và Cho vay Ký quỹ, và hoàn toàn chịu trách nhiệm về bất kỳ hoạt động
                                    giao dịch và phi giao dịch nào trong Tài khoản Nami.Exchange và tài khoản ký quỹ của bạn. Bạn không nên tham gia vào các
                                    Giao dịch hoặc đầu tư vào các quỹ vượt quá khả năng tài chính của mình;
                                </li>
                                <li>
                                    Bạn hoàn toàn chịu trách nhiệm khi biết tình trạng thực sự của bất kỳ vị trí nào, ngay cả khi Nami.Exchange có thể trình bày
                                    không chính xác bất kỳ lúc nào;
                                </li>
                                <li>
                                    Bạn đồng ý giữ đủ Tài sản Kỹ thuật số trong Tài khoản Ký quỹ của mình, theo yêu cầu của Nami.Exchange cho sự tham gia của
                                    Người dùng trong Giao dịch Ký quỹ và nhanh cháng hoàn trả đầy đủ khoản vay của bạn. Việc không giữ đủ tài sản hoặc không trả
                                    nợ đúng hạn có thể dẫn đến việc buộc phải thanh lý tài sản trong tài khoản ký quỹ của bạn;
                                </li>
                                <li>
                                    Ngay cả với khả năng thanh lý mạnh mẽ bất kỳ vị thế nào, Nami.Exchange cũng không thể đảm bảo dừng lỗ. Nếu tài sản của bạn
                                    không đủ để trả khoản nợ còn nợ sau khi thanh lý chức vụ, bạn vẫn phải chịu trách nhiệm cho bất kỳ khoản thiếu hụt nào về
                                    tài sản;
                                </li>
                                <li>
                                    Nami.Exchange có thể thực hiện các biện pháp, tùy theo quyết định của mình và thay mặt bạn, để giảm các tổn thất tiềm ẩn của
                                    bạn, bao gồm nhưng không giới hạn, chuyển tài sản từ tài khoản ký quỹ của bạn sang Tài khoản Nami.Exchange và / hoặc ngược
                                    lại;
                                </li>
                                <li>
                                    Trong thời gian bảo trì hệ thống Nami.Exchange, bạn đồng ý chịu hoàn toàn trách nhiệm quản lý tài khoản ký quỹ của mình dưới
                                    các rủi ro, bao gồm nhưng không giới hạn, đáng các vị thế và hoàn trả khoản vay của bạn.
                                </li>
                                <li>
                                    Bạn đồng ý tự mình thực hiện tất cả các Giao dịch, Giao dịch ký quỹ và / hoặc đi vay và hoàn toàn chịu trách nhiệm về các
                                    hoạt động của mình. Nami.Exchange không chịu trách nhiệm pháp lý đối với bất kỳ tổn thất hoặc thiệt hại nào do việc bạn sử
                                    dụng bất kỳ dịch vụ nào của Nami.Exchange hoặc việc bạn không biết về các rủi ro liên quan đến việc sử dụng Tài sản kỹ thuật
                                    số hoặc khi bạn sử dụng Dịch vụ Nami.Exchange.
                                </li>
                            </ol>
                            <Title2>5. Dịch vụ cho vay</Title2>
                            <p>
                                Trừ khi Nami.Exchange có quy định khác, để vay tiền tệ, bạn phải ký kết với Nami.Exchange Thỏa thuận sử dụng dịch vụ cho vay
                                riêng biệt và mở tài khoản ký quỹ đặc biệt và / hoặc hoàn thành các thủ tục liên quan khác, sau khi hoàn tất đăng ký và xác minh
                                danh tính cho tài khoản Nami của bạn. Bạn hiểu và đồng ý rằng:
                            </p>
                            <ol style={{ listStyle: 'lower-alpha' }} type={'a'}>
                                <li>
                                    Có những rủi ro đáng kể liên quan đến Dịch vụ cho vay, bao gồm nhưng không giới hạn rủi ro biến động giá trị của Tài sản kỹ
                                    thuật số được vay, rủi ro phái sinh và rủi ro kỹ thuật. Bạn phải xem xét cẩn thận và thực hiện phán đoán r&otilde; ràng để
                                    đánh giá tình hình tài chính của mình và các rủi ro nái trên để đưa ra bất kỳ quyết định nào về việc sử dụng Dịch vụ cho vay
                                    và bạn phải chịu trách nhiệm về mọi tổn thất phát sinh từ đ&oacute;;
                                </li>
                                <li>
                                    bạn sẽ hợp tác để cung cấp thông tin và tài liệu liên quan đến việc xác minh danh tính và Dịch vụ cho vay theo yêu cầu của
                                    Nami.Exchange, đồng thời tự chịu trách nhiệm thực hiện các biện pháp bảo mật cần thiết để bảo vệ an toàn cho tài khoản ký
                                    quỹ và thông tin có nhân của bạn;
                                </li>
                                <li>
                                    bạn phải đọc kỹ các Quy tắc nền tảng Nami.Exchange có liên quan trước khi sử dụng Dịch vụ cho vay, đồng thời lưu ý, hiểu và
                                    tuân thủ các thông tin và quy tắc cụ thể liên quan đến hoạt động của Dịch vụ cho vay, đồng thời bạn cam kết rằng việc sử
                                    dụng tài sản được vay phải tuân theo các yêu cầu của các Điều khoản này và các luật và quy định liên quan;
                                </li>
                                <li>
                                    Nami.Exchange có toàn quyền quản lý tài khoản ký quỹ và tài sản thế chấp của bạn trong thời gian Dịch vụ cho vay được cung
                                    cấp và có quyền, trong các trường hợp được quy định trong Thỏa thuận người dùng Dịch vụ cho vay hoặc các Điều khoản này,
                                    thực hiện các biện pháp kiểm soát rủi ro khác nhau, trong đó bao gồm nhưng không giới hạn ở việc buộc phải thanh lý. Các
                                    bước như vậy có thể gây ra tổn thất lớn cho bạn và bạn sẽ tự chịu trách nhiệm về kết quả của các biện pháp đ&oacute;;
                                </li>
                                <li>
                                    Nami.Exchange có quyền cấm tạm thời hoặc vĩnh viễn bạn sử dụng Dịch vụ cho vay khi thấy cần thiết hoặc hợp lý, và trong phạm
                                    vi tối đa được pháp luật cho phép mà không phải chịu bất kỳ trách nhiệm pháp lý nào đối với bạn.
                                </li>
                            </ol>
                            <Title2>6. Dịch vụ tiết kiệm Nami.Exchange</Title2>
                            <p>
                                Nami.Exchange cung cấp Nami.Exchange Savings, một sản phẩm cung cấp cho Người dùng các dịch vụ giá trị gia tăng cho Tài sản kỹ
                                thuật số nhàn rỗi của họ. Để sử dụng dịch vụ Nami.Exchange Savings, bạn phải ký kết với Nami.Exchange một Thỏa thuận sử dụng
                                dịch vụ tiết kiệm Nami.Exchange riêng (https://nami.exchange/saving-terms) và mở một tài khoản dịch vụ Nami.Exchange Savings đặc
                                biệt, sau đây hoàn thành đăng ký và xác minh danh tính cho Tài khoản Nami.Exchange của bạn. Khi sử dụng dịch vụ Tiết kiệm
                                Nami.Exchange, bạn cần lưu ý rằng:
                            </p>
                            <ol>
                                <li>
                                    Tài sản Tiết kiệm Nami.Exchange sẽ được sử dụng trong hoạt động vay có đòn bẩy tiền điện tử và các hoạt động kinh doanh
                                    khác.
                                </li>
                                <li>
                                    Khi bạn sử dụng dịch vụ Tiết kiệm Nami.Exchange, bạn sẽ ủy quyền vô điều kiện cho Nami.Exchange phân phối và cấp lãi vay
                                    theo Quy tắc Nền tảng Nami.Exchange.
                                </li>
                                <li>
                                    Bạn phải tuân thủ các luật và quy định có liên quan để đảm bảo rằng các nguồn Tài sản kỹ thuật số là hợp pháp và tuân thủ
                                    khi sử dụng dịch vụ Nami.Exchange Savings.
                                </li>
                                <li>
                                    Khi bạn sử dụng dịch vụ Tiết kiệm Nami.Exchange, bạn nên nhận thức đầy đủ những rủi ro khi đầu tư vào Tài sản kỹ thuật số và
                                    vận hành một cách thận trọng.
                                </li>
                                <li>
                                    Bạn đồng ý rằng tất cả các hoạt động đầu tư được thực hiện trên Nami.Exchange thể hiện ý định đầu tư thực sự của bạn và chấp
                                    nhận vô điều kiện những rủi ro và lợi ích tiềm ẩn từ các quyết định đầu tư của bạn.
                                </li>
                                <li>
                                    Nami.Exchange có quyền đình chỉ hoặc chấm dứt dịch vụ Nami.Exchange Savings. Nếu cần, Nami.Exchange có thể tạm ngừng và chấm
                                    dứt dịch vụ Nami.Exchange Savings bất kỳ lúc nào.
                                </li>
                                <li>
                                    Do sự chậm trễ của mạng, lỗi hệ thống máy tính và các trường hợp bất khả kháng khác, có thể dẫn đến việc trì hoãn, tạm
                                    ngừng, chấm dứt hoặc sai lệch việc thực hiện của dịch vụ Nami. hệ thống thực thi dịch vụ chạy ổn định và hiệu quả.
                                    Nami.Exchange không chịu bất kỳ trách nhiệm nào nếu việc thực hiện cuối cùng không như mong đợi của bạn do các yếu tố trên.
                                </li>
                            </ol>
                            <Title2>7. Chương trình Staking</Title2>
                            <p>
                                Đôi khi, Nami.Exchange sẽ khởi chạy Chương trình Staking cho các loại Tiền tệ kỹ thuật số cụ thể để thưởng, theo các quy tắc
                                nhất định, người dùng nắm giữ các Loại tiền kỹ thuật số đó trong Tài khoản Nami.Exchange của họ. Khi tham gia vào các chương
                                trình Staking, bạn cần lưu ý rằng:
                            </p>
                            <ol>
                                <li>
                                    Trừ khi được Nami.Exchange quy định khác, các Chương trình Staking đều miễn phí và Người dùng có thể giao dịch trong thời
                                    gian staking;
                                </li>
                                <li>Nami.Exchange không đảm bảo số tiền thu được của Người dùng theo bất kỳ Chương trình ký quỹ nào;</li>
                                <li>
                                    Nami.Exchange có quyền bắt đầu hoặc chấm dứt Chương trình Staking đối với bất kỳ Đơn vị tiền tệ kỹ thuật số nào hoặc sửa đổi
                                    các quy tắc trên các chương trình đó theo quyết định riêng của mình;
                                </li>
                                <li>
                                    Người dùng phải đảm bảo rằng các nguồn Tiền tệ kỹ thuật số mà họ nắm giữ trong Tài khoản Nami.Exchange là hợp pháp và tuân
                                    thủ và cam kết tuân thủ các luật và quy định liên quan. Nếu không, Nami.Exchange có quyền thực hiện các bước cần thiết theo
                                    các Điều khoản này hoặc Quy tắc nền tảng Nami.Exchange, bao gồm nhưng không giới hạn việc đáng băng Tài khoản Nami.Exchange
                                    hoặc khấu trừ Tiền kỹ thuật số được trao cho Người dùng vi phạm quy tắc của các Chương trình Staking tương ứng .
                                </li>
                            </ol>
                            <Title1>IV. MIỄN TRỪ TRÁCH NHIỆM</Title1>
                            <Title2>1. Tuyên bố từ chối bảo đảm</Title2>
                            <p>
                                <Strong>
                                    VỚI PHẠM VI TỐI ĐA THEO LUẬT ÁP DỤNG, DỊCH VỤ NAMI EXCHANGE, TÀI LIỆU NAMI.EXCHANGE VÀ BẤT KỲ SẢN PHẨM, DỊCH VỤ HOẶC MỤC
                                    KHÁC ĐƯỢC CUNG CẤP TỪ NAMI.EXCHANGE ĐƯỢC CUNG CẤP TR&Ecirc;N CƠ SỞ &ldquo;NGUY&Ecirc;N TRẠNG&rdquo; VÀ &ldquo;HIỆN
                                    C&Oacute;&rdquo;, VÀ NAMI TỪ CHỐI BẢO ĐẢM VỀ HIỆU SUẤT, KH&Oacute;A HỌC KINH DOANH HOẶC CÁC DỊCH VỤ SỬ DỤNG TRONG THƯƠNG MẠI
                                    MÀ KH&Ocirc;NG GIỚI HẠN THỜI GIAN BẮT ĐẦU. NAMI.EXCHANGE KH&Ocirc;NG TUY&Ecirc;N BỐ HOẶC BẢO ĐẢM RẰNG TRANG WEB, DỊCH VỤ
                                    NAMI.EXCHANGE HOẶC TÀI LIỆU NAMI.EXCHANGE LÀ CH&Iacute;NH XÁC, HOÀN CHỈNH, TIN CẬY, HIỆN TẠI, KH&Ocirc;NG C&Oacute; LỖI HOẶC
                                    KH&Ocirc;NG C&Oacute; SAI S&Oacute;T KHÁC. NAMI.EXCHANGE KH&Ocirc;NG ĐẢM BẢO RẰNG BẤT KỲ LỆNH GIAO DỊCH NÀO SẼ ĐƯỢC THỰC
                                    HIỆN, CHẤP NHẬN, GHI NHẬN HOẶC BỎ LỠ. NGOẠI TRỪ CÁC TUY&Ecirc;N BỐ, THỎA THUẬN VÀ QUY TẮC R&Otilde; RÀNG ĐƯỢC ĐẶT RA TRONG
                                    CÁC ĐIỀU KHOẢN NÀY, BẠN ĐỒNG &Yacute; RẰNG BẠN KH&Ocirc;NG LI&Ecirc;N QUAN ĐẾN BẤT KỲ BÁO CÁO HOẶC THỎA THUẬN NÀO KHÁC ĐỐI
                                    VỚI VIỆC BẠN SỬ DỤNG VÀ TRUY CẬP DỊCH VỤ NAMI.EXCHANGE. KH&Ocirc;NG GIỚI HẠN THỜI GIAN BẮT ĐẦU, BẠN SAU Đ&Acirc;Y HIỂU VÀ
                                    ĐỒNG &Yacute; RẰNG NAMI.EXCHANGE SẼ KH&Ocirc;NG CHỊU TRÁCH NHIỆM PHÁP L&Yacute; ĐỐI VỚI BẤT KỲ MẤT LỖI HOẶC THIỆT HẠI NÀO
                                    PHÁT SINH NGOÀI HOẶC LI&Ecirc;N QUAN ĐẾN: (A) BẤT KỲ SỰ KH&Ocirc;NG CH&Iacute;NH XÁC HOẶC BẤT CỨ LỖI NÀO VỀ DỮ LIỆU GIÁ TÀI
                                    SẢN KỸ THUẬT SỐ, (B) TR&Igrave; HO&Atilde;N TRONG VIỆC TRUYỀN DỮ LIỆU, (C) TƯƠNG TÁC VÀO BẤT KỲ DỮ LIỆU NÀO, (D) CÁC HOẠT
                                    ĐỘNG BẢO TR&Igrave; THƯỜNG XUY&Ecirc;N, (E) BẤT CỨ THIỆT HẠI NÀO LI&Ecirc;N QUAN ĐẾN VIỆC VI PHẠM CÁC ĐIỀU KHOẢN NÀY, (F)
                                    BẤT KỲ THIỆT HẠI NÀO DO HÀNH ĐỘNG BẤT HỢP PHÁP CỦA CÁC B&Ecirc;N THỨ BA KHÁC HOẶC HÀNH ĐỘNG KH&Ocirc;NG ĐƯỢC NAMI.EXCHANGE
                                    CHO PHÉP; VÀ (G) CÁC LOẠI TRỪ KHÁC ĐƯỢC LI&Ecirc;N QUAN ĐẾN TUY&Ecirc;N BỐ TỪ CHỐI VÀ CÁC QUY TẮC NỀN TẢNG DO NAMI.EXCHANGE
                                    BAN HÀNH.
                                </Strong>
                            </p>
                            <p>
                                <Strong>
                                    VIỆC TỪ CHỐI TRÁCH NHIỆM CỦA CÁC BẢO ĐẢM C&Oacute; THỂ KH&Ocirc;NG ÁP DỤNG VỚI NGOẠI LỆ N&Oacute; BỊ CẤM BẰNG LUẬT ÁP DỤNG
                                    CỦA PHÁP LUẬT TRONG ĐỊA BÀN MÀ BẠN CƯ TR&Uacute;.
                                </Strong>
                            </p>
                            <Title2>2. Miễn trừ trách nhiệm về Thiệt hại và Giới hạn Trách nhiệm</Title2>
                            <p>
                                <Strong>
                                    VỚI PHẠM VI TỐI ĐA TRONG LUẬT ÁP DỤNG, KH&Ocirc;NG C&Oacute; SỰ KIỆN NÀO MÀ TRONG Đ&Oacute; NAMI.EXCHANGE, CÁC PH&Acirc;N
                                    NHÁNH, CỔ Đ&Ocirc;NG, THÀNH VI&Ecirc;N, GIÁM ĐỐC, NH&Acirc;N VI&Ecirc;N, LUẬT SƯ, ĐẠI DIỆN, NHÀ CUNG CẤP HAY NHÀ THẦU CỦA
                                    NAMI.EXCHANGE PHẢI CHỊU TRÁCH NHIỆM VỀ BẤT CỨ THIỆT HẠI TRỰC TIẾP HAY GIÁN TIẾP HOẶC CÁC RỦI RO TƯƠNG TỰ (BAO GỒM NHƯNG
                                    KH&Ocirc;NG GIỚI HẠN Ở THIỆT HẠI DO MẤT DỮ LIỆU, TH&Ocirc;NG TIN, DOANH THU, LỢI NHUẬN HOẶC LỢI &Iacute;CH TÀI CH&Iacute;NH
                                    KHÁC) PHÁT SINH TỪ CÁC DỊCH VỤ CỦA NAMI.EXCHANGE, HIỆU SUẤT HOẠT ĐỘNG CỦA NAMI.EXCHANGE HOẶC BẤT CỨ SẢN PHẨM NÀO KHÁC ĐƯỢC
                                    CUNG CẤP BỞI NAMI.EXCHANGE VÀ CÁC PH&Acirc;N NHÁNH, D&Ugrave; DƯỚI H&Igrave;NH THỨC HỢP ĐỒNG, THỎA THUẬN HOẶC CÁC
                                    H&Igrave;NH THỨC KHÁC NGAY CẢ KHI NAMI.EXCHANGE Đ&Atilde; ĐƯỢC KHUYẾN CÁO VỀ KHẢ NĂNG XẢY RA CÁC THIỆT HẠI NHƯ VẬY NGOẠI TRỪ
                                    TRƯỜNG HỢP Đ&Atilde; C&Oacute; QUYẾT ĐỊNH PHÁP L&Yacute; RẰNG NHỮNG THIỆT HẠI NẾU C&Oacute; LÀ KẾT QUẢ CỦA T&Iacute;NH SƠ
                                    SUẤT, MỤC Đ&Iacute;CH LỪA ĐẢO, G&Acirc;Y HIỂU LẦM HOẶC CHỦ Đ&Iacute;CH VI PHẠM PHÁP LUẬT CỦA NAMI EXCHANGE. MỘT SỐ PHÁN
                                    QUYẾT PHÁP L&Yacute; KH&Ocirc;NG CHO PHÉP LOẠI TRỪ HOẶC GIỚI HẠN CÁC THIỆT HẠI HOẶC HẬU QUẢ N&Ecirc;N GIỚI HẠN TR&Ecirc;N
                                    C&Oacute; THỂ KH&Ocirc;NG ÁP DỤNG CHO BẠN.
                                </Strong>
                            </p>
                            <p>
                                <Strong>
                                    D&Ugrave; Đ&Atilde; N&Oacute;I Ở TR&Ecirc;N, KH&Ocirc;NG C&Oacute; BẤT CỰ SỰ KIỆN NÀO MÀ TRÁCH NHIỆM CỦA NAMI.EXCHANGE, CÁC
                                    PH&Acirc;N NHÁNH, CỔ Đ&Ocirc;NG, THÀNH VI&Ecirc;N, GIÁM ĐỐC, NH&Acirc;N VI&Ecirc;N, LUẬT SƯ, ĐẠI DIỆN, NHÀ CUNG CẤP HAY NHÀ
                                    THẦU CỦA NAMI.EXCHANGE TỪ CÁC DỊCH VỤ CỦA NAMI.EXCHANGE, HIỆU SUẤT HOẠT ĐỘNG CỦA NAMI.EXCHANGE HOẶC BẤT CỨ SẢN PHẨM NÀO KHÁC
                                    ĐƯỢC CUNG CẤP BỞI NAMI.EXCHANGE VÀ CÁC PH&Acirc;N NHÁNH, D&Ugrave; DƯỚI H&Igrave;NH THỨC HỢP ĐỒNG, THỎA THUẬN HOẶC CÁC
                                    H&Igrave;NH THỨC KHÁC, VƯỢT QUÁ TỔNG PH&Iacute; BẠN Đ&Atilde; CHIA TRẢ CHO NAMI.EXCHANGE THEO CÁC QUY ĐỊNH NÀY TRONG
                                    V&Ograve;NG 12 THÁNG TRƯỚC THỜI ĐIỂM XẢY RA SỰ KIỆN PHÁT SINH TRÁCH NHIỆM PHÁP L&Yacute;.
                                </Strong>
                            </p>
                            <Title2>3. Bồi thường</Title2>
                            <p>
                                Bạn đồng ý bồi thường cho Nami.Exchange, nhà điều hành sàn giao dịch, các chi nhánh, nhà thầu, người cấp phép và giám đốc, cán
                                bộ, nhân viên và đại lý tương ứng từ bất kỳ khiếu nại, hành động, tố tụng, điều tra, yêu cầu, kiện tụng, chi phí và thiệt hại
                                liên quan (bao gồm phí luật sư, tiền phạt hoặc hình phạt do bất kỳ cơ quan quản lý nào áp đặt) phát sinh từ hoặc liên quan đến
                                (i) việc bạn sử dụng hoặc hành vi liên quan đến Dịch vụ Nami.Exchange, (ii) hành vi vi phạm của bạn hoặc việc chúng tôi thực thi
                                các Điều khoản này, hoặc (iii) bạn vi phạm bất kỳ luật, quy định hiện hành nào hoặc quyền của bất kỳ bên thứ ba nào trong quá
                                trình bạn sử dụng Dịch vụ Nami.Exchange. Nếu bạn có nghĩa vụ bồi thường cho nhà điều hành Nami.Exchange, các chi nhánh, nhà
                                thầu, người cấp phép và giám đốc, cán bộ, nhân viên hoặc đại lý tương ứng của họ theo các Điều khoản này, Nami.Exchange sẽ có
                                quyền, theo quyết định riêng của mình, kiểm soát bất kỳ hành động nào hoặc tiếp tục và để xác định xem Nami.Exchange có muốn dàn
                                xếp hay không, và nếu có, theo những điều khoản nào.
                            </p>
                            <Title1>V. Thông báo</Title1>
                            <p>
                                <Strong>
                                    Xin lưu ý rằng tất cả các thông báo chính thức, tin tức, chương trình khuyến mãi, cuộc thi và airdrop sẽ được liệt kê trên{' '}
                                </Strong>
                                <a href="https://nami.exchange/support/announcement">
                                    <Strong>https://nami.exchange/support/announcement</Strong>
                                </a>
                                <Strong>.</Strong>
                            </p>
                            <p>
                                <Strong>
                                    BẠN HIỂU VÀ THƯỜNG XUY&Ecirc;N THAM KHẢO CÁC TÀI LIỆU NÀY. NAMI.EXCHANGE SẼ KH&Ocirc;NG CHỊU TRÁCH NHIỆM TRƯỚC BẤT CỨ THIỆT
                                    HẠI CÁ NH&Acirc;N NÀO PHÁT SINH TỪ VIỆC KH&Ocirc;NG NẮM BẮT ĐƯỢC CÁC TH&Ocirc;NG TIN TỪ TH&Ocirc;NG BÁO CH&Iacute;NH THỨC.
                                </Strong>
                            </p>
                            <Title1>VI. Chấm dứt hợp đồng</Title1>
                            <Title2>1. Đình chỉ tài khoản Nami.Exchange</Title2>
                            <p>
                                Bạn đồng ý rằng Nami.Exchange sẽ có quyền đình chỉ ngay lập tức Tài khoản Nami.Exchange của bạn (và bất kỳ tài khoản nào thuộc
                                sở hữu của các pháp nhân hoặc chi nhánh có liên quan), đáng băng hoặc khóa Tài sản kỹ thuật số hoặc tiền mã hóa trong tất cả các
                                tài khoản đó và tạm ngừng quyền truy cập của bạn vào Nami .Exchange vì bất kỳ lý do gì bao gồm việc Nami.Exchange nghi ngờ bất
                                kỳ tài khoản nào như vậy vi phạm các Điều khoản này, Chính sách quyền riêng tư của chúng tôi hoặc bất kỳ luật và quy định hiện
                                hành nào. Bạn đồng ý rằng Nami.Exchange sẽ không chịu trách nhiệm pháp lý đối với bạn và đối với bất kỳ sửa đổi vĩnh viễn hoặc
                                tạm thời nào đối với Tài khoản Nami.Exchange của bạn, hoặc đình chỉ hoặc chấm dứt quyền truy cập của bạn vào tất cả hoặc bất kỳ
                                phần nào của Dịch vụ Nami.Exchange. Nami.Exchange sẽ có quyền lưu giữ và sử dụng dữ liệu giao dịch hoặc thông tin khác liên quan
                                đến các Tài khoản Nami.Exchange đó. Các biện pháp kiểm soát tài khoản trên cũng có thể được áp dụng trong các trường hợp sau:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>
                                    Tài khoản Nami.Exchange phải tuân theo thủ tục tố tụng của chính phủ, cuộc điều tra hình sự hoặc các vụ kiện tụng đang chờ
                                    xử lý khác;
                                </li>
                                <li>Chúng tôi phát hiện các hoạt động bất thường trong Tài khoản Nami.Exchange;</li>
                                <li>Chúng tôi phát hiện truy cập trái phép vào Tài khoản Nami.Exchange;</li>
                                <li>Chúng tôi phải làm như vậy theo lệnh của tòa án hoặc lệnh của cơ quan quản lý / chính phủ.</li>
                            </ul>
                            <Title2>2. Hủy tài khoản Nami.Exchange</Title2>
                            <p>
                                Trong trường hợp xảy ra bất kỳ sự kiện nào sau đây, Nami.Exchange sẽ có quyền trực tiếp chấm dứt các Điều khoản này bằng cách
                                hủy Tài khoản Nami.Exchange của bạn và sẽ được hưởng quyền nhưng không có nghĩa vụ phải đóng băng vĩnh viễn, hủy bỏ, trao đổi
                                hoặc rút các tài sản trong Tài khoản của bạn, bao gồm:
                            </p>
                            <ul className="ml-4 list-disc mt-8 space-y-1">
                                <li>sau khi Nami.Exchange chấm dứt các dịch vụ cho bạn;</li>
                                <li>
                                    bạn bị cáo buộc đăng ký hoặc đăng ký dưới tên của bất kỳ người nào khác với tư cách là Người dùng Nami.Exchange một lần nữa,
                                    trực tiếp hoặc gián tiếp;
                                </li>
                                <li>thông tin bạn đã cung cấp là không trung thực, không chính xác, lỗi thời hoặc không đầy đủ;</li>
                                <li>
                                    khi các Điều khoản này được sửa đổi, bạn tuyên bố rằng bạn không sẵn sàng chấp nhận các Điều khoản đã sửa đổi bằng cách đăng
                                    ký hủy Tài khoản Nami.Exchange của bạn hoặc bằng các phương tiện khác;
                                </li>
                                <li>bạn yêu cầu chấm dứt Dịch vụ Nami.Exchange; và</li>
                                <li>bất kỳ trường hợp nào khác mà Nami.Exchange cho rằng nên chấm dứt Dịch vụ Nami.Exchange.</li>
                            </ul>
                            <Paragraph>
                                Nếu Tài khoản Nami.Exchange của bạn bị chấm dứt, tài khoản và thông tin giao dịch đáp ứng các tiêu chuẩn lưu giữ dữ liệu sẽ được
                                lưu trữ an toàn trong 5 năm. Ngoài ra, nếu giao dịch chưa hoàn thành trong quá trình chấm dứt tài khoản, Nami.Exchange sẽ có
                                quyền thông báo cho đối tác của bạn về tình hình tại thời điểm đó. Bạn thừa nhận rằng việc thoát tài khoản do người dùng thực
                                hiện (quyền xáa theo Quy định bảo vệ dữ liệu chung - GDPR hoặc các quy định tương đương khác) cũng sẽ phải tuân theo giao thức
                                chấm dứt được nêu ở trên.
                            </Paragraph>
                            <Paragraph>
                                Nếu Nami.Exchange được thông báo rằng bất kỳ Tài sản kỹ thuật số hoặc số tiền nào được giữ trong Tài khoản Nami.Exchange của bạn
                                bị đánh cắp hoặc không thuộc quyền sở hữu hợp pháp của bạn, Nami.Exchange có thể, nhưng không có nghĩa vụ, tạm giữ và quản lý
                                các khoản tiền bị ảnh hưởng và Tài khoản Nami.Exchange của bạn. Nếu Nami.Exchange thực hiện việc tạm giữ hành chính đối với một
                                số hoặc tất cả tiền của bạn hoặc Tài khoản Nami.Exchange, Nami.Exchange có thể tiếp tục giữ như vậy cho đến khi tranh chấp đã
                                được giải quyết và bằng chứng về giải pháp được Nami.Exchange chấp nhận. Nami.Exchange sẽ không liên quan đến bất kỳ tranh chấp
                                nào như vậy hoặc việc giải quyết tranh chấp. Bạn đồng ý rằng Nami.Exchange sẽ không có trách nhiệm pháp lý hoặc trách nhiệm đối
                                với bất kỳ khoản giữ nào như vậy, hoặc việc bạn không thể rút Tài sản kỹ thuật số hoặc tiền mã hóa hoặc thực hiện các giao dịch
                                trong khoảng thời gian bị giữ như vậy.
                            </Paragraph>
                            <Title2>3. Số tài sản còn lại sau khi Nami.Exchange Chấm dứt Tài khoản</Title2>
                            <p>
                                Trừ khi được quy định trong điều 4 dưới đây, khi Tài khoản Nami.Exchange bị đáng / rút, tất cả số dư tài khoản còn lại (bao gồm
                                các khoản phí và nghĩa vụ nợ với Nami.Exchange) sẽ được thanh toán ngay cho Nami.Exchange. Sau khi thanh toán tất cả các khoản
                                phí chưa thanh toán cho Nami.Exchange (nếu có), Người dùng sẽ có 5 ngày làm việc để rút tất cả Tài sản kỹ thuật số hoặc tiền mã
                                hóa từ tài khoản.
                            </p>
                            <Title2>
                                4. Số tiền còn lại sau khi Nami.Exchange chấm dứt tài khoản do gian lận, vi phạm pháp luật hoặc vi phạm các điều khoản này
                            </Title2>
                            <p>
                                Nami.Exchange duy trì toàn quyền giám sát Tài sản kỹ thuật số, quỹ và dữ liệu / thông tin của Người dùng có thể được chuyển cho
                                các cơ quan chính phủ trong trường hợp Nami.Exchange cần đình chỉ / đáng tài khoản phát sinh từ các cuộc điều tra gian lận, điều
                                tra vi phạm pháp luật hoặc vi phạm Những điều khoản này.
                            </p>
                            <Title1>
                                <Strong>VII. Không phải lời khuyên tài chính</Strong>
                            </Title1>
                            <p>
                                Nami.Exchange không phải là nhà môi giới, trung gian, đại lý hoặc cố vấn của bạn và không có mối quan hệ ủy thác hoặc nghĩa vụ
                                đối với bạn liên quan đến bất kỳ giao dịch nào hoặc các quyết định hoặc hoạt động khác bị ảnh hưởng bởi bạn sử dụng Dịch vụ
                                Nami.Exchange. Nami.Exchange không liên lạc hoặc không cung cấp thông tin nào cho bạn nhằm mục đích hoặc sẽ được coi hoặc được
                                hiểu là tư vấn đầu tư, tư vấn tài chính, tư vấn giao dịch hoặc bất kỳ hình thức tư vấn nào khác. Trừ khi được quy định khác
                                trong các Điều khoản này, tất cả các giao dịch được thực hiện tự động, dựa trên các thông số trong hướng dẫn đặt lệnh của bạn và
                                phù hợp với quy trình thực hiện giao dịch đã đăng và bạn hoàn toàn chịu trách nhiệm xác định xem bất kỳ khoản đầu tư, chiến lược
                                đầu tư hoặc giao dịch liên quan nào có phù hợp với bạn không theo mục tiêu đầu tư có nhân, hoàn cảnh tài chính và mức độ chấp
                                nhận rủi ro của bạn, và bạn sẽ tự chịu trách nhiệm về bất kỳ tổn thất hoặc trách nhiệm pháp lý nào từ đó. Bạn nên tham khảo ý
                                kiến của các chuyên gia pháp lý hoặc thuế về tình huống cụ thể của bạn. Nami.Exchange không khuyến nghị bạn nên mua, tìm kiếm,
                                bán hoặc nắm giữ bất kỳ Tài sản kỹ thuật số nào. Trước khi đưa ra quyết định mua, bán hoặc nắm giữ bất kỳ Tài sản kỹ thuật số
                                nào, bạn nên tiến hành thẩm định của riêng mình và tham khảo ý kiến các cố vấn tài chính của bạn trước khi đưa ra bất kỳ quyết
                                định đầu tư nào. Nami.Exchange sẽ không chịu trách nhiệm về các quyết định mà bạn đưa ra để mua, bán hoặc nắm giữ Tài sản kỹ
                                thuật số dựa trên thông tin do Nami.Exchange cung cấp.
                            </p>
                            <Title1>
                                <Strong>VIII. Tuân thủ Luật pháp địa phương</Strong>
                            </Title1>
                            <p>
                                Người dùng có trách nhiệm tuân thủ luật pháp địa phương liên quan đến việc sử dụng hợp pháp Dịch vụ Nami.Exchange trong khu vực
                                tài phán địa phương của họ cũng như các luật và quy định khác áp dụng cho Người dùng. Người dùng cũng phải chấp nhận, trong phạm
                                vi luật pháp địa phương của họ, tất cả các khía cạnh thuế, việc khấu lưu, thu, báo cáo và nộp cho cơ quan thuế thích hợp của họ.
                                TẤT CẢ NGƯỜI D&Ugrave;NG SỬ DỤNG DỊCH VỤ NAMI.EXCHANGE ĐỀU HIỂU VÀ XÁC NHẬN RẰNG TIỀN CỦA HỌ ĐẾN TỪ NGUỒN HỢP PHÁP VÀ
                                KH&Ocirc;NG XUẤT XỨ TỪ CÁC HOẠT ĐỘNG BẤT HỢP PHÁP; NGƯỜI D&Ugrave;NG ĐỒNG &Yacute; RẰNG Nami.Exchange SẼ Y&Ecirc;U CẦU HỌ HOẶC
                                NGƯỜI KHÁC THU THẬP TH&Ocirc;NG TIN VÀ TÀI LIỆU CẦN THIẾT THEO PHÁP LUẬT LI&Ecirc;N QUAN HOẶC LỆNH CỦA CH&Iacute;NH PHỦ ĐỂ XÁC
                                MINH T&Iacute;NH HỢP PHÁP CỦA NGUỒN VỐN VÀ VIỆC SỬ DỤNG VỐN CỦA HỌ. Các cơ quan có thẩm quyền trên toàn cầu và sẽ không ngần
                                ngại thu giữ, đóng băng, chấm dứt tài khoản và tiền mã hóa của Người dùng bị gắn cờ hoặc điều tra theo ủy quyền pháp lý.
                            </p>
                            <Title1>
                                <Strong>IX. Chính sách bảo mật</Strong>
                            </Title1>
                            <p>
                                Việc truy cập vào Dịch vụ Nami.Exchange sẽ yêu cầu gửi một số thông tin nhận dạng có nhân nhất định. Vui lòng xem lại Chính sách
                                quyền riêng tư của Nami.Exchange tại https://www.Nami.Exchange.com/vi/privacy để biết tóm tắt về các nguyên tắc của
                                Nami.Exchange về việc thu thập và sử dụng thông tin nhận dạng có nhân.
                            </p>
                            <Title1>
                                <Strong>X. Giải quyết tranh chấp: Nơi phán xử, Phán quyết trọng tài, Từ bỏ Hành động Tập thể</Strong>
                            </Title1>
                            <p>
                                VUI L&Ograve;NG ĐỌC KỸ PHẦN NÀY, V&Igrave; PHẦN NÀY LI&Ecirc;N QUAN ĐẾN VIỆC LOẠI BỎ MỘT SỐ QUYỀN LỢI PHÁP L&Yacute; NHẤT ĐỊNH
                                LI&Ecirc;N QUAN ĐẾN CÁC THỦ TỤC PHÁP L&Yacute;, BAO GỒM CẢ CÁC VỤ KIỆN TẬP THỂ.
                            </p>
                            <Paragraph>
                                <Strong>1. Thông báo Khiếu nại và Thời hạn Giải quyết Tranh chấp. </Strong>Vui lòng liên hệ với Nami.Exchange trước!
                                Nami.Exchange muốn giải quyết các mối quan tâm của bạn mà không cần đến các thủ tục pháp lý chính thức, nếu có thể. Nếu bạn có
                                tranh chấp với Nami.Exchange, bạn nên liên hệ với Nami.Exchange. Nami.Exchange sẽ cố gắng giải quyết tranh chấp nội bộ của bạn
                                sớm nhất có thể. Các bên đồng ý thương lượng một cách thiện chí để giải quyết tranh chấp (các cuộc thảo luận sẽ được giữ bí mật
                                và tuân theo các quy tắc hiện hành bảo vệ các cuộc thảo luận dàn xếp không được sử dụng làm bằng chứng trong bất kỳ thủ tục pháp
                                lý nào).
                            </Paragraph>
                            <Paragraph>
                                Trong trường hợp tranh chấp không thể được giải quyết một cách thỏa đáng và bạn muốn khẳng định một khiếu nại pháp lý chống lại
                                Nami.Exchange, thì bạn đồng ý đưa ra cơ sở của khiếu nại đó bằng văn bản trong &ldquo;Thông báo Khiếu nại&rdquo;, như một hình
                                thức thông báo trước đến Nami.Exchange. Thông báo Khiếu nại phải (1) mô tả bản chất và cơ sở của khiếu nại hoặc tranh chấp, (2)
                                đưa ra đề xuất các biện pháp giải quyết cụ thể, và (3) bao gồm email tài khoản Nami.Exchange của bạn. Thông báo Khiếu nại phải
                                được gửi đến một địa chỉ email hoặc siêu liên kết được cung cấp trong thư từ của bạn với Nami.Exchange. Sau khi bạn đã cung cấp
                                Thông báo Khiếu nại cho Nami.Exchange, tranh chấp được nêu trong Thông báo Khiếu nại có thể được Nami.Exchange hoặc bạn đệ trình
                                lên trọng tài theo đoạn 2 của Phần này, bên dưới. Để tránh nghi ngờ, việc gửi tranh chấp cho Nami.Exchange để giải quyết nội bộ
                                và gửi Thông báo khiếu nại cho Nami.Exchange là những điều kiện tiên quyết để bắt đầu một thủ tục trọng tài (hoặc bất kỳ thủ tục
                                pháp lý nào khác). Trong quá trình phân xử, số tiền của bất kỳ đề nghị dàn xếp nào do bạn hoặc Nami.Exchange đưa ra sẽ không
                                được tiết lộ cho trọng tài viên.
                            </Paragraph>
                            <Paragraph>
                                <Strong>2. Thỏa thuận Trọng tài. </Strong>Bạn và Nami.Exchange đồng ý rằng, theo khoản 1 ở trên, bất kỳ tranh chấp, khiếu nại
                                hoặc tranh cãi nào giữa bạn và Nami.Exchange phát sinh liên quan hoặc liên quan đến bất kỳ cách nào với các Điều khoản này hoặc
                                mối quan hệ của bạn với Nami.Exchange với tư cách là người dùng có nhân của Nami (không phải tập thể người dùng), ngoại trừ các
                                trường hợp được quy định dưới đây trong các trường hợp ngoại lệ đối với Thỏa thuận phân xử trọng tài. Bạn và Nami.Exchange đồng
                                ý thêm rằng trọng tài sẽ có độc quyền phán quyết về quyền tài phán của riêng mình, bao gồm nhưng không giới hạn bất kỳ phản đối
                                nào liên quan đến sự tồn tại, phạm vi hoặc hiệu lực của Thỏa thuận Trọng tài hoặc khả năng phân xử của bất kỳ yêu cầu bồi thường
                                hoặc yêu cầu phản tố. Thỏa thuận Trọng tài là một thỏa thuận không chính thức hơn là một vụ kiện tại tòa án. KH&Ocirc;NG
                                C&Oacute; THẨM PHÁN HOẶC BỒI THẨM ĐOÀN TRONG PHÁN QUYẾT TRỌNG TÀI, VÀ QUYỀN BỒI THẨM ĐƯỢC GIỚI HẠN. Có nhiều giới hạn trong phán
                                quyết trọng tài so với tại tòa án. Trọng tài viên phải tuân theo thỏa thuận này và có thể đưa ra mức bồi thường thiệt hại tương
                                tự như tòa án (bao gồm, nếu có, phí luật sư), ngoại trừ việc trọng tài viên không thể đưa ra biện pháp giải quyết theo hướng
                                tuyên bố hoặc bắt buộc có lợi cho bất kỳ ai trừ các bên tham gia trọng tài. Các điều khoản trọng tài quy định trong Phần này sẽ
                                vẫn còn hiệu lực khi các Điều khoản này chấm dứt.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Quy tắc Trọng tài. </Strong>Việc phán quyết trọng tài sẽ tuân theo Quy tắc Trọng tài của Phòng Thương mại Quốc tế
                                (&ldquo;ICC&rdquo;) sau đó có hiệu lực (&ldquo;Các Quy tắc ICC&rdquo;), như được sửa đổi bởi Mục X. Việc phân xử sẽ do Tòa án
                                Quốc tế của Trọng tài của ICC. Trừ khi các bên có thỏa thuận khác, sẽ chỉ có một trọng tài viên được chỉ định phù hợp với Quy
                                tắc ICC. Mọi phán quyết trọng tài sẽ được tiến hành bằng tiếng Anh, trừ khi có yêu cầu khác bởi luật bắt buộc của một quốc gia
                                thành viên của Liên minh Châu &Acirc;u hoặc bất kỳ cơ quan tài phán nào khác. Bất kể cách thức mà trọng tài được tiến hành,
                                trọng tài viên sẽ đưa ra một quyết định bằng văn bản có lý do đủ để giải thích những phát hiện và kết luận cần thiết làm cơ sở
                                cho quyết định và phán quyết, nếu có. THẨM QUYỀN VỀ BẤT KỲ KHOẢN BỒI THƯỜNG NÀO C&Oacute; THỂ ĐƯỢC ĐƯA RA TRONG BẤT KỲ
                                T&Ograve;A ÁN NÀO C&Oacute; TRÁCH NHIỆM PHÁP L&Yacute; ĐỐI VỚI B&Ecirc;N (HOẶC TR&Ecirc;N TÀI SẢN CỦA B&Ecirc;N) ĐỐI DIỆN VỚI
                                B&Ecirc;N PHẢI CHI TRẢ KHOẢN BỒI THƯỜNG.
                            </Paragraph>
                            <Paragraph>
                                <Strong>Thời gian nộp hồ sơ</Strong>: BẤT KỲ KHIẾU NẠI TRỌNG TÀI NÀO CHỐNG LẠI Nami.Exchange CẦN ĐƯỢC TIẾN HÀNH BẰNG CÁCH GỬI
                                VĂN BẢN TRONG V&Ograve;NG MỘT (1) NĂM, SAU NGÀY B&Ecirc;N KHIẾU NẠI BIẾT TỚI HOẶC GHI NHẬN HÀNH ĐỘNG G&Acirc;Y KHIẾU NẠI; VÀ SẼ
                                KH&Ocirc;NG C&Oacute; BẤT KỲ QUYỀN KHIẾU NẠI NÀO KH&Ocirc;NG ĐƯỢC XÁC NHẬN TRONG KHOẢNG THỜI GIAN Đ&Oacute;. KỲ HẠN 1 NĂM NÀY
                                BAO GỒM THỦ TỤC GIẢI QUYẾT TRANH CHẤP NỘI BỘ ĐƯỢC THIẾT LẬP TRONG KHOẢN 1 CỦA MỤC NÀY. Nếu luật hiện hành cấm thời hạn một năm
                                để xác nhận các khiếu nại, thì bất kỳ khiếu nại nào cũng phải được xác nhận trong khoảng thời gian ngắn nhất được luật hiện hành
                                cho phép.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Quá trình</Strong>; Lưu ý: Bên có ý định tìm kiếm trọng tài sau khi kết thúc Thời hạn Giải quyết Tranh chấp được quy
                                định tại khoản 1 ở trên, phải gửi yêu cầu đến ICC theo Quy tắc của ICC. Nếu chúng tôi yêu cầu phân xử đối với bạn, chúng tôi sẽ
                                thông báo cho bạn theo địa chỉ email hoặc địa chỉ gửi thư mà bạn đã cung cấp. Bạn đồng ý rằng bất kỳ thông báo nào được gửi đến
                                email hoặc địa chỉ gửi thư này sẽ được coi là có hiệu lực cho mọi mục đích, bao gồm nhưng không giới hạn các quyết định về tính
                                thích hợp của dịch vụ. Bạn có nghĩa vụ đảm bảo rằng địa chỉ email và / hoặc địa chỉ gửi thư trong hồ sơ với Nami.Exchange là cập
                                nhật và chính xác.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Ghế của Trọng tài</Strong>: Vị trí ghế của trọng tài sẽ là Thụy Sĩ.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Địa điểm Điều trần</Strong>: Địa điểm của bất kỳ phiên điều trần trọng tài trực tiếp nào sẽ là Thụy Sĩ, trừ khi các bên
                                có thỏa thuận khác.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Luật điều chỉnh / Quyền tài phán</Strong>: Luật điều chỉnh của trọng tài sẽ được xác định theo Quy tắc của ICC.&nbsp;
                            </Paragraph>
                            <Paragraph>
                                <Strong>Bảo mật.</Strong> Các bên đồng ý rằng trọng tài sẽ được giữ bí mật. Sự tồn tại của trọng tài, bất kỳ thông tin không
                                công khai nào được cung cấp trong trọng tài và bất kỳ đệ trình, lệnh hoặc phán quyết nào được đưa ra trong trọng tài (gọi chung
                                là &ldquo;Thông tin bí mật&rdquo;) sẽ không được tiết lộ cho bất kỳ bên nào ngoại trừ hội đồng trọng tài, ICC, các bên, cố vấn
                                của họ, chuyên gia, nhân chứng, kế toán và kiểm toán viên, công ty bảo hiểm và tái bảo hiểm, và bất kỳ người nào khác cần thiết
                                cho việc tiến hành trọng tài. Bất chấp những điều đã nái ở trên, một bên có thể tiết lộ Thông tin bí mật trong phạm vi mà việc
                                tiết lộ có thể được yêu cầu để thực hiện nghĩa vụ pháp lý, bảo vệ hoặc theo đuổi quyền hợp pháp, thực thi hoặc kháng cáo khoản
                                bồi thường trong các thủ tục pháp lý trung thực. Điều khoản bảo mật này sẽ vẫn còn hiệu lực ngay cả khi chấm dứt các Thỏa thuận
                                này và bất kỳ phán quyết trọng tài nào được đưa ra theo các thỏa thuận này.
                            </Paragraph>
                            <Paragraph>
                                <Strong>3. Bãi bỏ Hành động Tập thể. </Strong>Bạn và Nami.Exchange đồng ý rằng bất cứ xác nhận nào liên quan đến các Thỏa thuận
                                này hoặc mối quan hệ của bạn với Nami.Exchange với vai trò là một người dùng của Nami.Exchange (cho dù dựa trên hợp đồng, vi
                                phạm, quy chế, gian lận, xuyên tạc hoặc bất kỳ lý thuyết pháp lý nào khác, và cho dù các xác nhận trước hay sau khi kết thúc
                                Thỏa thuận này) sẽ được đưa tới cho các đối tượng khác trong một phán quyết trọng tài với tư cách khiếu nại có nhân, mà không
                                phải là đại diện trong một khiếu nại tập thể. Bạn và Nami.Exchange đồng ý từ bỏ mọi quyền đối với các khiếu nại như vậy được đưa
                                ra, xét xử hoặc phân xử với tư cách là một hành động tập thể, tập thể, đại diện hoặc luật sư tư nhân, trong phạm vi luật hiện
                                hành cho phép. Không được phép kết hợp hoặc hợp nhất các khiếu nại trọng tài riêng lẻ thành một khiếu nại trọng tài duy nhất mà
                                không có sự đồng ý của tất cả các bên, bao gồm cả Nami.Exchange.
                            </Paragraph>
                            <Paragraph>
                                <Strong>4. Các sửa đổi. </Strong>Nami.Exchange có quyền cập nhật, sửa đổi, chỉnh sửa, tạm ngừng hoặc thực hiện bất kỳ thay đổi
                                nào trong tương lai đối với Phần X liên quan đến Thỏa thuận Trọng tài của các bên, tuân theo luật hiện hành. Bạn đồng ý và đồng
                                ý rằng bạn có trách nhiệm đảm bảo rằng sự hiểu biết của bạn về Phần này được cập nhật. Theo luật hiện hành, việc bạn tiếp tục sử
                                dụng tài khoản Nami.Exchange sẽ được coi là bạn chấp nhận bất kỳ sửa đổi nào đối với Phần X liên quan đến Thỏa thuận Trọng tài
                                của các bên. Bạn đồng ý rằng nếu bạn phản đối các sửa đổi đối với Phần X, Nami.Exchange có thể chặn quyền truy cập vào tài khoản
                                của bạn trong khi tài khoản của bạn bị đáng. Trong những trường hợp như vậy, Điều khoản Sử dụng trước khi sửa đổi sẽ vẫn có hiệu
                                lực đầy đủ trong khi tài khoản của bạn bị đáng.
                            </Paragraph>
                            <Paragraph>
                                <Strong> Tính hiệu lực từng phần. </Strong>Nếu bất kỳ phần nào của các Điều khoản này được coi là không hợp lệ hoặc không thể
                                thi hành vì bất kỳ lý do gì hoặc ở bất kỳ mức độ nào, phần còn lại của các Điều khoản này sẽ vẫn có hiệu lực và có thể thi hành
                                được và phần không hợp lệ hoặc không thể thi hành sẽ có hiệu lực trong phạm vi cao nhất được pháp luật cho phép với tài khoản
                                đang chờ đáng của bạn.
                            </Paragraph>
                            <Title1>
                                <Strong>XI. Điều khoản khác</Strong>
                            </Title1>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <Strong> Các Bên độc lập.</Strong> Nami.Exchange là một nhà thầu độc lập nhưng không phải là đại lý của bạn trong việc thực
                                    hiện các Điều khoản này. Các Điều khoản này sẽ không được hiểu là sự kiện hoặc bằng chứng về sự liên kết, liên doanh, đối
                                    tác hoặc nhượng quyền thương mại giữa các bên.
                                </li>
                                <li>
                                    <Strong> Toàn bộ Thỏa thuận.</Strong> Các Điều khoản này cấu thành toàn bộ thỏa thuận giữa các bên về việc sử dụng Dịch vụ
                                    Nami.Exchange và sẽ thay thế tất cả các thỏa thuận bằng văn bản hoặc bằng miệng trước đó giữa các bên. Không sử dụng quy tắc
                                    thương mại hoặc thông lệ thông thường khác hoặc phương pháp giao dịch giữa các bên để sửa đổi, giải thích, bổ sung hoặc thay
                                    đổi các điều khoản ở đây.
                                </li>
                                <li>
                                    <Strong> Phiên dịch và sửa đổi. </Strong>Nami.Exchange có quyền thay đổi, điều chỉnh, sửa đổi và / hoặc thay đổi các Điều
                                    khoản này bất kỳ lúc nào. Tất cả các thay đổi sẽ có hiệu lực ngay lập tức khi được công bố trên trang web Nami.Exchange. Bạn
                                    có trách nhiệm thường xuyên kiểm tra các trang có liên quan trên các trang web / ứng dụng của chúng tôi để xác nhận phiên
                                    bản mới nhất của các Điều khoản này. Nếu bạn không đồng ý với bất kỳ sửa đổi nào như vậy, biện pháp khắc phục duy nhất của
                                    bạn là chấm dứt việc sử dụng Dịch vụ Nami.Exchange và hủy tài khoản của bạn. Bạn đồng ý rằng, trừ khi có quy định r&otilde;
                                    ràng khác trong các Điều khoản này, Nami.Exchange sẽ không chịu trách nhiệm về bất kỳ sửa đổi hoặc chấm dứt nào đối với Dịch
                                    vụ Nami.Exchange của bạn hoặc bất kỳ bên thứ ba nào, hoặc việc đình chỉ hoặc chấm dứt quyền truy cập của bạn vào Dịch vụ
                                    Nami.Exchange.
                                </li>
                                <li>
                                    <Strong> Trường hợp bất khả kháng.</Strong> Nami.Exchange sẽ không chịu trách nhiệm về bất kỳ sự chậm trễ hoặc không thực
                                    hiện theo yêu cầu của các Điều khoản này vì bất kỳ nguyên nhân hoặc điều kiện nào nằm ngoài khả năng kiểm soát hợp lý của
                                    Nami.Exchange.
                                </li>
                                <li>
                                    <Strong> Tính hiệu lực từng phần.</Strong> Nếu bất kỳ phần nào của các Điều khoản này không hợp lệ hoặc không thể thi hành,
                                    thì tính không hợp lệ hoặc khả năng thực thi đó sẽ không ảnh hưởng đến các điều khoản khác của các Điều khoản này, sẽ vẫn có
                                    hiệu lực đầy đủ và phần không hợp lệ hoặc không thể thi hành sẽ có hiệu lực ở mức độ cao nhất có thể .
                                </li>
                                <li>
                                    <Strong> Chuyển nhượng. </Strong>Bạn không được chuyển nhượng hoặc chuyển giao bất kỳ quyền nào để sử dụng Dịch vụ
                                    Nami.Exchange hoặc bất kỳ quyền hoặc nghĩa vụ nào của bạn theo các Điều khoản này mà không có sự đồng ý trước bằng văn bản
                                    từ Nami.Exchange, bao gồm bất kỳ quyền hoặc nghĩa vụ nào liên quan đến việc thực thi pháp luật hoặc thay đổi quyền kiểm
                                    soát. Nami.Exchange có thể chuyển nhượng hoặc chuyển giao bất kỳ hoặc tất cả các quyền hoặc nghĩa vụ của mình theo các Điều
                                    khoản này, toàn bộ hoặc một phần, mà không cần thông báo hoặc nhận được sự đồng ý hoặc chấp thuận của bạn.
                                </li>
                                <li>
                                    <Strong> Từ bỏ. </Strong>Việc một bên không yêu cầu thực hiện bất kỳ điều khoản nào sẽ không ảnh hưởng đến quyền yêu cầu
                                    thực hiện bất kỳ lúc nào sau đó của bên đó. Đồng thời, sự từ bỏ của một bên để tìm kiếm sự khắc phục đối với việc bên kia vi
                                    phạm các Điều khoản này hoặc bất kỳ điều khoản nào trong các điều khoản hiện hành sẽ không cấu thành sự từ bỏ của bên đó đối
                                    với bất kỳ vi phạm hoặc vi phạm nào tiếp theo của bên kia hoặc của chính điều khoản.
                                </li>
                                <li>
                                    <Strong> Tuyên bố từ chối trách nhiệm về trang web của bên thứ ba. </Strong>Bất kỳ liên kết nào đến các trang web của bên
                                    thứ ba từ Dịch vụ Nami.Exchange không ngụ ý chứng thực bởi Nami.Exchange đối với bất kỳ sản phẩm, dịch vụ, thông tin hoặc
                                    tuyên bố từ chối trách nhiệm nào được trình bày trong đó, Nami.Exchange cũng không đảm bảo tính chính xác của thông tin có
                                    trên chúng. Nếu bạn bị tổn thất do sử dụng sản phẩm và dịch vụ của bên thứ ba đó, Nami.Exchange sẽ không chịu trách nhiệm về
                                    tổn thất đó. Ngoài ra, vì Nami.Exchange không kiểm soát các điều khoản sử dụng hoặc chính sách bảo mật của các trang web bên
                                    thứ ba, bạn nên đọc và hiểu kỹ các chính sách đó.
                                </li>
                                <li>
                                    <Strong> Các vấn đề liên quan đến Apple Inc. </Strong>Nếu bạn sử dụng bất kỳ thiết bị nào do Apple Inc. sản xuất để tham gia
                                    vào bất kỳ hoạt động thương mại hoặc chương trình khen thưởng nào thông qua Nami.Exchange Services, các hoạt động và chương
                                    trình đó được cung cấp bởi Nami.Exchange và không liên kết với Apple Inc. trong bất cứ cách nào.
                                </li>
                                <li>
                                    <Strong> Thông tin liên hệ. </Strong>Để biết thêm thông tin về Nami.Exchange, bạn có thể tham khảo thông tin về doanh nghiệp
                                    được tìm thấy trên các trang web của Nami.Exchange. Nếu bạn có câu hỏi liên quan đến các Điều khoản này, vui lòng liên hệ
                                    với Nami.Exchange để được giải thích r&otilde; qua nhóm Hỗ trợ khách hàng của chúng tôi tại support@nami.exchange
                                </li>
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (width < WIDTH_MD) return <Content />;
    else
        return (
            <MaldivesLayout hideFooter={width < WIDTH_MD ? true : false} hideNavBar={width < WIDTH_MD ? true : false} dark={true}>
                <Content />
            </MaldivesLayout>
        );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['footer', 'navbar', 'common']))
    }
});
export default Terms;
