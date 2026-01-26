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
              <TabsTrigger value={child} key={child}>
                <Link to={child.toLocaleLowerCase()}>
                  {strCaptalize(seprateBySpaces(child))}
                </Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  )
}
