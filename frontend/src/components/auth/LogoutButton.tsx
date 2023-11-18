import { Button, useToast } from "@chakra-ui/react"
import { clearUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';
import { logOut } from "../../api/auth";
import { AxiosError } from "axios";

export default function LogoutButton() {
    const dispatch = useDispatch();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await logOut();
            dispatch(clearUser());
        } catch (err : any) {
            console.log(err)
            toast({
                title: 'Failed to logout',
                description: err.message,
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
