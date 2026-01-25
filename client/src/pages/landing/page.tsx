import { Link } from "react-router";
import style from "./style";

export default function Page() {
  return (
    <div className={style.page}>
      <div>
        <h1>Landing Page</h1>
        <Link to="/home">Get Started</Link>
      </div>
    </div>
  );
}
