import './_group.css';

export function PriorityColumn() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',minHeight:'100vh',display:'flex'}}>
      {/* Sidebar */}
      <aside style={{width:200,background:'#1F3D2C',flexShrink:0,display:'flex',flexDirection:'column',padding:'24px 0'}}>
        <div style={{padding:'0 20px 24px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:15,fontWeight:800,color:'#fff',lineHeight:1.1}}>Done For<br/>You</div>
          <div style={{fontSize:9,letterSpacing:'0.12em',color:'#EBC99B',marginTop:4,textTransform:'uppercase'}}>Marketing</div>
        </div>
        <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:9,color:'#EBC99B',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:3}}>Welcome back</div>
          <div style={{fontSize:13,color:'#F5F2EA',fontFamily:'Georgia,serif'}}>Jane Smith</div>
        </div>
        <nav style={{padding:'12px 12px',flex:1}}>
          {[['Dashboard','▦',true],['Your Social Media','⤲',false],['Google Business Profile','G',false],['Performance Analytics','↑',false],['Your Account','○',false],['Contact Us','✉',false]].map(([label,icon,active]) => (
            <div key={label as string} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:7,marginBottom:2,background:active?'rgba(255,255,255,0.12)':'transparent',cursor:'pointer'}}>
              <span style={{fontSize:12,color:active?'#EBC99B':'rgba(255,255,255,0.55)',width:16,textAlign:'center'}}>{icon}</span>
              <span style={{fontSize:12,color:active?'#fff':'rgba(255,255,255,0.65)',fontWeight:active?600:400}}>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {/* Top nav */}
        <header style={{height:48,background:'#fff',borderBottom:'0.5px solid rgba(31,61,44,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',flexShrink:0}}>
          <div style={{fontSize:11,color:'#6B756B'}}>☰</div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{fontSize:12,color:'#1F3D2C',fontWeight:600}}>Bloom Wellness</span>
            <button style={{fontSize:11,color:'#6B756B',background:'rgba(107,117,107,0.1)',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer'}}>Sign out</button>
          </div>
        </header>

        <div style={{flex:1,padding:'24px 28px',display:'grid',gridTemplateColumns:'1.1fr 0.9fr',gap:16,alignContent:'start'}}>

          {/* LEFT — Priority column: approval first, then stats */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* Greeting + urgency summary at top of left col */}
            <div>
              <h1 style={{fontSize:24,fontWeight:400,color:'#1F3D2C',fontFamily:'Georgia,serif',margin:'0 0 4px'}}>Welcome back, Jane!</h1>
              <p style={{fontSize:12,color:'#9aaa9a',margin:0}}>May 2026 · Your marketing at a glance</p>
            </div>

            {/* APPROVAL QUEUE — dominant card */}
            <div style={{background:'#fff',borderRadius:12,border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{padding:'18px 22px',borderBottom:'0.5px solid rgba(31,61,44,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <span style={{fontSize:13,fontWeight:700,color:'#1F3D2C'}}>Needs your approval</span>
                  <span style={{marginLeft:8,fontSize:11,background:'#EBC99B',color:'#1F3D2C',borderRadius:10,padding:'2px 8px',fontWeight:700}}>3</span>
                </div>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>View all →</span>
              </div>
              {['Spring is here! 🌸 We\'re helping local businesses bloom with our done-for-you marketing packages. Ready to grow?','Did you know 80% of customers research businesses online before visiting? Make sure your Google Business Profile is working FOR you.','Your brand story deserves to be told. Our team crafts captions, creates AI visuals, and manages your social media.'].map((cap,i) => (
                <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'14px 22px',borderBottom:i<2?'0.5px solid rgba(31,61,44,0.06)':'none'}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'rgba(45,107,79,0.08)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#2D6B4F',fontWeight:700}}>IG</div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:12,color:'#1F3D2C',margin:'0 0 6px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{cap}</p>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:10,background:'rgba(235,201,155,0.3)',color:'#7D2A03',borderRadius:4,padding:'2px 7px',fontWeight:600}}>Needs review</span>
                      <span style={{fontSize:10,color:'#9aaa9a'}}>May {10+i*3}</span>
                    </div>
                  </div>
                  <button style={{fontSize:11,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:6,padding:'7px 14px',cursor:'pointer',flexShrink:0,fontWeight:600}}>Approve</button>
                </div>
              ))}
            </div>

            {/* Stats row — 4 compact tiles */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              {[
                {label:'Posts',val:'5',sub:'this month'},
                {label:'Queued',val:'1',sub:'ready to publish'},
                {label:'GBP views',val:'142',sub:'↑ 9%'},
                {label:'Engagement',val:'3.4%',sub:'↑ 0.2%'},
              ].map((s,i) => (
                <div key={i} style={{background:'#fff',borderRadius:10,padding:'14px 16px',border:'0.5px solid rgba(31,61,44,0.09)',textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:800,color:i===3?'#7D2A03':'#1F3D2C',lineHeight:1,marginBottom:4}}>{s.val}</div>
                  <div style={{fontSize:9,color:'#6B756B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{s.label}</div>
                  <div style={{fontSize:10,color:'#2D6B4F',fontWeight:600}}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Coming up */}
            <div style={{background:'#fff',borderRadius:12,padding:'18px 22px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Coming up</span>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>View calendar →</span>
              </div>
              <p style={{fontSize:12,color:'#9aaa9a',textAlign:'center',padding:'12px 0',margin:0}}>No upcoming posts scheduled.</p>
            </div>
          </div>

          {/* RIGHT — Supporting info column */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* Reach chart */}
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Monthly reach</span>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>Full analytics →</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:6,height:64,marginBottom:10}}>
                {[44,50,56,62,74,90].map((h,i) => (
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{width:'100%',height:h*0.65+'px',background:i===5?'#2D6B4F':'rgba(45,107,79,0.18)',borderRadius:'3px 3px 0 0'}}/>
                    <span style={{fontSize:8,color:'#9aaa9a'}}>{['J','F','M','A','M','J'][i]}</span>
                  </div>
                ))}
              </div>
              {[['Instagram','82%','#C13584','2,240'],['Facebook','55%','#1877F2','1,490'],['Google','40%','#BA7517','948'],['LinkedIn','15%','#0A66C2','142']].map(([n,w,c,v]) => (
                <div key={n} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                  <span style={{fontSize:11,color:'#1F3D2C',width:58,flexShrink:0}}>{n}</span>
                  <div style={{flex:1,height:5,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
                  <span style={{fontSize:10,fontWeight:700,color:'#1F3D2C',width:36,textAlign:'right'}}>{v}</span>
                </div>
              ))}
            </div>

            {/* GBP */}
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1F3D2C',marginBottom:12}}>Google Business Profile</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {[['142','Views','↑ 9%'],['18','Calls','↑ 6%'],['4.8','Rating','23 reviews']].map(([v,l,s]) => (
                  <div key={l} style={{background:'rgba(45,107,79,0.04)',borderRadius:8,padding:'10px',textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:800,color:'#1F3D2C'}}>{v}</div>
                    <div style={{fontSize:9,color:'#6B756B'}}>{l}</div>
                    <div style={{fontSize:9,color:'#2D6B4F',fontWeight:600}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team message */}
            <div style={{background:'#1F3D2C',borderRadius:12,padding:'18px 20px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#EBC99B',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>From your team</div>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.85)',margin:'0 0 12px',lineHeight:1.5}}><strong style={{color:'#fff'}}>Summer is approaching</strong> — peak season for many businesses. Want us to create a seasonal promotion post?</p>
              <div style={{display:'flex',gap:8}}>
                <button style={{fontSize:11,background:'#EBC99B',color:'#1F3D2C',border:'none',borderRadius:6,padding:'7px 14px',cursor:'pointer',fontWeight:700}}>Yes, create it</button>
                <button style={{fontSize:11,background:'transparent',color:'rgba(255,255,255,0.6)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,padding:'7px 12px',cursor:'pointer'}}>Not this time</button>
              </div>
            </div>

            {/* Business profile */}
            <div style={{background:'#fff',borderRadius:12,padding:'16px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Your Business</span>
                <a href="#" style={{fontSize:11,color:'#2D6B4F',fontWeight:600,textDecoration:'none'}}>View profile →</a>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:'#1F3D2C',marginBottom:4}}>Bloom Wellness</div>
              <div style={{fontSize:11,color:'#6B756B'}}>Wellness · No address yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
