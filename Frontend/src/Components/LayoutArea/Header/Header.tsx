import { UserMenu } from "../../UserArea/UserMenu/UserMenu";
import "./Header.css";

export function Header() {
    return (
        <div className="Header">
            <h1>TravelOS</h1>
            <UserMenu />
        </div>
    );
}
