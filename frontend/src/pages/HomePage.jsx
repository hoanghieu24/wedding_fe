import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/client'
import styles from './HomePage.module.css'

const defaultGallery = [
  { id: 1, imageUrl: 'https://picsum.photos/id/20/900/1100', title: 'Khoảnh khắc bên nhau' },
  { id: 2, imageUrl: 'https://picsum.photos/id/42/900/1100', title: 'Ánh mắt yêu thương' },
  { id: 3, imageUrl: 'https://picsum.photos/id/132/900/1100', title: 'Nụ cười hạnh phúc' },
  { id: 4, imageUrl: 'https://picsum.photos/id/145/900/1100', title: 'Kỷ niệm ngọt ngào' },
  { id: 5, imageUrl: 'https://picsum.photos/id/173/900/1100', title: 'Đi cùng nhau' },
  { id: 6, imageUrl: 'https://picsum.photos/id/168/900/1100', title: 'Tình yêu vĩnh cửu' }
]

const defaultSongs = [
  { name: 'Lạ Lùng', artist: 'Vũ.' },
  { name: 'Perfect', artist: 'Ed Sheeran' },
  { name: 'Hơn Cả Yêu', artist: 'Đức Phúc' }
]

const defaultWishes = [
  {
    id: 1,
    guestName: 'Gia đình',
    message: 'Chúc hai con luôn yêu thương, trân trọng và nắm tay nhau đi qua mọi mùa trong đời.',
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    guestName: 'Bạn bè',
    message: 'Một hành trình mới thật đẹp đang bắt đầu. Chúc hai bạn mãi hạnh phúc và viên mãn.',
    createdAt: '2026-01-20'
  },
  {
    id: 3,
    guestName: 'Người thân',
    message: 'Chúc tình yêu của hai con luôn dịu dàng, bền lâu và ngập tràn tiếng cười.',
    createdAt: '2026-01-25'
  }
]

const bankAccounts = [
  {
    id: 1,
    bankName: 'VietinBank',
    accountName: 'Hoang Thi Thu Trang',
    accountNumber: '106869089934',
    note: 'Mừng cưới cô dâu chú rể',
    qrImage: 'https://qr.sepay.vn/img?bank=VietinBank&acc=106869089934&template=qronly&amount=&des='
  },
  {
    id: 2,
    bankName: 'MB Bank',
    accountName: 'TRAN THI B',
    accountNumber: '0988776655',
    note: 'Chúc mừng hạnh phúc',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=MBBANK-TRAN%20THI%20B-0988776655'
  }
]

const floatingHearts = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${9 + Math.random() * 9}s`,
  size: `${8 + Math.random() * 14}px`,
  opacity: 0.28 + Math.random() * 0.55
}))

function parseWeddingDate(raw) {
  if (!raw) return new Date('2026-05-10T17:30:00+07:00')

  if (String(raw).includes('/')) {
    const [day, month, year] = String(raw).split('/')
    return new Date(`${year}-${month}-${day}T17:30:00+07:00`)
  }

  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? new Date('2026-05-10T17:30:00+07:00') : date
}

function formatHeroDate(rawDate, location) {
  const date = parseWeddingDate(rawDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}${location ? ` · ${location}` : ' · Nghệ An'}`
}

function formatWishDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN')
}

export default function HomePage() {
  const [data, setData] = useState({ site: {}, gallery: [], wishes: [] })
  const [loading, setLoading] = useState(true)
  const [wishModalOpen, setWishModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeNav, setActiveNav] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [visibleMap, setVisibleMap] = useState({})
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)

  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

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

  const audioRef = useRef(null)
  const toastTimerRef = useRef(null)

  const showToast = useCallback((type, message) => {
    setToast({ type, message })

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setToast(null)
    }, 3600)
  }, [])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/public/site')
      setData(res.data || { site: {}, gallery: [], wishes: [] })
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      showToast('error', 'Không tải được dữ liệu thiệp cưới. Đang hiển thị nội dung mẫu.')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    document.title = 'Duy Trung ❤️ Thu Trang | Wedding Invitation'
    load()

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [load])

  const site = data.site || {}
  const gallery = data.gallery?.length ? data.gallery : defaultGallery
  const wishes = data.wishes?.length ? data.wishes : defaultWishes

  const coupleNames = useMemo(() => {
    if (site.groomName || site.brideName) {
      return `${site.groomName || 'Duy Trung'} & ${site.brideName || 'Thu Trang'}`
    }

    return site.heroTitle || 'Duy Trung & Thu Trang'
  }, [site.brideName, site.groomName, site.heroTitle])

  const heroImage = site.heroImageUrl || 'https://picsum.photos/id/104/1100/1300'
  const thanksImage = site.thanksImageUrl || 'https://picsum.photos/id/64/900/1100'

  const venueItems = useMemo(() => [
    {
      icon: 'fa-solid fa-church',
      label: 'Ceremony',
      title: site.ceremonyTitle || 'Lễ thành hôn',
      location: site.ceremonyPlaceName || site.weddingLocation || 'Tư gia nhà gái',
      address: site.ceremonyAddress || 'Địa chỉ sẽ được cập nhật trên thiệp',
      time: site.ceremonyTime || '15:30 - 17:00',
      mapUrl: site.ceremonyMapUrl || site.weddingMapUrl
    },
    {
      icon: 'fa-solid fa-champagne-glasses',
      label: 'Reception',
      title: site.receptionTitle || 'Tiệc cưới',
      location: site.receptionPlaceName || 'Trung tâm tiệc cưới',
      address: site.receptionAddress || 'Địa chỉ sẽ được cập nhật trên thiệp',
      time: site.receptionTime || '18:00 - 22:00',
      mapUrl: site.receptionMapUrl || site.weddingMapUrl
    }
  ], [site])

  useEffect(() => {
    const targetDate = parseWeddingDate(site.weddingDate)

    const tick = () => {
      const diff = targetDate.getTime() - Date.now()

      if (diff <= 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const name = entry.target.getAttribute('data-section')
            if (name) {
              setVisibleMap(prev => ({ ...prev, [name]: true }))
            }
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -70px 0px'
      }
    )

    const elements = document.querySelectorAll('[data-section]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [loading])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 28)

      const sections = ['hero', 'story', 'schedule', 'gallery', 'rsvp', 'wishes']
      const position = window.scrollY + 160

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element && position >= element.offsetTop && position < element.offsetTop + element.offsetHeight) {
          setActiveNav(section)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id)
    if (!element) return

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [])

  const openMap = useCallback((url) => {
    if (!url) {
      showToast('info', 'Địa chỉ bản đồ sẽ được cập nhật sớm.')
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }, [showToast])

  const toggleMusic = async () => {
    if (!audioRef.current) {
      showToast('info', 'Nhạc nền sẽ được cập nhật sớm.')
      return
    }

    try {
      if (musicPlaying) {
        audioRef.current.pause()
        setMusicPlaying(false)
      } else {
        audioRef.current.volume = 0.45
        await audioRef.current.play()
        setMusicPlaying(true)
      }
    } catch (error) {
      showToast('error', 'Trình duyệt cần bạn chạm/click thêm lần nữa để phát nhạc.')
    }
  }

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('success', `Đã sao chép ${label}.`)
    } catch (error) {
      showToast('error', 'Không thể sao chép. Bạn hãy copy thủ công nhé.')
    }
  }

  const submitRsvp = async (event) => {
    event.preventDefault()

    if (!rsvp.guestName.trim()) {
      showToast('error', 'Bạn vui lòng nhập họ tên để xác nhận.')
      return
    }

    try {
      setSubmittingRsvp(true)
      await api.post('/public/rsvp', rsvp)

      const messageMap = {
        GOING: `Cảm ơn ${rsvp.guestName.trim()}, hẹn gặp bạn trong ngày vui nhé.`,
        MAYBE: `Cảm ơn ${rsvp.guestName.trim()}, chúng mình sẽ chờ tin bạn.`,
        NOT_GOING: `Cảm ơn ${rsvp.guestName.trim()}, tình cảm của bạn vẫn luôn thật đáng quý.`
      }

      showToast('success', messageMap[rsvp.attendanceStatus] || 'Đã gửi xác nhận thành công.')

      setRsvp({
        guestName: '',
        phone: '',
        attendanceStatus: 'GOING',
        attendanceType: 'DIRECT',
        note: ''
      })
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi gửi xác nhận. Bạn thử lại giúp mình nhé.')
    } finally {
      setSubmittingRsvp(false)
    }
  }

  const submitWish = async (event) => {
    event.preventDefault()

    if (!wish.message.trim()) {
      showToast('error', 'Bạn vui lòng nhập lời chúc.')
      return
    }

    try {
      setSubmittingWish(true)
      await api.post('/public/wish', wish)

      setWish({ guestName: '', message: '' })
      setWishModalOpen(false)
      showToast('success', 'Cảm ơn lời chúc thật đẹp của bạn.')
      load()
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi gửi lời chúc. Bạn thử lại nhé.')
    } finally {
      setSubmittingWish(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.ambientOne} />
      <div className={styles.ambientTwo} />

      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          <span className={styles.toastIcon}>
            {toast.type === 'success' && <i className="fa-solid fa-check" />}
            {toast.type === 'error' && <i className="fa-solid fa-triangle-exclamation" />}
            {toast.type === 'info' && <i className="fa-solid fa-circle-info" />}
          </span>
          <p>{toast.message}</p>
          <button onClick={() => setToast(null)} aria-label="Đóng thông báo">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <button className={styles.brand} onClick={() => scrollToSection('hero')}>
            <span className={styles.brandMark}>T</span>
            <span>
              <strong>T&T</strong>
              <small>Wedding Day</small>
            </span>
          </button>

          <div className={styles.navLinks}>
            {[
              ['story', 'Chuyện tình'],
              ['schedule', 'Lịch cưới'],
              ['gallery', 'Album'],
              ['rsvp', 'Xác nhận'],
              ['wishes', 'Lời chúc']
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={activeNav === id ? styles.navActive : ''}
              >
                {label}
              </button>
            ))}
          </div>

          <button className={styles.navCta} onClick={() => scrollToSection('rsvp')}>
            Gửi RSVP
          </button>
        </div>
      </nav>

      <header className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <img src={heroImage} alt={coupleNames} />
        </div>

        <div className={styles.heroShade} />

        <div className={styles.floatingLayer}>
          {floatingHearts.map(item => (
            <span
              key={item.id}
              className={styles.floatHeart}
              style={{
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
                width: item.size,
                height: item.size,
                opacity: item.opacity
              }}
            />
          ))}
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroCard}>
            <span className={styles.eyebrow}>
              <i className="fa-solid fa-heart" />
              Save the date
            </span>

            <p className={styles.heroSmallText}>Trân trọng kính mời</p>

            <h1>{coupleNames}</h1>

            <p className={styles.heroDesc}>
              {site.welcomeMessage ||
                'Một lời hẹn giữa yêu thương, để cùng nhau chứng kiến khoảnh khắc đẹp nhất trong ngày chúng mình chính thức về chung một nhà.'}
            </p>

            <div className={styles.heroMeta}>
              <span>
                <i className="fa-solid fa-calendar-days" />
                {formatHeroDate(site.weddingDate, site.weddingLocation)}
              </span>
              <span>
                <i className="fa-solid fa-location-dot" />
                {site.weddingLocation || 'Nghệ An'}
              </span>
            </div>

            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={() => scrollToSection('rsvp')}>
                <span>Xác nhận tham dự</span>
                <i className="fa-solid fa-arrow-right" />
              </button>

              <button className={styles.ghostBtn} onClick={() => scrollToSection('schedule')}>
                Xem lịch cưới
              </button>
            </div>
          </div>
        </div>

        <button className={styles.musicButton} onClick={toggleMusic}>
          <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-music'}`} />
          <span>{musicPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc'}</span>
        </button>

        <button className={styles.scrollCue} onClick={() => scrollToSection('story')}>
          <span>Khám phá</span>
          <i className="fa-solid fa-chevron-down" />
        </button>
      </header>

      <main>
        <section className={styles.section} id="story" data-section="story">
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <div className={`${styles.storyImageWrap} ${visibleMap.story ? styles.revealLeft : ''}`}>
                <img src={heroImage} alt="Cô dâu chú rể" />
                <div className={styles.storyBadge}>
                  <strong>10</strong>
                  <span>May 2026</span>
                </div>
              </div>

              <div className={`${styles.storyContent} ${visibleMap.story ? styles.revealRight : ''}`}>
                <span className={styles.sectionKicker}>Our story</span>
                <h2>Chuyện tình được viết bằng những điều dịu dàng</h2>

                {(site.story ||
                  'Duy Trung và Thu Trang – hai mảnh ghép tưởng chừng xa lạ lại tìm thấy nhau giữa vô vàn điều đẹp đẽ của cuộc sống.\n\nTừ những lần gặp gỡ bình dị, những cuộc trò chuyện dài và sự đồng hành chân thành, cả hai dần nhận ra mình chính là bến bờ bình yên của nhau.\n\nNgày hôm nay, hành trình ấy bước sang một chương mới, nơi tình yêu được chúc phúc bởi gia đình, bạn bè và những người thương yêu nhất.'
                )
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                <blockquote>
                  “Tình yêu không cần quá ồn ào, chỉ cần đủ chân thành để cùng nhau đi hết một đời.”
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.countdownSection}`} data-section="countdown">
          <div className={styles.container}>
            <div className={styles.centerHeader}>
              <span className={styles.sectionKicker}>The big day</span>
              <h2>Đếm ngược tới ngày trọng đại</h2>
              <p>Chúng mình rất mong được gặp bạn trong ngày hạnh phúc này.</p>
            </div>

            <div className={styles.timerGrid}>
              {[
                ['Ngày', countdown.days],
                ['Giờ', countdown.hours],
                ['Phút', countdown.minutes],
                ['Giây', countdown.seconds]
              ].map(([label, value], index) => (
                <div
                  className={`${styles.timerCard} ${visibleMap.countdown ? styles.popIn : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  key={label}
                >
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="schedule" data-section="schedule">
          <div className={styles.container}>
            <div className={styles.centerHeader}>
              <span className={styles.sectionKicker}>Wedding schedule</span>
              <h2>Lễ cưới & Tiệc mừng</h2>
              <p>Những dấu mốc quan trọng trong ngày vui của chúng mình.</p>
            </div>

            <div className={styles.venueGrid}>
              {venueItems.map((venue, index) => (
                <article
                  className={`${styles.venueCard} ${visibleMap.schedule ? styles.revealUp : ''}`}
                  style={{ animationDelay: `${index * 0.12}s` }}
                  key={venue.title}
                >
                  <div className={styles.venueTop}>
                    <span>{venue.label}</span>
                    <i className={venue.icon} />
                  </div>

                  <h3>{venue.title}</h3>

                  <div className={styles.venueInfo}>
                    <p>
                      <i className="fa-solid fa-location-dot" />
                      <span>
                        <strong>{venue.location}</strong>
                        {venue.address}
                      </span>
                    </p>

                    <p>
                      <i className="fa-regular fa-clock" />
                      <span>{venue.time}</span>
                    </p>
                  </div>

                  <button className={styles.outlineBtn} onClick={() => openMap(venue.mapUrl)}>
                    Chỉ đường
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </button>
                </article>
              ))}

              <article
                className={`${styles.venueCard} ${styles.qrCard} ${visibleMap.schedule ? styles.revealUp : ''}`}
                style={{ animationDelay: '0.24s' }}
              >
                <div className={styles.venueTop}>
                  <span>Check-in</span>
                  <i className="fa-solid fa-qrcode" />
                </div>

                <h3>Mã QR check-in</h3>

                <p className={styles.qrText}>
                  {site.qrDescription ||
                    'Quét mã tại cửa để check-in nhanh và lưu lại khoảnh khắc trong ngày cưới.'}
                </p>

                <button
                  className={styles.outlineBtn}
                  onClick={() => {
                    if (site.qrImageUrl) {
                      window.open(site.qrImageUrl, '_blank', 'noopener,noreferrer')
                    } else {
                      showToast('info', 'Mã QR sẽ được cập nhật sớm.')
                    }
                  }}
                >
                  {site.qrButtonText || 'Xem QR'}
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </article>
            </div>
          </div>
        </section>

        {site.showGallery !== false && (
          <section className={`${styles.section} ${styles.gallerySection}`} id="gallery" data-section="gallery">
            <div className={styles.container}>
              <div className={styles.centerHeader}>
                <span className={styles.sectionKicker}>Gallery</span>
                <h2>Khoảnh khắc yêu thương</h2>
                <p>Mỗi bức ảnh là một mảnh ký ức dịu dàng trong hành trình của chúng mình.</p>
              </div>

              <div className={styles.galleryGrid}>
                {gallery.map((item, index) => (
                  <figure
                    className={`${styles.galleryItem} ${visibleMap.gallery ? styles.zoomIn : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    key={item.id || index}
                  >
                    <img src={item.imageUrl || item} alt={item.title || `Khoảnh khắc ${index + 1}`} />
                    <figcaption>
                      <i className="fa-regular fa-heart" />
                      <span>{item.title || 'Wedding moment'}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {site.showMusic !== false && (
          <section className={styles.section} data-section="music">
            <div className={styles.container}>
              <div className={`${styles.musicPanel} ${visibleMap.music ? styles.revealUp : ''}`}>
                <div className={styles.musicIcon}>
                  <i className="fa-solid fa-headphones-simple" />
                </div>

                <div>
                  <span className={styles.sectionKicker}>Wedding playlist</span>
                  <h2>Giai điệu của ngày hạnh phúc</h2>
                  <p>{site.backgroundMusicTitle || 'Những bài hát dành riêng cho câu chuyện tình yêu của Duy Trung & Thu Trang.'}</p>
                </div>

                <div className={styles.songList}>
                  {(site.songs?.length ? site.songs : defaultSongs).map((song, index) => (
                    <span key={index}>
                      <i className="fa-solid fa-music" />
                      {typeof song === 'string' ? song : `${song.name} · ${song.artist}`}
                    </span>
                  ))}
                </div>

                <button className={styles.primaryBtn} onClick={toggleMusic}>
                  <span>{musicPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}</span>
                  <i className={`fa-solid ${musicPlaying ? 'fa-pause' : 'fa-play'}`} />
                </button>
              </div>
            </div>
          </section>
        )}

        <section className={`${styles.section} ${styles.thanksSection}`} data-section="thanks">
          <div className={styles.container}>
            <div className={styles.thanksGrid}>
              <div className={`${styles.thanksContent} ${visibleMap.thanks ? styles.revealLeft : ''}`}>
                <span className={styles.sectionKicker}>Thank you</span>
                <h2>Lời tri ân</h2>
                <p>
                  Gửi đến ông bà, cha mẹ, người thân và bạn bè yêu quý — cảm ơn vì tất cả sự yêu thương,
                  chở che và đồng hành để chúng con có được ngày hôm nay.
                </p>
                <p>
                  Sự hiện diện của mọi người trong ngày trọng đại này chính là món quà quý giá nhất,
                  là kỷ niệm mà chúng con sẽ luôn gìn giữ.
                </p>
                <div className={styles.signature}>{coupleNames}</div>
              </div>

              <div className={`${styles.thanksImage} ${visibleMap.thanks ? styles.revealRight : ''}`}>
                <img src={thanksImage} alt="Lời tri ân" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="rsvp" data-section="rsvp">
          <div className={styles.container}>
            <div className={styles.rsvpGrid}>
              <div className={`${styles.rsvpIntro} ${visibleMap.rsvp ? styles.revealLeft : ''}`}>
                <span className={styles.sectionKicker}>RSVP</span>
                <h2>Bạn sẽ đến chung vui cùng chúng mình chứ?</h2>
                <p>
                  Hãy để lại lời xác nhận để cô dâu chú rể chuẩn bị thật chu đáo cho sự hiện diện của bạn.
                </p>

                <div className={styles.rsvpStats}>
                  <div>
                    <strong>01</strong>
                    <span>Ngày duy nhất</span>
                  </div>
                  <div>
                    <strong>02</strong>
                    <span>Trái tim chung nhịp</span>
                  </div>
                  <div>
                    <strong>∞</strong>
                    <span>Yêu thương</span>
                  </div>
                </div>
              </div>

              <form className={`${styles.rsvpForm} ${visibleMap.rsvp ? styles.revealRight : ''}`} onSubmit={submitRsvp}>
                <label>
                  <span>Họ và tên *</span>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={rsvp.guestName}
                    onChange={(e) => setRsvp({ ...rsvp, guestName: e.target.value })}
                    required
                  />
                </label>

                <label>
                  <span>Số điện thoại</span>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={rsvp.phone}
                    onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })}
                  />
                </label>

                <div className={styles.formTwoCols}>
                  <label>
                    <span>Hình thức</span>
                    <select
                      value={rsvp.attendanceType}
                      onChange={(e) => setRsvp({ ...rsvp, attendanceType: e.target.value })}
                    >
                      <option value="DIRECT">Tham dự trực tiếp</option>
                      <option value="ONLINE">Tham dự online</option>
                    </select>
                  </label>

                  <label>
                    <span>Trạng thái</span>
                    <select
                      value={rsvp.attendanceStatus}
                      onChange={(e) => setRsvp({ ...rsvp, attendanceStatus: e.target.value })}
                    >
                      <option value="GOING">Chắc chắn tham dự</option>
                      <option value="MAYBE">Có thể sẽ đến</option>
                      <option value="NOT_GOING">Không thể tham dự</option>
                    </select>
                  </label>
                </div>

                <label>
                  <span>Lời nhắn</span>
                  <textarea
                    rows="4"
                    placeholder="Gửi một lời chúc nhỏ tới cô dâu chú rể..."
                    value={rsvp.note}
                    onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
                  />
                </label>

                <button className={styles.submitBtn} type="submit" disabled={submittingRsvp}>
                  {submittingRsvp ? 'Đang gửi...' : 'Gửi xác nhận'}
                  <i className="fa-solid fa-heart" />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bankSection}`} data-section="bank">
          <div className={styles.container}>
            <div className={styles.centerHeader}>
              <span className={styles.sectionKicker}>Wedding gift</span>
              <h2>Mừng cưới</h2>
              <p>Nếu bạn muốn gửi quà mừng từ xa, cô dâu chú rể xin trân trọng cảm ơn.</p>
            </div>

            <div className={styles.bankGrid}>
              {bankAccounts.map((bank, index) => (
                <article
                  className={`${styles.bankCard} ${visibleMap.bank ? styles.revealUp : ''}`}
                  style={{ animationDelay: `${index * 0.12}s` }}
                  key={bank.id}
                >
                  <div className={styles.bankQr}>
                    <img src={bank.qrImage} alt={`QR ${bank.bankName}`} />
                  </div>

                  <div className={styles.bankInfo}>
                    <span>{bank.note}</span>
                    <h3>{bank.bankName}</h3>

                    <div className={styles.bankLine}>
                      <small>Chủ tài khoản</small>
                      <strong>{bank.accountName}</strong>
                    </div>

                    <div className={styles.bankLine}>
                      <small>Số tài khoản</small>
                      <button onClick={() => copyText(bank.accountNumber, 'số tài khoản')}>
                        {bank.accountNumber}
                        <i className="fa-regular fa-copy" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {site.showWishes !== false && (
          <section className={styles.section} id="wishes" data-section="wishes">
            <div className={styles.container}>
              <div className={styles.wishHeader}>
                <div>
                  <span className={styles.sectionKicker}>Guest book</span>
                  <h2>Lời chúc ngọt ngào</h2>
                  <p>Những lời chúc nhỏ sẽ làm ngày vui của chúng mình thêm trọn vẹn.</p>
                </div>

                <button className={styles.primaryBtn} onClick={() => setWishModalOpen(true)}>
                  <span>Gửi lời chúc</span>
                  <i className="fa-solid fa-pen-nib" />
                </button>
              </div>

              <div className={styles.wishGrid}>
                {wishes.slice(0, 9).map((item, index) => (
                  <article
                    className={`${styles.wishCard} ${visibleMap.wishes ? styles.revealUp : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    key={item.id || index}
                  >
                    <div className={styles.wishAvatar}>
                      {(item.guestName || item.fullName || 'K').trim().charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{item.guestName || item.fullName || 'Khách mời'}</h3>
                      <p>{item.message}</p>
                      {item.createdAt && <time>{formatWishDate(item.createdAt)}</time>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <h2>{coupleNames}</h2>
              <p>Trân trọng cảm ơn sự hiện diện và tình cảm của bạn.</p>
            </div>

            <div className={styles.footerSocial}>
              <i className="fa-brands fa-facebook-f" />
              <i className="fa-brands fa-instagram" />
              <i className="fa-solid fa-camera" />
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>#TrungTrangWedding</span>
            <span>Made with love — Hoàng Hiếu</span>
          </div>
        </div>
      </footer>

      {site.showMusic !== false && site.backgroundMusicUrl && (
        <audio ref={audioRef} src={site.backgroundMusicUrl} loop preload="auto" />
      )}

      {wishModalOpen && (
        <div className={styles.modalOverlay} onMouseDown={() => setWishModalOpen(false)}>
          <div className={styles.modalCard} onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setWishModalOpen(false)}>
              <i className="fa-solid fa-xmark" />
            </button>

            <span className={styles.sectionKicker}>Send wishes</span>
            <h2>Gửi lời chúc</h2>
            <p>Viết một lời chúc thật đẹp dành cho Duy Trung & Thu Trang.</p>

            <form onSubmit={submitWish}>
              <label>
                <span>Tên của bạn</span>
                <input
                  placeholder="Ví dụ: Minh Anh"
                  value={wish.guestName}
                  onChange={(e) => setWish({ ...wish, guestName: e.target.value })}
                />
              </label>

              <label>
                <span>Lời chúc *</span>
                <textarea
                  rows="5"
                  placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                  value={wish.message}
                  onChange={(e) => setWish({ ...wish, message: e.target.value.slice(0, 500) })}
                  required
                />
              </label>

              <div className={styles.modalActions}>
                <button className={styles.submitBtn} type="submit" disabled={submittingWish}>
                  {submittingWish ? 'Đang gửi...' : 'Gửi lời chúc'}
                  <i className="fa-solid fa-paper-plane" />
                </button>

                <button className={styles.cancelBtn} type="button" onClick={() => setWishModalOpen(false)}>
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
