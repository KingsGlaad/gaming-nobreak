"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CommandIcon,
} from "lucide-react";
import { NavMain } from "./nav-main";

const data = {
  user: {
    name: "Administrador",
    email: "admin@gamingnobreak.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Jovens",
      url: "/dashboard/jovens",
      icon: <UsersIcon />,
    },
    {
      title: "Líderes",
      url: "/dashboard/lideres",
      icon: <CommandIcon />,
    },
    {
      title: "Atividades",
      url: "/dashboard/atividades",
      icon: <ListIcon />,
    },
    {
      title: "Temporadas",
      url: "/dashboard/temporadas",
      icon: <ChartBarIcon />,
    },
    {
      title: "Regras de Pontuação",
      url: "/dashboard/regras",
      icon: <FolderIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Gaming Nobreak</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
