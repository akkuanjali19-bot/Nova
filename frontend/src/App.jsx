import React, { useState, useRef } from 'react'

export default function App(){
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const fileRef = useRef()

  const sendText = async () => {
    if (!input) return
    setMessages(m => [...m, {from:'user', text: input}])
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: input})
      })
      const data = await res.json()
      setMessages(m => [...m, {from:'bot', text: data.text}])
    } catch (e) {
      setMessages(m => [...m, {from:'bot', text: '[error] Could not reach backend. Make sure backend is running.'}])
    }
    setInput('')
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMessages(m => [...m, {from:'user', text: '[image uploaded]'}])
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('http://localhost:8000/upload_image', {method:'POST', body: fd})
      const data = await res.json()
      setMessages(m => [...m, {from:'bot', text: data.description}])
    } catch (e) {
      setMessages(m => [...m, {from:'bot', text: '[error] Image upload failed.'}])
    }
  }

  return (
    <div style={{maxWidth:700, margin:'2rem auto', fontFamily:'sans-serif'}}>
      <h2>Nova — Virtual Companion (Platonic)</h2>
      <div style={{border:'1px solid #eee', padding:10, minHeight:300}}>
        {messages.map((m,i)=> (
          <div key={i} style={{textAlign: m.from==='user'? 'right':'left', margin:'8px 0'}}>
            <div style={{display:'inline-block', background: m.from==='user'? '#dcf8c6':'#f1f0f0', padding:8, borderRadius:8}}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10, display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1}} placeholder="Say something to Nova..." />
        <button onClick={sendText}>Send</button>
        <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} />
      </div>
    </div>
  )
}