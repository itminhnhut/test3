import React, { useState } from 'react';
import Container from '../components/common/Container';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const PartnerWD = () => {
    const [selected, setSelected] = useState(1);
    return (
        <Container className="max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl my-20">
            <Tabs tab={selected} className="gap-6 border-b border-divider dark:border-divider-dark">
                {[...Array(6).keys()].map((item) => (
                    <TabItem
                        isActive={item === selected}
                        key={item}
                        className={`text-left !px-0 !text-base !w-auto first:ml-4 md:first:ml-0`}
                        value={item}
                        onClick={() => {
                            setSelected(item);
                        }}
                    >
                        Item {item}
                    </TabItem>
                ))}
            </Tabs>
        </Container>
    );
};

export default PartnerWD;
