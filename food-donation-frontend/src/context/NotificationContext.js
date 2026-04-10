// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

// const NotificationContext = createContext();

// export const useNotifications = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children, currentUser }) => {
//     const [notifications, setNotifications] = useState([]);
//     const [stompClient, setStompClient] = useState(null);
//     const [connected, setConnected] = useState(false);

//     const addNotification = useCallback((notification) => {
//         const id = Date.now();
//         const newNotif = { ...notification, id };
//         setNotifications(prev => [newNotif, ...prev]);

//         // Auto-remove after 5 seconds
//         setTimeout(() => {
//             setNotifications(prev => prev.filter(n => n.id !== id));
//         }, 5000);
//     }, []);

//     useEffect(() => {
//         if (currentUser && !stompClient) {
//             const socket = new SockJS('http://localhost:8080/ws');
//             const client = Stomp.over(socket);
            
//             // Disable logging for cleaner console
//             client.debug = null;

//             client.connect({}, () => {
//                 setConnected(true);
//                 setStompClient(client);

//                 // Private notifications for the logged-in user
//                 client.subscribe(`/user/${currentUser.userId}/queue/notifications`, (message) => {
//                     const notification = JSON.parse(message.body);
//                     addNotification(notification);
//                 });

//                 // Public broadcast notifications
//                 client.subscribe('/topic/public', (message) => {
//                     const notification = JSON.parse(message.body);
//                     addNotification(notification);
//                 });
//             }, (error) => {
//                 console.error('WebSocket connection error:', error);
//                 // Attempt to reconnect after 5 seconds
//                 setTimeout(() => setStompClient(null), 5000);
//             });

//             return () => {
//                 if (client) {
//                     client.disconnect();
//                 }
//             };
//         }
//     }, [currentUser, stompClient, addNotification]);

//     return (
//         <NotificationContext.Provider value={{ notifications, setNotifications }}>
//             {children}
//             <div className="notification-toast-container">
//                 {notifications.map(notif => (
//                     <div key={notif.id} className={`notification-toast ${notif.type || 'info'}`}>
//                         <div className="toast-header">
//                             <span className="toast-title">{notif.title}</span>
//                             <button className="toast-close" onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}>&times;</button>
//                         </div>
//                         <div className="toast-body">{notif.message}</div>
//                     </div>
//                 ))}
//             </div>
//         </NotificationContext.Provider>
//     );
// };
