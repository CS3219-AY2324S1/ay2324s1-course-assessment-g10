import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../reducers/authSlice"
import LogoutButton from "./auth/LogoutButton";

export default function NavigationBar() {

    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (
    <div className="navbar">
        <div className="title">Peer Prep</div>
        { isAuthenticated ? <LogoutButton/> : (<div/>) }
    </div>)
}
