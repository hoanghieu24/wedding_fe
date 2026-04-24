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

const defaultSongs = [
  { name: 'Lạ Lùng', artist: 'Vũ.' },
  { name: 'Perfect', artist: 'Ed Sheeran' },
  { name: 'Hơn Cả Yêu', artist: 'Đức Phúc' }
]

const bankAccounts = [
  {
    id: 1,
    bankName: 'VietinBank',
    accountName: 'Hoang Thi Thu Trang',
    accountNumber: '106869089934',
    note: 'Mừng cưới cô dâu chú rể',
    qrImage:
      'https://qr.sepay.vn/img?bank=VietinBank&acc=106869089934&template=qronly&amount=&des='
  },
  {
    id: 2,
    bankName: 'MB Bank',
    accountName: 'TRAN THI B',
    accountNumber: '0988776655',
    note: 'Chúc mừng hạnh phúc',
    qrImage:
      'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=MBBANK-TRAN%20THI%20B-0988776655'
  }
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

  return `⸻ ${parts.join(' · ')} — ${location || 'Nghệ An'} ⸻`
}

const petals = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${8 + Math.random() * 8}s`,
  scale: 0.6 + Math.random() * 0.8,
  rotate: `${Math.random() * 360}deg`
}))

export default function HomePage() {
  const [data, setData] = useState({ site: {}, gallery: [], wishes: [] })
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

  const [activeNav, setActiveNav] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [animateElements, setAnimateElements] = useState({})
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)

  const heroRef = useRef(null)
  const observerRef = useRef(null)
  const audioRef = useRef(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    document.title = 'Duy Trung ❤️ Thu Trang | Thiệp cưới sang trọng'
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setToast('')
    }, 3200)
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await api.get('/public/site')
      setData(res.data)
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      showToast('Không tải được dữ liệu. Đang hiển thị nội dung mẫu.')
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
          fullName: 'Cô dâu chú rể',
          message: 'Chúc tình yêu bền lâu, dịu dàng và hạnh phúc mãi mãi. ❤️',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          fullName: 'Gia đình',
          message: 'Chúc hai con luôn yêu thương, trân trọng và nắm tay nhau thật lâu.',
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          fullName: 'Bạn bè',
          message: 'Một hành trình mới thật đẹp đang bắt đầu. Chúc hai bạn thật viên mãn.',
          createdAt: '2024-01-25'
        }
      ]

  const coupleNames = useMemo(() => {
    if (site.groomName || site.brideName) {
      return `${site.groomName || 'Duy Trung'} & ${site.brideName || 'Thu Trang'}`
    }

    return site.heroTitle || 'Duy Trung & Thu Trang'
  }, [site])

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
        .catch((err) => {
          console.log('Không thể phát nhạc tự động:', err)
        })
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
          showToast('Bạn hãy chạm lại một lần nữa để bật nhạc nhé.')
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
        threshold: 0.2,
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

      const sections = ['loveStory', 'venues', 'rsvp']
      const scrollPos = window.scrollY + 100

      for (const section of sections) {
        const el = document.getElementById(section)

        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveNav(section)
          break
        }
      }
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

  const submitRsvp = async (e) => {
    e.preventDefault()

    if (!rsvp.guestName.trim()) {
      showToast('Vui lòng nhập họ tên để xác nhận.')
      return
    }

    try {
      setSubmittingRsvp(true)

      await api.post('/public/rsvp', rsvp)

      const messageMap = {
        GOING: `🎉 Cảm ơn ${rsvp.guestName}, bạn đã xác nhận tham dự ( bạn đã gửi lời chúc riêng tư , nếu muốn công khai hãy xuống cuối trang để chúc công khai , xin cảm ơn ) !`,
        MAYBE: `✨ Cảm ơn ${rsvp.guestName}, chúng tôi sẽ chờ tin bạn nhé.( bạn đã gửi lời chúc riêng tư , nếu muốn công khai hãy xuống cuối trang để chúc công khai , xin cảm ơn ) `,
        NOT_GOING: `💌 Cảm ơn ${rsvp.guestName}, tình cảm của bạn vẫn luôn trọn vẹn.( bạn đã gửi lời chúc riêng tư , nếu muốn công khai hãy xuống cuối trang để chúc công khai , xin cảm ơn ) `
      }

      setFeedback(messageMap[rsvp.attendanceStatus] || 'Đã gửi xác nhận thành công.')
      showToast('Gửi xác nhận thành công.')

      setRsvp({
        guestName: '',
        phone: '',
        attendanceStatus: 'GOING',
        attendanceType: 'DIRECT',
        note: ''
      })

      setTimeout(() => setFeedback(''), 4200)
    } catch (error) {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau.')
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
      showToast('Cảm ơn lời chúc tốt đẹp của bạn!')
    } catch (error) {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      setSubmittingWish(false)
    }
  }

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

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      setActiveNav(id)
    }
  }, [])

  const copyBankNumber = useCallback(
    async (accountNumber) => {
      try {
        await navigator.clipboard.writeText(accountNumber)
        showToast('Đã sao chép số tài khoản.')
      } catch (error) {
        showToast('Không thể sao chép, bạn vui lòng copy thủ công nhé.')
      }
    },
    [showToast]
  )

  const venueItems = [
    {
      icon: 'fa-solid fa-church',
      title: site.ceremonyTitle || 'Lễ thành hôn',
      location: site.ceremonyPlaceName || site.weddingLocation || 'Nhà thờ Lớn Hà Nội',
      address: site.ceremonyAddress || '40 Nhà Chung, Hoàn Kiếm',
      time: site.ceremonyTime || '15:30 - 17:00',
      mapUrl: site.ceremonyMapUrl || site.weddingMapUrl
    },
    {
      icon: 'fa-solid fa-champagne-glasses',
      title: site.receptionTitle || 'Tiệc cưới',
      location: site.receptionPlaceName || 'Khách sạn Metropole · Grand Ballroom',
      address: site.receptionAddress || '15 Lý Thường Kiệt, Hà Nội',
      time: site.receptionTime || '18:00 - 22:00',
      mapUrl: site.receptionMapUrl || site.weddingMapUrl
    }
  ]

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
            <li
              className={activeNav === 'loveStory' ? styles.active : ''}
              onClick={() => scrollToSection('loveStory')}
            >
              Chuyện tình
            </li>

            <li
              className={activeNav === 'venues' ? styles.active : ''}
              onClick={() => scrollToSection('venues')}
            >
              Địa điểm
            </li>

            <li
              className={activeNav === 'rsvp' ? styles.active : ''}
              onClick={() => scrollToSection('rsvp')}
            >
              Xác nhận
            </li>
          </ul>
        </div>
      </nav>

      <header className={styles.hero} id="hero" ref={heroRef}>
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

        <div className={styles.coupleSilhouette}>
          <div className={styles.brideGroomIcon}>💍</div>
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

          <br />

          <div className={styles.coupleLabel}>
            <span className={styles.brideText}>Chú rể</span>
            <span className={styles.heartDivider}>❤</span>
            <span className={styles.groomText}>Cô dâu</span>
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
            {site.welcomeMessage ||
              'Một lời hẹn giữa yêu thương, để cùng nhau chứng kiến khoảnh khắc đẹp nhất của chúng tôi trong sắc đỏ nồng nàn và hạnh phúc.'}
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

        <button onClick={() => scrollToSection('loveStory')} className={styles.scrollDown}>
          <i className="fa-solid fa-chevron-down" />
          <span>Cuộn xuống</span>
        </button>
      </header>

      <main>
        <section className={styles.section} id="loveStory">
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <div
                className={`${styles.glassCard} ${styles.storyCopy} ${
                  animateElements.loveStory ? styles.fadeInUp : ''
                }`}
                data-animate
                id="loveStory"
              >
              <h2 className={styles.sectionTitleLeft} style={{ fontSize: '100px' }}>
  Chuyện tình mang sắc đỏ
</h2>

                <div className={styles.sectionDividerLeft}>
                  <i className="fa-solid fa-heart" />
                </div>

                {(site.story ||
                  'Duy Trung và Thu Trang – hai mảnh ghép tưởng chừng xa lạ lại tìm thấy nhau giữa vô vàn điều đẹp đẽ của cuộc sống. Từ những lần gặp gỡ bình dị, những cuộc trò chuyện dài và sự đồng hành chân thành, cả hai dần nhận ra mình chính là bến bờ bình yên của nhau.\n\nHành trình yêu thương được viết bằng những chuyến đi, tiếng cười và sự thấu hiểu. Và giờ đây, tình yêu ấy sẽ được đơm hoa trong ngày trọng đại, nơi gia đình và bạn bè cùng chứng kiến.'
                )
                  .split(/\n+/)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                <p className={styles.quote}>
                  <i className="fa-solid fa-heart" /> “Anh không cần một tình yêu hoàn hảo, anh chỉ cần em – người đồng hành trọn đời.”
                </p>
              </div>

              <div
                className={`${styles.storyMedia} ${animateElements.loveStory ? styles.fadeInUp : ''}`}
                data-animate
                id="loveStory"
                style={{ animationDelay: '0.2s' }}
              >
                <img src={site.heroImageUrl || 'https://picsum.photos/id/104/900/1100'} alt={coupleNames} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.countdownWrap}>
              <h2 className={styles.sectionTitle} data-animate id="countdown">
                Ngày trọng đại
              </h2>

              <p className={styles.countdownDesc}>
                Chúng tôi rất mong được gặp bạn trong ngày hạnh phúc nhất của mình.
              </p>

              <div className={styles.timer}>
                {[
                  ['Ngày', countdown.days],
                  ['Giờ', countdown.hours],
                  ['Phút', countdown.minutes],
                  ['Giây', countdown.seconds]
                ].map(([label, value], idx) => (
                  <div
                    className={`${styles.timerCard} ${animateElements.countdown ? styles.bounceIn : ''}`}
                    data-animate
                    id="countdown"
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
            <h2 className={styles.sectionTitle} data-animate id="venues">
              Lễ cưới &amp; Tiệc mừng
            </h2>

            <p className={styles.sectionSubtitle}>
              Mọi yêu thương sẽ hội tụ trong một ngày thật đẹp, tại những nơi lưu giữ khoảnh khắc thiêng liêng nhất của chúng tôi.
            </p>

            <div className={styles.venuesGrid}>
              {venueItems.map((venue, idx) => (
                <div
                  className={`${styles.venueCard} ${animateElements.venues ? styles.slideInUp : ''}`}
                  data-animate
                  id="venues"
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

              <div
                className={`${styles.venueCard} ${animateElements.venues ? styles.slideInUp : ''}`}
                data-animate
                id="venues"
                style={{ animationDelay: '0.3s' }}
              >
                <div className={styles.venueIcon}>
                  <i className="fa-solid fa-qrcode" />
                </div>

                <h3>Mã QR check-in</h3>

                <p>
                  {site.qrDescription ||
                    'Quét mã tại cửa để nhận ảnh cưới kỷ niệm và món quà lưu niệm nhỏ từ cô dâu chú rể.'}
                </p>

                <button
                  className={styles.venueBtn}
                  onClick={() => {
                    if (site.qrImageUrl) {
                      window.open(site.qrImageUrl, '_blank')
                    } else {
                      showToast('Mã QR sẽ được cập nhật sớm.')
                    }
                  }}
                >
                  <i className="fa-solid fa-image" /> {site.qrButtonText || 'Xem QR'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {site.showGallery !== false && (
          <section className={`${styles.section} ${styles.sectionSoft}`}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle} data-animate id="gallery">
                Khoảnh khắc đỏ
              </h2>

              <div className={styles.sectionDivider} data-animate id="gallery">
                <i className="fa-solid fa-camera" />
              </div>

              <div className={styles.galleryGrid}>
                {gallery.map((item, index) => (
                  <div
                    className={`${styles.galleryItem} ${animateElements.gallery ? styles.scaleIn : ''}`}
                    data-animate
                    id="gallery"
                    key={item.id || index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <img src={item.imageUrl || item} alt={item.title || `Khoảnh khắc ${index + 1}`} />

                    <div className={styles.galleryOverlay}>
                      <i className="fa-regular fa-heart" />
                    </div>
                  </div>
                ))}
              </div>

              <p className={styles.galleryNote}>
                <i className="fa-solid fa-hashtag" /> #TrungTrangWedding — lưu giữ mọi khoảnh khắc yêu thương
              </p>
            </div>
          </section>
        )}

        {site.showMusic !== false && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div
                className={`${styles.playlistCard} ${animateElements.music ? styles.fadeInUp : ''}`}
                data-animate
                id="music"
              >
                <div className={styles.playlistIcon}>
                  <i className="fa-solid fa-headphones" />
                </div>

                <h3>Giai điệu trái tim</h3>

                <p>{site.backgroundMusicTitle || 'Những bài hát Duy Trung & Thu Trang dành tặng nhau'}</p>

                <div className={styles.playlistTags}>
                  {(site.songs?.length ? site.songs : defaultSongs).map((song, idx) => (
                    <div className={styles.playlistTag} key={idx}>
                      <i className="fa-solid fa-music" />{' '}
                      {typeof song === 'string' ? song : `${song.name} - ${song.artist}`}
                    </div>
                  ))}
                </div>

                <button className={styles.btnPrimary} onClick={toggleMusic}>
                  <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-play'}`} />
                  {musicPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc cưới'}
                </button>
              </div>
            </div>
          </section>
        )}

        <section className={`${styles.section} ${styles.sectionSoft}`}>
          <div className={styles.container}>
            <div className={styles.thanksGrid}>
              <div
                className={`${styles.thanksMedia} ${animateElements.thanks ? styles.slideInLeft : ''}`}
                data-animate
                id="thanks"
              >
                <img src={site.thanksImageUrl || 'https://picsum.photos/id/64/900/1100'} alt="Lời tri ân" />
              </div>

              <div
                className={`${styles.glassCard} ${styles.thanksCopy} ${
                  animateElements.thanks ? styles.slideInRight : ''
                }`}
                data-animate
                id="thanks"
              >
                <h2 className={styles.sectionTitleLeft}>Lời tri ân</h2>

                <div className={styles.sectionDividerLeft}>
                  <i className="fa-solid fa-heart" />
                </div>

                <p>
                  Gửi đến ông bà, cha mẹ, người thân và bạn bè yêu quý — cảm ơn vì tất cả sự yêu thương,
                  chở che và đồng hành để chúng con trưởng thành như hôm nay.
                </p>

                <p>
                  Cảm ơn những cái nắm tay, những lời chúc, những sự hiện diện âm thầm nhưng ấm áp trong suốt hành trình yêu thương của chúng con.
                </p>

                <p>
                  Sự hiện diện của mọi người trong ngày trọng đại này chính là món quà quý giá nhất, là kỷ niệm mà chúng con sẽ luôn gìn giữ.
                </p>

                <p className={styles.quote}>
                  “Tình yêu không chỉ là nhìn về phía nhau, mà còn cùng nhau nhìn về một hướng.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="rsvp">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} data-animate id="rsvpForm">
              Xác nhận tham dự
            </h2>

            <p className={styles.sectionSubtitle}>
              Hãy để lại lời xác nhận và những lời chúc ngọt ngào dành cho cô dâu chú rể.
            </p>

            <div
              className={`${styles.rsvpShell} ${animateElements.rsvpForm ? styles.fadeInUp : ''}`}
              data-animate
              id="rsvpForm"
            >
              <div className={styles.rsvpDecor}>
                <span>RSVP</span>
                <strong>Hẹn gặp bạn trong ngày vui</strong>
                <p>Một lời xác nhận nhỏ sẽ giúp cô dâu chú rể chuẩn bị chu đáo hơn.</p>
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
                  value={rsvp.attendanceType}
                  onChange={(e) => setRsvp({ ...rsvp, attendanceType: e.target.value })}
                >
                  <option value="DIRECT">🥂 Tham dự trực tiếp</option>
                  <option value="ONLINE">💻 Tham dự online</option>
                </select>

                <select
                  className={styles.field}
                  value={rsvp.attendanceStatus}
                  onChange={(e) => setRsvp({ ...rsvp, attendanceStatus: e.target.value })}
                >
                  <option value="GOING">🥂 Chắc chắn tham dự</option>
                  <option value="MAYBE">✨ Có thể sẽ đến</option>
                  <option value="NOT_GOING">💌 Rất tiếc không thể tham dự</option>
                </select>

                <textarea
                  className={styles.field}
                  placeholder="Lời chúc tốt đẹp dành cho cô dâu chú rể..."
                  rows="3"
                  value={rsvp.note}
                  onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
                />

                <button type="submit" className={styles.submitBtn} disabled={submittingRsvp}>
                  {submittingRsvp ? 'ĐANG GỬI...' : 'GỬI LỜI XÁC NHẬN'} <i className="fa-solid fa-heart" />
                </button>

                {feedback && <div className={styles.feedback}>{feedback}</div>}
              </form>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionSoft}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Mừng cưới</h2>

            <p className={styles.sectionSubtitle}>
              Nếu bạn muốn gửi quà mừng từ xa, có thể dùng một trong hai tài khoản dưới đây 💖
            </p>

            <div className={styles.bankGrid}>
              {bankAccounts.map((bank) => (
                <div key={bank.id} className={styles.bankCard}>
                  <div className={styles.bankHeader}>
                    <div className={styles.bankIcon}>
                      <i className="fa-solid fa-building-columns" />
                    </div>

                    <div>
                      <h3>{bank.bankName}</h3>
                      <p>{bank.note}</p>
                    </div>
                  </div>

                  <div className={styles.bankBody}>
                    <div className={styles.bankQrWrap}>
                      <img src={bank.qrImage} alt={`QR ${bank.bankName}`} className={styles.bankQr} />
                    </div>

                    <div className={styles.bankInfo}>
                      <div className={styles.bankLine}>
                        <span>Ngân hàng</span>
                        <strong>{bank.bankName}</strong>
                      </div>

                      <div className={styles.bankLine}>
                        <span>Chủ tài khoản</span>
                        <strong>{bank.accountName}</strong>
                      </div>

                      <div className={styles.bankLine}>
                        <span>Số tài khoản</span>
                        <strong>{bank.accountNumber}</strong>
                      </div>

                      <button className={styles.copyBankBtn} onClick={() => copyBankNumber(bank.accountNumber)}>
                        <i className="fa-regular fa-copy" /> Sao chép STK
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {site.showWishes !== false && (
          <section className={`${styles.section} ${styles.sectionSoft}`}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Lời chúc ngọt ngào
              </h2>

              <p className={styles.sectionSubtitle} style={{ marginBottom: 20 }}>
                Những lời chúc nhỏ sẽ làm ngày vui của chúng tôi thêm trọn vẹn.
              </p>

              <div className={styles.guestMessages}>
                {wishes.slice(0, 9).map((item, index) => (
                  <div
                    className={`${styles.wishCard} ${animateElements.wishes ? styles.fadeInUp : ''}`}
                    data-animate
                    id="wishes"
                    key={item.id || index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={styles.wishAvatar}>
                      <i className="fa-solid fa-comment-dots" />
                    </div>

                    <div className={styles.wishContent}>
                      <strong>{item.guestName || item.fullName || 'Khách mời'}</strong>
                      <p>{item.message}</p>
                      {item.createdAt && <small>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</small>}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.wishAction}>
                <button className={styles.btnPrimary} onClick={() => setWishModalOpen(true)}>
                  <i className="fa-solid fa-pen-fancy" /> Gửi lời chúc công khai
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>{coupleNames} — Trân trọng cảm ơn sự hiện diện của bạn.</p>

          <div className={styles.footerSocial}>
            <i className="fa-brands fa-facebook" />
            <i className="fa-brands fa-instagram" />
            <i className="fa-solid fa-camera" />
          </div>

          <p>
            <i className="fa-solid fa-camera" /> #TrungTrangWedding
          </p>

          <small>
            Made with <i className="fa-solid fa-heart" style={{ color: '#e74c3c' }} /> — Hoàng Hiếu
          </small>
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
              {musicPlaying ? 'Đang phát nhạc' : 'Bật nhạc cưới'}
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
                placeholder="Viết lời chúc tới Duy Trung & Thu Trang"
                rows="4"
                value={wish.message}
                onChange={(e) => setWish({ ...wish, message: e.target.value.slice(0, 500) })}
                required
              />

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitBtn} disabled={submittingWish}>
                  {submittingWish ? 'Đang gửi...' : 'Gửi ngay'}
                </button>

                <button type="button" className={styles.btnOutline} onClick={() => setWishModalOpen(false)}>
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
