import { Link } from "react-router";
import style from "./style";
import { useAuthContext } from "@/contexts/auth.contex";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className={style.page}>
      <div>
        {isAuthenticated ? (
          <Link to="/me/home">
            <Button className="cursor-pointer">Open Communication</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
