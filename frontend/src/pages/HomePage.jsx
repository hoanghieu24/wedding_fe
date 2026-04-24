import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import api from '../api/client'
import styles from './HomePage.module.css'

const defaultGallery = [
  { id: 1, imageUrl: 'https://picsum.photos/id/20/800/920', title: 'Khoảnh khắc bên nhau' },
  { id: 2, imageUrl: 'https://picsum.photos/id/42/800/920', title: 'Ánh mắt yêu thương' },
  { id: 3, imageUrl: 'https://picsum.photos/id/132/800/920', title: 'Nụ cười hạnh phúc' },
  { id: 4, imageUrl: 'https://picsum.photos/id/145/800/920', title: 'Kỷ niệm ngọt ngào' },
  { id: 5, imageUrl: 'https://picsum.photos/id/173/800/920', title: 'Đi cùng nhau' },
  { id: 6, imageUrl: 'https://picsum.photos/id/168/800/920', title: 'Tình yêu vĩnh cửu' }
]

function parseWeddingDate(raw) {
  if (!raw) return new Date('2026-05-10T17:30:00+07:00')

  if (raw.includes('/')) {
    const [day, month, year] = raw.split('/')
    return new Date(`${year}-${month}-${day}T17:30:00+07:00`)
  }

  const maybe = new Date(raw)

  return Number.isNaN(maybe.getTime())
    ? new Date('2026-05-10T17:30:00+07:00')
    : maybe
}

function formatHeroDate(rawDate, location) {
  const date = parseWeddingDate(rawDate)

  const parts = [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getFullYear())
  ]

  return `${parts.join(' · ')}${location ? ` · ${location}` : ''}`
}

const petals = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${8 + Math.random() * 8}s`,
  scale: 0.6 + Math.random() * 0.8,
  rotate: `${Math.random() * 360}deg`
}))

export default function HomePage() {
  const [data, setData] = useState({
    site: {},
    gallery: [],
    wishes: []
  })

  const [wishModalOpen, setWishModalOpen] = useState(false)

  const [wish, setWish] = useState({
    guestName: '',
    message: ''
  })

  const [rsvp, setRsvp] = useState({
    guestName: '',
    phone: '',
    attendanceStatus: 'GOING',
    attendanceType: 'DIRECT',
    note: ''
  })

  const [feedback, setFeedback] = useState('')
  const [toast, setToast] = useState('')

  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const [scrolled, setScrolled] = useState(false)
  const [animateElements, setAnimateElements] = useState({})
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)

  const observerRef = useRef(null)
  const audioRef = useRef(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    document.title = 'Duy Trung ❤️ Thu Trang'
  }, [])

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
      setData(res.data)
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      showToast('Đang hiển thị nội dung mẫu.')
    }
  }, [showToast])

  useEffect(() => {
    load()

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [load])

  const site = data.site || {}

  const gallery = data.gallery?.length ? data.gallery : defaultGallery

  const wishes = data.wishes?.length
    ? data.wishes
    : [
        {
          id: 1,
          fullName: 'Bạn bè',
          message: 'Chúc hai bạn trăm năm hạnh phúc.',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          fullName: 'Gia đình',
          message: 'Mong hai con luôn yêu thương và đồng hành cùng nhau.',
          createdAt: '2024-01-20'
        }
      ]

  const coupleNames = useMemo(() => {
    if (site.groomName || site.brideName) {
      return `${site.groomName || 'Duy Trung'} & ${site.brideName || 'Thu Trang'}`
    }

    return site.heroTitle || 'Duy Trung & Thu Trang'
  }, [site])

  const venueItems = [
    {
      icon: 'fa-solid fa-ring',
      title: site.ceremonyTitle || 'Lễ thành hôn',
      location: site.ceremonyPlaceName || site.weddingLocation || 'Tư gia nhà trai',
      address: site.ceremonyAddress || 'Địa chỉ sẽ được cập nhật',
      time: site.ceremonyTime || '15:30',
      mapUrl: site.ceremonyMapUrl || site.weddingMapUrl
    },
    {
      icon: 'fa-solid fa-champagne-glasses',
      title: site.receptionTitle || 'Tiệc cưới',
      location: site.receptionPlaceName || 'Nhà hàng tiệc cưới',
      address: site.receptionAddress || 'Địa chỉ sẽ được cập nhật',
      time: site.receptionTime || '18:00',
      mapUrl: site.receptionMapUrl || site.weddingMapUrl
    }
  ]

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

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      showToast('Nhạc nền sẽ được cập nhật sớm.')
      return
    }

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.volume = 0.45

      audioRef.current
        .play()
        .then(() => {
          setMusicPlaying(true)
          setAudioAllowed(true)
        })
        .catch(() => {
          showToast('Chạm lại một lần nữa để bật nhạc nhé.')
        })
    }
  }, [musicPlaying, showToast])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateElements((prev) => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px'
      }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) {
        elements.forEach((el) => observerRef.current.unobserve(el))
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  return (
    <div className={styles.app}>
      {toast && (
        <div className={styles.toast}>
          <i className="fa-solid fa-heart" />
          <span>{toast}</span>
          <button onClick={() => setToast('')}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo} onClick={() => scrollToSection('hero')}>
            <i className="fa-solid fa-heart" />
            <span>T&T</span>
          </div>

          <ul className={styles.navMenu}>
            <li onClick={() => scrollToSection('venues')}>Địa điểm</li>
            <li onClick={() => scrollToSection('gallery')}>Ảnh cưới</li>
            <li onClick={() => scrollToSection('rsvp')}>Xác nhận</li>
          </ul>
        </div>
      </nav>

      <header className={styles.hero} id="hero">
        <div className={styles.heroOverlay} />

        <div className={styles.sparkleLayer}>
          {petals.map((petal) => (
            <span
              key={petal.id}
              className={styles.petal}
              style={{
                left: petal.left,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                transform: `scale(${petal.scale}) rotate(${petal.rotate})`
              }}
            />
          ))}
        </div>

        <div className={styles.heroContent}>
          <div
            className={`${styles.heroBadge} ${animateElements.hero ? styles.animated : ''}`}
            data-animate
            id="hero"
          >
            <i className="fa-solid fa-heart" />
            <span>Save the date</span>
          </div>

          <div className={styles.coupleLabel}>
            <span>Wedding Invitation</span>
          </div>

          <h1
            className={`${styles.heroTitle} ${animateElements.hero ? styles.animated : ''}`}
            data-animate
            id="hero"
          >
            {coupleNames}
          </h1>

          <p
            className={`${styles.heroDesc} ${animateElements.hero ? styles.animated : ''}`}
            data-animate
            id="hero"
          >
            {site.welcomeMessage || 'Trân trọng mời bạn đến chung vui cùng chúng tôi.'}
          </p>

          <div
            className={`${styles.heroDate} ${animateElements.hero ? styles.animated : ''}`}
            data-animate
            id="hero"
          >
            {formatHeroDate(site.weddingDate, site.weddingLocation)}
          </div>

          <div className={styles.heroActions}>
            <button onClick={() => scrollToSection('rsvp')} className={styles.btnPrimary}>
              <i className="fa-solid fa-envelope-open-text" />
              Xác nhận tham dự
            </button>

            <button onClick={() => scrollToSection('venues')} className={styles.btnOutline}>
              <i className="fa-solid fa-location-dot" />
              Xem địa điểm
            </button>
          </div>
        </div>

        <button onClick={() => scrollToSection('countdown')} className={styles.scrollDown}>
          <i className="fa-solid fa-chevron-down" />
        </button>
      </header>

      <main>
        <section className={styles.section} id="countdown">
          <div className={styles.container}>
            <div className={styles.countdownWrap}>
              <h2 className={styles.sectionTitle} data-animate id="countdownTitle">
                Ngày trọng đại
              </h2>

              <p className={styles.countdownDesc}>Hẹn gặp bạn trong ngày cưới.</p>

              <div className={styles.timer}>
                {[
                  ['Ngày', countdown.days],
                  ['Giờ', countdown.hours],
                  ['Phút', countdown.minutes],
                  ['Giây', countdown.seconds]
                ].map(([label, value], idx) => (
                  <div
                    className={`${styles.timerCard} ${
                      animateElements.countdownTitle ? styles.bounceIn : ''
                    }`}
                    data-animate
                    id="countdownTitle"
                    key={label}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className={styles.timerNumber}>{value}</div>
                    <div className={styles.timerLabel}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="venues">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} data-animate id="venuesTitle">
              Địa điểm
            </h2>

            <p className={styles.sectionSubtitle}>Thông tin buổi lễ và tiệc mừng.</p>

            <div className={styles.venuesGrid}>
              {venueItems.map((venue, idx) => (
                <div
                  className={`${styles.venueCard} ${
                    animateElements.venuesTitle ? styles.slideInUp : ''
                  }`}
                  data-animate
                  id="venuesTitle"
                  key={idx}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className={styles.venueIcon}>
                    <i className={venue.icon} />
                  </div>

                  <h3>{venue.title}</h3>

                  <p>
                    <strong>{venue.location}</strong>
                    <br />
                    {venue.address}
                    <br />
                    {venue.time}
                  </p>

                  <button className={styles.venueBtn} onClick={() => openMap(venue.mapUrl)}>
                    <i className="fa-solid fa-location-dot" /> Chỉ đường
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {site.showGallery !== false && (
          <section className={`${styles.section} ${styles.sectionSoft}`} id="gallery">
            <div className={styles.container}>
              <h2 className={styles.sectionTitle} data-animate id="galleryTitle">
                Khoảnh khắc
              </h2>

              <div className={styles.sectionDivider} data-animate id="galleryTitle">
                <i className="fa-solid fa-camera" />
              </div>

              <div className={styles.galleryGrid}>
                {gallery.map((item, index) => (
                  <div
                    className={`${styles.galleryItem} ${
                      animateElements.galleryTitle ? styles.scaleIn : ''
                    }`}
                    data-animate
                    id="galleryTitle"
                    key={item.id || index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <img
                      src={item.imageUrl || item}
                      alt={item.title || `Khoảnh khắc ${index + 1}`}
                    />

                    <div className={styles.galleryOverlay}>
                      <i className="fa-regular fa-heart" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.section} id="rsvp">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} data-animate id="rsvpForm">
              Bạn sẽ đến chứ?
            </h2>

            <p className={styles.sectionSubtitle}>Gửi xác nhận để chúng mình chuẩn bị chu đáo hơn.</p>

            <div
              className={`${styles.rsvpShell} ${
                animateElements.rsvpForm ? styles.fadeInUp : ''
              }`}
              data-animate
              id="rsvpForm"
            >
              <div className={styles.rsvpDecor}>
                <span>RSVP</span>
                <strong>Hẹn gặp bạn</strong>
                <p>Một lời xác nhận nhỏ là niềm vui rất lớn với chúng mình.</p>
              </div>

              <form className={styles.rsvpForm} onSubmit={submitRsvp}>
                <input
                  type="text"
                  className={styles.field}
                  placeholder="Họ và tên *"
                  required
                  value={rsvp.guestName}
                  onChange={(e) => setRsvp({ ...rsvp, guestName: e.target.value })}
                />

                <input
                  type="tel"
                  className={styles.field}
                  placeholder="Số điện thoại"
                  value={rsvp.phone}
                  onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })}
                />

                <select
                  className={styles.field}
                  value={rsvp.attendanceStatus}
                  onChange={(e) => setRsvp({ ...rsvp, attendanceStatus: e.target.value })}
                >
                  <option value="GOING">Tôi sẽ tham dự</option>
                  <option value="MAYBE">Có thể sẽ đến</option>
                  <option value="NOT_GOING">Rất tiếc không thể đến</option>
                </select>

                <select
                  className={styles.field}
                  value={rsvp.attendanceType}
                  onChange={(e) => setRsvp({ ...rsvp, attendanceType: e.target.value })}
                >
                  <option value="DIRECT">Tham dự trực tiếp</option>
                  <option value="ONLINE">Tham dự online</option>
                </select>

                <textarea
                  className={styles.field}
                  placeholder="Lời nhắn cho cô dâu chú rể..."
                  rows="3"
                  value={rsvp.note}
                  onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
                />

                <button type="submit" className={styles.submitBtn} disabled={submittingRsvp}>
                  {submittingRsvp ? 'Đang gửi...' : 'Gửi xác nhận'}
                  <i className="fa-solid fa-heart" />
                </button>

                {feedback && <div className={styles.feedback}>{feedback}</div>}
              </form>
            </div>
          </div>
        </section>

        {site.showWishes !== false && (
          <section className={`${styles.section} ${styles.sectionSoft}`} id="wishes">
            <div className={styles.container}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Lời chúc
              </h2>

              <p className={styles.sectionSubtitle} style={{ marginBottom: 20 }}>
                Gửi một lời chúc nhỏ cho chúng mình.
              </p>

              <div className={styles.guestMessages}>
                {wishes.slice(0, 6).map((item, index) => (
                  <div
                    className={`${styles.wishCard} ${
                      animateElements.wishesTitle ? styles.fadeInUp : ''
                    }`}
                    data-animate
                    id="wishesTitle"
                    key={item.id || index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={styles.wishAvatar}>
                      <i className="fa-solid fa-comment-dots" />
                    </div>

                    <div className={styles.wishContent}>
                      <strong>{item.guestName || item.fullName || 'Khách mời'}</strong>
                      <p>{item.message}</p>
                      {item.createdAt && (
                        <small>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.wishAction}>
                <button className={styles.btnPrimary} onClick={() => setWishModalOpen(true)}>
                  <i className="fa-solid fa-pen-fancy" /> Gửi lời chúc
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>{coupleNames}</p>
          <small>Thank you for being here.</small>
        </div>
      </footer>

      {site.showMusic !== false && site.backgroundMusicUrl && (
        <>
          <audio ref={audioRef} src={site.backgroundMusicUrl} loop preload="auto" />

          <button className={styles.musicFloatingBtn} onClick={toggleMusic}>
            <span className={styles.musicIcon}>
              <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-music'}`} />
            </span>

            <span className={styles.musicText}>
              {musicPlaying ? 'Đang phát' : 'Bật nhạc'}
            </span>
          </button>
        </>
      )}

      {wishModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setWishModalOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Gửi lời chúc</h3>

              <button className={styles.modalClose} onClick={() => setWishModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={submitWish}>
              <input
                className={styles.field}
                placeholder="Tên của bạn"
                value={wish.guestName}
                onChange={(e) => setWish({ ...wish, guestName: e.target.value })}
              />

              <textarea
                className={styles.field}
                placeholder="Viết lời chúc..."
                rows="4"
                value={wish.message}
                onChange={(e) => setWish({ ...wish, message: e.target.value.slice(0, 500) })}
                required
              />

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitBtn} disabled={submittingWish}>
                  {submittingWish ? 'Đang gửi...' : 'Gửi ngay'}
                </button>

                <button
                  type="button"
                  className={styles.btnOutline}
                  onClick={() => setWishModalOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
