import { faFacebookF, faTelegram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox, Transition } from '@headlessui/react';
import { iconColorPrimary } from 'config/colors';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { IconArrowDown } from './Icons';

const Footer = () => {
    const { t } = useTranslation('footer');
    const router = useRouter();
    const { route, locale } = router;
    return useMemo(() => (
        <footer>
            <div className="flex items-center justify-center bg-black-50 text-[#83859E] text-xs py-3">
                Copyright © 2021 Nami. All rights reserved.
            </div>
        </footer>
    ), [],
    );
};

export default Footer;
