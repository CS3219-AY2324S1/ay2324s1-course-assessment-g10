import { Button, useToast } from "@chakra-ui/react"
import { clearUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';
import { logOut } from "../../api/auth";

export default function LogoutButton() {
    const dispatch = useDispatch();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            const response = await logOut();
            dispatch(clearUser());
        } catch (err : any) {
            toast({
                title: 'Failed to logout',
                description: err.msg,
                status: 'error'
            })
        }
    }

    return (
        <Button variant="ghost" onClick={handleLogout}>
            Log out
        </Button>
    )
}
