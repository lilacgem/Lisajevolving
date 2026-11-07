import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import {createBandReader} from './audioBands.js';

export default function Home() {
 const media=useRef(null),mirror=useRef(null),graph=useRef(null);
 const [track,setTrack]=useState('lisaj');
 const isAuj=track==='aujoulevol';
 const [playing,setPlaying]=useState(false),[filter,setFilter]=useState('All'),[error,setError]=useState('');
 useEffect(()=>{
  document.title='LisajEvolving — my inner universe';
  let frame;
  function tick(){
   const g=graph.current;
   if(g){const values=g.readBands();const active=!media.current.paused;mirror.current?.contentWindow?.postMessage({type:'lisa-audio',...(active?values:{energy:0,bass:0,mid:0,high:0})},location.origin);}
   frame=requestAnimationFrame(tick);
  }tick();return()=>{cancelAnimationFrame(frame);graph.current?.context.close().catch(()=>{});};
 },[]);
 async function connect(){try{if(!graph.current){const context=new(window.AudioContext||window.webkitAudioContext)(),analyser=context.createAnalyser();const readBands=createBandReader(context,analyser);const source=context.createMediaElementSource(media.current);source.connect(analyser);analyser.connect(context.destination);graph.current={context,analyser,readBands};}await graph.current.context.resume();}catch{setError('The audio can play, but this browser could not connect the mirror response.');}}
 async function toggle(){if(!media.current.paused){media.current.pause();return;}await connect();try{await media.current.play();}catch{setError('Tap the audio player to begin.');}}
 async function enterVoice(next='lisaj') {setFilter('All');if(next!==track){media.current.pause();setTrack(next);media.current.src=next==='aujoulevol'?'/media/aujoulevol-enhanced.m4a':'/media/LisajEvokesEnhanced.m4a';media.current.load();await connect();try{await media.current.play();}catch{setError('Press play to enter this mirror.');}}else{toggle();}document.getElementById('voice')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 return <div className={'home '+(playing?'sound-is-flowing':'')}>
  <div className="sky-dust" aria-hidden="true"/>
  <header className="site-nav"><a className="wordmark" href="#">lisa<span>j</span>evolving<span className="star">✳</span></a><nav aria-label="Main"><a href="#orbit">My orbit</a><a href="#flow">The flow</a><a href="#throne">My throne</a></nav><span className="nav-note">INNER WORLD / OPEN SKY</span></header>
  <main>
   <section className="universe" id="orbit" aria-labelledby="universe-title">
    <div className="universe-intro"><p className="eyebrow">COME AS YOU ARE. BECOME AS YOU FEEL.</p><h1 id="universe-title">My throne.<br/><em>My universe.</em></h1><p>All of me has room here.<br/>The soft. The loud. The still becoming.</p></div>
    <div className="orbital-space">
     <div className="orbit-ring ring-one" aria-hidden="true"/><div className="orbit-ring ring-two" aria-hidden="true"/><div className="orbit-ring ring-three" aria-hidden="true"/>
     <div className="throne-halo" aria-hidden="true">✧</div><span className="orbit-coordinate coordinate-one" aria-hidden="true">SOUL / SOUND / SELF</span><span className="orbit-coordinate coordinate-two" aria-hidden="true">NOTHING TO FIT INTO</span>
     <div className="mirror-core"><iframe ref={mirror} src={"?mirror=1&embedded=1&track="+track} title={isAuj?"Aujoulevol living mirror with orbital ribbons":"LisajEvokes living mirror, responding to the compilation"}/><div className="core-vignette"/></div>
     <button className="orbit-body voice-world" onClick={()=>enterVoice('lisaj')} aria-label={playing&&!isAuj?'Pause LisajEvokes living mirror':'Enter and play LisajEvokes living mirror'}><span className="planet planet-voice" aria-hidden="true"/><span className="world-label">01 / LISAJEVOKES<em>{playing&&!isAuj?'Your voice is flowing':'A little bit of everything'}</em><small>{playing&&!isAuj?'Ⅱ PAUSE THE FLOW':'↗ ENTER THIS WORLD'}</small></span></button>
     <button className="orbit-body next-world" onClick={()=>enterVoice('aujoulevol')} aria-label="Enter and play Aujoulevol living mirror"><span className="planet planet-next" aria-hidden="true"/><span className="world-label">02 / AUJOULEVOL<em>A different kind of frequency</em><small>↗ ENTER THIS WORLD</small></span></button>
     <span className="satellite satellite-one" aria-hidden="true">✦</span><span className="satellite satellite-two" aria-hidden="true">✧</span>
     <div className="core-label"><span>THE LIVING MIRRORS</span><p>Pieces of my world.<br/>Each with its own gravity.</p></div>
    </div>
    <div className="universe-bottom"><span>NO BOXES. NO FIXED FORM.</span><a href="#flow">FOLLOW THE FLOW ↓</a><span>JUST ME, EVOLVING.</span></div>
   </section>
   <section className="flow-section" id="flow"><div className="section-heading"><div><p className="eyebrow">WHATEVER MOVES THROUGH ME</p><h2>Let it <em>flow.</em></h2></div><p>Conversations. Visuals. Real life.<br/>There’s no single way to be here.</p></div><div className="filters" aria-label="Filter posts">{['All','Audio','Vlogs','Visuals','Notes'].map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item==='All'?'Everything':item}</button>)}</div>
    <article id="voice" className="voice-chamber" hidden={filter!=='All'&&filter!=='Audio'}><div className={'voice-art '+(isAuj?'auj-art ':'')+(playing?'is-playing':'')}><div className="echo echo-one"/><div className="echo echo-two"/><div className="voice-pearl"/><span className="art-index">{isAuj?"LIVING MIRROR / 002":"LIVING MIRROR / 001"}</span><span className="art-signature">{isAuj?<>Aujoule<em>vol</em></>:<>Lisaj<em>Evokes</em></>}</span></div><div className="episode"><p className="eyebrow">{isAuj?"AUJOULEVOL · 5:42":"VOICE COLLECTION · 3:34"}</p><h3>{isAuj?<>A different kind<br/>of <em>frequency.</em></>:<>A little bit<br/>of <em>everything.</em></>}</h3><p>{isAuj?"Aujoulevol in its own orbit. Low frequencies expand the halo, the mids move the ribbons, and the highs bring out fine light.":"Me talking, thinking, and wandering through different things. My voice becomes movement, color, and light in the mirror above."}</p><button className="pill" onClick={toggle}>{playing?'Ⅱ Pause the flow':'▶ Let my voice flow'}<span>↗</span></button><audio ref={media} controls preload="metadata" onPlay={()=>{setPlaying(true);connect();}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>setError('The recording could not load. Please refresh and try again.')} aria-label={isAuj?"Aujoulevol enhanced audio":"LisajEvokes enhanced compilation"} src={isAuj?"/media/aujoulevol-enhanced.m4a":"/media/LisajEvokesEnhanced.m4a"}></audio><p className="playback-note">Sound begins when you choose.</p>{error&&<p role="status">{error}</p>}</div></article>
    {filter!=='All'&&filter!=='Audio'&&<div className="empty-flow"><span>✧</span><h3>Space for what comes next.</h3><p>{filter} will find their way here as I share them.</p><button className="pill" onClick={()=>setFilter('All')}>Return to the flow ↗</button></div>}
    <div className="next-mirror" id="next-mirror"><span className="mini-planet"/><div><p className="eyebrow">ANOTHER WORLD IN THE ORBIT</p><h3>Aujoulevol</h3><p>Teal light, gold filaments, and orbital ribbons. A mirror shaped by the enhanced recording.</p></div><button className="pill" onClick={()=>enterVoice('aujoulevol')}>Enter Aujoulevol ↗</button></div>
   </section>
   <section className="throne-section" id="throne"><div className="throne-symbol" aria-hidden="true">♛</div><p className="eyebrow">THE INNER ME</p><h2>I don’t have to<br/>be one thing.<br/><em>I get to be me.</em></h2><p>This is my space to feel, speak, create, wander.<br/>To be soft and take up space.<br/>To let every version of me have a place in the orbit.</p><span className="throne-signature">Lisa J. — still evolving ✧</span></section>
  </main><footer><a className="wordmark" href="#">lisajevolving ✳</a><span>MY WORLD. MY GRAVITY.</span><a href="https://evomirror.com" target="_blank" rel="noreferrer">Born with EvoMirror ↗</a></footer>
 </div>;
}
