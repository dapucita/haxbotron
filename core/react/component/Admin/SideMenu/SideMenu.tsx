import React from 'react';
import MainboardSideMenu from './Mainboard.SideMenu';
import RoomListSideMenu from './RoomList.SideMenu';

interface menuProp {
    menuPath: string
}

export default function SideMenu({ menuPath }: menuProp) {
    switch(menuPath) {
        case "/admin": {
            return (
                <MainboardSideMenu />
            );
        }
        case "/admin/roomlist": {
            return (
                <RoomListSideMenu />
            );
        }
        case "/admin/newroom": {
            return (
                <RoomListSideMenu />
            );
        }
        case "/admin/serverinfo": {
            return (
                <MainboardSideMenu />
            );
        }
        default: {
            return (
                <MainboardSideMenu />
            );
        }
    }
}
