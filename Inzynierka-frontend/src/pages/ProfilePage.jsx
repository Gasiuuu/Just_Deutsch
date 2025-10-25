import React, { useState } from 'react'
import Navbar from "../components/Navbar.jsx";
import profileImg from "../assets/profileImg.jpg";
import Footer from "../components/Footer.jsx";
import UserStore from "../stores/UserStore.js";
import UserService from "../services/UserService.js";
import {MdOutlineSaveAlt} from "react-icons/md";

function ProfilePage() {

    const BACKEND_URL = import.meta.env.VITE_ENV_BACKEND_URL;
    const user = UserStore((state) => state.user)

    const [languageLevel, setLanguageLevel] = useState(user.language_level || 'a1');
    const [preference, setPreference] = useState(user.preferences || 'sport');

    const languageLevels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
    const preferences = [
        { value: 'sport', label: 'Sport' },
        { value: 'podroze', label: 'Podróże' },
        { value: 'motoryzacja', label: 'Motoryzacja' },
        { value: 'dom i ogrod', label: 'Dom i ogród' },
        { value: 'czlowiek', label: 'Człowiek' },
        { value: 'moda', label: 'Moda' },
        { value: 'zwierzeta', label: 'Zwierzęta' },
        { value: 'rosliny', label: 'Rośliny' },
        { value: 'zywnosc', label: 'Żywność' },
        { value: 'zawody', label: 'Zawody' },
    ];

    const handleSave = async () => {
        try {
            const data = {
                language_level: languageLevel,
                preferences: preference
            };
            console.log(data, user.id);
            await UserService.editUser(user.id, data);
            alert('Dane zostały zapisane!');
        } catch (error) {
            console.error('Błąd podczas zapisywania:', error);
            alert('Wystąpił błąd podczas zapisywania danych');
        }
    }

    return (
        <div className="relative">
            <header className="sticky top-0 w-full h-[var(--header-height)] z-[11]">
                <Navbar/>
            </header>
            <div className="pb-[120px]">
                <div className="relative w-full h-[630px] overflow-hidden bg-cover bg-no-repeat"
                     style={{
                         backgroundImage: `url(${profileImg})`,
                         backgroundSize: "1700px auto",
                         backgroundPosition: "-10px -230px"
                     }}>
                    <div
                        className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-transparent to-white pointer-events-none">
                    </div>
                </div>

                <div className="relative px-[300px] -mt-[300px] z-10">
                    <div className="flex flex-col bg-white rounded-xl px-12 py-8 items-center justify-center shadow-lg">
                        <div className="rounded-full w-45 h-45 bg-white -mt-35 flex items-center justify-center">
                            <img
                                src={`${BACKEND_URL}${user.avatar}`}
                                alt="avatar"
                                className="rounded-full w-40 h-40 object-cover"
                            />
                        </div>

                        <h3 className="font-semibold text-2xl p-3">{user.username}</h3>
                        <h4 className="mb-6">{user.first_name} {user.last_name}</h4>

                        <div className="w-full max-w-md space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Poziom języka
                                </label>
                                <select
                                    value={languageLevel}
                                    onChange={(e) => setLanguageLevel(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {languageLevels.map(level => (
                                        <option key={level} value={level}>
                                            {level.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Zainteresowania
                                </label>
                                <select
                                    value={preference}
                                    onChange={(e) => setPreference(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {preferences.map(pref => (
                                        <option key={pref.value} value={pref.value}>
                                            {pref.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center w-full bg-blue-500 text-white font-semibold gap-2 py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors mt-6"
                            >
                                <MdOutlineSaveAlt/> Zapisz
                            </button>
                        </div>

                    </div>
                </div>


            </div>
            <Footer/>
        </div>

    )
}

export default ProfilePage