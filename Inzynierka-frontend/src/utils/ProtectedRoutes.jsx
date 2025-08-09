import { Outlet, Navigate } from "react-router-dom"
import UserStore from "../stores/UserStore.js";

const ProtectedRoutes = () => {

    const user = UserStore(state => state.user);
    return user ? <Outlet /> : <Navigate to="/logowanie" />
}

export default ProtectedRoutes