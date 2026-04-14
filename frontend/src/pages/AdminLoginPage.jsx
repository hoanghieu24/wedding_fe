import React, { useState } from 'react'
import api from '../api/client'

export default function AdminLoginPage(){
  const [form, setForm] = useState({username:'admin', password:'123456'})
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/admin'
    } catch {
      alert('Sai tài khoản hoặc mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{paddingTop:60,maxWidth:420}}>
      <form className="card grid" onSubmit={submit}>
        <h1>Đăng nhập admin</h1>
        <input className="input" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="btn" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  )
}
