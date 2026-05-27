import './_group.css';

export function SplitConsole() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',minHeight:'100vh',display:'flex',flexDirection:'column'}}>

      {/* Slim top bar */}
      <header style={{height:44,background:'#1F3D2C',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:28}}>
          <div>
            <span style={{fontSize:14,fontWeight:800,color:'#fff',fontFamily:'Georgia,serif'}}>Done For You</span>
            <span style={{fontSize:9,color:'#EBC99B',marginLeft:6,letterSpacing:'0.12em',textTransform:'uppercase'}}>Marketing</span>
          </div>
          <nav style={{display:'flex',gap:2}}>
            {[['Dashboard',true],['Social Media',false],['GBP',false],['Analytics',false],['Account',false],['Contact',false]].map(([label,active]) => (
              <span key={label as string} style={{padding:'4px 10px',borderRadius:5,fontSize:11,color:active?'#fff':'rgba(255,255,255,0.5)',fontWeight:active?600:400,background:active?'rgba(255,255,255,0.15)':'transparent',cursor:'pointer'}}>{label}</span>
            ))}
          </nav>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:12,color:'#EBC99B',fontFamily:'Georgia,serif'}}>Jane Smith</span>
          <button style={{fontSize:10,color:'rgba(255,255,255,0.6)',background:'transparent',border:'1px solid rgba(255,255,255,0.2)',borderRadius:5,padding:'4px 10px',cursor:'pointer'}}>Sign out</button>
        </div>
      </header>

      {/* 50/50 horizontal split — no scrolling sidebar */}
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:0}}>

        {/* LEFT PANEL — dark "action console" */}
        <div style={{background:'#1F3D2C',display:'flex',flexDirection:'column',padding:'24px 28px',gap:20,overflowY:'auto'}}>

          <div>
            <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:24,color:'#fff',margin:'0 0 4px'}}>Welcome back, Jane!</h1>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.45)',margin:0}}>Bloom Wellness</p>
          </div>

          {/* Stats — 2×2 grid on dark */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,borderRadius:10,overflow:'hidden'}}>
            {[
              {label:'Posts this month',val:'5',sub:'3 pending review'},
              {label:'Approved & queued',val:'1',sub:'Ready to publish'},
              {label:'GBP views',val:'142',sub:'↑ 9% vs last mo.'},
              {label:'Engagement rate',val:'3.4%',sub:'↑ 0.2% vs last mo.'},
            ].map((s,i) => (
              <div key={i} style={{background:'rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.09em',margin:'0 0 6px'}}>{s.label}</p>
                <p style={{fontSize:28,fontWeight:800,color:i>1?'#EBC99B':'#fff',margin:'0 0 4px',lineHeight:1}}>{s.val}</p>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',margin:0}}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Approval queue on dark */}
          <div style={{background:'rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
            <div style={{padding:'12px 18px',borderBottom:'0.5px solid rgba(255,255,255,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>Needs your approval</span>
                <span style={{marginLeft:8,fontSize:10,background:'#EBC99B',color:'#1F3D2C',borderRadius:8,padding:'2px 7px',fontWeight:700}}>3</span>
              </div>
              <span style={{fontSize:10,color:'#EBC99B',cursor:'pointer'}}>View all →</span>
            </div>
            {['Spring is here! 🌸 We\'re helping local businesses bloom with our done-for-you marketing packages.','Did you know 80% of customers research businesses online before visiting?','Your brand story deserves to be told. Our team crafts captions and AI visuals.'].map((cap,i) => (
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'12px 18px',borderBottom:i<2?'0.5px solid rgba(255,255,255,0.06)':'none'}}>
                <div style={{width:28,height:28,borderRadius:6,background:'rgba(255,255,255,0.1)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'rgba(255,255,255,0.7)',fontWeight:700}}>IG</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.8)',margin:'0 0 5px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{cap}</p>
                  <span style={{fontSize:9,background:'rgba(235,201,155,0.25)',color:'#EBC99B',borderRadius:3,padding:'2px 6px',fontWeight:600}}>Needs review</span>
                </div>
                <button style={{fontSize:10,background:'#EBC99B',color:'#1F3D2C',border:'none',borderRadius:5,padding:'5px 10px',cursor:'pointer',fontWeight:700,flexShrink:0}}>Approve</button>
              </div>
            ))}
          </div>

          {/* Coming up */}
          <div style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'14px 18px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>Coming up</span>
              <span style={{fontSize:10,color:'#EBC99B',cursor:'pointer'}}>Calendar →</span>
            </div>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'10px 0',margin:0}}>No upcoming posts scheduled.</p>
          </div>

        </div>

        {/* RIGHT PANEL — light "context panel" */}
        <div style={{background:'#F5F2EA',display:'flex',flexDirection:'column',padding:'24px 28px',gap:16,overflowY:'auto'}}>

          {/* Reach */}
          <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Monthly reach</span>
              <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>Full analytics →</a>
            </div>
            {[['Instagram','82%','#C13584','2,240','+22%'],['Facebook','55%','#1877F2','1,490','+11%'],['Google','40%','#BA7517','948','+9%'],['LinkedIn','15%','#0A66C2','142','+3%']].map(([n,w,c,v,d]) => (
              <div key={n} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:11,color:'#1F3D2C',width:62}}>{n}</span>
                <div style={{flex:1,height:5,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
                <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C',width:36,textAlign:'right'}}>{v}</span>
                <span style={{fontSize:10,color:'#2D6B4F',width:30,textAlign:'right'}}>{d}</span>
              </div>
            ))}
          </div>

          {/* GBP */}
          <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#1F3D2C',marginBottom:12}}>Google Business Profile</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {[['142','Views','↑ 9%'],['18','Calls','↑ 6%'],['4.8','Rating','23 reviews']].map(([v,l,s]) => (
                <div key={l} style={{background:'rgba(45,107,79,0.04)',borderRadius:8,padding:'12px',textAlign:'center'}}>
                  <div style={{fontSize:22,fontWeight:800,color:'#1F3D2C'}}>{v}</div>
                  <div style={{fontSize:9,color:'#6B756B'}}>{l}</div>
                  <div style={{fontSize:9,color:'#2D6B4F',fontWeight:600}}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Team message */}
          <div style={{background:'rgba(45,107,79,0.06)',borderRadius:12,padding:'16px 20px',border:'0.5px solid rgba(45,107,79,0.15)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#2D6B4F',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>From your team</div>
            <p style={{fontSize:12,color:'#1F3D2C',margin:'0 0 12px',lineHeight:1.6}}><strong>Summer is approaching</strong> — want a seasonal promotion post?</p>
            <div style={{display:'flex',gap:8}}>
              <button style={{fontSize:11,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:6,padding:'7px 14px',cursor:'pointer',fontWeight:600}}>Yes, create it</button>
              <button style={{fontSize:11,background:'transparent',color:'#6B756B',border:'1px solid rgba(31,61,44,0.2)',borderRadius:6,padding:'7px 12px',cursor:'pointer'}}>Not this time</button>
            </div>
          </div>

          {/* Email campaigns */}
          <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Email campaigns</span>
              <span style={{fontSize:10,color:'#2D6B4F',fontWeight:600,cursor:'pointer'}}>↑ Upgrade to view</span>
            </div>
            {['May newsletter – Spring deals','Welcome sequence – new clients','Re-engagement – April'].map((c,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',paddingBottom:8,marginBottom:8,borderBottom:i<2?'0.5px solid rgba(31,61,44,0.06)':'none'}}>
                <span style={{fontSize:11,color:'#1F3D2C'}}>{c}</span>
                <span style={{fontSize:11,color:'#2D6B4F',fontWeight:600}}>{['42%','61%','28%'][i]} open</span>
              </div>
            ))}
          </div>

          {/* Business profile */}
          <div style={{background:'#fff',borderRadius:12,padding:'16px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Your Business</span>
              <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>View profile →</a>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:'#1F3D2C',marginBottom:3}}>Bloom Wellness</div>
            <div style={{fontSize:11,color:'#6B756B'}}>Wellness · No address, phone, or website set</div>
          </div>

        </div>
      </div>
    </div>
  );
}
