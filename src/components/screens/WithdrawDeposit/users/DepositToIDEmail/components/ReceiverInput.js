import InputV2 from 'components/common/V2/InputV2';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MAX_NOTE_LENGTH } from './DepositInputCard';
const ReceiverInput = React.memo(({ receiver, setReceiver }) => {
    const [receiverInput, setReceiverInput] = useState(receiver?.value || '');

    useEffect(() => {
        let timeout = setTimeout(() => setReceiver((prev) => ({ ...prev, value: receiverInput })), 200);
        return () => clearTimeout(timeout);
    }, [receiverInput]);

    const onChangeNoteHandler = (value) => {
        let noteValue = value;
        // prevent from paste
        if (value.length > MAX_NOTE_LENGTH) {
            noteValue = noteValue.slice(0, MAX_NOTE_LENGTH);
        }
        setReceiver((prev) => ({ ...prev, noteValue }));
    };

    return (
        <div>
            <div className="">
                <label htmlFor="namiid-email-input" className="text-txtSecondary dark:text-txtSecondary-dark inline-block text-sm mb-4">
                    Nami ID/Email
                </label>
                <Tabs tab={receiver.type === 'nami-id' ? 0 : 1} className="mb-4">
                    <TabItem className="" onClick={() => setReceiver((prev) => ({ ...prev, type: 'nami-id' }))} active={receiver.type === 'nami-id'}>
                        Nami ID
                    </TabItem>
                    <TabItem onClick={() => setReceiver((prev) => ({ ...prev, type: 'email' }))} active={receiver.type === 'email'}>
                        Email
                    </TabItem>
                </Tabs>
                <InputV2 id="namiid-email-input" placeholder="Nhập Nami ID" canPaste onChange={(value) => setReceiverInput(value)} value={receiverInput} />
            </div>
            <div className="">
                <label htmlFor="note-input" className="text-txtSecondary dark:text-txtSecondary-dark text-sm mb-2 inline-block">
                    Ghi chú
                </label>

                <InputV2
                    id="note-input"
                    placeholder="Nhập ghi chú"
                    showDividerSuffix={false}
                    suffix={
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                            {receiver.noteValue.length}/{MAX_NOTE_LENGTH}
                        </div>
                    }
                    onChange={onChangeNoteHandler}
                    value={receiver.noteValue}
                />
            </div>
        </div>
    );
});

export default ReceiverInput;

const Tabs = styled.div.attrs({
    className: 'relative flex items-center overflow-hidden border  dark:after:bg-dark-2 after:bg-gray-12 rounded-md border-divider dark:border-divider-dark '
})`
    &:after {
        content: '';
        position: absolute;

        z-index: 0;
        height: 100%;
        /* border-style: solid;
        border-width: 0 1px;
        border-color: inherit; */
        opacity: 50;
        transform: ${({ tab }) => `translateX(${tab * 100}%)`};
        width: 50%;
        transition: all 0.2s;
    }
`;

const TabItem = styled.div.attrs(({ active }) => ({
    className: ` first:border-r border-divider dark:border-divider-dark py-3 z-[1] w-1/2 flex items-center justify-center text-sm mb:text-base leading-6 hover:cursor-pointer ${
        active ? 'text-txtPrimary dark:text-txtPrimary-dark font-semibold' : 'text-txtSecondary dark:text-txtSecondary-dark'
    }`
}))``;
