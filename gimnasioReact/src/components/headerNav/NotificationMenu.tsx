import { useState, useEffect } from "react";
import React from "react";
//icons
import { RiNotification3Line, RiCloseLine, RiInformationLine, RiCheckLine, RiInboxLine } from 'react-icons/ri';
//Enlaces
import { Link } from "react-router-dom";
//react-menu
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
//Notificaciones
import { getMemberNotifications } from "../../api/action/notifications.api";
//Models
import { Notification } from "../../model/notifications.model";


const NotificationMenu = () => {
    //notificaciones
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getMemberNotifications();
            setNotifications(data);
            setCount(data.length);
        };
        fetchNotifications();

        //Actualizar cada 5 minutos
        const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    //Marcar todas como leídas
    const markAllAsRead = () => {
        setCount(0);
    };

    //Obtener icono según el tipo de notificación
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'warning':
                return <RiInformationLine className="p-2 bg-yellow-100 text-yellow-500 box-content rounded-full" />;
            case 'danger':
                return <RiCloseLine className="p-2 bg-red-100 text-red-500 box-content rounded-full" />;
            case 'success':
                return <RiCheckLine className="p-2 bg-green-100 text-green-500 box-content rounded-full" />;
            default:
                return <RiInformationLine className="p-2 bg-blue-100 text-blue-500 box-content rounded-full" />;
        }
    };

    return (
    <Menu>
        <MenuButton className="relative hover:bg-slate-700 p-2 rounded-lg transition-colors">
            <RiNotification3Line className="text-2xl" />
            {count > 0 && (
            <span className="absolute -top-0.5 right-0 bg-sky-500 py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">
                {count}
            </span>
            )}
        </MenuButton> 
        <MenuItems anchor='bottom end' className='bg-secondary mt-1 p-4 rounded-lg max-h-[70vh] overflow-y-auto w-80'>
            <div className="flex justify-between items-center mb-2">
            <h1 className="text-dark font-medium">Notificaciones</h1>
            {count > 0 && (
                <button 
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:underline"
                >
                Marcar como leídas
                </button>
            )}
            </div>
            <hr className="my-3 border-gray-500" />
            {notifications.length === 0 ? (
            <div className="text-center py-4">
                <RiInboxLine className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500">No hay notificaciones</p>
            </div>
            ) : (
            notifications.map((notification, index) => (
                <React.Fragment key={index}>
                <MenuItem as='div' className='p-0 hover:bg-slate-200'>
                    <Link 
                        to={notification.link}
                        className="flex flex-1 items-start gap-x-3 py-2 px-4 hover:bg-slate-200 transition-colors rounded-lg text-dark"
                    >
                    {getNotificationIcon(notification.type)}
                    <div className="text-sm flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="font-medium">{notification.title}</span>
                            <span className="text-xs text-gray-500">{notification.date}</span>
                        </div>
                        <p className="text-dark mt-1">{notification.message}</p>
                    </div>
                    </Link>
                </MenuItem>
                {index < notifications.length - 1 && <hr className="my-3 border-gray-300" />}
                </React.Fragment>
            ))
            )}
            <hr className="my-3 border-gray-300" />
            <MenuItem as='div' className='p-0 hover:bg-slate-200 flex justify-center cursor-default'>
            <Link 
                to="/notifications" 
                className="text-dark text-sm hover:text-sky-700 transition-colors font-medium"
            >
                Ver todas las notificaciones
            </Link>
            </MenuItem>
        </MenuItems>                   
    </Menu>
  );
}
export default NotificationMenu;