import { Trans } from 'next-i18next';

import { getLoginUrl, getS3Url } from 'redux/actions/utils';

const NotAuth = () => {
    return (
        <div className="rounded-xl h-full py-[110px] w-full bg-white dark:bg-bgContainer-dark flex items-center justify-center">
            <div>
                <div className="flex justify-center mb-3">
                    <img className="max-h-[124px]" src={getS3Url('/images/icon/ic_login.png')} />
                </div>
                <div className=" text-txtSecondary dark:text-txtSecondary-dark text-center">
                    <Trans
                        i18nKey="common:no_auth"
                        components={[
                            <a
                                className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold"
                                href={getLoginUrl('sso', 'register')}
                            />,
                            <a
                                className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold"
                                href={getLoginUrl('sso')}
                            />
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotAuth;
