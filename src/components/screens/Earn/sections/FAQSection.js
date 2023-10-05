import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import CollapseV2 from 'components/common/V2/CollapseV2';
import classNames from 'classnames';
import { ChevronDown } from 'react-feather';
import Link from 'next/link';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';

const mockQuestions = [
    {
        question: 'Chương trình giới thiệu Referral là gì?',
        answer: 'Khoản vay crypto cũng có thể được sử dụng cho các chiến lược nâng cao như chênh lệch giá, chiến lược liên quan đến việc tìm kiếm một sàn mà bạn có thể vay với lãi suất thấp hơn và cho vay với lãi suất cao hơn trên một sàn khác.'
    },
    {
        question: 'Chương trình giới thiệu là gì? Khi nào tôi nhận được hoa hồng thường?',
        answer: 'Tết Congo á'
    },
    {
        question: 'Thế nào là người giới thiệu đủ điều kiện?',
        answer: 'Khi người giới thiệu ko thiếu điều kiện'
    },
    {
        question: 'Làm sao để đủ điều kiện nhận hoa hồng?',
        answer: 'Không thiếu điều kiện là được'
    }
];

const FAQSection = ({
    questions = mockQuestions
}) => {

    const [open, setOpen] = useState(-1);
    const { t, i18n: {
        language
    } } = useTranslation();

    const closeAll = () => {
        setOpen(-1);
    }

    return (
        <div className="mt-20">
            <h3 className="text-6xl text-center font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:faq')}</h3>

            <div className="h-10"></div>

            <div className="bg-bgContainer dark:bg-bgContainer-dark rounded-xl py-8 px-6 ">
                <div className="space-y-2">
                    {questions.map((question, idx) => {
                        const active = idx === open;
                        return (
                            <CollapseV2
                                key={idx}
                                className="w-full border-b border-divider dark:border-divider-dark py-4 last-of-type:border-none"
                                divLabelClassname="justify-between"
                                chevronDownClassName="w-6 h-6 text-txtPrimary dark:text-txtPrimary-dark"
                                chrevronStyled={{
                                    color: 'currentColor'
                                }}
                                active={active}
                                label={
                                    <span className="text-base">
                                        <span className="mr-1 pointer-events-none">{idx + 1}.</span>
                                        {question.question}
                                    </span>
                                }
                            >
                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-base">{question.answer}</div>
                            </CollapseV2>
                        );
                    })}
                </div>

                <HrefButton href="/support/faq" variants="blank" className='mx-auto text-center'>
                    {t('common:read_more')}
                </HrefButton>
            </div>
        </div>
    );
};

export default FAQSection;
