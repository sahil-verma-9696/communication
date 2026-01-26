"use client";

import * as React from "react";
import { Command, LifeBuoy, Send } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGlobalContext } from "@/contexts/global.context";
import { Link } from "react-router";
import { APP_NAME } from "@/app.constatns";

const data = {
  navMain: [],
  navSecondary: [
    {
      title: "Friends",
      url: "/friends",
      icon: Command,
    },
    {
      title: "Support",
      url: "https://github.com/sahil-verma-9696/communication/issues",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "https://github.com/sahil-verma-9696/communication/issues",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const ctx = useGlobalContext();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{APP_NAME}</span>
                  <span className="truncate text-xs">Project</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={ctx.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
