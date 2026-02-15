import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { Link } from "react-router";

export default function Page() {
  return (
    <div className="size-full flex justify-center items-center">
      <div className="flex gap-2">
        <Link to={"/me/friends"}>
          <Card className="w-fit">
            <CardContent className="flex justify-center">
              <Users size={42} />
            </CardContent>
            <CardFooter>Friends</CardFooter>
          </Card>
        </Link>
        <Link to={"/me/profile"}>
          <Card className="w-fit">
            <CardContent className="flex justify-center">
              <User size={42} />
            </CardContent>
            <CardFooter>Profile</CardFooter>
          </Card>
        </Link>
        <Card className="w-fit">
          <CardContent className="flex justify-center">
            <Users size={42} />
          </CardContent>
          <CardFooter>Friends</CardFooter>
        </Card>
      </div>
    </div>
  );
}
