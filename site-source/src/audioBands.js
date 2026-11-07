// Frequency boundaries use the context's sample rate, independent of FFT size.
export function createBandReader(context, analyser) {
 analyser.fftSize=2048;analyser.smoothingTimeConstant=.75;
 const values=new Uint8Array(analyser.frequencyBinCount);
 const band=(lo,hi)=>{const a=Math.max(0,Math.ceil(lo/context.sampleRate*analyser.fftSize)),b=Math.min(values.length,Math.ceil(hi/context.sampleRate*analyser.fftSize));let sum=0;for(let i=a;i<b;i++)sum+=values[i]/255;return b>a?sum/(b-a):0;};
 return ()=>{analyser.getByteFrequencyData(values);const bass=band(20,250),mid=band(250,4000),high=band(4000,16000);return {bass,mid,high,energy:Math.min(1,bass*.25+mid*.65+high*.1)};};
}
