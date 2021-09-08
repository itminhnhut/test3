import Image from 'next/image';
import defaults from 'lodash/defaults';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

const NotificationContent = (props) => {
    const { type, title, message } = props;
    return (
        <div className="flex items-center py-3 px-5 bg-white rounded-md notification-shadow w-full">
            <div className="mr-3">
                <Image src={`/images/icons/icon-${type}.svg`} width={32} height={32} />
            </div>
            <div className="flex flex-grow flex-col">
                <div>{title}</div>
                <div className="text-black-500 text-sm">{message}</div>
            </div>
        </div>
    );
};

const showNotification = (options = {}, position = 'top', container = 'top-right') => {
    const { title, message, type } = defaults(options, {
        title: 'Place order',
        message: '',
        type: 'success',
    });

    store.addNotification({
        title,
        message,
        type: 'success',
        insert: position,
        container,
        animationIn: ['animate__animated', 'animate__slideInRight', 'animate__faster'],
        animationOut: ['animate__animated', 'animate__slideOutRight', 'animate__faster'],
        dismiss: {
            duration: 30000,
            onScreen: false,
        },
        content: <NotificationContent title={title} message={message} type={type} />,
    });
};

export default showNotification;
