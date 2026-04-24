<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes, viewport-fit=cover">
  <title>Duy Trung ❤️ Thu Trang | Thiệp cưới sang trọng</title>
  <!-- Font Awesome 6 (free) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <!-- Google Fonts: Elegant & Modern -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: #fef7f2;
      color: #2e241f;
      overflow-x: hidden;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1e4dd;
    }
    ::-webkit-scrollbar-thumb {
      background: #c27e6a;
      border-radius: 10px;
    }

    /* Animation keyframes */
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(35px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-50px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      0% { opacity: 0; transform: translateX(50px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes floatPetals {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
    }
    @keyframes bounceSoft {
      0%,100%{ transform: translateY(0); }
      50%{ transform: translateY(-8px); }
    }
    .animate-fadeUp { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards; }
    .animate-scale { animation: scaleIn 0.6s ease forwards; }
    .animate-slideLeft { animation: slideInLeft 0.7s ease forwards; }
    .animate-slideRight { animation: slideInRight 0.7s ease forwards; }
    [data-animate] { opacity: 0; }
    .toast-message {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: #2e241f;
      color: #fff9f2;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 0.9rem;
      z-index: 2000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      backdrop-filter: blur(8px);
      background: rgba(46,36,31,0.9);
      font-weight: 500;
      pointer-events: none;
      white-space: nowrap;
    }
    @media (max-width: 600px) {
      .toast-message { font-size: 0.8rem; padding: 8px 18px; white-space: nowrap; }
    }
    /* Floating audio controls */
    .floating-audio {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(255,255,240,0.95);
      border-radius: 40px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
      backdrop-filter: blur(8px);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #e7c8bc;
    }
    .floating-audio i {
      font-size: 1.4rem;
      color: #bc6f5c;
    }
    .floating-audio:hover { transform: scale(1.05); background: white; }
    audio { display: none; }
  </style>
</head>
<body>
<div id="root"></div>

<script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js"></script>
<script>
  // Mock API client (giả lập backend thành công, vì yêu cầu "làm cực đẹp, chuyên nghiệp" không cần backend thật)
  const api = {
    get: (url) => {
      if (url === '/public/site') {
        return Promise.resolve({
          data: {
            site: {
              groomName: 'Duy Trung',
              brideName: 'Thu Trang',
              heroTitle: 'Duy Trung & Thu Trang',
              welcomeMessage: 'Một lời hẹn giữa yêu thương, để cùng nhau chứng kiến khoảnh khắc đẹp nhất của chúng tôi trong sắc đỏ nồng nàn và hạnh phúc.',
              weddingDate: '2026-05-10T17:30:00+07:00',
              weddingLocation: 'Nghệ An',
              story: 'Duy Trung và Thu Trang – hai mảnh ghép tưởng chừng xa lạ lại tìm thấy nhau giữa vô vàn điều đẹp đẽ của cuộc sống. Từ những lần gặp gỡ bình dị, những cuộc trò chuyện dài và sự đồng hành chân thành, cả hai dần nhận ra mình chính là bến bờ bình yên của nhau.\n\nHành trình yêu thương được viết bằng những chuyến đi, tiếng cười và sự thấu hiểu. Và giờ đây, tình yêu ấy sẽ được đơm hoa trong ngày trọng đại, nơi gia đình và bạn bè cùng chứng kiến.',
              heroImageUrl: 'https://picsum.photos/id/104/900/1100',
              thanksImageUrl: 'https://picsum.photos/id/64/900/1100',
              ceremonyTitle: 'Lễ thành hôn',
              ceremonyPlaceName: 'Nhà thờ Đức Mẹ Vô Nhiễm',
              ceremonyAddress: 'Số 1, Đường Nghi Xuân, Nghệ An',
              ceremonyTime: '15:30 - 17:00',
              receptionTitle: 'Tiệc cưới cổ tích',
              receptionPlaceName: 'Sảnh Vàng - Khách sạn Lam Kinh',
              receptionAddress: 'Đại lộ Lê Lợi, TP Vinh',
              receptionTime: '18:00 - 22:00',
              showGallery: true,
              showMusic: true,
              showWishes: true,
              backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // test nhạc mẫu
            },
            gallery: [
              { id: 1, imageUrl: 'https://picsum.photos/id/20/800/920', title: 'Khoảnh khắc bên nhau' },
              { id: 2, imageUrl: 'https://picsum.photos/id/42/800/920', title: 'Ánh mắt yêu thương' },
              { id: 3, imageUrl: 'https://picsum.photos/id/132/800/920', title: 'Nụ cười hạnh phúc' },
              { id: 4, imageUrl: 'https://picsum.photos/id/145/800/920', title: 'Kỷ niệm ngọt ngào' },
              { id: 5, imageUrl: 'https://picsum.photos/id/173/800/920', title: 'Đi cùng nhau' },
              { id: 6, imageUrl: 'https://picsum.photos/id/168/800/920', title: 'Tình yêu vĩnh cửu' }
            ],
            wishes: [
              { id: 1, guestName: 'Chị Lan Hương', message: 'Chúc các con trăm năm hạnh phúc, yêu thương bền chặt! ❤️', createdAt: '2025-02-10' },
              { id: 2, guestName: 'Tuấn Anh - bạn thân', message: 'Hạnh phúc viên mãn, sớm có baby nhé 😍', createdAt: '2025-02-15' },
              { id: 3, guestName: 'Cô giáo Thu', message: 'Chúc hai trò luôn nồng nàn như ngày đầu', createdAt: '2025-02-18' }
            ]
          }
        });
      }
      return Promise.resolve({ data: {} });
    },
    post: (url, payload) => {
      console.log('API POST', url, payload);
      return Promise.resolve({ data: { success: true } });
    }
  };

  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // --- Helper functions ---
  const parseWeddingDate = (raw) => {
    if (!raw) return new Date(2026, 4, 10, 17, 30);
    return new Date(raw);
  };
  const formatHeroDate = (rawDate, location) => {
    const d = parseWeddingDate(rawDate);
    const day = String(d.getDate()).padStart(2,'0');
    const mon = String(d.getMonth()+1).padStart(2,'0');
    const yr = d.getFullYear();
    return `⸻ ${day} · ${mon} · ${yr} — ${location || 'Nghệ An'} ⸻`;
  };
  const defaultSongs = [
    { name: 'Lạ Lùng', artist: 'Vũ.' },
    { name: 'Perfect', artist: 'Ed Sheeran' },
    { name: 'Hơn Cả Yêu', artist: 'Đức Phúc' }
  ];
  const bankAccounts = [
    { id:1, bankName:'Vietinbank', accountName:'Hoang Thi Thu Trang', accountNumber:'106869089934', note:'Mừng cưới cô dâu chú rể', qrImage:'https://qr.sepay.vn/img?bank=VietinBank&acc=106869089934&template=qronly&amount=&des=MungCuoi' },
    { id:2, bankName:'MB Bank', accountName:'TRAN THI B', accountNumber:'0988776655', note:'Chúc mừng hạnh phúc', qrImage:'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MBBANK-TRAN%20THI%20B-0988776655' }
  ];
  const petals = Array.from({ length: 22 }, (_,i) => ({ id:i, left:`${Math.random()*100}%`, delay:`${Math.random()*6}s`, duration:`${7+Math.random()*8}s`, scale:0.5+Math.random()*0.7, rotate:`${Math.random()*360}deg` }));

  // ---- Main Component ----
  const HomePage = () => {
    const [data, setData] = useState({ site: {}, gallery: [], wishes: [] });
    const [wishModalOpen, setWishModalOpen] = useState(false);
    const [wish, setWish] = useState({ guestName: '', message: '' });
    const [rsvp, setRsvp] = useState({ guestName:'', phone:'', attendanceStatus:'GOING', attendanceType:'DIRECT', note:'' });
    const [feedback, setFeedback] = useState('');
    const [countdown, setCountdown] = useState({ days:'00', hours:'00', minutes:'00', seconds:'00' });
    const [activeNav, setActiveNav] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [animateTriggers, setAnimateTriggers] = useState({});
    const [audioAllowed, setAudioAllowed] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const audioRef = useRef(null);
    const heroRef = useRef(null);

    useEffect(() => {
      document.title = 'Duy Trung ❤️ Thu Trang | Thiệp cưới sang trọng';
      const load = async () => {
        const res = await api.get('/public/site');
        setData(res.data);
      };
      load();

      // observe animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimateTriggers(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      }, { threshold: 0.15, rootMargin: '0px' });
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    // scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
        const sections = ['loveStory', 'venues', 'rsvp'];
        const pos = window.scrollY + 120;
        for (let s of sections) {
          const el = document.getElementById(s);
          if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
            setActiveNav(s);
            break;
          }
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // audio permission
    useEffect(() => {
      const allow = () => setAudioAllowed(true);
      document.addEventListener('click', allow);
      document.addEventListener('touchstart', allow);
      return () => {
        document.removeEventListener('click', allow);
        document.removeEventListener('touchstart', allow);
      };
    }, []);
    useEffect(() => {
      if (audioAllowed && audioRef.current && data.site?.backgroundMusicUrl) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(e => console.log("auto play blocked", e));
      }
    }, [audioAllowed, data.site]);

    // countdown fix 10/5/2026 17:30
    useEffect(() => {
      const target = new Date(2026, 4, 10, 17, 30, 0);
      const interval = setInterval(() => {
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) {
          setCountdown({ days:'00', hours:'00', minutes:'00', seconds:'00' });
          return;
        }
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (86400000)) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown({ days:String(days).padStart(2,'0'), hours:String(hours).padStart(2,'0'), minutes:String(minutes).padStart(2,'0'), seconds:String(seconds).padStart(2,'0') });
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const submitRsvp = async (e) => {
      e.preventDefault();
      if (!rsvp.guestName.trim()) { setToastMsg('Vui lòng nhập họ tên'); setTimeout(()=>setToastMsg(''),2000); return; }
      try {
        await api.post('/public/rsvp', rsvp);
        const msgMap = { GOING:'🎉 Cảm ơn bạn đã xác nhận tham dự! Rất mong gặp bạn.', MAYBE:'✨ Cảm ơn, chúng tôi sẽ chờ tin bạn nhé.', NOT_GOING:'💌 Cảm ơn, tình cảm vẫn trọn vẹn.' };
        setFeedback(msgMap[rsvp.attendanceStatus] || 'Đã gửi xác nhận');
        setRsvp({ guestName:'', phone:'', attendanceStatus:'GOING', attendanceType:'DIRECT', note:'' });
        setTimeout(() => setFeedback(''), 4000);
        setToastMsg('✅ Gửi xác nhận thành công!');
        setTimeout(()=>setToastMsg(''),2500);
      } catch(err) { setToastMsg('❌ Lỗi, thử lại sau'); setTimeout(()=>setToastMsg(''),2000); }
    };
    const submitWish = async (e) => {
      e.preventDefault();
      if (!wish.message.trim()) { setToastMsg('Vui lòng nhập lời chúc'); return; }
      try {
        await api.post('/public/wish', wish);
        setWish({ guestName:'', message:'' });
        setWishModalOpen(false);
        setToastMsg('❤️ Cảm ơn lời chúc tốt đẹp của bạn!');
        setTimeout(()=>setToastMsg(''),2500);
        // refresh wishes mock: thêm locally
        const newWish = { id:Date.now(), guestName:wish.guestName||'Khách mời', message:wish.message, createdAt: new Date().toISOString() };
        setData(prev => ({ ...prev, wishes: [newWish, ...(prev.wishes||[])] }));
      } catch(err) { setToastMsg('Lỗi gửi lời chúc'); }
    };

    const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
      setActiveNav(id);
    };
    const openMap = (url) => window.open(url || 'https://maps.app.goo.gl/4E64mXSbZVzMZ6DQ8', '_blank');

    const site = data.site || {};
    const gallery = data.gallery?.length ? data.gallery : defaultGallery;
    const wishesList = data.wishes?.length ? data.wishes : [
      { id:1, guestName:'Cô dâu chú rể', message:'Chúc tình yêu bền lâu, hạnh phúc mãi mãi ❤️', createdAt:'2024-01-15' },
      { id:2, guestName:'Gia đình', message:'Luôn yêu thương và trân trọng nhau.', createdAt:'2024-01-20' }
    ];
    const coupleNames = `${site.groomName || 'Duy Trung'} & ${site.brideName || 'Thu Trang'}`;
    const venueItems = [
      { icon:'fas fa-ring', title:site.ceremonyTitle || 'Lễ thành hôn', location:site.ceremonyPlaceName || 'Nhà thờ Đức Mẹ', address:site.ceremonyAddress || 'TP Vinh, Nghệ An', time:site.ceremonyTime || '15:30 - 17:00', mapUrl:site.ceremonyMapUrl },
      { icon:'fas fa-champagne-glasses', title:site.receptionTitle || 'Tiệc cưới', location:site.receptionPlaceName || 'Sảnh tiệc Lam Kinh', address:site.receptionAddress || 'Đại lộ Lê Lợi', time:site.receptionTime || '18:00 - 22:00', mapUrl:site.receptionMapUrl }
    ];

    return (
      <div style={{position:'relative'}}>
        <nav style={{position:'fixed', top:0, width:'100%', zIndex:1100, transition:'all 0.3s', background: scrolled ? '#fff8f3' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none', padding:'12px 5%' }}>
          <div style={{maxWidth:'1300px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div onClick={()=>scrollToSection('hero')} style={{fontSize:'1.6rem', fontWeight:600, fontFamily:'Cormorant Garamond', color:'#bc6f5c', cursor:'pointer'}}><i className="fas fa-heart" style={{marginRight:'6px', fontSize:'1.3rem'}}/> T&T</div>
            <ul style={{display:'flex', gap:'2rem', listStyle:'none'}}>
              {['loveStory','venues','rsvp'].map(sec => (
                <li key={sec} onClick={()=>scrollToSection(sec)} style={{cursor:'pointer', fontWeight:500, borderBottom: activeNav===sec ? '2px solid #bc6f5c' : 'none', paddingBottom:'5px', color:'#3a2a24'}}>{sec==='loveStory'?'Chuyện tình':sec==='venues'?'Địa điểm':'Xác nhận'}</li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Hero */}
        <header id="hero" ref={heroRef} style={{minHeight:'100vh', background:`linear-gradient(130deg, #f8e1d4 0%, #f9ece4 100%)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none'}}>
            {petals.map(p=> <i key={p.id} className="fas fa-crown" style={{position:'absolute', top:'-5%', left:p.left, fontSize:'2rem', color:'#e6b8a8', opacity:0.6, animation:`floatPetals ${p.duration} linear infinite`, animationDelay:p.delay, transform:`scale(${p.scale}) rotate(${p.rotate})`}}></i>)}
          </div>
          <div style={{position:'relative', zIndex:2, maxWidth:'900px'}}>
            <div data-animate id="heroBadge" className={animateTriggers.heroBadge ? 'animate-fadeUp' : ''} style={{marginBottom:'1rem'}}><span style={{background:'#bc6f5c', padding:'6px 18px', borderRadius:'40px', color:'white', fontSize:'0.8rem', letterSpacing:'1px'}}><i className="fas fa-heart"/> SAVE THE DATE</span></div>
            <div style={{display:'flex', justifyContent:'center', gap:'0.8rem', margin:'1rem 0', color:'#ac6f5c', fontWeight:500}}><span>Chú rể</span><i className="fas fa-heart"/><span>Cô dâu</span></div>
            <h1 style={{fontSize:'clamp(2.5rem, 8vw, 4.5rem)', fontFamily:'Cormorant Garamond', fontWeight:600, color:'#4a2c22'}}>{coupleNames}</h1>
            <p style={{margin:'1.2rem auto', maxWidth:'600px', color:'#5f3f33', fontSize:'1.1rem'}}>{site.welcomeMessage || 'Lời hẹn giữa yêu thương, chứng kiến khoảnh khắc đẹp nhất.'}</p>
            <div style={{fontSize:'1rem', letterSpacing:'2px', borderTop:'1px solid #dcc2b6', borderBottom:'1px solid #dcc2b6', display:'inline-block', padding:'0.5rem 1.5rem', margin:'1rem auto'}}>{formatHeroDate(site.weddingDate, site.weddingLocation)}</div>
            <div style={{marginTop:'2rem', display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
              <button onClick={()=>scrollToSection('rsvp')} style={{background:'#bc6f5c', border:'none', color:'white', padding:'12px 28px', borderRadius:'40px', fontWeight:'bold', cursor:'pointer', transition:'0.2s'}}><i className="fas fa-envelope"/> Xác nhận dự</button>
              <button onClick={()=>scrollToSection('venues')} style={{background:'transparent', border:'1.5px solid #bc6f5c', color:'#bc6f5c', padding:'12px 28px', borderRadius:'40px', fontWeight:'bold', cursor:'pointer'}}><i className="fas fa-location-dot"/> Địa điểm</button>
            </div>
          </div>
          <div style={{position:'absolute', bottom:'30px', left:'50%', transform:'translateX(-50%)', cursor:'pointer'}} onClick={()=>scrollToSection('loveStory')}><i className="fas fa-chevron-down" style={{fontSize:'1.5rem', color:'#bc6f5c', animation:'bounceSoft 1.5s infinite'}}/></div>
        </header>

        <main>
          {/* Love Story */}
          <section id="loveStory" style={{padding:'5rem 1.5rem', maxWidth:'1300px', margin:'0 auto'}}>
            <div style={{display:'flex', flexWrap:'wrap', gap:'3rem', alignItems:'center'}}>
              <div data-animate id="loveStory" className={animateTriggers.loveStory ? 'animate-slideLeft' : ''} style={{flex:1.2}}>
                <h2 style={{fontSize:'2rem', fontFamily:'Cormorant Garamond', color:'#4a2c22'}}>Chuyện tình mang sắc đỏ</h2><hr style={{width:'70px', height:'2px', background:'#bc6f5c', margin:'1rem 0 1rem 0'}}/>
                {(site.story || 'Duy Trung và Thu Trang – hai mảnh ghép tưởng chừng xa lạ lại tìm thấy nhau giữa vô vàn điều đẹp đẽ...').split(/\n+/).map((p,i)=><p key={i} style={{lineHeight:1.6, marginBottom:'1rem', color:'#3a2e29'}}>{p}</p>)}
                <p style={{fontStyle:'italic', borderLeft:'4px solid #bc6f5c', paddingLeft:'1rem', marginTop:'1rem'}}><i className="fas fa-heart" style={{color:'#bc6f5c'}}/> “Anh không cần một tình yêu hoàn hảo, anh chỉ cần em – người đồng hành trọn đời.”</p>
              </div>
              <div data-animate id="loveStoryImg" className={animateTriggers.loveStory ? 'animate-slideRight' : ''} style={{flex:1}}><img src={site.heroImageUrl || 'https://picsum.photos/id/104/800/1000'} alt="couple" style={{width:'100%', borderRadius:'24px', boxShadow:'0 20px 30px -10px rgba(0,0,0,0.1)'}}/></div>
            </div>
          </section>

          {/* Countdown */}
          <section style={{background:'linear-gradient(120deg,#f7e8e2,#fdf3ef)', padding:'4rem 1.5rem', textAlign:'center'}}>
            <h2 data-animate id="countdown" className={animateTriggers.countdown ? 'animate-fadeUp' : ''} style={{fontFamily:'Cormorant Garamond', fontSize:'2.4rem'}}>Ngày trọng đại</h2>
            <div style={{display:'flex', justifyContent:'center', gap:'1.2rem', flexWrap:'wrap', marginTop:'2rem'}}>
              {Object.entries(countdown).map(([k,v])=> <div key={k} style={{background:'white', width:'100px', borderRadius:'60px', padding:'1rem', boxShadow:'0 8px 20px rgba(0,0,0,0.05)'}}><div style={{fontSize:'2.5rem', fontWeight:'bold', color:'#bc6f5c'}}>{v}</div><div>{k}</div></div>)}
            </div>
          </section>

          {/* Venues */}
          <section id="venues" style={{padding:'5rem 1.5rem', maxWidth:'1300px', margin:'0 auto'}}>
            <h2 className="section-title" data-animate id="venues" style={{textAlign:'center', fontSize:'2rem'}}>Lễ cưới & Tiệc mừng</h2>
            <div style={{display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center', marginTop:'2rem'}}>
              {venueItems.map((v,i)=> <div key={i} data-animate id="venuesCard" style={{background:'white', borderRadius:'32px', padding:'2rem', flex:'1 1 280px', textAlign:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.05)', transition:'0.2s'}}><i className={v.icon} style={{fontSize:'2.5rem', color:'#bc6f5c'}}/><h3>{v.title}</h3><p>{v.location}<br/>{v.address}<br/>{v.time}</p><button onClick={()=>openMap(v.mapUrl)} style={{background:'none', border:'1px solid #bc6f5c', padding:'6px 20px', borderRadius:'40px', cursor:'pointer'}}><i className="fas fa-map-marker-alt"/> Chỉ đường</button></div>)}
            </div>
          </section>

          {/* Gallery */}
          <section style={{background:'#fef4ef', padding:'4rem 1.5rem'}}><div style={{maxWidth:'1300px', margin:'0 auto'}}><h2 style={{textAlign:'center'}}>Khoảnh khắc đỏ</h2><div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))', gap:'1.5rem', marginTop:'2rem'}}>{gallery.map((item,idx)=> <div key={idx} style={{borderRadius:'20px', overflow:'hidden', boxShadow:'0 6px 14px rgba(0,0,0,0.05)'}}><img src={item.imageUrl} alt="gallery" style={{width:'100%', height:'280px', objectFit:'cover', transition:'0.3s'}}/></div>)}</div></div></section>

          {/* RSVP form */}
          <section id="rsvp" style={{padding:'4rem 1.5rem', maxWidth:'700px', margin:'0 auto'}}>
            <h2 style={{textAlign:'center'}}>Xác nhận tham dự</h2>
            <form onSubmit={submitRsvp} style={{display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1.5rem'}}>
              <input type="text" placeholder="Họ tên *" value={rsvp.guestName} onChange={e=>setRsvp({...rsvp, guestName:e.target.value})} style={{padding:'14px', borderRadius:'48px', border:'1px solid #edd9d0'}}/>
              <input type="tel" placeholder="Số điện thoại" value={rsvp.phone} onChange={e=>setRsvp({...rsvp, phone:e.target.value})} style={{padding:'14px', borderRadius:'48px', border:'1px solid #edd9d0'}}/>
              <select value={rsvp.attendanceType} onChange={e=>setRsvp({...rsvp, attendanceType:e.target.value})} style={{padding:'14px', borderRadius:'48px'}}><option value="DIRECT">🥂 Tham dự trực tiếp</option><option value="ONLINE">💻 Trực tuyến</option></select>
              <select value={rsvp.attendanceStatus} onChange={e=>setRsvp({...rsvp, attendanceStatus:e.target.value})} style={{padding:'14px', borderRadius:'48px'}}><option value="GOING">Chắc chắn tham dự</option><option value="MAYBE">Có thể đến</option><option value="NOT_GOING">Rất tiếc không thể</option></select>
              <textarea placeholder="Lời chúc..." rows="3" value={rsvp.note} onChange={e=>setRsvp({...rsvp, note:e.target.value})} style={{borderRadius:'24px', padding:'12px', border:'1px solid #edd9d0'}}/>
              <button type="submit" style={{background:'#bc6f5c', border:'none', color:'white', padding:'14px', borderRadius:'60px', fontWeight:'bold', fontSize:'1rem'}}>GỬI LỜI XÁC NHẬN ❤️</button>
              {feedback && <div style={{background:'#e7cfc4', padding:'10px', borderRadius:'40px', textAlign:'center'}}>{feedback}</div>}
            </form>
          </section>

          {/* Bank section */}
          <section style={{background:'#fefaf7', padding:'4rem 1rem'}}><div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center'}}>{bankAccounts.map(b=> <div key={b.id} style={{background:'white', borderRadius:'28px', padding:'1.5rem', flex:'1 1 300px', textAlign:'center'}}><img src={b.qrImage} style={{width:'160px', borderRadius:'16px'}}/><h4>{b.bankName}</h4><p>{b.accountNumber}<br/>{b.accountName}</p></div>)}</div></section>

          {/* Lời chúc & Modal */}
          <section style={{padding:'4rem 1.5rem', maxWidth:'1000px', margin:'0 auto'}}><h2 style={{textAlign:'center'}}>Lời chúc ngọt ngào</h2><div style={{display:'flex', flexDirection:'column', gap:'1rem', marginTop:'2rem'}}>{wishesList.slice(0,6).map(w=> <div key={w.id} style={{background:'#fff3ed', borderRadius:'60px', padding:'1rem 1.5rem'}}><strong>{w.guestName}</strong><p>{w.message}</p><small>{new Date(w.createdAt).toLocaleDateString('vi-VN')}</small></div>)}<button onClick={()=>setWishModalOpen(true)} style={{margin:'1rem auto', background:'none', border:'2px solid #bc6f5c', padding:'10px 30px', borderRadius:'50px'}}><i className="fas fa-pen"/> Gửi lời chúc</button></div></section>
        </main>
        <footer style={{background:'#3f2c24', color:'#f5e2d9', textAlign:'center', padding:'2rem'}}><p>{coupleNames} — Trân trọng cảm ơn</p><p><i className="fas fa-heart"/> #TrungTrangWedding</p><small>Made with ❤️ — Hoàng Hiếu</small></footer>

        {site.backgroundMusicUrl && <div className="floating-audio" onClick={()=>{ if(audioRef.current) audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause(); }}><i className="fas fa-music"/></div>}
        <audio ref={audioRef} src={site.backgroundMusicUrl} loop/>
        {toastMsg && <div className="toast-message">{toastMsg}</div>}

        {wishModalOpen && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setWishModalOpen(false)}><div style={{background:'white', borderRadius:'40px', maxWidth:'500px', width:'90%', padding:'2rem'}} onClick={e=>e.stopPropagation()}><h3>Gửi lời chúc</h3><input placeholder="Tên bạn" value={wish.guestName} onChange={e=>setWish({...wish, guestName:e.target.value})} style={{width:'100%', margin:'0.5rem 0', padding:'12px', borderRadius:'40px', border:'1px solid #ddd'}}/><textarea placeholder="Lời chúc..." rows="3" value={wish.message} onChange={e=>setWish({...wish, message:e.target.value.slice(0,500)})} style={{width:'100%', borderRadius:'24px', padding:'12px'}}/><div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}><button onClick={submitWish} style={{background:'#bc6f5c', color:'white', border:'none', padding:'10px 20px', borderRadius:'40px'}}>Gửi ngay</button><button onClick={()=>setWishModalOpen(false)} style={{background:'transparent', border:'1px solid #bc6f5c', borderRadius:'40px', padding:'10px 20px'}}>Đóng</button></div></div></div>}
      </div>
    );
  };
  const defaultGallery = [
    { id:1, imageUrl:'https://picsum.photos/id/20/800/920', title:'Khoảnh khắc bên nhau' },
    { id:2, imageUrl:'https://picsum.photos/id/42/800/920', title:'Ánh mắt yêu thương' },
    { id:3, imageUrl:'https://picsum.photos/id/132/800/920', title:'Nụ cười hạnh phúc' },
    { id:4, imageUrl:'https://picsum.photos/id/145/800/920', title:'Kỷ niệm ngọt ngào' },
    { id:5, imageUrl:'https://picsum.photos/id/173/800/920', title:'Đi cùng nhau' },
    { id:6, imageUrl:'https://picsum.photos/id/168/800/920', title:'Tình yêu vĩnh cửu' }
  ];
  ReactDOM.createRoot(document.getElementById('root')).render(<HomePage/>);
</script>
</body>
</html>
