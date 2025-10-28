import React from 'react'
import { NavLink } from 'react-router-dom'
import Flashcards from '../icons/Flashcards.jsx'
import Quiz from '../icons/Quiz.jsx'
import Quiz1 from '../icons/Quiz1.jsx'
import Translate from '../icons/Translate.jsx'
import Vocabulary from '../icons/Vocabulary.jsx'
import Grammar from '../icons/Grammar.jsx'
import Dialog from "../icons/Dialog.jsx";
import GapFill from "../icons/GapFill.jsx";
import Ai from "../icons/Ai.jsx";

function Sidebar() {
    return (
        <aside
            className="
                sticky top-[var(--header-height)]
                h-[calc(100vh-var(--header-height))]
                bg-white border-r border-gray-300
                transition-all duration-300 ease
                w-16 xl:w-[230px]
                px-2 xl:px-5 py-5
              "
        >
            <nav className="flex flex-col gap-3 items-center xl:items-start">
                {[
                    { to: '/fiszki',        color: '#f89919', label: 'Fiszki',       Icon: Flashcards },
                    { to: '/slownik',       color: '#12a9ff', label: 'Słownik',      Icon: Translate },
                    { to: '/quizy',         color: '#d50010', label: 'Quizy',        Icon: Quiz1 },
                    { to: '/slownictwo',    color: '#4dc416', label: 'Słownictwo',   Icon: Vocabulary },
                    { to: '/gramatyka',     color: '#cb16f3', label: 'Gramatyka',    Icon: Grammar },
                    // { to: '/gap-fill',      color: '#faee25', label: 'Gap Fill',     Icon: GapFill },
                    // { to: '/tlumaczenia',   color: '#1c274c', label: 'Tłumaczenia',  Icon: Dialog },
                    { to: '/cwiczenia-ai',  color: '#faee25', label: 'Ćwiczenia AI', Icon: Ai },
                ].map(({ to, color, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        style={{ '--underline-color': color }}
                        className="
                          relative flex items-center w-full
                          justify-center xl:justify-start
                          py-2 px-2 xl:px-5
                          text-[#333333] font-medium text-[1.2em] rounded
                          transition-all duration-300 ease-in-out
                          after:content-[''] after:absolute after:left-0 after:bottom-0
                          after:h-[3px] after:w-0 after:bg-[var(--underline-color)]
                          after:transition-[width] after:duration-500 after:ease-[ease]
                          hover:after:w-full active:after:w-full
                        "
                    >
                        <Icon className="w-6 h-6 flex-shrink-0 transition-all duration-300 ease-in-out" />
                        <span
                            className="
                            inline-block xl:ml-3
                            max-w-0 xl:max-w-[150px]
                            overflow-hidden whitespace-nowrap
                            transition-all duration-300 ease-in-out
                          "
                        >
              {label}
            </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
