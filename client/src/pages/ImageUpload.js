import React from "react";
import "../App.js";

import { useState } from "react";

function App() {


  const [image1, setImage1] = useState({ preview: '', data: '' })
  const [status1, setStatus1] = useState('')
  const [image2, setImage2] = useState({ preview: '', data: '' })
  const [status2, setStatus2] = useState('')
  const handleSubmit1 = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image1.data)
    const response = await fetch('http://localhost:5000/image1', {
      method: 'POST',
      body: formData,
    })
    if (response) setStatus1(response.statusText)
  }
  const handleSubmit2 = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image2.data)
    const response = await fetch('http://localhost:5000/image2', {
      method: 'POST',
      body: formData,
    })
    if (response) setStatus2(response.statusText)
  }
const handleFileChange1 = (e) => {
    const img1 = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage1(img1)
}
const handleFileChange2 = (e) => {
  const img2 = {
    preview: URL.createObjectURL(e.target.files[0]),
    data: e.target.files[0],
  }
  console.log(img2)
  setImage2(img2)
}

  return (
   
    <div className='App'>
    
    <h1>Upload to server</h1>
    {image1.preview && <img src={image1.preview} width='100' height='100' alt=""/>}
    <hr></hr>
    <form onSubmit={handleSubmit1}>
      <input type='file' name='file' onChange={handleFileChange1}></input>
      <button type='submit'>Submit</button>
    </form>
    {status1 && <h4>{status1}</h4>}
    {image2.preview && <img src={image2.preview} width='100' height='100' alt="" />}
    <form onSubmit={handleSubmit2}>
      <input type='file' name='file' onChange={handleFileChange2}></input>
      <button type='submit'>Submit</button>
    </form>
    {status2 && <h4>{status2}</h4>}
  </div>
  );
}

export default App;