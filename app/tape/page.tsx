'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

// ============================================================
// 型定義
// ============================================================
type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string;
  artworkUrl: string;
  durationMs: number;
  trackViewUrl: string;
};

type LocalTrack = {
  isLocal: true;
  fileName: string;
  objectUrl: string;
};

type ActiveSource = Track | LocalTrack | null;

type EffectParams = {
  hiss: number;
  hicut: number;
  locut: number;
  wow: number;
  sat: number;
  gain: number;
};

type AudioNodes = {
  highpass?: BiquadFilterNode;
  lowpass?: BiquadFilterNode;
  shaper?: WaveShaperNode;
  delay?: DelayNode;
  lfoGain?: GainNode;
  lfo2Gain?: GainNode;
  noiseGain?: GainNode;
  output?: GainNode;
  wetGain?: GainNode;
  dryGain?: GainNode;
};

const PRESETS: Record<string, EffectParams> = {
  Clean:    { hiss: 0,  hicut: 18000, locut: 30,  wow: 0,  sat: 0,  gain: 100 },
  Cassette: { hiss: 25, hicut: 6500,  locut: 120, wow: 35, sat: 35, gain: 95  },
  VHS:      { hiss: 40, hicut: 5000,  locut: 200, wow: 55, sat: 50, gain: 90  },
  Walkman:  { hiss: 18, hicut: 8000,  locut: 80,  wow: 20, sat: 25, gain: 100 },
};

function valueToRotation(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min);
  return -135 + ratio * 270;
}

// ============================================================
// メインページ（状態を一元管理）
// ============================================================
export default function TapePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<ActiveSource>(null);
  const [showResults, setShowResults] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  const [params, setParams] = useState<EffectParams>(PRESETS.Cassette);
  const [activePreset, setActivePreset] = useState<string>('Cassette');
  const [bypass, setBypass] = useState(false);

  const [activeTab, setActiveTab] = useState<'itunes' | 'local'>('itunes');
  const [localFile, setLocalFile] = useState<LocalTrack | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodes>({});

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/itunes-search?term=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      setResults(data.results ?? []);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectTrack = (track: Track) => {
    setSelectedTrack(track);
    setShowResults(false);
  };

  const initAudioContext = useCallback(() => {
    if (ctxRef.current) return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 7000;
    lowpass.Q.value = 0.7;

    const shaper = ctx.createWaveShaper();
    shaper.curve = makeSatCurve(30);
    shaper.oversample = '2x';

    const delay = ctx.createDelay(0.05);
    delay.delayTime.value = 0.005;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 4.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.0008;
    lfo.connect(lfoGain).connect(delay.delayTime);
    lfo.start();

    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.7;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.0015;
    lfo2.connect(lfo2Gain).connect(delay.delayTime);
    lfo2.start();

    const bufSize = 2 * ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const out = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) out[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 5000;
    noiseFilter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;

    noise.connect(noiseFilter).connect(noiseGain);
    noise.start();

    const wetGain = ctx.createGain();
    wetGain.gain.value = 1;
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0;

    const output = ctx.createGain();
    output.gain.value = 1;

    delay.connect(wetGain).connect(output);
    dryGain.connect(output);
    noiseGain.connect(output);
    output.connect(ctx.destination);

    nodesRef.current = {
      highpass, lowpass, shaper, delay,
      lfoGain, lfo2Gain, noiseGain, output, wetGain, dryGain,
    };
  }, []);

  const connectAudioElement = useCallback((audio: HTMLAudioElement) => {
    initAudioContext();
    const ctx = ctxRef.current!;
    const n = nodesRef.current;

    const src = ctx.createMediaElementSource(audio);
    src.connect(n.highpass!);
    n.highpass!.connect(n.lowpass!);
    n.lowpass!.connect(n.shaper!);
    n.shaper!.connect(n.delay!);
    src.connect(n.dryGain!);
  }, [initAudioContext]);

  useEffect(() => {
    if (!selectedTrack) return;

    const audio = new Audio();
    if (isLocalTrack(selectedTrack)) {
      audio.src = selectedTrack.objectUrl;
      audio.loop = false;
    } else {
      audio.crossOrigin = 'anonymous';
      audio.src = `/api/itunes-audio?url=${encodeURIComponent(selectedTrack.previewUrl)}`;
      audio.loop = true;
    }
    audio.preload = 'auto';
    audioRef.current = audio;

    const onCanPlay = () => {
      try {
        connectAudioElement(audio);
        setDuration(audio.duration || 30);
      } catch (e) {
        console.warn('connect failed', e);
      }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.src = '';
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
    };
  }, [selectedTrack, connectAudioElement]);

  useEffect(() => {
    const n = nodesRef.current;
    if (!n.lowpass) return;

    n.lowpass.frequency.value = params.hicut;
    n.highpass!.frequency.value = params.locut;
    n.shaper!.curve = makeSatCurve(params.sat);
    n.lfoGain!.gain.value = (params.wow / 100) * 0.003;
    n.lfo2Gain!.gain.value = (params.wow / 100) * 0.005;
    n.output!.gain.value = params.gain / 100;
    if (!bypass) {
      n.noiseGain!.gain.value = (params.hiss / 100) * 0.06;
    }
  }, [params, bypass]);

  useEffect(() => {
    const n = nodesRef.current;
    if (!n.wetGain) return;
    if (bypass) {
      n.wetGain.gain.value = 0;
      n.dryGain!.gain.value = 1;
      n.noiseGain!.gain.value = 0;
    } else {
      n.wetGain.gain.value = 1;
      n.dryGain!.gain.value = 0;
      n.noiseGain!.gain.value = (params.hiss / 100) * 0.06;
    }
  }, [bypass, params.hiss]);

  useEffect(() => {
    return () => {
      if (localFile?.objectUrl) {
        URL.revokeObjectURL(localFile.objectUrl);
      }
    };
  }, [localFile]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const ctx = ctxRef.current;
    if (ctx?.state === 'suspended') await ctx.resume();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error('play failed', e);
      }
    }
  };

  const handleChangeTrack = () => {
    setSelectedTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (localFile?.objectUrl) {
      URL.revokeObjectURL(localFile.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    const track: LocalTrack = {
      isLocal: true,
      fileName: file.name,
      objectUrl,
    };
    setLocalFile(track);
    setSelectedTrack(track);
  };

  const updateParam = (key: keyof EffectParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
    setActivePreset('');
  };

  const applyPreset = (name: keyof typeof PRESETS) => {
    setParams(PRESETS[name]);
    setActivePreset(name);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = selectedTrack
    ? Math.min(100, (currentTime / (duration || 30)) * 100)
    : 0;

  return (
    <main className="tape-main">
      <section className="hero">
        <div className="hero-grain" aria-hidden="true" />
        <ScribbleOverlay />

        <div className="top-meta">
          <span><span className="live-dot" />On Air · Est. 2026</span>
          <span>{selectedTrack ? 'Track 01 / Side A' : 'Insert a tape'}</span>
        </div>

        <div className="logo-wrap">
          <Image
            src="/tape/logo.png"
            alt="Tape Radio"
            width={800}
            height={463}
            priority
            className="logo-img"
          />
        </div>

        <div className="vmarker left">Rec · Play · Stop</div>
        <div className="vmarker right">A · B · C · 60min</div>

        <div className="cassette-stage">
          <div className="cassette-wrap">
            <Image
              src="/tape/cassette.jpg"
              alt="cassette tape"
              width={941}
              height={1672}
              className="cassette-img"
              priority
            />
            {selectedTrack && !isLocalTrack(selectedTrack) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedTrack.artworkUrl}
                alt=""
                aria-hidden="true"
                className="cassette-artwork"
              />
            )}
            {selectedTrack && (
              <button
                type="button"
                className="play-overlay"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
            )}
          </div>
        </div>

        {selectedTrack ? (
          <>
            <div className="track-info">
              <div className="track-status">
                <span><span className="live-dot">●</span> {isPlaying ? 'Now Playing' : 'Paused'}</span>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <div className="track-name">
                {isLocalTrack(selectedTrack) ? selectedTrack.fileName : selectedTrack.trackName}
              </div>
              <div className="track-artist">
                {isLocalTrack(selectedTrack)
                  ? 'Local file'
                  : `${selectedTrack.artistName} · ${selectedTrack.collectionName}`}
              </div>
              <div className="time-row">
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="player-actions">
              <button type="button" className="action-btn" onClick={handleChangeTrack}>
                別の曲を探す
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="source-tabs">
              <button
                type="button"
                className={`tab ${activeTab === 'itunes' ? 'active' : ''}`}
                onClick={() => setActiveTab('itunes')}
              >
                iTunesから探す
              </button>
              <button
                type="button"
                className={`tab ${activeTab === 'local' ? 'active' : ''}`}
                onClick={() => setActiveTab('local')}
              >
                自分のファイル
              </button>
            </div>

            {activeTab === 'itunes' ? (
              <>
                <form className="search-row" onSubmit={handleSearch}>
                  <input
                    className="search-input"
                    type="text"
                    name="q"
                    autoComplete="off"
                    placeholder="アーティスト・曲名で検索…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="submit" className="search-btn" disabled={searching}>
                    {searching ? '...' : '検索'}
                  </button>
                </form>

                {showResults && results.length > 0 && (
                  <div className="results-list">
                    <div className="results-label">{results.length} 件の結果</div>
                    <ul>
                      {results.map((track) => (
                        <li key={track.trackId}>
                          <button
                            type="button"
                            className="result-item"
                            onClick={() => handleSelectTrack(track)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={track.artworkUrl} alt="" width={40} height={40} />
                            <div className="result-meta">
                              <div className="result-name">{track.trackName}</div>
                              <div className="result-artist">{track.artistName}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showResults && results.length === 0 && !searching && (
                  <div className="results-empty">該当する曲が見つかりませんでした</div>
                )}
              </>
            ) : (
              <div className="local-file-section">
                <label className="local-file-btn">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <span>音楽ファイルを選択</span>
                </label>
                <p className="local-file-hint">
                  mp3 / m4a / wav など、ブラウザがサポートする音声ファイルが使えます
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <section className="knobs-section">
        <div className="knob-header">
          <span className="knob-header-title">テープの質感</span>
          <button
            type="button"
            className="knob-header-bypass"
            onClick={() => setBypass(!bypass)}
            aria-pressed={bypass}
          >
            バイパス
            <span className={`toggle-pill ${bypass ? 'on' : ''}`} />
          </button>
        </div>

        <div className="knobs-grid">
          <Knob label="ヒス" value={params.hiss} min={0} max={100}
                onChange={(v) => updateParam('hiss', v)} />
          <Knob label="ハイカット" value={params.hicut} min={2000} max={20000}
                onChange={(v) => updateParam('hicut', v)}
                format={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : `${Math.round(v)}`} />
          <Knob label="ローカット" value={params.locut} min={20} max={400}
                onChange={(v) => updateParam('locut', v)} />
          <Knob label="揺らぎ" value={params.wow} min={0} max={100}
                onChange={(v) => updateParam('wow', v)} />
          <Knob label="歪み" value={params.sat} min={0} max={100}
                onChange={(v) => updateParam('sat', v)} />
          <Knob label="音量" value={params.gain} min={0} max={150}
                onChange={(v) => updateParam('gain', v)} />
        </div>

        <div className="presets">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((name) => (
            <button
              key={name}
              type="button"
              className={`preset-btn ${activePreset === name ? 'active' : ''}`}
              onClick={() => applyPreset(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="footer-mark">Web Audio · iTunes Preview · ciraf inc.</div>
      </section>
    </main>
  );
}

function ScribbleOverlay() {
  return (
    <svg className="scribbles" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
      <path d="M 20 240 Q 40 220 60 235 T 90 240 Q 70 260 50 255 T 25 270" />
      <path d="M 30 360 Q 38 380 30 400 Q 22 420 30 440 Q 38 460 30 480" />
      <path d="M 320 150 Q 340 140 360 155 Q 380 170 365 180 Q 350 185 335 175" />
      <path d="M 340 660 Q 370 655 375 680 Q 370 705 345 705 Q 325 700 325 680 Q 327 665 345 667" />
      <path d="M 250 490 Q 270 485 290 490 Q 305 500 300 520 Q 295 535 275 535 Q 255 530 250 515" />
    </svg>
  );
}

function Knob({
  label, value, min, max, onChange, format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const knobRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, startY: 0, startValue: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { dragging: true, startY: e.clientY, startValue: value };
    knobRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dy = dragRef.current.startY - e.clientY;
    const range = max - min;
    const sensitivity = range / 200;
    let newValue = dragRef.current.startValue + dy * sensitivity;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current.dragging = false;
    knobRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = (max - min) / 100;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    }
  };

  const rotation = valueToRotation(value, min, max);
  const displayValue = format ? format(value) : Math.round(value).toString();

  return (
    <div className="knob-cell">
      <div
        ref={knobRef}
        className="knob-dot"
        style={{ '--rot': `${rotation}deg` } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        tabIndex={0}
      />
      <div className="knob-label">{label}</div>
      <div className="knob-value">{displayValue}</div>
    </div>
  );
}

function isLocalTrack(t: ActiveSource): t is LocalTrack {
  return !!t && 'isLocal' in t && t.isLocal === true;
}

function makeSatCurve(amount: number): Float32Array<ArrayBuffer> {
  const k = (amount / 100) * 80;
  const samples = 4096;
  const buffer = new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT);
  const curve = new Float32Array(buffer);
  const deg = Math.PI / 180;
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}
