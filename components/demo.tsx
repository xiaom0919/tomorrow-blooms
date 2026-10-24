"use client";
import {useState} from "react";
import {ArrowRight,Check,Heart,Leaf,Sun} from "lucide-react";
import Modal from "./modal";
import PondArt,{Boat,Flower} from "./pond-art";
export default function Demo({onClose}:{onClose:()=>void}){
 const [step,setStep]=useState(0),[text,setText]=useState("希望明天面试顺利，能勇敢地说出自己的想法。"),[reply,setReply]=useState("提前准备三个最想讲的经历。紧张的时候，就从你最熟悉的那个开始。祝你带着自己的光出发。"),[thanked,setThanked]=useState(false);
 return <Modal onClose={onClose} className={`demo-modal demo-step-${step}`} label="体验纸船的一夜旅行">
 <div className="demo-label"><span className="status-dot"/>互动演示 · 不向真实用户发送</div>
 <div className="demo-progress">{["许愿","漂流","浇水","晚安","花开"].map((s,i)=><span className={i<=step?"complete":""} key={s}><i>{i<step?<Check size={11}/>:i+1}</i>{s}</span>)}</div>
 {step===0&&<><Flower size={52}/><h2>今晚，你想许什么愿？</h2><p>把一个小小的期待，交给这艘纸船。</p><textarea aria-label="演示愿望" value={text} onChange={e=>setText(e.target.value)} maxLength={160}/><button className="primary" disabled={!text.trim()} onClick={()=>setStep(1)}>折成纸船，放进池塘 <ArrowRight size={16}/></button></>}
 {step===1&&<><div className="demo-pond"><PondArt hasBoat/></div><h2>你的小船，漂向另一扇窗</h2><p>它会随机遇见一位愿意倾听的人。<br/>接下来，我们换到接船人的视角。</p><button className="primary" onClick={()=>setStep(2)}>去接住这艘小船 <ArrowRight size={16}/></button></>}
 {step===2&&<><Boat size={66}/><h2>有人把愿望交给了你</h2><div className="demo-wish">“{text}”</div><label className="field-label" htmlFor="demo-reply">现在，你是接船人。留下一句具体的建议：</label><textarea id="demo-reply" maxLength={240} value={reply} onChange={e=>setReply(e.target.value)}/><button className="primary" disabled={!reply.trim()} onClick={()=>setStep(3)}>替它浇点水 <Leaf size={16}/></button></>}
 {step===3&&<><div className="sleep-moon">☾</div><h2>今晚先睡吧，愿望有人照看。</h2><p>回信已经装进信封。<br/>等清晨到来，再一起打开。</p><button className="primary" onClick={()=>setStep(4)}>快进到清晨，撕开挂历 <Sun size={16}/></button><small>演示中的时间会加速，真实愿望在清晨 6 点后揭晓。</small></>}
 {step===4&&<><Flower size={82} className="demo-bloom"/><div className="eyebrow">早安，你的愿望开花了</div><h2>有人认真听见了你。</h2><div className="letter"><span className="letter-caption">给昨晚许愿的你</span><p>{reply}</p><span className="letter-sign">—— 另一扇窗前的人</span></div><p className="demo-example">这是刚才由你扮演接船人写下的演示回信。</p><button className="primary" onClick={()=>setThanked(true)} disabled={thanked}>{thanked?<><Check size={16}/>暖光已经送回</>:<><Heart size={16}/>谢谢你，我收到了</>}</button><button className="text-button" onClick={onClose}>回到池塘，许下真正的愿望 <ArrowRight size={14}/></button></>}
 </Modal>;
}
