import { Outlet } from "react-router";
import AuthGaurd from "./providers/auth-gaurd";
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import GlobalContextProvider from "./providers/global";
import { PathNameBreadcrumb } from "./components/pathname-breadcrumb";

export default function App() {
  return (
    <>
      <GlobalContextProvider>
        <AuthGaurd>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />

                  <PathNameBreadcrumb />
                </div>
              </header>

              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </AuthGaurd>
      </GlobalContextProvider>
    </>
  );
}
