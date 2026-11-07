import React, {useRef,useState,useEffect} from 'react';
import {startCanvasRecording} from './canvasRecording.js';
import {createBandReader} from './audioBands.js';

function TrackExport({track}) {
 const isAuj=track==='aujoulevol'; const title=isAuj?'Aujoulevol':'LisajEvokes';
 const frame=useRef(null), audio=useRef(null), output=useRef(null), active=useRef(null);
 const [status,setStatus]=useState('Ready to render the full living mirror.'), [busy,setBusy]=useState(false), [complete,setComplete]=useState(false);
 useEffect(()=>()=>{active.current?.cancel();},[]);
 async function render() {
  setBusy(true); setStatus('Preparing audio and artwork…');
  let context,raf,interval;
  try {
   const sourceCanvas=frame.current.contentDocument.querySelector('canvas');
   if(!sourceCanvas) throw new Error('The mirror is still loading. Try again in a moment.');
   context=new AudioContext();
   const source=context.createMediaElementSource(audio.current), analyser=context.createAnalyser(), destination=context.createMediaStreamDestination();
   const readBands=createBandReader(context,analyser);
   source.connect(analyser); analyser.connect(destination); 
   await context.resume();
   if(audio.current.readyState<1) await new Promise((resolve,reject)=>{audio.current.onloadedmetadata=resolve;audio.current.onerror=()=>reject(new Error('Audio could not load'));audio.current.load();});
   const duration=audio.current.duration;
   const ctx=output.current.getContext('2d');
   function paint() {
    frame.current.contentWindow.postMessage({type:'lisa-audio',...readBands()},location.origin);
    ctx.fillStyle='#08070d';ctx.fillRect(0,0,720,1280);ctx.drawImage(sourceCanvas,0,0,720,1280);
    const shade=ctx.createLinearGradient(0,990,0,1280);shade.addColorStop(0,'#08070d00');shade.addColorStop(1,'#08070dee');ctx.fillStyle=shade;ctx.fillRect(0,990,720,290);
    ctx.textAlign='center';ctx.fillStyle='#eee0f1';ctx.font='italic 40px Georgia';ctx.fillText('The living mirror',360,1110);
    ctx.font='16px sans-serif';ctx.fillStyle='#cbb3d4';ctx.fillText(isAuj?'A U J O U L E V O L':'L I S A J E V O K E S',360,1154);
    ctx.font='15px sans-serif';ctx.fillText('lisajevolving.com',360,1190);
    raf=requestAnimationFrame(paint);
   } paint();
   const cleanup=()=>{cancelAnimationFrame(raf);clearInterval(interval);audio.current.pause();context.close().catch(()=>{});setBusy(false);};
   active.current=startCanvasRecording({canvas:output.current,microphone:destination.stream,maxDurationMs:(duration+1)*1000,onStopping:()=>setStatus('Saving the completed video…'),onError:error=>{cleanup();setStatus(error.message);},onComplete:async result=>{
    cleanup();setComplete(true);setStatus('Writing video to your export folder…');
    try {const response=await fetch('/__export/'+(isAuj?'aujoulevol':'lisaj')+'-full.webm',{method:'POST',headers:{'Content-Type':result.mimeType},body:result.blob});if(!response.ok)throw new Error('Could not save the video.');setStatus(`Saved full recording (${(result.blob.size/1048576).toFixed(1)} MB). Ready for MP4 conversion.`);}catch(error){setStatus(error.message);}
   }});
   audio.current.currentTime=0;await audio.current.play();
   audio.current.onended=()=>active.current.stop();
   interval=setInterval(()=>setStatus(`Rendering ${Math.floor(audio.current.currentTime)} / ${Math.ceil(duration)} seconds — keep this tab open.`),1000);
  } catch(error) {cancelAnimationFrame(raf);clearInterval(interval);audio.current?.pause();context?.close().catch(()=>{});setStatus(error.message);setBusy(false);}
 }
 return <main style={{background:'#17151b',color:'#eaddec',minHeight:'100vh',fontFamily:'sans-serif',padding:24}}><h1>{title} · social export</h1><p role="status">{status}</p><button disabled={busy||complete} onClick={render} style={{padding:'14px 24px',cursor:'pointer'}}>Render full video</button><div style={{display:'flex',gap:24,marginTop:24}}><div style={{width:360,height:640,overflow:'hidden'}}><iframe ref={frame} title="Export mirror source" src={"?mirror=1&embedded=1&track="+track} style={{width:720,height:1280,border:0,transform:'scale(.5)',transformOrigin:'top left'}}/></div><canvas ref={output} width="720" height="1280" style={{width:360,height:640}}/></div><audio ref={audio} src={isAuj?"/media/aujoulevol-enhanced.m4a":"/media/LisajEvokesEnhanced.m4a"} preload="auto"/></main>;
}

export default function Export(){return <div><TrackExport track='lisaj'/><TrackExport track='aujoulevol'/></div>;}
