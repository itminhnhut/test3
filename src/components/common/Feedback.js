import { GoogleSpreadsheet } from 'google-spreadsheet';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthSelector from 'src/redux/selectors/authSelectors';
import { Popover } from '@headlessui/react';
import { Trans, useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import showNotification from 'utils/notificationService';
import { formatTime } from 'src/redux/actions/utils';

const SPREADSHEET_ID = process.env.NEXT_FEEDBACK_SPREADSHEET_ID;
const SHEET_ID = process.env.NEXT_FEEDBACK_SHEET_ID;
const CLIENT_EMAIL = process.env.NEXT_FEEDBACK_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.NEXT_FEEDBACK_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const Feedback = () => {
    const { t, i18n } = useTranslation();
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useSelector(AuthSelector.userSelector);
    const buttonFeedback = useRef();
    const onClickSend = async () => {
        if (!feedback) return;
        const newRow = {
            Name: user?.name || '',
            Phone: user?.phone || '',
            Email: user?.email || '',
            Feedback: feedback || '',
            Url: (window && window.location.href) || '',
            Date: formatTime(new Date(), 'HH:mm dd/MM/yyyy') || '',
        };
        try {
            setLoading(true);
            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            });
            // loads document properties and worksheets
            await doc.loadInfo();

            const sheet = doc.sheetsById[SHEET_ID];
            const result = await sheet.addRow(newRow);
            setFeedback('');
            buttonFeedback?.current?.click();
            showNotification({ message: t('common:feedback_sent_success'), title: t('common:success'), type: 'success' });
        } catch (e) {
            showNotification({ message: t('common:feedback_sent_failed'), title: t('common:failure'), type: 'warning' });
        } finally {
            setLoading(false);
        }
    };
    const onClickReset = () => {
        setFeedback('');
    };

    return (
        <Popover className="relative">
            <Popover.Button
                type="button"
                className="inline-flex items-center focus:outline-none group"
                aria-expanded="false"
                ref={buttonFeedback}
            >
                <span className="mr-1.5 text-black-500 group-hover:text-black">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.80517 12.9994C8.67016 12.9997 8.54834 12.9185 8.49665 12.7937C8.44495 12.669 8.47359 12.5254 8.56917 12.4301L10.6098 10.3881C6.4445 8.19944 1.33317 8.19944 1.33317 12.9994C1.33317 5.8061 7.6405 4.3601 14.4918 6.4921L16.0985 4.89544C16.1941 4.80063 16.3374 4.77269 16.4617 4.82461C16.5859 4.87653 16.6667 4.99811 16.6665 5.13277V12.6661C16.6665 12.8502 16.5173 12.9994 16.3332 12.9994H8.80517Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </span>
                <span
                    className="text-sm text-black-500 font-semibold leading-none group-hover:text-black"
                >{t('common:feedback_send')}
                </span>

            </Popover.Button>
            <Popover.Panel
            // static
                className="absolute z-10 transform w-screen max-w-[320px] rounded-md border border-black-200 right-0 bg-white shadow-lg"
            >
                <div className="pt-5 px-6 pb-6">
                    <div className="text-sm mb-4 text-black-600">
                        {t('common:feedback_desc')}
                    </div>
                    <div className="form-group !mb-4 relative">
                        <textarea
                            name=""
                            id=""
                            rows="20"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="form-control focus:outline-none focus:ring-0 resize-y border !border-black-200 rounded-md focus:!border-violet min-h-[150px] max-h-[300px]"
                            placeholder={t('common:feedback_placeholder')}
                        />
                        <button
                            className="btn btn-icon bg-green !rounded-full absolute right-2 bottom-2 transform rotate-180"
                            type="button"
                            onClick={onClickReset}
                        >
                            <FontAwesomeIcon icon={faUndo} color="#ffffff" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <button
                            className="btn btn-primary btn-xs w-full"
                            type="button"
                            disabled={loading}
                            onClick={onClickSend}
                        >
                            {t('common:send')}
                        </button>
                    </div>
                    <div className="text-xs text-black-600">
                        <Trans i18nKey="common:feedback_send_contact" t={t}>
                            Nếu bạn có những câu hỏi khác? Vui lòng liên hệ với chúng tôi qua số hotline: 1900888666 hoặc <a href="https://support.attlas.io" target="_blank" rel="noreferrer" className="text-violet font-medium">những câu hỏi thường gặp</a>.
                        </Trans>

                    </div>
                </div>

            </Popover.Panel>
        </Popover>
    );
};

export default Feedback;
