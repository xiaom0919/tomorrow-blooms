"use client";

export function Flower({ color = "#d98b83", size = 36, className = "" }: {color?: string; size?: number; className?: string}) {
  return <svg width={size} height={size} viewBox="0 0 80 80" className={className} aria-hidden="true">
    <g fill={color}>{[0,60,120,180,240,300].map(a => <ellipse key={a} cx="40" cy="25" rx="10" ry="19" transform={`rotate(${a} 40 40)`}/>)}</g>
    <circle cx="40" cy="40" r="9" fill="#ebc879"/><circle cx="37" cy="38" r="2" fill="#fbebaf"/>
  </svg>;
}

export function Boat({className = "", size = 44}: {className?: string; size?: number}) {
  return <svg width={size} height={size*.7} viewBox="0 0 110 75" fill="none" className={className} aria-hidden="true"><path d="M9 38 52 5 66 37 101 30 78 65 30 65Z" fill="#f6ecd3"/><path d="m9 38 43-33-7 33 56-8-23 35-33-27-15 27Z" fill="#e6d5ad"/><path d="m9 38 36 0 33 27H30Z" fill="#f9efd7"/><path d="m45 38 7-33 14 32" stroke="#bcaa84" strokeWidth="1.2"/><path d="m9 38 36 0 56-8" stroke="#fff9e8" strokeWidth="1.4"/></svg>;
}

function Lotus({x,y,s=1,color="#dd9a98"}:{x:number;y:number;s?:number;color?:string}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy="20" rx="48" ry="11" fill="#91b5a1" opacity=".25"/>
    <path d="M0 4C-22-5-39-18-42-35-17-36-3-17 0 4" fill="#b96f74"/>
    <path d="M0 4C22-5 39-18 42-35 17-36 3-17 0 4" fill="#ca858a"/>
    <path d="M0 4C-22-12-28-35-17-54 0-45 7-19 0 4" fill={color}/>
    <path d="M0 4C22-12 28-35 17-54 0-45-7-19 0 4" fill="#ecc1b4"/>
    <path d="M0 2C-12-15-14-39 0-61 14-39 12-15 0 2" fill="#f2c9b6"/>
    <path d="M-19-6Q0 10 19-6" stroke="#d7b765" strokeWidth="4" fill="none"/>
  </g>;
}

export default function PondArt({hasBoat = false, blooming = false, night = false, onFlower}: {hasBoat?: boolean;blooming?: boolean;night?:boolean;onFlower?:()=>void}) {
  return <svg className={`pond-illustration ${night ? "pond-night" : ""}`} viewBox="0 0 760 390" role="img" aria-label="月光下的许愿池，纸船轻轻漂浮，池边开着荷花">
    <defs>
      <radialGradient id="water" cx="42%" cy="30%" r="80%"><stop stopColor="#668e85"/><stop offset=".5" stopColor="#3e6b64"/><stop offset="1" stopColor="#224c48"/></radialGradient>
      <linearGradient id="bank" x2="0" y2="1"><stop stopColor="#b9bda1"/><stop offset="1" stopColor="#8c9c80"/></linearGradient>
      <linearGradient id="moontrail" x2="0" y2="1"><stop stopColor="#f4e4ad" stopOpacity=".35"/><stop offset="1" stopColor="#f4e4ad" stopOpacity="0"/></linearGradient>
      <radialGradient id="moonlight"><stop stopColor="#f0d59a" stopOpacity=".3"/><stop offset="1" stopColor="#f0d59a" stopOpacity="0"/></radialGradient>
      <filter id="soft-shadow"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
    </defs>
    <circle cx="578" cy="68" r="77" fill="url(#moonlight)"/>
    <circle cx="578" cy="68" r="24" fill="#e8d39c"/><circle cx="568" cy="61" r="3" fill="#dbc58f" opacity=".5"/><circle cx="585" cy="76" r="5" fill="#dbc58f" opacity=".4"/>
    <g stroke="#a4ac8e" strokeWidth="1.5" fill="none" opacity=".8"><path d="M86 234Q93 158 67 128M87 207Q61 193 57 175M88 191Q110 169 105 151M89 176Q73 158 75 149"/><path d="M655 217Q672 150 657 117M665 176Q691 164 689 148M668 159Q643 146 646 132"/></g>
    <g fill="#9eac8b"><ellipse cx="64" cy="128" rx="4" ry="12" transform="rotate(-28 64 128)"/><ellipse cx="57" cy="175" rx="4" ry="10" transform="rotate(-35 57 175)"/><ellipse cx="105" cy="150" rx="4" ry="12" transform="rotate(20 105 150)"/><ellipse cx="657" cy="117" rx="4" ry="13"/><ellipse cx="689" cy="148" rx="4" ry="11" transform="rotate(34 689 148)"/></g>
    <ellipse cx="377" cy="305" rx="285" ry="43" fill="#60795e" opacity=".12" filter="url(#soft-shadow)"/>
    <path d="M83 236C74 181 160 132 281 133 381 123 426 146 505 143 592 137 693 166 688 224 686 280 576 325 414 328 254 333 103 297 83 236Z" fill="url(#bank)"/>
    <path d="M94 225C100 175 185 145 286 148 392 138 447 159 521 153 599 149 677 178 672 223 664 268 565 306 416 311 256 316 112 281 94 225Z" fill="#d2cdb0"/>
    <path d="M105 222C112 177 199 157 291 160 395 151 445 170 521 164 593 159 662 183 659 222 649 262 552 295 416 301 269 306 122 273 105 222Z" fill="url(#water)" filter="url(#grain)"/>
    <path d="M551 172Q574 166 593 178L610 232Q576 250 534 231Z" fill="url(#moontrail)"/>
    <g stroke="#d0dbba" fill="none" strokeLinecap="round" opacity=".35"><path d="M542 186h44m-51 9h65m-58 11h43m-44 11h61m-71 10h45"/><path d="M206 209q33-8 62-2m-86 30q29 6 45 2m217 24q41 6 79-3m-154 25q42 4 71-3m-75-104q15-3 31 0"/></g>
    <g fill="#719782"><path d="M148 227c0-13 26-23 51-20l-14 15 27-9c20 18-8 34-38 32-15-1-26-7-26-18"/><path d="M446 199c0-12 24-22 46-18l-12 14 22-8c18 16-6 30-33 29-13 0-23-6-23-17"/><path d="M498 271c0-13 29-23 55-19l-18 15 29-10c22 20-10 35-40 32-15-1-26-7-26-18"/><path d="M257 281c0-8 19-16 36-13l-10 9 19-6c12 11-7 23-28 22-9-1-17-5-17-12"/></g>
    <g fill="#577f6a"><ellipse cx="197" cy="184" rx="28" ry="12" transform="rotate(-10 197 184)"/><ellipse cx="574" cy="234" rx="24" ry="10" transform="rotate(8 574 234)"/></g>
    <Lotus x={185} y={217} s={.66}/><Lotus x={536} y={267} s={.82}/><Lotus x={478} y={195} s={.42}/>
    <g className="pond-fish" fill="#e3a47d" opacity=".8"><path d="M284 239q19-14 38 0-19 13-38 0m38 0 10-9v18Z"/><circle cx="291" cy="238" r="1.5" fill="#3e685d"/></g>
    <g className="pond-petals" fill="#d7a59c"><ellipse cx="394" cy="192" rx="4" ry="2" transform="rotate(24 394 192)"/><ellipse cx="422" cy="239" rx="3" ry="1.7" transform="rotate(-24 422 239)"/><ellipse cx="244" cy="264" rx="3" ry="2"/></g>
    <g fill="#87977b"><ellipse cx="112" cy="277" rx="22" ry="9" transform="rotate(24 112 277)"/><ellipse cx="647" cy="268" rx="28" ry="11" transform="rotate(-19 647 268)"/><ellipse cx="136" cy="291" rx="14" ry="6" transform="rotate(14 136 291)"/></g>
    <g stroke="#758a6b" strokeWidth="2" fill="none"><path d="M125 290q-16-41-9-65m7 48q-17-16-21-36m23 47q13-27 11-38M605 290q9-29 1-49m3 32q17-22 18-39"/></g>
    <g fill="#c3ad72"><ellipse cx="116" cy="227" rx="2.5" ry="8"/><ellipse cx="102" cy="237" rx="2.5" ry="7" transform="rotate(-20 102 237)"/><ellipse cx="136" cy="246" rx="2.5" ry="8" transform="rotate(12 136 246)"/></g>
    <g fill="#f5df9c" className="fireflies"><circle cx="146" cy="154" r="2"/><circle cx="604" cy="122" r="2.4"/><circle cx="688" cy="242" r="1.8"/><circle cx="292" cy="125" r="1.6"/><circle cx="75" cy="241" r="2"/></g>
    {hasBoat && <g className="floating-boat" transform="translate(335 201)"><ellipse cx="33" cy="38" rx="45" ry="9" fill="#c7d8ba" opacity=".15"/><path d="m-4 9 31-27 12 26 31-3-20 28H12Z" fill="#e7d7b6"/><path d="m-4 9 32-1 22 25H12Z" fill="#faf0d5"/><path d="m28 8-1-26 12 26" fill="#f5e8c9"/><path d="m28 8 42-3-20 28" fill="#c7b58e"/><circle cx="28" cy="1" r="4" fill="#efcd7c"/><circle cx="28" cy="1" r="16" fill="#f3d383" opacity=".16"/></g>}
    {blooming && <g className="new-flower" onClick={onFlower} role="button" tabIndex={0} aria-label="打开愿望之花" onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onFlower?.();}}} style={{cursor:"pointer"}}><circle cx="360" cy="241" r="40" fill="#e8c989" opacity=".15"/><Lotus x={360} y={247} s={1.1} color="#df9b7f"/><circle cx="360" cy="249" r="5" fill="#edd18e"/><text x="360" y="284" textAnchor="middle" fontSize="12" fill="#f4e8c5">轻触，读一朵花</text></g>}
    <path d="M193 340q153 12 310-1" fill="none" stroke="#b9bba3" strokeWidth="1" strokeDasharray="2 7"/>
    <text x="378" y="368" textAnchor="middle" fill="#8a9380" fontSize="11" letterSpacing="4">一池月光，接住每一个小小的愿望</text>
  </svg>;
}
