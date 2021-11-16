import 'animate.css/animate.min.css';
import defaults from 'lodash/defaults';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const NotificationContent = (props) => {
    const { type, title, message } = props;

    // console.log('__ chek noti', props);
    let bgColor = 'bg-dominant';
    if (type !== 'success') {
        bgColor = 'bg-red';
    }
    return (
        <div className={`flex items-center py-3 px-5 w-full ${bgColor}`}>
            <div className="flex flex-grow flex-col">
                <div className="text-white font-semibold">{title}</div>
                <div className="text-white text-sm">{message}</div>
            </div>
        </div>
    );
};

const showNotification = (options = {}, dismiss = undefined, position = 'top', container = 'top-right') => {
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
            duration: dismiss || 5000,
            onScreen: false,
        },
        content: <NotificationContent title={title} message={message} type={type} />
    });
};

export default showNotification;
