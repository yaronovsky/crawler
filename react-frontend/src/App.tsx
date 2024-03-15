import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const output = (document.getElementById('output') as HTMLTextAreaElement);
        output.value = '';
        const input = (event.target as HTMLFormElement).url.value;
        const keyword = (event.target as HTMLFormElement).keyword.value;
        fetch(`http://localhost:3000/parse?url=${input}&keyword=${keyword}`)
            .then(response => response.text())
            .then(data => {
                output.value = data;
            });
    }
    return (
        <div className="app">
            <div className="inner-wrapper">
                <form name="crwaler-form" onSubmit={handleSubmit}>
                    <label htmlFor="crawl">
                        Crawl me:
                        <input id="crwal" type="text" name="url"/>
                    </label>
                    <label htmlFor="keyword">
                        Keyword:
                        <input id="keyword" type="text" name="keyword"/>
                    </label>
                    <button>Crawl</button>
                </form>
                <textarea name="output" id="output"/>
            </div>
        </div>
    );
}

export default App;
