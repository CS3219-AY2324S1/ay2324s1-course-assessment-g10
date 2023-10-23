import { Button } from "@chakra-ui/react"
import { clearUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';
import { logOut } from "../../api/auth";

export default function LogoutButton() {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await logOut();
        dispatch(clearUser());
    }

    return (
        <Button variant="ghost" onClick={handleLogout}>
            Log out
        </Button>
    )
}
