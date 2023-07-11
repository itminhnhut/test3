import OneSignal from 'react-onesignal';

export default async function initOneSignal() {
    const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID
    if(!ONE_SIGNAL_APP_ID) return
    await OneSignal.init({ appId: process.env.ONE_SIGNAL_APP_ID, allowLocalhostAsSecureOrigin: true });
    OneSignal.showSlidedownPrompt();
    OneSignal.addListenerForNotificationOpened(data => {
        console.log(data)
    })
}