'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
/** Keeps the layout usable if a remote image is unavailable. The fallback is an illustration. */
export default function Photo(props:ImageProps){const [failed,setFailed]=useState(false);return <Image {...props} unoptimized src={failed?'/images/mountain.svg':props.src} alt={failed?'Ilustración de montaña · fotografía no disponible':props.alt} onError={()=>setFailed(true)}/>}
