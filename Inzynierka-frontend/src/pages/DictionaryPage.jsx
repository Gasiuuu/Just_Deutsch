import React, {useState} from 'react'
import DictionaryInput from "../components/DictionaryInput.jsx";
import DictionaryResult from "../components/DictionaryResult.jsx";
import DictionaryDialogue from "../components/DictionaryDialogue.jsx";

function DictionaryPage() {

    const [result, setResult] = useState(null)
    const [word, setWord] = useState('')


    return(
        <div>
            <DictionaryInput onSearchResult={setResult} onWord={setWord}/>
            <DictionaryDialogue data={word} />
            {result && <DictionaryResult data={result} /> }
        </div>
    )

}

export default DictionaryPage