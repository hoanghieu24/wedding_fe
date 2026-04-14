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
  border: '1px solid #e2e8f0'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 760
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
  const [message, setMessage] = useState('')

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
    const totalGoing = (data.rsvps || []).filter(item => item.attendingStatus === 'GOING').length
    const totalMaybe = (data.rsvps || []).filter(item => item.attendingStatus === 'MAYBE').length
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
    } catch (error) {
      console.error(error)
      setMessage('Upload ảnh thất bại.')
    } finally {
      setUploading(false)
    }
  }

  const toggleWish = async (id) => {
    try {
      await api.patch(`/admin/wishes/${id}/toggle`)
      await load()
      setMessage('Đã cập nhật trạng thái hiển thị lời chúc.')
    } catch (error) {
      console.error(error)
      setMessage('Không thể cập nhật trạng thái lời chúc.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/admin/login'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff5f5 0%, #f8fafc 38%, #ffffff 100%)',
        padding: '28px 18px 40px'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          style={{
            ...cardStyle,
            padding: 24,
            marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,245,245,0.96))'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={softBadge}>Wedding Admin Panel</div>
              <h1
                style={{
                  margin: '14px 0 8px',
                  fontSize: 34,
                  lineHeight: 1.1,
                  color: '#0f172a'
                }}
              >
                Quản trị thiệp cưới
              </h1>
              <p style={{ margin: 0, color: '#475569', fontSize: 15 }}>
                Quản lý nội dung trang cưới, thư viện ảnh, lời chúc công khai và danh sách khách xác nhận tham dự.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" style={outlineBtn} onClick={load}>
                Làm mới dữ liệu
              </button>
              <button
                type="button"
                style={{ ...outlineBtn, borderColor: '#fecaca', color: '#b91c1c', background: '#fff' }}
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginBottom: 20,
              padding: '14px 16px',
              borderRadius: 14,
              background: '#fff',
              border: '1px solid #fde68a',
              color: '#92400e',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 22
          }}
        >
          <StatCard
            title="Tổng ảnh gallery"
            value={data.gallery.length}
            desc="Ảnh đã upload lên thư viện"
            gradient="linear-gradient(135deg, #ef4444, #f97316)"
          />
          <StatCard
            title="Lời chúc công khai"
            value={stats.totalVisibleWish}
            desc={`${data.wishes.length} lời chúc đã gửi`}
            gradient="linear-gradient(135deg, #7c3aed, #ec4899)"
          />
          <StatCard
            title="Khách chắc chắn tham dự"
            value={stats.totalGoing}
            desc="Số RSVP xác nhận sẽ đến"
            gradient="linear-gradient(135deg, #0ea5e9, #2563eb)"
          />
          <StatCard
            title="Khách còn cân nhắc"
            value={stats.totalMaybe}
            desc="Danh sách RSVP trạng thái MAYBE"
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.55fr 1fr',
            gap: 20,
            alignItems: 'start'
          }}
        >
          <form onSubmit={updateSite} style={{ ...cardStyle }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 18
              }}
            >
              <div>
                <h2 style={sectionTitleStyle}>Chỉnh sửa nội dung thiệp cưới</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                  Cập nhật toàn bộ nội dung hiển thị ngoài trang người dùng.
                </p>
              </div>

              <button type="submit" style={primaryBtn} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
              <div>
                <h3 style={{ margin: '0 0 14px', color: '#111827', fontSize: 18 }}>Thông tin chung</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                  <Field label="Tên chú rể">
                    <input
                      style={inputStyle}
                      value={site.groomName || ''}
                      onChange={(e) => updateSiteField('groomName', e.target.value)}
                      placeholder="VD: Duy Trung"
                    />
                  </Field>

                  <Field label="Tên cô dâu">
                    <input
                      style={inputStyle}
                      value={site.brideName || ''}
                      onChange={(e) => updateSiteField('brideName', e.target.value)}
                      placeholder="VD: Thu Trang"
                    />
                  </Field>

                  <Field label="Ngày cưới">
                    <input
                      style={inputStyle}
                      value={site.weddingDate || ''}
                      onChange={(e) => updateSiteField('weddingDate', e.target.value)}
                      placeholder="VD: 2026-05-10 17:30:00"
                    />
                  </Field>

                  <Field label="Địa điểm tổng quan">
                    <input
                      style={inputStyle}
                      value={site.weddingLocation || ''}
                      onChange={(e) => updateSiteField('weddingLocation', e.target.value)}
                      placeholder="VD: Nghệ An"
                    />
                  </Field>

                  <Field label="Link bản đồ tổng">
                    <input
                      style={inputStyle}
                      value={site.weddingMapUrl || ''}
                      onChange={(e) => updateSiteField('weddingMapUrl', e.target.value)}
                      placeholder="https://maps.google.com/..."
                    />
                  </Field>

                  <Field label="Tiêu đề hero">
                    <input
                      style={inputStyle}
                      value={site.heroTitle || ''}
                      onChange={(e) => updateSiteField('heroTitle', e.target.value)}
                      placeholder="VD: Duy Trung & Thu Trang"
                    />
                  </Field>

                  <Field label="Ảnh hero">
                    <input
                      style={inputStyle}
                      value={site.heroImageUrl || ''}
                      onChange={(e) => updateSiteField('heroImageUrl', e.target.value)}
                      placeholder="Link ảnh bìa trang chủ"
                    />
                  </Field>

                  <Field label="Tên bài nhạc nền">
                    <input
                      style={inputStyle}
                      value={site.backgroundMusicTitle || ''}
                      onChange={(e) => updateSiteField('backgroundMusicTitle', e.target.value)}
                      placeholder="VD: Perfect - Ed Sheeran"
                    />
                  </Field>

                  <Field label="Link nhạc nền">
                    <input
                      style={inputStyle}
                      value={site.backgroundMusicUrl || ''}
                      onChange={(e) => updateSiteField('backgroundMusicUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  </Field>
                </div>

                <div style={{ marginTop: 16, display: 'grid', gap: 16 }}>
                  <Field label="Lời chào / lời mời">
                    <textarea
                      style={textareaStyle}
                      rows={3}
                      value={site.welcomeMessage || ''}
                      onChange={(e) => updateSiteField('welcomeMessage', e.target.value)}
                      placeholder="Nhập lời mời hiển thị ở phần đầu trang..."
                    />
                  </Field>

                  <Field label="Câu chuyện tình yêu">
                    <textarea
                      style={textareaStyle}
                      rows={5}
                      value={site.story || ''}
                      onChange={(e) => updateSiteField('story', e.target.value)}
                      placeholder="Nhập nội dung câu chuyện tình yêu của cô dâu chú rể..."
                    />
                  </Field>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 14px', color: '#111827', fontSize: 18 }}>Thông tin buổi lễ</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                  <Field label="Tiêu đề buổi lễ">
                    <input
                      style={inputStyle}
                      value={site.ceremonyTitle || ''}
                      onChange={(e) => updateSiteField('ceremonyTitle', e.target.value)}
                      placeholder="VD: Lễ thành hôn"
                    />
                  </Field>

                  <Field label="Tên địa điểm buổi lễ">
                    <input
                      style={inputStyle}
                      value={site.ceremonyPlaceName || ''}
                      onChange={(e) => updateSiteField('ceremonyPlaceName', e.target.value)}
                      placeholder="VD: Nhà thờ / Trung tâm tổ chức"
                    />
                  </Field>

                  <Field label="Địa chỉ buổi lễ">
                    <input
                      style={inputStyle}
                      value={site.ceremonyAddress || ''}
                      onChange={(e) => updateSiteField('ceremonyAddress', e.target.value)}
                      placeholder="VD: 40 Nhà Chung, Hoàn Kiếm"
                    />
                  </Field>

                  <Field label="Thời gian buổi lễ">
                    <input
                      style={inputStyle}
                      value={site.ceremonyTime || ''}
                      onChange={(e) => updateSiteField('ceremonyTime', e.target.value)}
                      placeholder="VD: 15:30 - 17:00"
                    />
                  </Field>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Link bản đồ buổi lễ">
                      <input
                        style={inputStyle}
                        value={site.ceremonyMapUrl || ''}
                        onChange={(e) => updateSiteField('ceremonyMapUrl', e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 14px', color: '#111827', fontSize: 18 }}>Thông tin tiệc cưới</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                  <Field label="Tiêu đề tiệc cưới">
                    <input
                      style={inputStyle}
                      value={site.receptionTitle || ''}
                      onChange={(e) => updateSiteField('receptionTitle', e.target.value)}
                      placeholder="VD: Tiệc cưới"
                    />
                  </Field>

                  <Field label="Tên địa điểm tiệc">
                    <input
                      style={inputStyle}
                      value={site.receptionPlaceName || ''}
                      onChange={(e) => updateSiteField('receptionPlaceName', e.target.value)}
                      placeholder="VD: Khách sạn Metropole"
                    />
                  </Field>

                  <Field label="Địa chỉ tiệc">
                    <input
                      style={inputStyle}
                      value={site.receptionAddress || ''}
                      onChange={(e) => updateSiteField('receptionAddress', e.target.value)}
                      placeholder="VD: 15 Lý Thường Kiệt, Hà Nội"
                    />
                  </Field>

                  <Field label="Thời gian tiệc">
                    <input
                      style={inputStyle}
                      value={site.receptionTime || ''}
                      onChange={(e) => updateSiteField('receptionTime', e.target.value)}
                      placeholder="VD: 18:00 - 22:00"
                    />
                  </Field>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Link bản đồ tiệc cưới">
                      <input
                        style={inputStyle}
                        value={site.receptionMapUrl || ''}
                        onChange={(e) => updateSiteField('receptionMapUrl', e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 14px', color: '#111827', fontSize: 18 }}>QR check-in / quà tặng</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                  <Field label="Link ảnh QR">
                    <input
                      style={inputStyle}
                      value={site.qrImageUrl || ''}
                      onChange={(e) => updateSiteField('qrImageUrl', e.target.value)}
                      placeholder="https://.../qr.png"
                    />
                  </Field>

                  <Field label="Nội dung nút QR">
                    <input
                      style={inputStyle}
                      value={site.qrButtonText || ''}
                      onChange={(e) => updateSiteField('qrButtonText', e.target.value)}
                      placeholder="VD: Xem QR"
                    />
                  </Field>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Mô tả QR">
                      <textarea
                        style={textareaStyle}
                        rows={3}
                        value={site.qrDescription || ''}
                        onChange={(e) => updateSiteField('qrDescription', e.target.value)}
                        placeholder="Mô tả ngắn khi người dùng xem phần QR..."
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 14px', color: '#111827', fontSize: 18 }}>Tùy chọn hiển thị</h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 12
                  }}
                >
                  {[
                    { key: 'showWishes', label: 'Hiển thị phần lời chúc' },
                    { key: 'showGallery', label: 'Hiển thị gallery ảnh' },
                    { key: 'showMusic', label: 'Hiển thị nhạc nền' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!site[item.key]}
                        onChange={(e) => updateSiteField(item.key, e.target.checked)}
                      />
                      <span style={{ color: '#334155', fontWeight: 600 }}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div style={{ display: 'grid', gap: 20 }}>
            <form onSubmit={upload} style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}>Upload ảnh gallery</h2>
              <p style={{ marginTop: -4, marginBottom: 14, color: '#64748b', fontSize: 14 }}>
                Chọn ảnh và upload trực tiếp lên gallery để hiển thị ngoài trang cưới.
              </p>

              <input
                type="file"
                accept="image/*"
                style={{ ...inputStyle, padding: 10 }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {file && (
                <div
                  style={{
                    marginTop: 14,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: 14
                  }}
                >
                  Đã chọn: <strong>{file.name}</strong>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <button type="submit" style={primaryBtn} disabled={uploading}>
                  {uploading ? 'Đang upload...' : 'Upload ảnh'}
                </button>
              </div>
            </form>

            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}>Tổng quan nhanh</h2>

              <div style={{ display: 'grid', gap: 12 }}>
                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#9f1239'
                  }}
                >
                  <strong>Couple:</strong>{' '}
                  {site.groomName || 'Chưa có'} &amp; {site.brideName || 'Chưa có'}
                </div>

                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8'
                  }}
                >
                  <strong>Ngày cưới:</strong> {site.weddingDate || 'Chưa cập nhật'}
                </div>

                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#047857'
                  }}
                >
                  <strong>Địa điểm:</strong> {site.weddingLocation || 'Chưa cập nhật'}
                </div>

                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  <strong>Hiển thị:</strong>{' '}
                  {[
                    site.showGallery ? 'Gallery' : null,
                    site.showMusic ? 'Music' : null,
                    site.showWishes ? 'Wishes' : null
                  ].filter(Boolean).join(' • ') || 'Chưa bật mục nào'}
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}>Ảnh gallery gần nhất</h2>

              {data.gallery.length === 0 ? (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b'
                  }}
                >
                  Chưa có ảnh nào trong gallery.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {data.gallery.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        borderRadius: 14,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title || 'Gallery'}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#0f172a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.title || 'Ảnh gallery'}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.imageUrl}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          <div style={{ ...cardStyle }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 style={sectionTitleStyle}>Danh sách RSVP</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                  Quản lý người đã xác nhận tham dự, email và trạng thái phản hồi.
                </p>
              </div>
              <div style={softBadge}>Tổng: {data.rsvps.length}</div>
            </div>

            <div style={tableWrap}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Họ tên</th>
                    <th style={thStyle}>Số Điện thoại</th>
                    <th style={thStyle}>Hình thức</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Lời nhắn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.length === 0 ? (
                    <tr>
                      <td style={tdStyle} colSpan={5}>
                        Chưa có ai gửi RSVP.
                      </td>
                    </tr>
                  ) : (
                    data.rsvps.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          <strong>{item.guestName || 'Không rõ tên'}</strong>
                        </td>
                        <td style={tdStyle}>{item.phone || '-'}</td>
                        <td style={tdStyle}>{item.attendanceType || '-'}</td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: 999,
                              background:
                                item.attendingStatus === 'GOING'
                                  ? '#dcfce7'
                                  : item.attendingStatus === 'MAYBE'
                                  ? '#fef3c7'
                                  : '#fee2e2',
                              color:
                                item.attendingStatus === 'GOING'
                                  ? '#166534'
                                  : item.attendingStatus === 'MAYBE'
                                  ? '#92400e'
                                  : '#991b1b',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            {item.attendanceStatus || 'UNKNOWN'}
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

          <div style={{ ...cardStyle }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 style={sectionTitleStyle}>Quản lý lời chúc</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                  Ẩn hoặc hiện lời chúc công khai hiển thị trên giao diện người dùng.
                </p>
              </div>
              <div style={softBadge}>Tổng: {data.wishes.length}</div>
            </div>

            <div style={tableWrap}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Người gửi</th>
                    <th style={thStyle}>Nội dung</th>
                    <th style={thStyle}>Ngày gửi</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {data.wishes.length === 0 ? (
                    <tr>
                      <td style={tdStyle} colSpan={5}>
                        Chưa có lời chúc nào.
                      </td>
                    </tr>
                  ) : (
                    data.wishes.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          <strong>{item.fullName || item.guestName || 'Khách mời'}</strong>
                        </td>
                        <td style={{ ...tdStyle, maxWidth: 420 }}>{item.message}</td>
                        <td style={tdStyle}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: 999,
                              background: item.visible ? '#dcfce7' : '#fee2e2',
                              color: item.visible ? '#166534' : '#991b1b',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            {item.visible ? 'Đang hiển thị' : 'Đang ẩn'}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => toggleWish(item.id)}
                            style={{
                              ...outlineBtn,
                              padding: '8px 14px',
                              fontSize: 13
                            }}
                          >
                            {item.visible ? 'Ẩn lời chúc' : 'Hiện lời chúc'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {loading && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99,
              backdropFilter: 'blur(2px)'
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '16px 20px',
                borderRadius: 16,
                boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
                color: '#0f172a',
                fontWeight: 700
              }}
            >
              Đang tải dữ liệu...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}