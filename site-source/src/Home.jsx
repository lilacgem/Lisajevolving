import React, { useRef, useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
 const media = useRef(null), mirror = useRef(null), graph = useRef(null);
 const [playing, setPlaying] = useState(false), [filter, setFilter] = useState('All'), [error, setError] = useState('');
 useEffect(() => {
  document.title = 'LisajEvolving — a world in progress';
  let frame;
  const tick = () => {
   const g = graph.current;
   if (g) {
    g.analyser.getByteFrequencyData(g.bins);
    const avg = (a,b) => { let sum=0; for(let i=a;i<b;i++) sum+=g.bins[i]; return sum/((b-a)*255); };
    const active = !media.current.paused;
    mirror.current?.contentWindow?.postMessage({type:'lisa-audio', energy:active?avg(0,128):0, bass:active?avg(0,8):0, mid:active?avg(8,40):0, high:active?avg(40,128):0}, location.origin);
   }
   frame=requestAnimationFrame(tick);
  }; tick();
  return () => { cancelAnimationFrame(frame); graph.current?.context.close().catch(()=>{}); };
 }, []);
 async function connect() {
  try {
   if (!graph.current) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser=context.createAnalyser(); analyser.fftSize=256;
    const source=context.createMediaElementSource(media.current); source.connect(analyser); analyser.connect(context.destination);
    graph.current={context,analyser,bins:new Uint8Array(analyser.frequencyBinCount)};
   }
   await graph.current.context.resume();
  } catch { setError('Audio is available; this browser could not connect the reactive visuals.'); }
 }
 async function toggle() {
  if (!media.current.paused) { media.current.pause(); return; }
  await connect();
  try { await media.current.play(); } catch { setError('Tap the audio player below to start playback.'); }
 }
 const showAudio = filter==='All'||filter==='Audio';
 return <div className="home">
  <header className="site-nav"><a className="wordmark" href="#">lisa<span>j</span>evolving<span className="star">✳</span></a><nav aria-label="Main"><a href="#latest">The feed</a><a href="#mirror">EvoMirror</a><a href="#about">My world</a></nav><span className="nav-note">ALWAYS BECOMING ↗</span></header>
  <main>
   <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">A LITTLE COSMIC. A LITTLE CONCRETE.</p><h1 id="hero-title">In my world.<br/><em>In my becoming.</em></h1><p className="intro">Voice notes, real life, creative detours.<br/>A digital home for all the versions of me.</p><a className="pill light" href="#latest">Come on in <span>↗</span></a><p className="handwritten">never just one thing ✧</p></div><div className="mirror-art" id="mirror"><iframe ref={mirror} src="?mirror=1&embedded=1" title="EvoMirror audio-reactive artwork"/><div className="art-caption"><span>01 / THE LIVING MIRROR</span><span>SOUND BECOMES LIGHT</span></div></div><div className="hero-bottom"><span>SOFT SPIRIT. CITY ENERGY.</span><span>SCROLL INTO MY ORBIT ↓</span></div></section>
   <section className="feed" id="latest"><div className="section-heading"><div><p className="eyebrow">THE FEED / OPEN ENDED</p><h2>Whatever’s <em>flowing.</em></h2></div><p>Some days a conversation.<br/>Some days something else entirely.</p></div><div className="filters" aria-label="Filter posts">{['All','Audio','Vlogs','Visuals','Notes'].map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}{item==='All'?' things':''}</button>)}</div>
   <article className="featured" hidden={!showAudio}><div className={'record-art '+(playing?'is-playing':'')}><span className="record-label">LISAJ<br/><i>EVOKES</i></span><div className="vinyl"/><span className="record-number">VOICE COLLECTION / 001</span></div><div className="episode"><p className="eyebrow">AUDIO COMPILATION · LISAJEVOKES</p><h3>A little bit<br/>of <em>everything.</em></h3><p>Me talking, thinking, and wandering through different things. Press play and watch my voice move through EvoMirror.</p><button className="pill light" onClick={toggle}>{playing?'Ⅱ Pause the compilation':'▶ Play the compilation'} <span>↗</span></button><audio ref={media} controls preload="metadata" onPlay={()=>{setPlaying(true);connect();}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>setError('The recording could not load. Please refresh and try again.')} aria-label="LisajEvokes enhanced compilation"><source src="/media/LisajEvokesEnhanced.m4a" type="audio/mp4"/></audio><p className="playback-note">Your pace. Your volume. No autoplay.</p>{error&&<p role="status">{error}</p>}</div></article>
   {!showAudio&&<div className="empty-feed"><span>✧</span><h3>A little room for what’s next.</h3><p>{filter} will appear here as I share them. For now, step into the audio compilation.</p><button className="pill" onClick={()=>setFilter('Audio')}>Explore the audio ↗</button></div>}
   <div className="feed-foot"><span>NO BOXES. JUST EXPRESSION.</span><span>AUDIO / FILM / ART / LIFE</span></div></section>
   <section className="about" id="about"><p className="eyebrow">THE GIRL BEHIND THE ORBIT</p><h2>I’m Lisa J.<br/>Still growing.<br/><em>Still evolving.</em></h2><div><span className="about-star">✳</span><p>This is where I leave pieces of my world: things I say, things I make, things I’m living through.</p><p>There’s room for softness and city energy. For a deep thought or a random moment. For whatever comes next.</p><a href="#latest">Stay a little while ↗</a></div></section>
  </main><footer><a className="wordmark" href="#">lisajevolving ✳</a><span>A WORLD IN PROGRESS.</span><a href="https://evomirror.com" target="_blank" rel="noreferrer">Meet EvoMirror ↗</a></footer>
 </div>;
}

