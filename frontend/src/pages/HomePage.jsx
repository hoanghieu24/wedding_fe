import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/client'
import styles from './HomePage.module.css'

const defaultGallery = [
  { id: 1, imageUrl: 'https://picsum.photos/id/64/900/1200', title: 'Wedding 1' },
  { id: 2, imageUrl: 'https://picsum.photos/id/65/900/1200', title: 'Wedding 2' },
  { id: 3, imageUrl: 'https://picsum.photos/id/66/900/1200', title: 'Wedding 3' },
  { id: 4, imageUrl: 'https://picsum.photos/id/67/900/1200', title: 'Wedding 4' },
  { id: 5, imageUrl: 'https://picsum.photos/id/68/900/1200', title: 'Wedding 5' },
  { id: 6, imageUrl: 'https://picsum.photos/id/69/900/1200', title: 'Wedding 6' }
]

const bankAccounts = [
  {
    id: 1,
    bankName: 'VietinBank',
    accountName: 'Hoang Thi Thu Trang',
    accountNumber: '106869089934',
    qrImage:
      'https://qr.sepay.vn/img?bank=VietinBank&acc=106869089934&template=qronly&amount=&des=Mung cuoi'
  },
  {
    id: 2,
    bankName: 'MB Bank',
    accountName: 'Nguyen Duy Trung',
    accountNumber: '0988776655',
    qrImage:
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MBBANK-NGUYEN%20DUY%20TRUNG-0988776655'
  }
]

function parseWeddingDate(raw) {
  if (!raw) return new Date('2026-12-20T09:30:00+07:00')

  if (typeof raw === 'string' && raw.includes('/')) {
    const [day, month, year] = raw.split('/')
    return new Date(`${year}-${month}-${day}T09:30:00+07:00`)
  }

  const date = new Date(raw)

  return Number.isNaN(date.getTime())
    ? new Date('2026-12-20T09:30:00+07:00')
    : date
}

function formatDateDots(raw) {
  const date = parseWeddingDate(raw)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

function formatDay(raw) {
  const date = parseWeddingDate(raw)
  return String(date.getDate()).padStart(2, '0')
}

function formatMonth(raw) {
  const date = parseWeddingDate(raw)
  return String(date.getMonth() + 1).padStart(2, '0')
}

function formatYear(raw) {
  const date = parseWeddingDate(raw)
  return date.getFullYear()
}

function getFirstName(name, fallback) {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1]
}

const hearts = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${8 + Math.random() * 10}s`,
  size: `${10 + Math.random() * 14}px`
}))

export default function HomePage() {
  const [data, setData] = useState({
    site: {},
    gallery: [],
    wishes: []
  })

  const [toast, setToast] = useState('')
  const [feedback, setFeedback] = useState('')
  const [wishModalOpen, setWishModalOpen] = useState(false)

  const [rsvp, setRsvp] = useState({
    guestName: '',
    phone: '',
    attendanceStatus: 'GOING',
    attendanceType: 'DIRECT',
    note: ''
  })

  const [wish, setWish] = useState({
    guestName: '',
    message: ''
  })

  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)

  const audioRef = useRef(null)
  const toastTimerRef = useRef(null)

  const site = data.site || {}
  const gallery = data.gallery?.length ? data.gallery : defaultGallery

  const wishes = data.wishes?.length
    ? data.wishes
    : [
        {
          id: 1,
          fullName: 'Bạn bè',
          message: 'Chúc hai bạn trăm năm hạnh phúc.',
          createdAt: '2026-01-01'
        },
        {
          id: 2,
          fullName: 'Gia đình',
          message: 'Mong hai con luôn yêu thương và bình an.',
          createdAt: '2026-01-02'
        }
      ]

  const groomName = site.groomName || 'Duy Trung'
  const brideName = site.brideName || 'Thu Trang'

  const groomFirstName = getFirstName(groomName, 'Trung')
  const brideFirstName = getFirstName(brideName, 'Trang')

  const coupleNames = useMemo(() => {
    return `${groomName} & ${brideName}`
  }, [groomName, brideName])

  const showToast = useCallback((message) => {
    setToast(message)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setToast('')
    }, 3000)
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await api.get('/public/site')
      setData(res.data || { site: {}, gallery: [], wishes: [] })
    } catch (error) {
      console.error(error)
      showToast('Đang hiển thị nội dung mẫu.')
    }
  }, [showToast])

  useEffect(() => {
    document.title = `${groomFirstName} ❤️ ${brideFirstName}`

    load()

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [load, groomFirstName, brideFirstName])

  useEffect(() => {
    const allowAudio = () => {
      setAudioAllowed(true)
      document.removeEventListener('click', allowAudio)
      document.removeEventListener('touchstart', allowAudio)
      document.removeEventListener('keydown', allowAudio)
    }

    document.addEventListener('click', allowAudio)
    document.addEventListener('touchstart', allowAudio)
    document.addEventListener('keydown', allowAudio)

    return () => {
      document.removeEventListener('click', allowAudio)
      document.removeEventListener('touchstart', allowAudio)
      document.removeEventListener('keydown', allowAudio)
    }
  }, [])

  useEffect(() => {
    if (audioAllowed && audioRef.current && site.backgroundMusicUrl) {
      audioRef.current.volume = 0.45

      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {})
    }
  }, [audioAllowed, site.backgroundMusicUrl])

  useEffect(() => {
    const targetDate = parseWeddingDate(site.weddingDate)

    const tick = () => {
      const now = new Date()
      const diff = targetDate - now

      if (diff <= 0) {
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      })
    }

    tick()

    const timer = setInterval(tick, 1000)

    return () => clearInterval(timer)
  }, [site.weddingDate])

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  const openMap = useCallback(
    (url) => {
      if (!url) {
        showToast('Bản đồ sẽ được cập nhật sớm.')
        return
      }

      window.open(url, '_blank')
    },
    [showToast]
  )

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      showToast('Nhạc nền sẽ được cập nhật sớm.')
      return
    }

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
      return
    }

    audioRef.current.volume = 0.45

    audioRef.current
      .play()
      .then(() => {
        setAudioAllowed(true)
        setMusicPlaying(true)
      })
      .catch(() => {
        showToast('Chạm lại một lần nữa để bật nhạc nhé.')
      })
  }, [musicPlaying, showToast])

  const copyBankNumber = useCallback(
    async (accountNumber) => {
      try {
        await navigator.clipboard.writeText(accountNumber)
        showToast('Đã sao chép số tài khoản.')
      } catch (error) {
        showToast('Bạn vui lòng sao chép thủ công nhé.')
      }
    },
    [showToast]
  )

  const submitRsvp = async (e) => {
    e.preventDefault()

    if (!rsvp.guestName.trim()) {
      showToast('Vui lòng nhập họ tên.')
      return
    }

    try {
      setSubmittingRsvp(true)

      await api.post('/public/rsvp', rsvp)

      setFeedback('Cảm ơn bạn đã xác nhận tham dự.')
      showToast('Gửi xác nhận thành công.')

      setRsvp({
        guestName: '',
        phone: '',
        attendanceStatus: 'GOING',
        attendanceType: 'DIRECT',
        note: ''
      })

      setTimeout(() => setFeedback(''), 4000)
    } catch (error) {
      showToast('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setSubmittingRsvp(false)
    }
  }

  const submitWish = async (e) => {
    e.preventDefault()

    if (!wish.message.trim()) {
      showToast('Vui lòng nhập lời chúc.')
      return
    }

    try {
      setSubmittingWish(true)

      await api.post('/public/wish', wish)

      setWish({
        guestName: '',
        message: ''
      })

      setWishModalOpen(false)
      load()
      showToast('Cảm ơn lời chúc của bạn.')
    } catch (error) {
      showToast('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setSubmittingWish(false)
    }
  }

  const ceremony = {
    title: site.ceremonyTitle || 'LỄ THÀNH HÔN',
    time: site.ceremonyTime || 'Chủ nhật - 09:30',
    date: formatDateDots(site.weddingDate),
    lunar: site.ceremonyLunarDate || 'Tức ngày đẹp tháng lành',
    place: site.ceremonyPlaceName || 'TẠI TƯ GIA NHÀ TRAI',
    address: site.ceremonyAddress || site.weddingLocation || 'Địa chỉ sẽ được cập nhật',
    mapUrl: site.ceremonyMapUrl || site.weddingMapUrl
  }

  const reception = {
    title: site.receptionTitle || 'TIỆC CƯỚI',
    time: site.receptionTime || 'Chủ nhật - 18:00',
    date: formatDateDots(site.weddingDate),
    lunar: site.receptionLunarDate || 'Tức ngày đẹp tháng lành',
    place: site.receptionPlaceName || 'NHÀ HÀNG TIỆC CƯỚI',
    address: site.receptionAddress || site.weddingLocation || 'Địa chỉ sẽ được cập nhật',
    mapUrl: site.receptionMapUrl || site.weddingMapUrl
  }

  return (
    <div className={styles.page}>
      {toast && (
        <div className={styles.toast}>
          <i className="fa-solid fa-heart" />
          <span>{toast}</span>
          <button onClick={() => setToast('')}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <nav className={styles.nav}>
        <button onClick={() => scrollToSection('hero')}>Home</button>
        <button onClick={() => scrollToSection('events')}>Lịch cưới</button>
        <button onClick={() => scrollToSection('rsvp')}>RSVP</button>
        <button onClick={() => scrollToSection('gift')}>Mừng cưới</button>
      </nav>

      <header className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <img
            src={site.heroImageUrl || gallery[0]?.imageUrl || 'https://picsum.photos/id/64/1000/1400'}
            alt={coupleNames}
          />
        </div>

        <div className={styles.heroOverlay} />

        <div className={styles.floatingHearts}>
          {hearts.map((heart) => (
            <span
              key={heart.id}
              style={{
                left: heart.left,
                width: heart.size,
                height: heart.size,
                animationDelay: heart.delay,
                animationDuration: heart.duration
              }}
            />
          ))}
        </div>

        <button className={styles.musicButtonTop} onClick={toggleMusic}>
          <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-music'}`} />
        </button>

        <div className={styles.heroContent}>
          <p className={styles.heroSub}>Wedding Invitation</p>

          <div className={styles.heroNames}>
            <span>{groomFirstName}</span>
            <i className="fa-solid fa-heart" />
            <span>{brideFirstName}</span>
          </div>

          <p className={styles.heroDate}>{formatDateDots(site.weddingDate)}</p>

          <div className={styles.heroSchedule}>
            <div>
              <strong>{ceremony.time}</strong>
              <span>{ceremony.title}</span>
            </div>

            <div>
              <strong>{reception.time}</strong>
              <span>THƯ MỜI TIỆC CƯỚI</span>
            </div>
          </div>

          <button className={styles.primaryButton} onClick={() => scrollToSection('rsvp')}>
            Xác nhận tham dự
          </button>
        </div>
      </header>

      <main>
        <section className={styles.parentsSection}>
          <div className={styles.container}>
            <div className={styles.doubleTitle}>
              <span>Nhà</span>
              <strong>Có</strong>
              <span>Hỷ</span>
            </div>

            <div className={styles.parentsGrid}>
              <div className={styles.parentCard}>
                <p>Nhà Trai</p>
                <h3>Ông: Nguyễn Văn A</h3>
                <h3>Bà: Trần Thị B</h3>
                <span>{site.groomAddress || 'Địa chỉ nhà trai'}</span>
              </div>

              <div className={styles.parentCard}>
                <p>Nhà Gái</p>
                <h3>Ông: Nguyễn Văn C</h3>
                <h3>Bà: Trần Thị D</h3>
                <span>{site.brideAddress || 'Địa chỉ nhà gái'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.invitationSection}>
          <div className={styles.container}>
            <p className={styles.smallCaps}>Trân trọng báo tin lễ thành hôn của</p>

            <div className={styles.fullNames}>
              <h2>{groomName}</h2>
              <span>&</span>
              <h2>{brideName}</h2>
            </div>

            <p className={styles.inviteText}>
              Chúng mình sắp bắt đầu một hành trình mới cùng nhau. Niềm vui này sẽ trọn vẹn hơn
              khi có bạn bên cạnh.
            </p>
          </div>
        </section>

        <section className={styles.eventsSection} id="events">
          <div className={styles.container}>
            <p className={styles.sectionKicker}>Invitation</p>
            <h2 className={styles.sectionTitle}>Lịch cưới</h2>

            <div className={styles.eventGrid}>
              {[ceremony, reception].map((event, index) => (
                <div className={styles.eventCard} key={index}>
                  <p className={styles.eventName}>{event.title}</p>

                  <h3>{event.time}</h3>

                  <div className={styles.eventDate}>{event.date}</div>

                  <p>{event.lunar}</p>

                  <strong>{event.place}</strong>

                  <span>{event.address}</span>

                  <button onClick={() => openMap(event.mapUrl)}>
                    <i className="fa-solid fa-location-dot" />
                    Xem chỉ đường
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.dateSection}>
          <div className={styles.container}>
            <div className={styles.calendarBox}>
              <p>Lễ Vu Quy</p>

              <div className={styles.bigDate}>
                <span>{formatDay(site.weddingDate)}</span>
                <div>
                  <strong>Tháng {formatMonth(site.weddingDate)}</strong>
                  <em>Năm {formatYear(site.weddingDate)}</em>
                </div>
              </div>

              <p>{site.ceremonyLunarDate || 'Tức ngày đẹp tháng lành'}</p>
            </div>

            <div className={styles.countdownBox}>
              <p className={styles.sectionKicker}>Save The Date</p>

              <h2>{coupleNames}</h2>

              <div className={styles.countdown}>
                <div>
                  <strong>{countdown.days}</strong>
                  <span>ngày</span>
                </div>
                <div>
                  <strong>{countdown.hours}</strong>
                  <span>giờ</span>
                </div>
                <div>
                  <strong>{countdown.minutes}</strong>
                  <span>phút</span>
                </div>
                <div>
                  <strong>{countdown.seconds}</strong>
                  <span>giây</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.loveSection}>
          <div className={styles.container}>
            <div className={styles.loveText}>
              <span>Love You</span>
              <p>
                Loại bỏ tất cả những lời yêu thương hoa mỹ, có lẽ tình yêu thực sự là sự đồng
                hành lâu dài.
              </p>
            </div>

            <div className={styles.loveImage}>
              <img
                src={gallery[1]?.imageUrl || site.heroImageUrl || 'https://picsum.photos/id/65/900/1200'}
                alt={coupleNames}
              />
            </div>
          </div>
        </section>

        <section className={styles.rsvpSection} id="rsvp">
          <div className={styles.container}>
            <p className={styles.sectionKicker}>RSVP</p>
            <h2 className={styles.sectionTitle}>Xác nhận tham dự</h2>

            <form className={styles.rsvpForm} onSubmit={submitRsvp}>
              <input
                type="text"
                placeholder="Họ và tên"
                value={rsvp.guestName}
                onChange={(e) => setRsvp({ ...rsvp, guestName: e.target.value })}
                required
              />

              <input
                type="tel"
                placeholder="Số điện thoại"
                value={rsvp.phone}
                onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })}
              />

              <select
                value={rsvp.attendanceStatus}
                onChange={(e) => setRsvp({ ...rsvp, attendanceStatus: e.target.value })}
              >
                <option value="GOING">Có, tôi sẽ tham dự</option>
                <option value="NOT_GOING">Tôi bận, rất tiếc không thể tham dự</option>
                <option value="MAYBE">Có thể sẽ đến</option>
              </select>

              <select
                value={rsvp.attendanceType}
                onChange={(e) => setRsvp({ ...rsvp, attendanceType: e.target.value })}
              >
                <option value="DIRECT">Khách nhà trai</option>
                <option value="ONLINE">Khách nhà gái</option>
              </select>

              <textarea
                placeholder="Lời nhắn..."
                rows="4"
                value={rsvp.note}
                onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
              />

              <button type="submit" disabled={submittingRsvp}>
                {submittingRsvp ? 'Đang gửi...' : 'Gửi xác nhận'}
              </button>

              {feedback && <p className={styles.feedback}>{feedback}</p>}
            </form>
          </div>
        </section>

        <section className={styles.gallerySection} id="gallery">
          <div className={styles.container}>
            <p className={styles.sectionKicker}>Album</p>
            <h2 className={styles.sectionTitle}>Love Story</h2>

            <div className={styles.galleryGrid}>
              {gallery.slice(0, 6).map((item, index) => (
                <div className={styles.galleryItem} key={item.id || index}>
                  <img src={item.imageUrl || item} alt={item.title || `Ảnh cưới ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.giftSection} id="gift">
          <div className={styles.container}>
            <p className={styles.sectionKicker}>Wedding Gift</p>
            <h2 className={styles.sectionTitle}>Gửi quà mừng tới Cô Dâu - Chú Rể</h2>

            <p className={styles.giftNote}>
              Sự hiện diện của bạn là món quà quý giá nhất. Nếu ở xa, bạn có thể gửi lời chúc
              qua mã QR bên dưới.
            </p>

            <div className={styles.bankGrid}>
              {bankAccounts.map((bank) => (
                <div className={styles.bankCard} key={bank.id}>
                  <div className={styles.bankQr}>
                    <img src={bank.qrImage} alt={`QR ${bank.bankName}`} />
                  </div>

                  <div className={styles.bankInfo}>
                    <h3>{bank.accountName}</h3>

                    <p>
                      <span>Ngân hàng</span>
                      <strong>{bank.bankName}</strong>
                    </p>

                    <p>
                      <span>Số tài khoản</span>
                      <strong>{bank.accountNumber}</strong>
                    </p>

                    <button onClick={() => copyBankNumber(bank.accountNumber)}>
                      <i className="fa-regular fa-copy" />
                      Sao chép STK
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.wishSection}>
          <div className={styles.container}>
            <p className={styles.sectionKicker}>Best Wishes</p>
            <h2 className={styles.sectionTitle}>Gửi lời chúc</h2>

            <div className={styles.wishList}>
              {wishes.slice(0, 4).map((item, index) => (
                <div className={styles.wishCard} key={item.id || index}>
                  <strong>{item.guestName || item.fullName || 'Khách mời'}</strong>
                  <p>{item.message}</p>
                </div>
              ))}
            </div>

            <button className={styles.primaryButton} onClick={() => setWishModalOpen(true)}>
              Gửi lời chúc
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{coupleNames}</p>
        <span>Thank you for being here.</span>
      </footer>

      {site.showMusic !== false && site.backgroundMusicUrl && (
        <audio ref={audioRef} src={site.backgroundMusicUrl} loop preload="auto" />
      )}

      {site.showMusic !== false && (
        <button className={styles.musicFloating} onClick={toggleMusic}>
          <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-music'}`} />
        </button>
      )}

      {wishModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setWishModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setWishModalOpen(false)}>
              ×
            </button>

            <h3>Gửi lời chúc</h3>

            <form onSubmit={submitWish}>
              <input
                placeholder="Tên của bạn"
                value={wish.guestName}
                onChange={(e) => setWish({ ...wish, guestName: e.target.value })}
              />

              <textarea
                placeholder="Gửi lời chúc..."
                rows="5"
                value={wish.message}
                onChange={(e) => setWish({ ...wish, message: e.target.value.slice(0, 500) })}
                required
              />

              <button type="submit" disabled={submittingWish}>
                {submittingWish ? 'Đang gửi...' : 'Gửi ngay'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
