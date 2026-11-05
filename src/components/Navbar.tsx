"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {maskPhone} from "@/lib/auth";
import {useApp} from "@/context/AppContext";
import Icon from './ui/Icon';

const links=[{name:'首页',href:'/'},{name:'院校库',href:'/schools'},{name:'专业库',href:'/programs'},{name:'申请参考',href:'/references'},{name:'选校规划',href:'/ai/school-match'}];
const tools=[{name:'选校方案',href:'/favorites',description:'清单、分享与PDF方案'},{name:'文书工具',href:'/ai',description:'查看实际开放状态'},{name:'联系顾问',href:'/contact',description:'带上清单沟通申请方向'},{name:'关于我们',href:'/about',description:'了解九万里留学'}];
export default function Navbar(){
 const pathname=usePathname();const [mobileOpen,setMobileOpen]=useState(false);const menu=useRef<HTMLDetailsElement>(null);const mobileButton=useRef<HTMLButtonElement>(null);
 const {favoriteCount,user,logout}=useApp();
 useEffect(()=>{setMobileOpen(false);if(menu.current)menu.current.open=false;},[pathname]);
 useEffect(()=>{const close=(e:PointerEvent)=>{if(menu.current&&!menu.current.contains(e.target as Node))menu.current.open=false;};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}if(mobileOpen){setMobileOpen(false);mobileButton.current?.focus();}}};document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape);};},[mobileOpen]);
 const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
 return <><header className="site-header"><nav className="design-container nav-inner" aria-label="主导航">
  <Link href="/" className="brand"><span className="brand-mark">留</span><span><strong>九万里留学库</strong><small>全球院校 · 清楚选择</small></span></Link>
  <div className="desktop-navigation">{links.map(l=><Link key={l.href} href={l.href} className={active(l.href)?'nav-link nav-active':'nav-link'} aria-current={active(l.href)?'page':undefined}>{l.name}</Link>)}<details ref={menu} className="nav-tools"><summary className="nav-link">更多工具 <Icon name="chevron" width="14" height="14"/></summary><div className="nav-dropdown">{tools.map(l=><Link key={l.href} href={l.href} onClick={()=>{if(menu.current)menu.current.open=false;}}><strong>{l.name}</strong><small>{l.description}</small></Link>)}</div></details></div>
  <div className="nav-account"><Link href="/favorites" className="nav-shortlist" aria-label={`我的清单，${favoriteCount}项收藏`}><Icon name="heart"/><span className="hidden sm:inline">我的清单</span>{favoriteCount>0&&<span className="filter-count">{favoriteCount>99?'99+':favoriteCount}</span>}</Link><div className="hidden lg:block">{user?<div className="flex items-center gap-2 text-sm"><span>{user.phone?maskPhone(user.phone):user.nickname}</span><button className="text-slate-500" onClick={logout}>退出</button></div>:<Link href="/contact" className="ui-primary">联系顾问</Link>}</div><button ref={mobileButton} className="icon-button lg:hidden" aria-label={mobileOpen?'关闭导航菜单':'打开导航菜单'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={()=>setMobileOpen(x=>!x)}><Icon name={mobileOpen?'close':'menu'}/></button></div>
 </nav>{mobileOpen&&<nav id="mobile-navigation" className="mobile-navigation" aria-label="手机导航"><div className="grid grid-cols-2 gap-2">{links.map(l=><Link key={l.href} href={l.href} className={active(l.href)?'nav-link nav-active':'nav-link'} onClick={()=>setMobileOpen(false)}>{l.name}</Link>)}</div><p className="px-3 pb-1 pt-4 text-xs text-slate-500">申请工具与服务</p><div className="grid grid-cols-2 gap-2">{tools.map(l=><Link key={l.href} href={l.href} className="nav-link" onClick={()=>setMobileOpen(false)}>{l.name}</Link>)}</div><div className="mt-3 border-t pt-3">{user?<button className="ui-secondary w-full" onClick={()=>{logout();setMobileOpen(false);}}>退出登录</button>:<Link href="/login" className="ui-primary w-full" onClick={()=>setMobileOpen(false)}>访客使用说明</Link>}</div></nav>}</header>
 <nav className="bottom-navigation" aria-label="手机快捷导航">
   {[{name:'院校',href:'/schools'},{name:'专业',href:'/programs'},{name:'我的清单',href:'/favorites'},{name:'咨询',href:'/contact'}].map(link=><Link key={link.href} href={link.href} aria-current={active(link.href)?'page':undefined} onClick={()=>setMobileOpen(false)}>{link.name}</Link>)}
 </nav></>;
}
