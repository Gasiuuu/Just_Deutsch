import {useEffect, useState} from 'react';
import login from './Login.module.css';
import logo from '../../assets/logo.png';
import { FaLocationDot } from "react-icons/fa6";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import loginForm from "./LoginForm.module.css";
import UserService from "../../services/UserService.js";
import {Link, useNavigate} from "react-router-dom";
import UserStore from "../../stores/UserStore.js";

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setUser = UserStore((state) => state.setUser);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(username, password);
            console.log(userData.user);
            setUser(userData.user);
            navigate('/strona-glowna')
        } catch(error) {
            setError(error);
        }
        console.log("Nazwa użytkownika:", username, "Password:", password);
    };

    return (
        <div className={login.loginContainer}>
            <div className={login.leftSide}>
                <Link to="/start">
                    <div className={login.logoContainer}>
                        <img src={logo} className={login.logoImg} alt="logo"/>
                        <h1 className={login.logo}>Just_deutsch</h1>
                    </div>
                </Link>

                <h2 className={login.location}><FaLocationDot className="mr-3"/> Ramsau bei Berchtesgaden, Bayern </h2>

            </div>
            <div className={login.rightSide}>
                <h1 className={login.helloText}>Witaj ponownie!</h1>
                <form onSubmit={handleSubmit} className={loginForm.loginFormContainer}>
                    <div className={loginForm.labelContainer}>
                        <label className={loginForm.loginLabel} htmlFor="username">Nazwa użytkownika:</label>
                        <input
                            className={loginForm.loginInput}
                            type="username"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={loginForm.loginLabel} htmlFor="password">Hasło:</label>
                        <input
                            className={loginForm.loginInput}
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className={loginForm.forgotPassword}><span className={loginForm.blue}>Zapomniałeś hasła?</span></p>
                    <button className={loginForm.submitBtn} type="submit">Zaloguj się</button>
                    <button className={loginForm.googleBtn}><FcGoogle className={loginForm.loginTypeIcons} /> Kontynuuj z Google</button>
                    <button className={loginForm.appleBtn}><FaApple className={loginForm.loginTypeIcons} /> Kontynuuj z Apple ID</button>

                    <p className={loginForm.register}>Nie masz konta?<Link to="/rejestracja"> <span className={loginForm.blue}>Zarejestruj się</span></Link>
                    </p>
                </form>

            </div>
        </div>
    )


}

export default Login;