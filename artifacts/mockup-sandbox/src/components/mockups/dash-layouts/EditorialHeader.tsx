import './_group.css';

export function EditorialHeader() {
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
          <div style={{fontSize:11,fontWeight:500,color:'#6B756B'}}>☰</div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{fontSize:12,color:'#1F3D2C',fontWeight:600}}>Bloom Wellness</span>
            <button style={{fontSize:11,color:'#6B756B',background:'rgba(107,117,107,0.1)',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer'}}>Sign out</button>
          </div>
        </header>

        {/* EDITORIAL HEADER BANNER — full-width, dark, stats embedded */}
        <div style={{background:'#1F3D2C',padding:'32px 32px 28px',flexShrink:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:28}}>
            <div>
              <h1 style={{fontSize:28,fontWeight:400,color:'#fff',fontFamily:'Georgia,serif',margin:0,lineHeight:1.2}}>Welcome back, Jane!</h1>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.55)',marginTop:6}}>May 2026 · Your marketing at a glance</p>
            </div>
            <span style={{fontSize:11,color:'#EBC99B',fontWeight:600,cursor:'pointer'}}>Full analytics →</span>
          </div>
          {/* 4-stat strip inside banner */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2,borderRadius:12,overflow:'hidden'}}>
            {[
              {label:'Posts this month',val:'5',sub:'3 pending review',col:'#EBC99B'},
              {label:'Approved & queued',val:'1',sub:'Ready to publish',col:'rgba(255,255,255,0.9)'},
              {label:'GBP views',val:'142',sub:'↑ 9% vs last mo.',col:'#EBC99B'},
              {label:'Engagement rate',val:'3.4%',sub:'↑ 0.2% vs last mo.',col:'rgba(255,255,255,0.9)'},
            ].map((s,i) => (
              <div key={i} style={{background:i%2===0?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.08)',padding:'20px 22px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 8px'}}>{s.label}</p>
                <p style={{fontSize:36,fontWeight:800,color:s.col,margin:'0 0 6px',lineHeight:1}}>{s.val}</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.45)',margin:0}}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content: two equal columns */}
        <div style={{flex:1,padding:'24px 28px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignContent:'start'}}>
          {/* Left col */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:'#fff',borderRadius:12,padding:'20px 22px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Monthly reach — all platforms</span>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>Full analytics →</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:8,height:72,marginBottom:10}}>
                {[44,50,56,62,74,90].map((h,i) => (
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{width:'100%',height:h*0.72+'px',background:i===5?'#2D6B4F':'rgba(45,107,79,0.2)',borderRadius:'3px 3px 0 0'}}/>
                    <span style={{fontSize:9,color:'#9aaa9a'}}>{['Jan','Feb','Mar','Apr','May','Jun'][i]}</span>
                  </div>
                ))}
              </div>
              {[['Instagram','82%','#C13584','2,240','+22%'],['Facebook','55%','#1877F2','1,490','+11%'],['Google','40%','#BA7517','948','+9%']].map(([n,w,c,v,d]) => (
                <div key={n} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{fontSize:11,color:'#1F3D2C',width:60,flexShrink:0}}>{n}</span>
                  <div style={{flex:1,height:5,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
                  <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C',width:36,textAlign:'right'}}>{v}</span>
                  <span style={{fontSize:10,color:'#2D6B4F',width:28,textAlign:'right'}}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:12,padding:'20px 22px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1F3D2C',marginBottom:14}}>Google Business Profile</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                {[['142','Views','↑ 9%'],['18','Calls','↑ 6%'],['4.8','Rating','23 reviews']].map(([v,l,s]) => (
                  <div key={l} style={{background:'rgba(45,107,79,0.04)',borderRadius:8,padding:'12px 14px',textAlign:'center'}}>
                    <div style={{fontSize:22,fontWeight:800,color:'#1F3D2C'}}>{v}</div>
                    <div style={{fontSize:10,color:'#6B756B'}}>{l}</div>
                    <div style={{fontSize:10,color:'#2D6B4F',fontWeight:600}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:'#fff',borderRadius:12,padding:'20px 22px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Needs your approval</span>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>View all →</span>
              </div>
              {['Spring is here! 🌸 We\'re helping local businesses bloom...','Did you know 80% of customers research businesses online before...','Your brand story deserves to be told. Our team crafts captions...'].map((cap,i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 0',borderBottom:i<2?'0.5px solid rgba(31,61,44,0.07)':'none'}}>
                  <div style={{width:28,height:28,borderRadius:7,background:'rgba(45,107,79,0.07)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#2D6B4F'}}>IG</div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:11,color:'#1F3D2C',margin:'0 0 4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cap}</p>
                    <span style={{fontSize:10,background:'rgba(235,201,155,0.3)',color:'#7D2A03',borderRadius:4,padding:'2px 6px',fontWeight:600}}>Needs review</span>
                  </div>
                  <button style={{fontSize:10,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:6,padding:'5px 10px',cursor:'pointer',flexShrink:0}}>Approve</button>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:12,padding:'20px 22px',border:'0.5px solid rgba(31,61,44,0.09)',flex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Coming up</span>
                <span style={{fontSize:11,color:'#2D6B4F',cursor:'pointer'}}>View calendar →</span>
              </div>
              <div style={{textAlign:'center',padding:'20px 0',color:'#9aaa9a',fontSize:12}}>No upcoming posts scheduled.</div>
              <div style={{marginTop:8,padding:'12px 14px',background:'rgba(45,107,79,0.04)',borderRadius:8,borderLeft:'3px solid #2D6B4F'}}>
                <div style={{fontSize:10,fontWeight:700,color:'#2D6B4F',marginBottom:4}}>Done For You Marketing</div>
                <p style={{fontSize:11,color:'#1F3D2C',margin:'0 0 8px'}}>Summer is approaching — peak season. Want us to create a seasonal post?</p>
                <div style={{display:'flex',gap:6}}>
                  <button style={{fontSize:10,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:5,padding:'4px 10px',cursor:'pointer'}}>Yes, create it</button>
                  <button style={{fontSize:10,background:'transparent',color:'#6B756B',border:'1px solid rgba(31,61,44,0.2)',borderRadius:5,padding:'4px 10px',cursor:'pointer'}}>Not this time</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
