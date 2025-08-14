"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MessageSquare, Book, Settings, Image } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: Settings,
    },
    {
      title: "Carousel Images",
      path: "/admin/carousel",
      icon: Image,
    },
    {
      title: "Stories",
      path: "/admin/stories",
      icon: Book,
    },
    {
      title: "FAQs",
      path: "/admin/faqs",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="p-4 flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-primary">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-gray-500">Yallakafala</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      tooltip={item.title}
                    >
                      <Link href={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <div className="flex flex-col h-full">
              <header className="bg-white shadow">
                <div className="flex justify-between items-center px-6 py-4">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-2xl font-semibold text-gray-800">
                      Admin Dashboard
                    </h1>
                  </div>
                </div>
              </header>

              <main className="flex-1 p-6">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
