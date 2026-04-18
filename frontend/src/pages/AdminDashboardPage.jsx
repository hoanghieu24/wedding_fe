import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  border: '1px solid rgba(226, 232, 240, 0.9)'
}

const sectionTitleStyle = {
  margin: 0,
  marginBottom: 14,
  fontSize: 22,
  fontWeight: 700,
  color: '#0f172a'
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #dbe2ea',
  outline: 'none',
  fontSize: 14,
  background: '#fff',
  boxSizing: 'border-box'
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 110
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#334155',
  marginBottom: 8
}

const primaryBtn = {
  border: 'none',
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  color: '#fff',
  borderRadius: 14,
  padding: '12px 18px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 10px 20px rgba(239, 68, 68, 0.25)'
}

const outlineBtn = {
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#0f172a',
  borderRadius: 14,
  padding: '10px 16px',
  fontWeight: 600,
  cursor: 'pointer'
}

const softBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 999,
  background: '#fff1f2',
  color: '#be123c',
  fontSize: 12,
  fontWeight: 700
}

const summaryCard = {
  borderRadius: 18,
  padding: 18,
  color: '#fff',
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12)'
}

const tableWrap = {
  overflowX: 'auto',
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  WebkitOverflowScrolling: 'touch'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 600
}

const thStyle = {
  textAlign: 'left',
  background: '#f8fafc',
  color: '#334155',
  fontSize: 13,
  padding: '14px 16px',
  borderBottom: '1px solid #e2e8f0'
}

const tdStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #eef2f7',
  fontSize: 14,
  color: '#334155',
  verticalAlign: 'top'
}

function StatCard({ title, value, desc, gradient }) {
  return (
    <div style={{ ...summaryCard, background: gradient }}>
      <div style={{ fontSize: 14, opacity: 0.92 }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, opacity: 0.95 }}>{desc}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState({ site: {}, gallery: [], wishes: [], rsvps: [] })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('site')

  const load = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/dashboard')
      setData(res.data)
    } catch (error) {
      console.error(error)
      setMessage('Không tải được dữ liệu quản trị.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const site = data.site || {}

  const updateSiteField = (field, value) => {
    setData((prev) => ({
      ...prev,
      site: {
        ...prev.site,
        [field]: value
      }
    }))
  }

  const stats = useMemo(() => {
    const totalGoing = (data.rsvps || []).filter(item => item.attendanceStatus === 'GOING').length
    const totalMaybe = (data.rsvps || []).filter(item => item.attendanceStatus === 'MAYBE').length
    const totalVisibleWish = (data.wishes || []).filter(item => item.visible).length
    return {
      totalGoing,
      totalMaybe,
      totalVisibleWish
    }
  }, [data.rsvps, data.wishes])

  const updateSite = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage('')
      await api.put('/admin/site', data.site)
      setMessage('Đã lưu thông tin thiệp cưới thành công.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error(error)
      setMessage('Lưu thông tin thất bại, vui lòng kiểm tra lại.')
    } finally {
      setSaving(false)
    }
  }

  const upload = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Bạn chưa chọn ảnh để upload.')
      return
    }

    try {
      setUploading(true)
      setMessage('')
      const form = new FormData()
      form.append('file', file)
      form.append('title', file.name)

      await api.post('/admin/gallery/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setFile(null)
      await load()
      setMessage('Upload ảnh thành công.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error(error)
      setMessage('Upload ảnh thất bại.')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return
    
    try {
      setDeleting(true)
      await api.delete(`/admin/gallery/${id}`)
      await load()
      setMessage('Xóa ảnh thành công.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error(error)
      setMessage('Xóa ảnh thất bại.')
    } finally {
      setDeleting(false)
    }
  }

  const toggleWish = async (id) => {
    try {
      await api.patch(`/admin/wishes/${id}/toggle`)
      await load()
      setMessage('Đã cập nhật trạng thái hiển thị lời chúc.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error(error)
      setMessage('Không thể cập nhật trạng thái lời chúc.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/admin/login'
  }

  // Mobile menu component
  const MobileMenu = () => (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        padding: 20,
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>Menu</h3>
          <button onClick={() => setMobileMenuOpen(false)} style={{ ...outlineBtn, padding: '8px 12px' }}>Đóng</button>
        </div>
        {['site', 'gallery', 'rsvp', 'wishes'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setMobileMenuOpen(false)
            }}
            style={{
              ...outlineBtn,
              width: '100%',
              marginBottom: 10,
              background: activeTab === tab ? '#ef4444' : '#fff',
              color: activeTab === tab ? '#fff' : '#0f172a'
            }}
          >
            {tab === 'site' && '📝 Nội dung'}
            {tab === 'gallery' && '🖼️ Gallery'}
            {tab === 'rsvp' && '📋 RSVP'}
            {tab === 'wishes' && '💝 Lời chúc'}
          </button>
        ))}
        <button onClick={logout} style={{ ...primaryBtn, width: '100%', marginTop: 10 }}>
          Đăng xuất
        </button>
      </div>
    </div>
  )

  const tabs = [
    { id: 'site', label: 'Nội dung', icon: '📝' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'rsvp', label: 'RSVP', icon: '📋' },
    { id: 'wishes', label: 'Lời chúc', icon: '💝' }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff5f5 0%, #f8fafc 38%, #ffffff 100%)',
        padding: '16px 12px 80px 12px'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            ...cardStyle,
            padding: 16,
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={softBadge}>Wedding Admin Panel</div>
              <h1 style={{ margin: '10px 0 6px', fontSize: 24, color: '#0f172a' }}>
                Quản trị thiệp cưới
              </h1>
              <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                Quản lý nội dung, thư viện ảnh, lời chúc và RSVP
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" style={{ ...outlineBtn, padding: '8px 12px', fontSize: 13 }} onClick={load}>
                🔄
              </button>
              <button
                type="button"
                style={{ ...outlineBtn, padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={logout}
              >
                🚪 Đăng xuất
              </button>
              <button
                type="button"
                style={{ ...primaryBtn, padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setMobileMenuOpen(true)}
              >
                ☰ Menu
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...outlineBtn,
                whiteSpace: 'nowrap',
                background: activeTab === tab.id ? '#ef4444' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#0f172a',
                border: activeTab === tab.id ? 'none' : '1px solid #cbd5e1'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              borderRadius: 12,
              background: '#fff',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: 13
            }}
          >
            {message}
          </div>
        )}

        {/* Stats Cards - Always visible */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            marginBottom: 20
          }}
        >
          <StatCard
            title="Tổng ảnh"
            value={data.gallery.length}
            desc="Ảnh đã upload"
            gradient="linear-gradient(135deg, #ef4444, #f97316)"
          />
          <StatCard
            title="Lời chúc công khai"
            value={stats.totalVisibleWish}
            desc={`${data.wishes.length} lời chúc`}
            gradient="linear-gradient(135deg, #7c3aed, #ec4899)"
          />
          <StatCard
            title="Khách chắc chắn"
            value={stats.totalGoing}
            desc="Sẽ tham dự"
            gradient="linear-gradient(135deg, #0ea5e9, #2563eb)"
          />
          <StatCard
            title="Khách cân nhắc"
            value={stats.totalMaybe}
            desc="Chưa chắc chắn"
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'site' && (
          <form onSubmit={updateSite} style={{ ...cardStyle }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={sectionTitleStyle}>Chỉnh sửa nội dung thiệp cưới</h2>
              <button type="submit" style={{ ...primaryBtn, width: '100%', marginTop: 12 }} disabled={saving}>
                {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              {/* Thông tin chung */}
              <div>
                <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: 18 }}>📋 Thông tin chung</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <Field label="Tên chú rể">
                    <input style={inputStyle} value={site.groomName || ''} onChange={(e) => updateSiteField('groomName', e.target.value)} />
                  </Field>
                  <Field label="Tên cô dâu">
                    <input style={inputStyle} value={site.brideName || ''} onChange={(e) => updateSiteField('brideName', e.target.value)} />
                  </Field>
                  <Field label="Ngày cưới">
                    <input style={inputStyle} value={site.weddingDate || ''} onChange={(e) => updateSiteField('weddingDate', e.target.value)} placeholder="2026-05-10 17:30:00" />
                  </Field>
                  <Field label="Địa điểm tổng quan">
                    <input style={inputStyle} value={site.weddingLocation || ''} onChange={(e) => updateSiteField('weddingLocation', e.target.value)} />
                  </Field>
                  <Field label="Link bản đồ">
                    <input style={inputStyle} value={site.weddingMapUrl || ''} onChange={(e) => updateSiteField('weddingMapUrl', e.target.value)} />
                  </Field>
                  <Field label="Tiêu đề hero">
                    <input style={inputStyle} value={site.heroTitle || ''} onChange={(e) => updateSiteField('heroTitle', e.target.value)} />
                  </Field>
                  <Field label="Ảnh hero URL">
                    <input style={inputStyle} value={site.heroImageUrl || ''} onChange={(e) => updateSiteField('heroImageUrl', e.target.value)} />
                  </Field>
                  <Field label="Lời chào">
                    <textarea style={textareaStyle} rows={3} value={site.welcomeMessage || ''} onChange={(e) => updateSiteField('welcomeMessage', e.target.value)} />
                  </Field>
                  <Field label="Câu chuyện tình yêu">
                    <textarea style={textareaStyle} rows={5} value={site.story || ''} onChange={(e) => updateSiteField('story', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Buổi lễ */}
              <div>
                <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: 18 }}>💒 Buổi lễ</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <Field label="Tiêu đề">
                    <input style={inputStyle} value={site.ceremonyTitle || ''} onChange={(e) => updateSiteField('ceremonyTitle', e.target.value)} />
                  </Field>
                  <Field label="Địa điểm">
                    <input style={inputStyle} value={site.ceremonyPlaceName || ''} onChange={(e) => updateSiteField('ceremonyPlaceName', e.target.value)} />
                  </Field>
                  <Field label="Địa chỉ">
                    <input style={inputStyle} value={site.ceremonyAddress || ''} onChange={(e) => updateSiteField('ceremonyAddress', e.target.value)} />
                  </Field>
                  <Field label="Thời gian">
                    <input style={inputStyle} value={site.ceremonyTime || ''} onChange={(e) => updateSiteField('ceremonyTime', e.target.value)} />
                  </Field>
                  <Field label="Link bản đồ">
                    <input style={inputStyle} value={site.ceremonyMapUrl || ''} onChange={(e) => updateSiteField('ceremonyMapUrl', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Tiệc cưới */}
              <div>
                <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: 18 }}>🎉 Tiệc cưới</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <Field label="Tiêu đề">
                    <input style={inputStyle} value={site.receptionTitle || ''} onChange={(e) => updateSiteField('receptionTitle', e.target.value)} />
                  </Field>
                  <Field label="Địa điểm">
                    <input style={inputStyle} value={site.receptionPlaceName || ''} onChange={(e) => updateSiteField('receptionPlaceName', e.target.value)} />
                  </Field>
                  <Field label="Địa chỉ">
                    <input style={inputStyle} value={site.receptionAddress || ''} onChange={(e) => updateSiteField('receptionAddress', e.target.value)} />
                  </Field>
                  <Field label="Thời gian">
                    <input style={inputStyle} value={site.receptionTime || ''} onChange={(e) => updateSiteField('receptionTime', e.target.value)} />
                  </Field>
                  <Field label="Link bản đồ">
                    <input style={inputStyle} value={site.receptionMapUrl || ''} onChange={(e) => updateSiteField('receptionMapUrl', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Tùy chọn hiển thị */}
              <div>
                <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: 18 }}>⚙️ Tùy chọn hiển thị</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#f8fafc', borderRadius: 12 }}>
                    <input type="checkbox" checked={!!site.showWishes} onChange={(e) => updateSiteField('showWishes', e.target.checked)} />
                    <span>Hiển thị phần lời chúc</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#f8fafc', borderRadius: 12 }}>
                    <input type="checkbox" checked={!!site.showGallery} onChange={(e) => updateSiteField('showGallery', e.target.checked)} />
                    <span>Hiển thị gallery ảnh</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#f8fafc', borderRadius: 12 }}>
                    <input type="checkbox" checked={!!site.showMusic} onChange={(e) => updateSiteField('showMusic', e.target.checked)} />
                    <span>Hiển thị nhạc nền</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'gallery' && (
          <>
            <form onSubmit={upload} style={{ ...cardStyle, marginBottom: 16 }}>
              <h2 style={sectionTitleStyle}>Upload ảnh gallery</h2>
              <input
                type="file"
                accept="image/*"
                style={{ ...inputStyle, padding: 10, marginBottom: 12 }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && (
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
                  Đã chọn: <strong>{file.name}</strong>
                </div>
              )}
              <button type="submit" style={{ ...primaryBtn, width: '100%' }} disabled={uploading}>
                {uploading ? 'Đang upload...' : '📤 Upload ảnh'}
              </button>
            </form>

            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}>📷 Thư viện ảnh ({data.gallery.length})</h2>
              {data.gallery.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  Chưa có ảnh nào trong gallery.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                  {data.gallery.map((item) => (
                    <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1', background: '#f8fafc' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => deleteImage(item.id)}
                        disabled={deleting}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(239,68,68,0.9)',
                          border: 'none',
                          borderRadius: 20,
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          fontSize: 16
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'rsvp' && (
          <div style={{ ...cardStyle }}>
            <h2 style={sectionTitleStyle}>📋 Danh sách RSVP ({data.rsvps.length})</h2>
            <div style={tableWrap}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Họ tên</th>
                    <th style={thStyle}>SĐT</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Lời nhắn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.length === 0 ? (
                    <tr><td style={tdStyle} colSpan={4}>Chưa có ai gửi RSVP.</td></tr>
                  ) : (
                    data.rsvps.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}><strong>{item.guestName || '-'}</strong></td>
                        <td style={tdStyle}>{item.phone || '-'}</td>
                        <td style={tdStyle}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            background: item.attendanceStatus === 'GOING' ? '#dcfce7' : item.attendanceStatus === 'MAYBE' ? '#fef3c7' : '#fee2e2',
                            color: item.attendanceStatus === 'GOING' ? '#166534' : item.attendanceStatus === 'MAYBE' ? '#92400e' : '#991b1b'
                          }}>
                            {item.attendanceStatus === 'GOING' ? '✅ Sẽ đến' : item.attendanceStatus === 'MAYBE' ? '❓ Cân nhắc' : '❌ Không đến'}
                          </span>
                        </td>
                        <td style={tdStyle}>{item.note || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div style={{ ...cardStyle }}>
            <h2 style={sectionTitleStyle}>💝 Quản lý lời chúc ({data.wishes.length})</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {data.wishes.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Chưa có lời chúc nào.</div>
              ) : (
                data.wishes.map((item) => (
                  <div key={item.id} style={{ padding: 14, background: '#f8fafc', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <strong>{item.fullName || item.guestName || 'Khách mời'}</strong>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{item.message}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWish(item.id)}
                        style={{
                          ...outlineBtn,
                          padding: '8px 14px',
                          fontSize: 12,
                          background: item.visible ? '#dcfce7' : '#fee2e2',
                          color: item.visible ? '#166534' : '#991b1b',
                          border: 'none'
                        }}
                      >
                        {item.visible ? '🙈 Ẩn' : '👁️ Hiện'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99
          }}>
            <div style={{ background: '#fff', padding: '16px 24px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.1)', fontWeight: 700 }}>
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </div>
  )
}
