import { useState, useEffect } from "react";

export function useStore(k,init){
 const [v,setV]=useState(()=>{try{const x=localStorage.getItem(k);if(x)return JSON.parse(x)}catch(e){}return init});
 useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},[k,v]);
 return [v,setV];
}

export function useCount(t,d){
 const [v,setV]=useState(0);
 useEffect(()=>{let s=null,id;const f=ts=>{if(s===null)s=ts;const p=Math.min((ts-s)/900,1);setV(t*(1-Math.pow(1-p,3)));if(p<1)id=requestAnimationFrame(f)};id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)},[t]);
 return d?v.toFixed(d):Math.round(v);
}
