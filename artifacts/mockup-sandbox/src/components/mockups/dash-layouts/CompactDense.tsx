import './_group.css';

export function CompactDense() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',minHeight:'100vh',display:'flex'}}>
      {/* Slim sidebar */}
      <aside style={{width:56,background:'#1F3D2C',flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0',gap:4}}>
        <div style={{fontSize:11,fontWeight:800,color:'#fff',textAlign:'center',marginBottom:16,lineHeight:1.1}}>D<br/>F<br/>Y</div>
        {['▦','⤲','G','↑','○','✉'].map((icon,i) => (
          <div key={i} style={{width:36,height:36,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:i===0?'rgba(255,255,255,0.15)':'transparent',color:i===0?'#EBC99B':'rgba(255,255,255,0.45)',fontSize:14,cursor:'pointer',marginBottom:2}}>
            {icon}
          </div>
        ))}
      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {/* Compact top nav with greeting inline */}
        <header style={{background:'#fff',borderBottom:'0.5px solid rgba(31,61,44,0.1)',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52,flexShrink:0}}>
          <div>
            <span style={{fontSize:18,fontWeight:400,color:'#1F3D2C',fontFamily:'Georgia,serif'}}>Welcome back, Jane!</span>
            <span style={{fontSize:11,color:'#9aaa9a',marginLeft:12}}>May 2026 · Your marketing at a glance</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:12,color:'#1F3D2C',fontWeight:600}}>Bloom Wellness</span>
            <button style={{fontSize:11,color:'#6B756B',background:'rgba(107,117,107,0.1)',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer'}}>Sign out</button>
          </div>
        </header>

        {/* COMPACT STAT STRIP — tight horizontal band */}
        <div style={{background:'#fff',borderBottom:'0.5px solid rgba(31,61,44,0.08)',padding:'12px 24px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,flexShrink:0}}>
          {[
            {label:'Posts this month',val:'5',sub:'3 pending review',delta:null},
            {label:'Approved & queued',val:'1',sub:'Ready to publish',delta:null},
            {label:'GBP views',val:'142',sub:'↑ 9% vs last',delta:'up'},
            {label:'Engagement rate',val:'3.4%',sub:'↑ 0.2% vs last',delta:'up'},
          ].map((s,i) => (
            <div key={i} style={{padding:'8px 20px',borderRight:i<3?'0.5px solid rgba(31,61,44,0.08)':'none',display:'flex',alignItems:'center',gap:14}}>
              <span style={{fontSize:28,fontWeight:800,color:'#1F3D2C',lineHeight:1}}>{s.val}</span>
              <div>
                <p style={{fontSize:10,color:'#6B756B',margin:'0 0 2px',textTransform:'uppercase',letterSpacing:'0.07em'}}>{s.label}</p>
                <p style={{fontSize:10,color:s.delta?'#2D6B4F':'#9aaa9a',margin:0,fontWeight:s.delta?600:400}}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main 3-col grid — dense layout */}
        <div style={{flex:1,padding:'16px 24px',display:'grid',gridTemplateColumns:'2fr 1.4fr 1fr',gap:12,alignContent:'start'}}>

          {/* Col 1: reach + GBP */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{background:'#fff',borderRadius:10,padding:'16px 18px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C'}}>Monthly reach</span>
                <span style={{fontSize:10,color:'#2D6B4F',cursor:'pointer'}}>Full analytics →</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:6,height:60,marginBottom:8}}>
                {[44,50,56,62,74,90].map((h,i) => (
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{width:'100%',height:h*0.6+'px',background:i===5?'#2D6B4F':'rgba(45,107,79,0.2)',borderRadius:'3px 3px 0 0'}}/>
                    <span style={{fontSize:8,color:'#9aaa9a'}}>{['J','F','M','A','M','J'][i]}</span>
                  </div>
                ))}
              </div>
              {[['Instagram','82%','#C13584','2,240','+22%'],['Facebook','55%','#1877F2','1,490','+11%'],['Google','40%','#BA7517','948','+9%'],['LinkedIn','15%','#0A66C2','142','+3%']].map(([n,w,c,v,d]) => (
                <div key={n} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                  <span style={{fontSize:10,color:'#1F3D2C',width:54,flexShrink:0}}>{n}</span>
                  <div style={{flex:1,height:4,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
                  <span style={{fontSize:10,fontWeight:700,color:'#1F3D2C',width:32,textAlign:'right'}}>{v}</span>
                  <span style={{fontSize:9,color:'#2D6B4F',width:26,textAlign:'right'}}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:10,padding:'14px 18px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1F3D2C',marginBottom:10}}>Google Business Profile</div>
              <div style={{display:'flex',gap:8}}>
                {[['142','Views','↑ 9%'],['18','Calls','↑ 6%'],['4.8','Rating','23 reviews']].map(([v,l,s]) => (
                  <div key={l} style={{flex:1,background:'rgba(45,107,79,0.04)',borderRadius:7,padding:'10px 12px',textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:800,color:'#1F3D2C'}}>{v}</div>
                    <div style={{fontSize:9,color:'#6B756B'}}>{l}</div>
                    <div style={{fontSize:9,color:'#2D6B4F',fontWeight:600}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: approval queue */}
          <div style={{background:'#fff',borderRadius:10,padding:'16px 18px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C'}}>Needs your approval</span>
              <span style={{fontSize:10,color:'#2D6B4F',cursor:'pointer'}}>View all →</span>
            </div>
            {['Spring is here! 🌸 We\'re helping local businesses bloom with our done-for-you marketing packages.','Did you know 80% of customers research businesses online before visiting?','Your brand story deserves to be told. Our team crafts captions, creates AI visuals...'].map((cap,i) => (
              <div key={i} style={{padding:'10px 0',borderBottom:i<2?'0.5px solid rgba(31,61,44,0.07)':'none'}}>
                <p style={{fontSize:11,color:'#1F3D2C',margin:'0 0 6px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{cap}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:9,background:'rgba(235,201,155,0.3)',color:'#7D2A03',borderRadius:4,padding:'2px 6px',fontWeight:600}}>Needs review</span>
                  <button style={{fontSize:9,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:5,padding:'4px 8px',cursor:'pointer'}}>Approve</button>
                </div>
              </div>
            ))}
          </div>

          {/* Col 3: coming up + team */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{background:'#fff',borderRadius:10,padding:'14px 16px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C'}}>Coming up</span>
                <span style={{fontSize:10,color:'#2D6B4F',cursor:'pointer'}}>Calendar →</span>
              </div>
              <p style={{fontSize:11,color:'#9aaa9a',textAlign:'center',padding:'12px 0'}}>No upcoming posts</p>
            </div>
            <div style={{background:'#1F3D2C',borderRadius:10,padding:'14px 16px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#EBC99B',marginBottom:8}}>From your team</div>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.8)',margin:'0 0 10px',lineHeight:1.5}}>Summer is approaching — want a seasonal post?</p>
              <button style={{fontSize:10,background:'#EBC99B',color:'#1F3D2C',border:'none',borderRadius:5,padding:'5px 10px',cursor:'pointer',fontWeight:700}}>Yes, create it</button>
            </div>
            <div style={{background:'#fff',borderRadius:10,padding:'14px 16px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1F3D2C',marginBottom:8}}>Your Business</div>
              <div style={{fontSize:12,fontWeight:700,color:'#1F3D2C',marginBottom:4}}>Bloom Wellness</div>
              <div style={{fontSize:10,color:'#6B756B'}}>Wellness · No address yet</div>
              <a href="#" style={{fontSize:10,color:'#2D6B4F',fontWeight:600,display:'block',marginTop:8,textDecoration:'none'}}>View profile →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
