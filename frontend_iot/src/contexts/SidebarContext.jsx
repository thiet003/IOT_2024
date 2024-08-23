import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(localStorage.getItem('activeItem') || 'Dashboard');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const setActive = (item) => {
        setActiveItem(item);
        localStorage.setItem('activeItem', item);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, activeItem, setActive }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);