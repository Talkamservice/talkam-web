import { useEffect } from 'react';
import Pusher from 'pusher-js'; // Import Pusher if you haven't

const Notifications = () => {

    const connectToPusher = () => {
        let pusherChannel; // Declare pusherChannel variable

        // Unsubscribe from the channel if it's already subscribed
        if (pusherChannel) {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        }

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            encrypted: true,
            authEndpoint: `${import.meta.env.VITE_BASE_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        });
        pusherChannel = pusher.subscribe('refresh-notification.' + currentUser?.id); // Assign pusherChannel
        pusherChannel.bind('refresh', (data) => {
            if (!document.visibilityState === 'hidden') {
                return;
            } else {
                showPushNotification(data);
            }
        });
        return () => {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        };
    };

    useEffect(() => {
        connectToPusher()
    }, []);

    const showPushNotification = (data) => {
        if (Notification.permission === 'granted') {
            new Notification(data.title, {
                body: data.message,
                icon: ''
            });
        }
    };

    const updateUIWithNotification = (data) => {
        // Update your app's notification UI
        console.log('Notification data:', data);
    };

    return (
        <div className='max-w-[300px] bg-red-500 p-8 rounded-lg'>
            <p>Some notification here</p>
        </div>
    );
};

export default Notifications;
