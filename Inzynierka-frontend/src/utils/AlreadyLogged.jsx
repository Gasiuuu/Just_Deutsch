import { Outlet, Navigate } from "react-router-dom"
import UserStore from "../stores/UserStore.js";

const AlreadyLogged = () => {

    const user = UserStore(state => state.user);
    return user ? <Navigate to="/juz-zalogowany" /> : <Outlet />
}

export default AlreadyLogged