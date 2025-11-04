import React from 'react'
import Footer from "../components/Footer.jsx";
import Login from "./Login/Login.module.css";
import {Link} from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import ErrorWarning from "../components/animations/ErrorWarning.jsx";


function AlreadyLoggedPage() {
    return(
        <div>
            <div className="flex flex-col items-center justify-center text-center min-h-100">
                <ErrorWarning />
                <h1 className={Login.helloText} style={{ padding: "15px" }}>
                    Jesteś już zalogowany!
                </h1>
                <Link to="/strona-glowna">
                    <div className="flex flex-row px-4 py-2 rounded-lg items-center justify-center text-center text-lg text-white no-underline bg-[linear-gradient(45deg,#000080,#800080)]">
                        <TbArrowBackUp  className="mr-2 animate-wiggle text-2xl" />
                        <p>Powrót na stronę główną</p>
                    </div>
                </Link>
            </div>

            <Footer/>
        </div>
    )
}

export default AlreadyLoggedPage