import React from 'react'
import UserStore from "../stores/UserStore.js";
import RecentFlashcardWidget from "../components/RecentFlashcardWidget.jsx";

function Home() {

    const user = UserStore((state) => state.user);
    console.log(user);
    const date = new Date();
    console.log(date.getHours());

    const helloHeader = () => {
        if (date.getHours() > 4 && date.getHours() < 12) {
            return <p>Guten Morgen, {user.first_name}</p>
        } else if (date.getHours() >= 12 && date.getHours() < 19) {
            return <p>Guten Tag, {user.first_name}</p>
        } else if (date.getHours() >= 19 && date.getHours() < 23) {
            return <p>Guten Abend, {user.first_name}</p>
        } else {
            return <p>Schlaf gut, {user.first_name}</p>
        }
    }
    return (
        <div className="px-5 py-3 mb-20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#000080] to-[#800080] bg-clip-text text-transparent mb-10">
                {helloHeader()}
            </h1>
            <RecentFlashcardWidget />
        </div>
    )
}

export default Home;