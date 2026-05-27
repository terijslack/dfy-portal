import './_group.css';

export function TopNavWide() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',minHeight:'100vh',display:'flex',flexDirection:'column'}}>

      {/* Full-width top nav — replaces sidebar entirely */}
      <header style={{background:'#1F3D2C',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 36px',height:54}}>
          <div style={{display:'flex',alignItems:'center',gap:32}}>
            <div>
              <span style={{fontSize:15,fontWeight:800,color:'#fff',fontFamily:'Georgia,serif'}}>Done For You</span>
              <span style={{fontSize:10,color:'#EBC99B',marginLeft:6,letterSpacing:'0.1em',textTransform:'uppercase'}}>Marketing</span>
            </div>
            <nav style={{display:'flex',gap:4}}>
              {[['Dashboard',true],['Your Social Media',false],['Google Business Profile',false],['Performance Analytics',false],['Your Account',false],['Contact Us',false]].map(([label,active]) => (
                <a key={label as string} href="#" style={{padding:'6px 14px',borderRadius:6,fontSize:12,fontWeight:active?600:400,color:active?'#fff':'rgba(255,255,255,0.6)',background:active?'rgba(255,255,255,0.15)':'transparent',textDecoration:'none',whiteSpace:'nowrap'}}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:1}}>Welcome back</div>
              <div style={{fontSize:13,color:'#fff',fontFamily:'Georgia,serif',fontWeight:500}}>Jane Smith</div>
            </div>
            <button style={{fontSize:11,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.1)',border:'none',borderRadius:6,padding:'6px 12px',cursor:'pointer'}}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Page heading strip */}
      <div style={{background:'#fff',borderBottom:'0.5px solid rgba(31,61,44,0.08)',padding:'20px 36px',flexShrink:0}}>
        <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:24,color:'#1F3D2C',margin:0}}>Welcome back, Jane!</h1>
      </div>

      {/* Wide content — 3 columns, no sidebar gutter */}
      <div style={{flex:1,padding:'24px 36px'}}>

        {/* Stats row — 4 across full width */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
          {[
            {label:'Posts this month',val:'5',sub:'3 pending review'},
            {label:'Approved & queued',val:'1',sub:'Ready to publish'},
            {label:'GBP views',val:'142',sub:'↑ 9% vs last month'},
            {label:'Engagement rate',val:'3.4%',sub:'↑ 0.2% vs last month'},
          ].map((s,i) => (
            <div key={i} style={{background:'#fff',borderRadius:10,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <p style={{fontSize:10,color:'#9aaa9a',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 8px'}}>{s.label}</p>
              <p style={{fontSize:32,fontWeight:800,color:'#1F3D2C',margin:'0 0 4px',lineHeight:1}}>{s.val}</p>
              <p style={{fontSize:11,color:i>1?'#2D6B4F':'#9aaa9a',margin:0,fontWeight:i>1?600:400}}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main 3-col grid */}
        <div style={{display:'grid',gridTemplateColumns:'1.2fr 1.4fr 1fr',gap:16}}>

          {/* Col 1 — reach + GBP */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Monthly reach</span>
                <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>Full analytics →</a>
              </div>
              {[['Instagram','82%','#C13584','2,240','+22%'],['Facebook','55%','#1877F2','1,490','+11%'],['Google','40%','#BA7517','948','+9%'],['LinkedIn','15%','#0A66C2','142','+3%']].map(([n,w,c,v,d]) => (
                <div key={n} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontSize:11,color:'#1F3D2C',width:60,flexShrink:0}}>{n}</span>
                  <div style={{flex:1,height:5,borderRadius:99,background:'rgba(31,61,44,0.08)'}}><div style={{width:w,height:'100%',borderRadius:99,background:c}}/></div>
                  <span style={{fontSize:11,fontWeight:700,color:'#1F3D2C',width:36,textAlign:'right'}}>{v}</span>
                  <span style={{fontSize:10,color:'#2D6B4F',width:30,textAlign:'right'}}>{d}</span>
                </div>
              ))}
            </div>
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
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1F3D2C',marginBottom:12}}>Your Business</div>
              <div style={{fontSize:14,fontWeight:700,color:'#1F3D2C',marginBottom:4}}>Bloom Wellness</div>
              <div style={{fontSize:11,color:'#6B756B',marginBottom:10}}>Wellness · No address yet</div>
              <a href="#" style={{fontSize:11,color:'#2D6B4F',fontWeight:600,textDecoration:'none'}}>View profile →</a>
            </div>
          </div>

          {/* Col 2 — approval queue */}
          <div style={{background:'#fff',borderRadius:12,border:'0.5px solid rgba(31,61,44,0.09)'}}>
            <div style={{padding:'18px 22px',borderBottom:'0.5px solid rgba(31,61,44,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <span style={{fontSize:13,fontWeight:700,color:'#1F3D2C'}}>Needs your approval</span>
                <span style={{marginLeft:8,fontSize:11,background:'#EBC99B',color:'#1F3D2C',borderRadius:10,padding:'2px 8px',fontWeight:700}}>3</span>
              </div>
              <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>View all →</a>
            </div>
            {['Spring is here! 🌸 We\'re helping local businesses bloom with our done-for-you marketing packages. Ready to grow? DM us today!','Did you know 80% of customers research businesses online before visiting? Make sure your Google Business Profile is working FOR you.','Your brand story deserves to be told. Our team crafts captions, creates AI visuals, and manages your social media.'].map((cap,i) => (
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'14px 22px',borderBottom:i<2?'0.5px solid rgba(31,61,44,0.06)':'none'}}>
                <div style={{width:30,height:30,borderRadius:7,background:'rgba(45,107,79,0.08)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#2D6B4F',fontWeight:700}}>IG</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:12,color:'#1F3D2C',margin:'0 0 6px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{cap}</p>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:10,background:'rgba(235,201,155,0.3)',color:'#7D2A03',borderRadius:4,padding:'2px 7px',fontWeight:600}}>Needs review</span>
                    <span style={{fontSize:10,color:'#9aaa9a'}}>May {9+i*5}</span>
                  </div>
                </div>
                <button style={{fontSize:11,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:6,padding:'7px 14px',cursor:'pointer',flexShrink:0,fontWeight:600}}>Approve</button>
              </div>
            ))}
            <div style={{padding:'16px 22px',borderTop:'0.5px solid rgba(31,61,44,0.07)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Coming up</span>
                <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>View calendar →</a>
              </div>
              <p style={{fontSize:12,color:'#9aaa9a',margin:0,textAlign:'center',padding:'8px 0'}}>No upcoming posts scheduled.</p>
            </div>
          </div>

          {/* Col 3 — team + email + media */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:'#1F3D2C',borderRadius:12,padding:'18px 20px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#EBC99B',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>From your team</div>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.85)',margin:'0 0 12px',lineHeight:1.5}}><strong style={{color:'#fff'}}>Summer is approaching</strong> — want a seasonal post?</p>
              <div style={{display:'flex',gap:8}}>
                <button style={{fontSize:11,background:'#EBC99B',color:'#1F3D2C',border:'none',borderRadius:6,padding:'7px 12px',cursor:'pointer',fontWeight:700}}>Yes, create it</button>
                <button style={{fontSize:11,background:'transparent',color:'rgba(255,255,255,0.55)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,padding:'7px 10px',cursor:'pointer'}}>Not this time</button>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Email campaigns</span>
                <span style={{fontSize:10,color:'#2D6B4F',cursor:'pointer',fontWeight:600}}>↑ Upgrade</span>
              </div>
              {['May newsletter – Spring deals','Welcome sequence – new clients','Re-engagement – April'].map((c,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:8,paddingBottom:8,borderBottom:i<2?'0.5px solid rgba(31,61,44,0.06)':'none'}}>
                  <span style={{fontSize:11,color:'#1F3D2C'}}>{c}</span>
                  <span style={{fontSize:11,color:'#2D6B4F',fontWeight:600}}>{['42%','61%','28%'][i]}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:12,padding:'18px 20px',border:'0.5px solid rgba(31,61,44,0.09)',flex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1F3D2C'}}>Media Uploads</span>
                <a href="#" style={{fontSize:11,color:'#2D6B4F',textDecoration:'none'}}>Send to team →</a>
              </div>
              <p style={{fontSize:11,color:'#6B756B',lineHeight:1.6,margin:0}}>Send your brand assets — logos, photos — and we'll use them in your content.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
