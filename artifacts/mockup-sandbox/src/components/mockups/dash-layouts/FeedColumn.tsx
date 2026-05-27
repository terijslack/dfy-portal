import './_group.css';

export function FeedColumn() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',minHeight:'100vh',display:'flex'}}>

      {/* Sidebar — minimal, icon + label only */}
      <aside style={{width:180,background:'#1F3D2C',flexShrink:0,display:'flex',flexDirection:'column',padding:'20px 0'}}>
        <div style={{padding:'0 18px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:14,fontWeight:800,color:'#fff',lineHeight:1.15}}>Done For You</div>
          <div style={{fontSize:9,color:'#EBC99B',marginTop:3,letterSpacing:'0.1em',textTransform:'uppercase'}}>Marketing</div>
        </div>
        <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:9,color:'#EBC99B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:2}}>Welcome back</div>
          <div style={{fontSize:13,color:'#F5F2EA',fontFamily:'Georgia,serif'}}>Jane Smith</div>
        </div>
        <nav style={{padding:'10px 10px',flex:1}}>
          {[['Dashboard',true],['Your Social Media',false],['Google Business Profile',false],['Performance Analytics',false],['Your Account',false],['Contact Us',false]].map(([label,active]) => (
            <div key={label as string} style={{padding:'8px 10px',borderRadius:6,marginBottom:2,background:active?'rgba(255,255,255,0.12)':'transparent',cursor:'pointer'}}>
              <span style={{fontSize:12,color:active?'#fff':'rgba(255,255,255,0.6)',fontWeight:active?600:400}}>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <header style={{height:46,background:'#fff',borderBottom:'0.5px solid rgba(31,61,44,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',flexShrink:0}}>
          <span style={{fontSize:11,color:'#6B756B'}}>☰</span>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:12,color:'#1F3D2C',fontWeight:600}}>Bloom Wellness</span>
            <button style={{fontSize:11,color:'#6B756B',background:'rgba(107,117,107,0.1)',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer'}}>Sign out</button>
          </div>
        </header>

        {/* FEED — single centered column, no grid */}
        <div style={{flex:1,overflowY:'auto',padding:'28px 0',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{width:'100%',maxWidth:640,padding:'0 20px',display:'flex',flexDirection:'column',gap:16}}>

            {/* Greeting */}
            <div>
              <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:26,color:'#1F3D2C',margin:'0 0 4px'}}>Welcome back, Jane!</h1>
            </div>

            {/* Urgency banner — inline callout */}
            <div style={{background:'#1F3D2C',borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <span style={{fontSize:12,fontWeight:700,color:'#EBC99B'}}>3 posts need your approval</span>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.65)',margin:'3px 0 0'}}>Review and approve before they're scheduled.</p>
              </div>
              <button style={{fontSize:11,background:'#EBC99B',color:'#1F3D2C',border:'none',borderRadius:7,padding:'8px 16px',cursor:'pointer',fontWeight:700,flexShrink:0}}>Review now →</button>
            </div>

            {/* Approval items — stacked cards */}
            {['Spring is here! 🌸 We\'re helping local businesses bloom with our done-for-you marketing packages. Ready to grow? DM us today!','Did you know 80% of customers research businesses online before visiting? Make sure your Google Business Profile is working FOR you.','Your brand story deserves to be told. Our team crafts captions, creates AI visuals, and manages your social media.'].map((cap,i) => (
              <div key={i} style={{background:'#fff',borderRadius:12,padding:'16px 20px',border:'0.5px solid rgba(31,61,44,0.09)',display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:34,height:34,borderRadius:8,background:'rgba(45,107,79,0.08)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#2D6B4F',fontWeight:700}}>IG</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:12,color:'#1F3D2C',margin:'0 0 8px',lineHeight:1.55}}>{cap}</p>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:10,background:'rgba(235,201,155,0.3)',color:'#7D2A03',borderRadius:4,padding:'2px 7px',fontWeight:600}}>Needs review</span>
                    <span style={{fontSize:10,color:'#9aaa9a'}}>May {9+i*5}</span>
                  </div>
                </div>
                <button style={{fontSize:11,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:7,padding:'8px 16px',cursor:'pointer',fontWeight:600,flexShrink:0}}>Approve</button>
              </div>
            ))}

            {/* Divider label */}
            <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0'}}>
              <div style={{flex:1,height:'0.5px',background:'rgba(31,61,44,0.1)'}}/>
              <span style={{fontSize:10,color:'#9aaa9a',textTransform:'uppercase',letterSpacing:'0.1em'}}>Your numbers</span>
              <div style={{flex:1,height:'0.5px',background:'rgba(31,61,44,0.1)'}}/>
            </div>

            {/* Stats — 4 in a row */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {[{label:'Posts',val:'5',sub:'this month'},{label:'Queued',val:'1',sub:'ready'},{label:'GBP views',val:'142',sub:'↑ 9%'},{label:'Engagement',val:'3.4%',sub:'↑ 0.2%'}].map((s,i) => (
                <div key={i} style={{background:'#fff',borderRadius:10,padding:'14px',textAlign:'center',border:'0.5px solid rgba(31,61,44,0.09)'}}>
                  <div style={{fontSize:22,fontWeight:800,color:'#1F3D2C',lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:9,color:'#9aaa9a',margin:'4px 0 2px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
                  <div style={{fontSize:10,color:'#2D6B4F',fontWeight:600}}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Reach */}
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Monthly reach</span>
                <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>Full analytics →</a>
              </div>
              {[['Instagram','82%','#C13584','2,240','+22%'],['Facebook','55%','#1877F2','1,490','+11%'],['Google','40%','#BA7517','948','+9%'],['LinkedIn','15%','#0A66C2','142','+3%']].map(([n,w,c,v,d]) => (
                <div key={n} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontSize:12,color:'#1F3D2C',width:66}}>{n}</span>
                  <div style={{flex:1,height:6,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
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
                    <div style={{fontSize:24,fontWeight:800,color:'#1F3D2C'}}>{v}</div>
                    <div style={{fontSize:10,color:'#6B756B'}}>{l}</div>
                    <div style={{fontSize:10,color:'#2D6B4F',fontWeight:600}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team message */}
            <div style={{background:'rgba(45,107,79,0.06)',borderRadius:12,padding:'16px 20px',border:'0.5px solid rgba(45,107,79,0.15)'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#2D6B4F',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>From your team</div>
              <p style={{fontSize:12,color:'#1F3D2C',margin:'0 0 12px',lineHeight:1.6}}><strong>Summer is approaching</strong> — peak season for many businesses. Want us to create a seasonal promotion post?</p>
              <div style={{display:'flex',gap:8}}>
                <button style={{fontSize:11,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:6,padding:'7px 14px',cursor:'pointer',fontWeight:600}}>Yes, create it</button>
                <button style={{fontSize:11,background:'transparent',color:'#6B756B',border:'1px solid rgba(31,61,44,0.2)',borderRadius:6,padding:'7px 12px',cursor:'pointer'}}>Not this time</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
