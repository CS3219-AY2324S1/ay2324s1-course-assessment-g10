import { Button } from "@chakra-ui/react"
import { clearUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';

export default function LogoutButton() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    }

    return (
        <Button variant="ghost" onClick={handleLogout}>
            Log out
        </Button>
    )
}
