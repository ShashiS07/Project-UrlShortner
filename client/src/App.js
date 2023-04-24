import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './App.css';
import axios from 'axios'


function App() {
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const handleUrl = (event) => {
    event.preventDefault()
    axios.post('http://localhost:4000/url/shorten', { longUrl, shortUrl })
      .then((res) => {
        setShortUrl(res.data.data.shortUrl)
        // alert(res.data.message)
        setLongUrl("")
      })

      .catch((err) => alert(err.response.data.message))
  }

  const handleCopy=()=>{
    if(shortUrl===""){
      alert("Short Link is Empty")
    }else{
      alert("Link is Copied")
    }
  }

  return (
    <div>
      <div className='header'>
        <header>Create Short Link</header>
      </div>
      <div className='long-url'>
        Enter URL: <input type='text' placeholder='http://site.com' value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
        <div className='button'>
          <button onClick={handleUrl}>Get Shorten URL</button>
        </div>
        <input type='text' placeholder='ShortLink will be here' value={shortUrl} onChange={(e) => setShortUrl}></input>
        <CopyToClipboard text={shortUrl}>
          <button onClick={handleCopy}>Copy Above Link</button>
        </CopyToClipboard>
      </div>

    </div>
  );
}

export default App;
