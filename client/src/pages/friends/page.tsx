import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Outlet } from "react-router";
import { usePageContext } from "./_context";
import { seprateBySpaces, strCaptalize } from "@/utils/formate-string";

export default function Page() {
  const ctx = usePageContext();
  return (
    <div>
      <Tabs defaultValue={ctx.activeTab} className="w-full">
        <TabsList>
          {ctx.friendChilds.map((child) => {
            return (
              <Link key={child} to={child.toLocaleLowerCase()}>
                <TabsTrigger value={child}>
                  {strCaptalize(seprateBySpaces(child))}
                </TabsTrigger>
              </Link>
            )
          })}
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  )
}
