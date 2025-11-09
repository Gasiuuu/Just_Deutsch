import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import backgroundImage from '../assets/register-background.jpg';
import logo from "../assets/logo.png";
import { LevelIcons } from '../icons/LevelIcons';
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidErrorCircle } from "react-icons/bi";
import { FaFutbol, FaCarAlt, FaHome, FaUser } from "react-icons/fa";
import { MdWork, MdFlight, MdCheckroom, MdPets, MdLocalFlorist, MdRestaurant } from 'react-icons/md';

function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [animating, setAnimating] = useState(true);
    const [preferences, setPreferences] = useState([])
    const [selectedPreferences, setSelectedPreferences] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: '',
        languageLevel: '',
        preference_ids: []
    });

    useEffect(() => {
        getPreferences()
    }, [])

    const getPreferences = async () => {
        try {
            const response = await UserService.getPreferences()
            setPreferences(response)
            console.log("Pomyślnie wczytano preferencje: ", response)
        } catch (e) {
            console.error("Wystąpił błąd w pobieraniu preferencji: ", e)
        }
    }

    const getPreferenceIcon = (value) => {
        const iconMap = {
            'Sport': { Icon: FaFutbol, color: '#4066FF' },
            'Podróże': { Icon: MdFlight, color: '#49F59F' },
            'Motoryzacja': { Icon: FaCarAlt, color: '#F24141' },
            'Dom i ogród': { Icon: FaHome, color: '#F28241' },
            'Człowiek': { Icon: FaUser, color: '#E5FF4F' },
            'Moda': { Icon: MdCheckroom, color: '#F241EF' },
            'Zwierzęta': { Icon: MdPets, color: '#91400F' },
            'Rośliny': { Icon: MdLocalFlorist, color: '#23DB00' },
            'Żywność': { Icon: MdRestaurant, color: '#8645FF' },
            'Zawody': { Icon: MdWork, color: '#023047' },
        };

        const { Icon, color } = iconMap[value]

        return <Icon size={28} style={{ color }} />;
    };


    const togglePreference = (id) => {
        setSelectedPreferences(prev => {
            if (prev.includes(id)) {
                return prev.filter(prefId => prefId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const languageDescriptions = {
        a1: 'Osoba rozumie i używa bardzo prostych wyrażeń, zadaje proste pytania   ',
        a2: 'Osoba potrafi porozumieć się w prostych, codziennych sytuacjach',
        b1: 'Osoba rozumie sedno wypowiedzi, potrafi opisać doświadczenia i zdarzenia',
        b2: 'Osoba rozumie sedno złożonych tekstów, swobodnie uczestniczy w dyskusjach',
        c1: 'Osoba bez trudu rozmawia na wszelkie tematy, rozumie głębokie i ukryte znaczenia rozbudowanych tekstów',
        c2: 'Osoba posługuje się językiem płynnie, spontanicznie i precyzyjnie, rozumie praktycznie wszystko'
    };

    const inputClasses =
        "w-full p-[10px] text-[14px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mb-4";

    const containerWidthClass = step === 1 ? 'max-w-md' : 'max-w-2xl';

    const headers = {
        1: "Podaj swoje dane",
        2: "Wybierz swój poziom językowy",
        3: "Wybierz swoje preferencje"
    }
    const header = headers[step]

    const changeStep = (newStep) => {
        setAnimating(false);
        setTimeout(() => {
            setStep(newStep);
            setAnimating(true);
        }, 500)
    };
    const nextStep = () => changeStep(Math.min(step + 1, 3))
    const prevStep = () => changeStep(Math.max(step - 1, 1))

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError(true);
            return;
        }

        console.log("Selected preferences:", selectedPreferences)

        const payload = {
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            language_level: formData.languageLevel,
            preference_ids: selectedPreferences
        }

        try {
            await UserService.register(payload);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error registering user: ', error);
            setShowError(true);
        }
    };

    return (
        <>
            <div
                className="min-h-screen w-full bg-fixed bg-center bg-cover overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="flex items-start justify-center pt-7">
                    <div
                        className={`
                          bg-white/40 backdrop-blur-xl rounded-xl p-8 shadow-lg
                          ${containerWidthClass} w-full pb-5
                          transition-width duration-800 ease-in-out
                        `}
                    >
                        <div className="flex flex-col items-center mb-6">
                            <img src={logo} className="w-10 h-10 mb-2" alt="logo"/>
                            <div className={`
                                transition-opacity duration-500 ease-in-out
                                ${animating ? 'opacity-100' : 'opacity-0'}
                              `}
                            >
                                <h1 className="text-gray-800 text-2xl font-semibold text-center">
                                    {header}
                                </h1>
                            </div>
                        </div>

                        <div className={`
                                transition-opacity duration-500 ease-in-out
                                ${animating ? 'opacity-100' : 'opacity-0'}
                              `}
                        >
                            <form onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <>
                                        <div className="form-group">
                                            <label className="text-gray-800">Imię</label>
                                            <input
                                                type="text"
                                                className={inputClasses}
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-gray-800">Nazwisko</label>
                                            <input
                                                type="text"
                                                className={inputClasses}
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-gray-800">Nazwa użytkownika</label>
                                            <input
                                                type="text"
                                                className={inputClasses}
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-gray-800">Email</label>
                                            <input
                                                type="email"
                                                className={inputClasses}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-gray-800">Hasło</label>
                                            <input
                                                type="password"
                                                className={inputClasses}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-gray-800">Powtórz hasło</label>
                                            <input
                                                type="password"
                                                className={inputClasses}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <div className="form-group">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].map(level => (
                                                <label
                                                    key={level}
                                                    className={`
                                                cursor-pointer 
                                                aspect-square                                                
                                                p-4 
                                                border 
                                                rounded-lg 
                                                transition-all duration-400 ease-in-out
                                                flex 
                                                flex-col 
                                                justify-center 
                                                items-center 
                                                text-center
                                                ${formData.languageLevel === level ? 'bg-gray-600 text-white border-gray-600' : 'bg-transparent text-white hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)]'}
                                            `}
                                                >

                                                    <input
                                                        type="radio"
                                                        name="languageLevel"
                                                        value={level}
                                                        className="hidden"
                                                        checked={formData.languageLevel === level}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                    <div className="flex flex-row items-center mb-2">
                                                        <LevelIcons level={level.toUpperCase()} width={40}
                                                                    height={40}/>
                                                        <span
                                                            className="font-semibold text-2xl ml-2">{level.toUpperCase()}</span>
                                                    </div>
                                                    <span
                                                        className="text-s md:text-xs">{languageDescriptions[level]}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-4 text-gray-700 text-center">
                                            Zainteresowania (możesz wybrać więcej niż jedno)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                                            {preferences.map(pref => (
                                                <button
                                                    key={pref.id}
                                                    type="button"
                                                    onClick={() => togglePreference(pref.id)}
                                                    className={`px-4 py-3 rounded-lg border-2 text-lg transition-all duration-400 ease-in-out flex items-center gap-2 ${
                                                        selectedPreferences.includes(pref.id)
                                                            ? 'bg-gray-600 text-white border-gray-600'
                                                            : 'bg-transparent text-white hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)]'
                                                    }`}
                                                >
                                                    {getPreferenceIcon(pref.label, selectedPreferences.includes(pref.id))}
                                                    <span>{pref.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between mt-6">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                                        >
                                            Wstecz
                                        </button>
                                    )}

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        >
                                            Dalej
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="ml-auto px-4 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white border-none rounded-[20px] cursor-pointer transition-[background-position] duration-[600ms] ease-in-out hover:bg-[position:right_center]"
                                        >
                                            Zarejestruj się
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {passwordError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-none bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center animate-fade-in-scale">
                        <div className="flex flex-row justify-center">
                            <BiSolidErrorCircle className="h-8 w-8 mr-1 text-yellow-500" />
                            <h2 className="text-2xl font-semibold mb-2">Błąd</h2>
                        </div>

                        <p className="mb-6">Hasło i Powtórz hasło muszą być identyczne</p>
                        <button
                            onClick={() => setPasswordError(false)}
                            className="ml-auto px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white border-none rounded-[10px] cursor-pointer transition-[background-position] duration-[600ms] ease-in-out hover:bg-[position:right_center]"
                        >
                            Wróć
                        </button>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-none bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center animate-fade-in-scale">
                        <div className="flex flex-row justify-center">
                            <FaCheckCircle className="h-8 w-8 mr-1 text-green-500"/>
                            <h2 className="text-2xl font-semibold mb-2">Sukces!</h2>
                        </div>

                        <p className="mb-6">Rejestracja przebiegła pomyślnie</p>
                        <button
                            onClick={() => navigate('/strona-glowna')}
                            className="ml-auto px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white border-none rounded-[10px] cursor-pointer transition-[background-position] duration-[600ms] ease-in-out hover:bg-[position:right_center]"
                        >
                            Przejdź na stronę główną
                        </button>
                    </div>
                </div>
            )}

            {showError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-none bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center animate-fade-in-scale">
                        <div className="flex flex-row justify-center">
                            <BiSolidErrorCircle className="h-8 w-8 mr-1 text-red-500"/>
                            <h2 className="text-2xl font-semibold mb-2">Coś poszło nie tak</h2>
                        </div>

                        <p className="mb-6">Wystąpił błąd podczas rejestracji</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-auto px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white border-none rounded-[10px] cursor-pointer transition-[background-position] duration-[600ms] ease-in-out hover:bg-[position:right_center]"
                        >
                            Spróbuj ponownie
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default RegisterPage;
