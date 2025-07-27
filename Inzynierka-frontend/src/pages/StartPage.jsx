import React, { useEffect, useRef } from 'react'
import Footer from "../components/Footer.jsx";
import startImage from '../assets/start-background.jpg';
import landImg from '../assets/DACH-lands.png';
import Navbar from "../components/Navbar.jsx";
import logo from "../assets/logo.png";
import StartPageProd from "../components/animations/StartPageProd.jsx";
import {Link} from "react-router-dom";
import Cv from "../components/animations/Cv.jsx";


function StartPage() {

    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting) {
                entry.target.classList.add("animate-slideInFromRight");
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.7,
            }
        )

        if(imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => {observer.disconnect()};

    }, [])

    const headerText = "font-bold text-[54px] bg-gradient-to-br from-[#000080] to-[#800080] bg-clip-text text-transparent text-center"
    const descText = "font-normal text-[26px] text-black mt-10 ml-10"

    return (
        <div className="relative">
            <header className="sticky top-0 w-full h-[var(--header-height)] z-[11]">
                <Navbar/>
            </header>
            <div className="px-40 pb-[120px]">
                <div className="relative w-full h-[630px] overflow-hidden bg-cover bg-no-repeat"
                     style={{
                         backgroundImage: `url(${startImage})`,
                         backgroundSize: "1700px auto",
                         backgroundPosition: "-10px -230px"
                     }}>
                    <div
                        className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-transparent to-white pointer-events-none">
                    </div>

                    <div>
                        <div className="flex flex-row p-10 animate-fadeIn">
                            <img src={logo} className="w-20 h-20" alt="logo"/>
                            <h1 className="text-white font-bold italic ml-8 mt-2 text-[48px]">Just_deutsch</h1>
                        </div>

                        <div>
                            <p className="text-white font-medium text-[42px] ml-10 w-140 animate-slideInFromLeft opacity-0">Tu
                                rozpoczyna się Twoja podróż po świecie
                                języka niemieckiego</p>
                        </div>

                        <Link to="/rejestracja">
                            <button
                                className="block ml-10 px-10 py-5 mt-25 text-white rounded-2xl text-4xl font-medium cursor-pointer no-underline bg-[linear-gradient(45deg,#000080,#800080)] opacity-0 animate-slideInFromLeft">
                                DOŁĄCZ JUŻ TERAZ
                            </button>
                        </Link>
                    </div>

                </div>

                <div className="flex flex-row mt-20">
                    <StartPageProd className="w-1/4"/>

                    <div className="flex flex-col mt-15 w-3/4">
                        <h1 className={headerText}>Wnieś swój niemiecki na nowy poziom</h1>
                        <p className={descText}>Rozwijaj znajomość języka niemieckiego dzięki prezyzyjnie dobranym
                            zestawom
                            słownictwa, które szybko wprowadzą Cię w codzienne i zawodowe konteksty. Połączysz to z
                            jasnymi, praktycznymi wyjaśnieniami reguł gramatycznych, dzięki czemu zyskasz pewność siebie
                            już od pierwszych lekcji. </p>
                    </div>
                </div>

                <div className="flex flex-row mt-30">

                    <div className="flex flex-col mt-15 w-3/4">
                        <h1 className={headerText}>Otwórz się na nowe możliwości</h1>
                        <p className={descText}>Znajomość języka niemieckiego otwiera przed Tobą drzwi do dynamicznego
                            rynku pracy w Niemczech, Austrii czy Szwajcarii. Dodatkowo zyskujesz pełny dostęp do bogatej
                            kultury, nauki na prestiżowych uczelniach i swobodę ogólnej komunikacji w krajach
                            niemieckojęzycznych.</p>
                    </div>
                    <img ref={imgRef} src={landImg} className="w-90 h-98 ml-40 mt-30 opacity-0" alt="landImg"/>

                </div>

                <div className="flex flex-row mt-30">

                    <Cv className="w-1/4"/>

                    <div className="flex flex-col mt-15 w-3/4">
                        <h1 className={headerText}>Ulepsz swoje CV</h1>
                        <p className={descText}>Znajomość języka niemieckiego w CV wyróżnia Cię na tle innych kandydatów, zwiększając atrakcyjność oferty w oczach międzynarodowych pracodawców. Pokazuje też Twoją gotowość do rozwoju oraz umiejętność komunikacji w wielokulturowym środowisku biznesowym.</p>
                    </div>

                </div>

                <Link to="/rejestracja">
                    <button
                        className="block mx-auto px-15 py-8 mt-30 mb-30 items-center justify-center text-white rounded-2xl text-4xl font-medium cursor-pointer no-underline bg-[linear-gradient(45deg,#000080,#800080)]">
                        DOŁĄCZ JUŻ TERAZ
                    </button>
                </Link>

            </div>
            <Footer/>
        </div>

    )
}

export default StartPage;