"use client";
import {useEffect,useRef} from "react";
import {X} from "lucide-react";
export default function Modal({children,onClose,className="",label}:{children:React.ReactNode;onClose:()=>void;className?:string;label:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const prev=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;document.body.style.overflow="hidden";ref.current?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();if(e.key==="Tab"){const els=ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],textarea,input,[tabindex="0"]');if(!els?.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
  document.addEventListener("keydown",key);return()=>{document.body.style.overflow=overflow;document.removeEventListener("keydown",key);prev?.focus();};
 },[onClose]);
 return <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={`modal ${className}`}><button className="icon-button modal-close" aria-label="关闭" onClick={onClose}><X size={20}/></button>{children}</div></div>;
}
