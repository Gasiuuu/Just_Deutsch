import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import UserService from "./services/UserService.js";
import UserStore from "./stores/UserStore.js";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx"
import StartPage from "./pages/StartPage.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import FlashcardSetPage from "./pages/FlashcardSetPage.jsx";
import DictionaryPage from "./pages/DictionaryPage.jsx";
import TranslatePage from "./pages/TranslatePage.jsx";
import GapFillPage from "./pages/GapFillPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import AddFlashcards from "./pages/AddFlashcards.jsx";
import EditFlashcardSet from "./pages/EditFlashcardSet.jsx";
import EditFlashcard from "./pages/EditFlashcard.jsx";
import QuizTopicsPage from "./pages/QuizTopicsPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import QuizResult from "./pages/QuizResult.jsx";


function AppRoutes() {

    const setUser = UserStore((state) => state.setUser)
    const [rendering, setRendering] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserService.getCurrentUser()
                setUser(userData)
            } catch (e) {
                console.log("Brak zalogowanego użytkownika: ", e)
            } finally {
                setRendering(false);
            }

        }
        fetchUser()
    }, [setUser])

    if (rendering) return null;

    const renderLayout = (Component) => (
        <div className="relative w-full flex flex-col min-h-screen">
            <header className="sticky top-0 w-full h-[var(--header-height)] z-[11]">
                <Navbar />
            </header>

            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-8 overflow-y-auto mb-15">
                    {Component}
                </div>
            </div>

            <Footer />
        </div>
    );

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/start" />} />
                <Route path="/start" element={<StartPage />} />
                <Route path="/logowanie" element={<Login />} />
                <Route path="/rejestracja" element={<Register />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/strona-glowna" element={renderLayout(<Home />)} />
                    <Route path="/fiszki" element={renderLayout(<FlashcardsPage />)}/>
                    <Route path="/fiszki/:categoryId" element={renderLayout(<FlashcardSetPage />)} />
                    <Route path="/slownik" element={renderLayout(<DictionaryPage />)} />
                    <Route path="/tlumaczenia" element={renderLayout(<TranslatePage />)} />
                    <Route path="/gap-fill" element={renderLayout(<GapFillPage />)}  />
                    <Route path="/dodaj-kategorie" element={renderLayout(<AddCategory />)} />
                    <Route path="/wybierz-zestaw" element={renderLayout(<FlashcardsPage />)} />
                    <Route path="/dodaj-fiszki/:categoryId" element={renderLayout(<AddFlashcards />)} />
                    <Route path="edytuj-zestaw/:categoryId" element={renderLayout(<EditFlashcardSet />)} />
                    <Route path="edytuj-fiszke/:flashcardId" element={renderLayout(<EditFlashcard />)} />
                    <Route path="/quizy" element={renderLayout(<QuizTopicsPage />)} />
                    <Route path="/quiz/:quizId" element={renderLayout(<QuizPage />)} />
                    <Route path="/quiz/:quizId/wyniki" element={renderLayout(<QuizResult />)} />
                </Route>

                {UserService.adminOnly() && (
                    <>
                    </>
                )}
            </Routes>

        </Router>
    );
}

export default AppRoutes;
