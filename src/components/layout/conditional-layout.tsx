"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import React from 'react';

export default function ConditionalLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const pathname = usePathname();
    const noLayoutRoutes = ['/alink-pro'];

    if (noLayoutRoutes.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <div className="flex-grow flex flex-col">
                {children}
            </div>
            <Footer />
        </>
    )
}