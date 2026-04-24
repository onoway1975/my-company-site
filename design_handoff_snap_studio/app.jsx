const { useState, useEffect, useRef } = React;

// ============ DESIGN TOKENS ============
const T = {
  coral: '#F4A896',
  cream: '#F5EDE0',
  preview: '#EFE4D4',
  ink: '#2C1810',
  sub: '#6B4E3D',
  muted: '#A88B78',
  biscuit: '#D4A574',
  border: '#D8C4A8',
  divider: '#E8D9C4',
};

const serif = "'Cormorant Garamond', 'Noto Serif JP', serif";
const sans  = "'Inter', 'LINE Seed', sans-serif";

// ============ SAMPLE TEMPLATES (subset of 30) ============
// Using Unsplash placeholder photos + category tags
const TEMPLATES = {
  recommended: [
    { id: 'studio_03', title: '春の撮影', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70&auto=format' },
    { id: 'jp_03',     title: '桜満開',   cat: '記念日',   img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=70&auto=format' },
    { id: 'studio_04', title: 'フラワーアーチ', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70&auto=format' },
    { id: 'fantasy_01', title: '星空と月明り', cat: 'ファンタジー', img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=70&auto=format' },
    { id: 'jp_01',     title: '七五三',   cat: '記念日',   img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format' },
    { id: 'world_03',  title: 'クリスマスツリー', cat: '世界', img: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&q=70&auto=format' },
  ],
  studio: [
    { id: 'studio_01', title: 'フラワードレッシングルーム', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&q=70&auto=format' },
    { id: 'studio_02', title: 'パステルバルーン', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70&auto=format' },
    { id: 'studio_05', title: 'シネマティック', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400&q=70&auto=format' },
    { id: 'studio_06', title: 'レモンガーデン', cat: 'スタジオ', img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=70&auto=format' },
  ],
  jp: [
    { id: 'jp_01', title: '七五三',     cat: '記念日', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format' },
    { id: 'jp_03', title: '桜満開',     cat: '記念日', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=70&auto=format' },
    { id: 'jp_06', title: '夏祭り・浴衣', cat: '記念日', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=70&auto=format' },
    { id: 'jp_08', title: 'お正月・初詣', cat: '記念日', img: 'https://images.unsplash.com/photo-1528164604427-a81eb708f11f?w=400&q=70&auto=format' },
  ],
  world: [
    { id: 'world_01', title: 'ハロウィン魔女', cat: '世界', img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&q=70&auto=format' },
    { id: 'world_03', title: 'クリスマスツリー', cat: '世界', img: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&q=70&auto=format' },
    { id: 'world_05', title: 'イースター', cat: '世界', img: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&q=70&auto=format' },
  ],
  fantasy: [
    { id: 'fantasy_01', title: '星空と月明り', cat: 'ファンタジー', img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=70&auto=format' },
    { id: 'fantasy_02', title: '魔法の森',    cat: 'ファンタジー', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70&auto=format' },
    { id: 'fantasy_03', title: '宇宙飛行士',  cat: 'ファンタジー', img: 'https://images.unsplash.com/photo-1446776877081-d173a4858a05?w=400&q=70&auto=format' },
  ],
  art: [
    { id: 'art_01', title: '油絵風',  cat: 'アート', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=70&auto=format' },
    { id: 'art_02', title: 'ジブリ風', cat: 'アート', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=70&auto=format' },
    { id: 'art_03', title: '水彩画',  cat: 'アート', img: 'https://images.unsplash.com/photo-1460411794035-42aac080490a?w=400&q=70&auto=format' },
  ],
  classic: [
    { id: 'classic_01', title: '昭和レトロ縁側', cat: 'クラシック', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70&auto=format' },
    { id: 'classic_02', title: '和室床の間',   cat: 'クラシック', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=70&auto=format' },
    { id: 'classic_03', title: 'ヴィンテージ', cat: 'クラシック', img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=70&auto=format' },
  ],
};

const CATEGORIES = [
  { key: 'recommended', label: 'おすすめ' },
  { key: 'studio',      label: 'スタジオ' },
  { key: 'jp',          label: '記念日' },
  { key: 'world',       label: '世界' },
  { key: 'fantasy',     label: 'ファンタジー' },
  { key: 'art',         label: 'アート' },
  { key: 'classic',     label: 'クラシック' },
];

// English names for each template (shown on Upload screen)
const TEMPLATE_EN = {
  studio_01: 'Flower Dressing Room',
  studio_02: 'Pastel Balloon',
  studio_03: 'Spring Studio',
  studio_04: 'Flower Arch',
  studio_05: 'Cinematic Portrait',
  studio_06: 'Lemon Garden',
  jp_01: 'Shichi-Go-San',
  jp_03: 'Cherry Blossom',
  jp_06: 'Summer Yukata',
  jp_08: 'New Year Shrine',
  world_01: 'Halloween Witch',
  world_03: 'Christmas Tree',
  world_05: 'Easter',
  fantasy_01: 'Starry Night',
  fantasy_02: 'Enchanted Forest',
  fantasy_03: 'Astronaut',
  art_01: 'Oil Painting',
  art_02: 'Ghibli Style',
  art_03: 'Watercolor',
  classic_01: 'Showa Engawa',
  classic_02: 'Tokonoma',
  classic_03: 'Vintage Studio',
};

// Helper: find template record by id
const findTpl = (id) => {
  for (const list of Object.values(TEMPLATES)) {
    const t = list.find(x => x.id === id);
    if (t) return t;
  }
  return null;
};

// Sample uploaded subject image per subject type (editorial, warm)
const SUBJECT_PREVIEWS = {
  dog:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=75&auto=format',
  cat:   'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=75&auto=format',
  child: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=75&auto=format',
};

// ============ SILHOUETTE ICONS (simple, editorial) ============
const DogSilhouette = ({ size = 44, color = T.ink }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
    {/* simple shiba-ish silhouette, facing left */}
    <path fill={color} d="M12 40c0-8 5-13 11-13 2-6 6-9 11-9 2 0 3 1 4 2l4-4c1-1 3 0 3 2v6c2 1 4 3 5 6 3 1 6 3 6 7 0 3-3 4-5 4-1 5-5 8-10 8l-2 4c0 2-3 2-3 0v-3h-7v3c0 2-3 2-3 0l-1-4c-5-1-8-4-9-9-2-1-4-2-4-4z"/>
  </svg>
);
const CatSilhouette = ({ size = 44, color = T.ink }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
    {/* simple cat sitting silhouette facing right */}
    <path fill={color} d="M18 14l6 8c2-1 5-2 8-2s6 1 8 2l6-8c1-1 3 0 3 2v10c3 3 5 7 5 12 0 10-8 16-22 16s-22-6-22-16c0-5 2-9 5-12V16c0-2 2-3 3-2zm10 22c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm8 0c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z"/>
  </svg>
);
const ChildSilhouette = ({ size = 44, color = T.ink }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
    {/* simple child bust silhouette */}
    <circle cx="32" cy="20" r="10" fill={color} />
    <path fill={color} d="M14 54c0-10 8-18 18-18s18 8 18 18v4H14z"/>
  </svg>
);

// ============ SHARED: Wordmark ============
const Wordmark = ({ small }) => (
  <div style={{ textAlign: 'center', fontFamily: serif, color: T.ink, lineHeight: 1 }}>
    <div style={{
      fontSize: small ? 18 : 22,
      letterSpacing: '0.12em',
      fontWeight: 500,
    }}>SNAP STUDIO</div>
    {!small && (
      <>
        <div style={{ width: 80, height: 1, background: T.ink, margin: '8px auto 6px', opacity: 0.9 }}/>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', fontStyle: 'italic', fontFamily: serif }}>
          for your loved ones
        </div>
      </>
    )}
  </div>
);

// =====================================================================
// SCREEN 1: LANDING + SUBJECT SELECT
// =====================================================================
function Landing({ onPick }) {
  const [tab, setTab] = useState('recommended');

  // Each studio card also carries a default subject for the subsequent flow
  return (
    <div style={{
      background: T.coral,
      minHeight: '100%',
      fontFamily: sans,
      color: T.ink,
      padding: '56px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* small editorial header mark */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontFamily: serif, opacity: 0.85, marginBottom: 28,
      }}>
        <span>est. 2026</span>
        <span>ciraf inc.</span>
      </div>

      {/* Silhouettes row */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
        <DogSilhouette size={34} />
        <span style={{ fontSize: 8, color: T.ink, opacity: 0.8, marginBottom: 12 }}>●</span>
        <CatSilhouette size={34} />
      </div>

      {/* Wordmark */}
      <div style={{ textAlign: 'center', fontFamily: serif, color: T.ink, marginBottom: 28 }}>
        <div style={{ fontSize: 30, letterSpacing: '0.10em', fontWeight: 500, lineHeight: 1 }}>
          SNAP STUDIO
        </div>
        <div style={{ width: 110, height: 1, background: T.ink, margin: '12px auto 8px' }}/>
        <div style={{ fontSize: 10, letterSpacing: '0.20em', fontStyle: 'italic' }}>
          for your loved ones
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: serif, fontSize: 20, textAlign: 'center',
        lineHeight: 1.5, marginBottom: 24, fontStyle: 'italic',
      }}>
        今日は、どのスタジオで撮ろう？
      </div>

      {/* Section label */}
      <div style={{
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        fontFamily: serif, textAlign: 'center', opacity: 0.7, marginBottom: 14,
      }}>
        — choose your studio —
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 18,
        overflowX: 'auto', scrollbarWidth: 'none',
      }} className="no-scrollbar">
        {CATEGORIES.map((c, i) => {
          const active = c.key === tab;
          return (
            <React.Fragment key={c.key}>
              {i > 0 && (
                <span style={{
                  display: 'flex', alignItems: 'center', color: T.ink, opacity: 0.35,
                  fontSize: 10, padding: '0 2px',
                }}>·</span>
              )}
              <button
                onClick={() => setTab(c.key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: serif, fontSize: 14,
                  letterSpacing: '0.04em',
                  color: T.ink,
                  opacity: active ? 1 : 0.5,
                  padding: '6px 8px',
                  borderBottom: active ? `1px solid ${T.ink}` : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  fontStyle: active ? 'italic' : 'normal',
                  fontWeight: active ? 500 : 400,
                  transition: 'all 0.15s',
                }}
              >{c.label}</button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Studio cards — 2-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 20,
      }}>
        {(TEMPLATES[tab] || []).map(t => (
          <button
            key={t.id}
            onClick={() => onPick('dog', t.id)}
            style={{
              background: T.cream,
              borderRadius: 14,
              padding: 8,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 4px 12px rgba(44,24,16,0.10)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              width: '100%', aspectRatio: '3 / 4',
              borderRadius: 8, overflow: 'hidden', background: T.preview,
              marginBottom: 8, position: 'relative',
            }}>
              <img src={t.img} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'sepia(0.22) saturate(0.85) contrast(0.95)' }}/>
            </div>
            <div style={{
              fontFamily: serif, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
              color: T.ink, lineHeight: 1.25,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              padding: '0 2px',
            }}>{t.title}</div>
            <div style={{
              fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: serif, color: T.muted, marginTop: 2, fontStyle: 'italic',
              padding: '0 2px 4px',
            }}>{t.cat}</div>
          </button>
        ))}
      </div>

      <div style={{
        marginTop: 'auto', paddingTop: 12,
        fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
        fontFamily: serif, textAlign: 'center', opacity: 0.6,
      }}>
        30 templates · 7 categories
      </div>
    </div>
  );
}

// =====================================================================
// SCREEN 2: UPLOAD
// =====================================================================
function Upload({ subject, templateId, onBack, onUpload }) {
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);

  const tpl = findTpl(templateId) || findTpl('jp_03');
  const tplEn = TEMPLATE_EN[tpl?.id] || '—';

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploaded(true);
      setFileName(f.name);
    } else {
      // simulate upload for prototype
      setUploaded(true);
      setFileName('your_photo.jpg');
    }
  };

  const simulateUpload = () => {
    setUploaded(true);
    setFileName('your_photo.jpg');
  };

  return (
    <div style={{
      background: T.coral,
      minHeight: '100%',
      fontFamily: sans,
      color: T.ink,
      padding: '56px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.ink, fontSize: 20,
          fontFamily: serif, cursor: 'pointer', padding: 0, width: 28,
        }}>‹</button>
        <div style={{ flex: 1 }}><Wordmark small/></div>
        <div style={{ width: 28 }}/>
      </div>

      {/* Subject badge */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          fontFamily: serif, color: T.sub, marginBottom: 6,
        }}>selected studio</div>
        <div style={{
          fontFamily: serif, fontSize: 22, fontStyle: 'italic', letterSpacing: '0.04em',
        }}>{tpl?.title || '未選択'} <span style={{opacity:0.5, fontSize: 14}}>— {tplEn}</span></div>
      </div>

      {/* Upload card */}
      <div style={{
        background: T.cream,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        boxShadow: '0 8px 24px rgba(44,24,16,0.10)',
      }}>
        <div style={{
          border: `1px dashed ${T.border}`,
          borderRadius: 16,
          background: T.preview,
          aspectRatio: '4 / 5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          overflow: 'hidden', position: 'relative',
        }}>
          {uploaded ? (
            <img src={SUBJECT_PREVIEWS[subject]} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15) saturate(0.9)' }}/>
          ) : (
            <>
              {/* upload icon — thin line */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="21" stroke={T.ink} strokeWidth="1" opacity="0.3"/>
                <path d="M22 14v14M15 21l7-7 7 7" stroke={T.ink} strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontFamily: serif, fontSize: 18, letterSpacing: '0.02em' }}>
                写真を選ぶ
              </div>
              <div style={{
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                fontFamily: serif, color: T.muted,
              }}>tap to upload</div>
            </>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={pickFile}/>

        {!uploaded ? (
          <button onClick={simulateUpload} style={{
            marginTop: 18, width: '100%', background: 'transparent',
            border: `1px solid ${T.ink}`, borderRadius: 14, padding: '14px 16px',
            fontFamily: serif, fontSize: 15, letterSpacing: '0.10em',
            color: T.ink, cursor: 'pointer',
          }}>
            CHOOSE A PHOTO
          </button>
        ) : (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 4, background: T.ink,
            }}/>
            <div style={{ fontSize: 12, fontFamily: sans, color: T.sub, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName}
            </div>
            <button onClick={() => { setUploaded(false); setFileName(''); }}
              style={{ background: 'none', border: 'none', fontSize: 11,
                fontFamily: serif, letterSpacing: '0.10em', color: T.sub,
                textTransform: 'uppercase', cursor: 'pointer' }}>
              change
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{
        fontSize: 11, fontFamily: sans, color: T.ink, opacity: 0.75, lineHeight: 1.7,
        padding: '0 6px', marginBottom: 20,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase',
          fontFamily: serif, marginBottom: 8, opacity: 0.9,
        }}>— tips —</div>
        · 被写体がはっきり写っている写真がおすすめ<br/>
        · 明るい自然光 · 正面〜斜め向き<br/>
        {subject === 'child' && '· 保護者の同意のもとご利用ください'}
      </div>

      {/* CTA */}
      <button
        disabled={!uploaded}
        onClick={onUpload}
        style={{
          marginTop: 'auto',
          width: '100%',
          background: uploaded ? T.ink : 'transparent',
          color: uploaded ? T.cream : T.ink,
          opacity: uploaded ? 1 : 0.35,
          border: `1px solid ${T.ink}`,
          borderRadius: 16,
          padding: '18px 16px',
          fontFamily: serif,
          fontSize: 16,
          letterSpacing: '0.16em',
          cursor: uploaded ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        CONTINUE
      </button>
    </div>
  );
}

// =====================================================================
// SCREEN 3: RESULT
// =====================================================================
function Result({ subject, initialTemplate, onBack, onReset }) {
  // determine initial tab from initialTemplate
  const findCatForTpl = (id) => {
    for (const [k, list] of Object.entries(TEMPLATES)) {
      if (list.some(t => t.id === id)) return k;
    }
    return 'recommended';
  };
  const [tab, setTab] = useState(() => initialTemplate ? findCatForTpl(initialTemplate) : 'recommended');
  const [selected, setSelected] = useState(initialTemplate || 'jp_03');
  const [saved, setSaved] = useState(false);

  const templates = TEMPLATES[tab] || [];
  const selectedTpl = Object.values(TEMPLATES).flat().find(t => t.id === selected);
  const previewImg = selectedTpl ? selectedTpl.img : SUBJECT_PREVIEWS[subject];

  return (
    <div style={{
      background: T.coral,
      minHeight: '100%',
      fontFamily: sans,
      color: T.ink,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 56,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0 20px', marginBottom: 20,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.ink, fontSize: 20,
          fontFamily: serif, cursor: 'pointer', padding: 0, width: 28,
        }}>‹</button>
        <div style={{ flex: 1 }}><Wordmark small/></div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer', width: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-label="tone adjust">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke={T.ink} strokeWidth="1"/>
            <path d="M9 1v16" stroke={T.ink} strokeWidth="1"/>
            <path d="M9 1a8 8 0 010 16" fill={T.ink}/>
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div style={{ padding: '0 20px', marginBottom: 22 }}>
        <div style={{
          background: T.cream,
          borderRadius: 20,
          padding: 14,
          boxShadow: '0 8px 24px rgba(44,24,16,0.12)',
        }}>
          <div style={{
            borderRadius: 10,
            overflow: 'hidden',
            aspectRatio: '4 / 5',
            background: T.preview,
            position: 'relative',
          }}>
            <img
              key={previewImg}
              src={previewImg}
              alt="preview"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'sepia(0.18) saturate(0.92) contrast(0.95)',
                animation: 'fadeIn 0.4s ease',
              }}
            />
            {/* editorial caption overlay */}
            <div style={{
              position: 'absolute', bottom: 10, left: 12, right: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              fontFamily: serif, color: T.cream,
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.9 }}>
                  — preview —
                </div>
                <div style={{ fontSize: 18, fontStyle: 'italic', marginTop: 2, letterSpacing: '0.02em' }}>
                  {selectedTpl ? selectedTpl.title : '未選択'}
                </div>
              </div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
                no. {selectedTpl ? selectedTpl.id.replace('_', ' / ') : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save & Share section */}
      <div style={{
        padding: '0 20px',
        marginTop: 'auto',
        paddingBottom: 28,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          fontFamily: serif, textAlign: 'center', opacity: 0.7, marginBottom: 22,
        }}>
          — save & share —
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 22,
        }}>
          {[
            { key: 'save',  label: '保存',  en: 'save',
              icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={T.cream} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H5a2 2 0 00-2 2v14l7-4 7 4V4a2 2 0 00-2-2z"/>
              </svg>,
              onClick: () => { setSaved(true); setTimeout(() => setSaved(false), 1600); } },
            { key: 'line',  label: 'LINE', en: 'line',
              icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3c-5 0-9 3.2-9 7.2 0 3.6 3.3 6.6 7.8 7.1.3 0 .7.3.6.7l-.3 1.6c-.1.3.2.6.5.4 1.2-.6 6.4-3.8 8.1-6.6.6-1 1.3-2 1.3-3.2 0-4-4-7.2-9-7.2z"
                  stroke={T.cream} strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M7 8.5v4M7 12.5h2M11 8.5v4M11 8.5l2.5 4V8.5M15.5 8.5h1.5M15.5 10.5h1.5M15.5 12.5h1.5M15.5 8.5v4"
                  stroke={T.cream} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>,
              onClick: () => {} },
            { key: 'mail',  label: 'メール', en: 'mail',
              icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={T.cream} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="16" height="12" rx="1.5"/>
                <path d="M2 6l8 5 8-5"/>
              </svg>,
              onClick: () => {} },
          ].map(btn => (
            <div key={btn.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button
                onClick={btn.onClick}
                style={{
                  width: 58, height: 58, borderRadius: '50%',
                  background: T.ink, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(44,24,16,0.20)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >{btn.icon}</button>
              <div style={{
                fontSize: 11, fontFamily: serif, letterSpacing: '0.08em', color: T.ink,
              }}>{btn.key === 'save' && saved ? 'SAVED' : btn.label}</div>
              <div style={{
                fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: serif, color: T.muted, fontStyle: 'italic', marginTop: -4,
              }}>{btn.en}</div>
            </div>
          ))}
        </div>

        <div style={{
          height: 1, background: T.ink, opacity: 0.15,
          margin: '4px 40px 18px',
        }}/>

        <button
          onClick={onReset}
          style={{
            display: 'block', margin: '0 auto',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: serif, fontSize: 13, fontStyle: 'italic',
            letterSpacing: '0.04em', color: T.ink, opacity: 0.75,
            padding: '6px 12px',
            borderBottom: `1px solid ${T.ink}`,
          }}
        >
          他のスタジオで撮ってみる ›
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// APP ROOT — screen state machine
// =====================================================================
function App() {
  const [screen, setScreen] = useState(() => {
    try { return localStorage.getItem('snap_screen') || 'landing'; } catch { return 'landing'; }
  });
  const [subject, setSubject] = useState(() => {
    try { return localStorage.getItem('snap_subject') || 'dog'; } catch { return 'dog'; }
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => { try { localStorage.setItem('snap_screen', screen); } catch {} }, [screen]);
  useEffect(() => { try { localStorage.setItem('snap_subject', subject); } catch {} }, [subject]);

  const go = (s) => setScreen(s);

  // screen labels for comment context (1-indexed)
  const screenLabelMap = {
    landing: '01 Landing',
    upload:  '02 Upload',
    result:  '03 Result',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', boxSizing: 'border-box', background: '#E8D9C4',
    }}>
      <IOSDevice width={390} height={844}>
        <div data-screen-label={screenLabelMap[screen]}
             style={{ width: '100%', minHeight: '100%', position: 'relative' }}>
          {screen === 'landing' && (
            <Landing onPick={(s, tplId) => { setSubject(s); setSelectedTemplate(tplId); go('upload'); }}/>
          )}
          {screen === 'upload' && (
            <Upload subject={subject} templateId={selectedTemplate} onBack={() => go('landing')} onUpload={() => go('result')}/>
          )}
          {screen === 'result' && (
            <Result subject={subject} initialTemplate={selectedTemplate} onBack={() => go('upload')} onReset={() => go('landing')}/>
          )}
        </div>
      </IOSDevice>
    </div>
  );
}

if (!window.__SNAP_PRINT__) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
window.__SNAP_COMPONENTS__ = { Landing, Upload, Result, App };
