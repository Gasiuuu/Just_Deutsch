import React, {useState} from 'react'
import UserStore from "../stores/UserStore.js";
import RecentFlashcardWidget from "../components/RecentFlashcardWidget.jsx"
import RecentQuizWidget from "../components/RecentQuizWidget.jsx"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'


function HomePage() {

    const user = UserStore((state) => state.user);
    console.log(user);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const date = new Date();
    console.log(date.getHours());

    const helloHeader = () => {
        if (date.getHours() > 4 && date.getHours() < 12) {
            return <h1>Guten Morgen, {user.first_name}</h1>
        } else if (date.getHours() >= 12 && date.getHours() < 19) {
            return <h1>Guten Tag, {user.first_name}</h1>
        } else if (date.getHours() >= 19 && date.getHours() < 23) {
            return <h1>Guten Abend, {user.first_name}</h1>
        } else {
            return <h1>Schlaf gut, {user.first_name}</h1>
        }
    }
    return (
        <div className="px-5 py-3 mb-20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#000080] to-[#800080] bg-clip-text text-transparent mb-10">
                {helloHeader()}
            </h1>
            <div className="flex gap-6 items-start">
                <div className="flex-1 flex flex-row gap-6">
                    <RecentFlashcardWidget/>
                    <RecentQuizWidget/>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow-md">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <DateCalendar
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;