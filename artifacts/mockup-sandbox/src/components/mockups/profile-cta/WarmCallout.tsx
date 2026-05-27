import './_group.css';

export function WarmCallout() {
  const steps = [
    {label:'Business name',done:true,icon:'🏢'},
    {label:'Industry',done:false,icon:'🏷'},
    {label:'Address',done:false,icon:'📍'},
    {label:'Phone',done:false,icon:'📞'},
    {label:'Website',done:false,icon:'🌐'},
  ];
  const done = steps.filter(s=>s.done).length;
  const pct = Math.round(done/steps.length*100);

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',padding:'24px',display:'flex',flexDirection:'column',gap:12,minHeight:'100vh',boxSizing:'border-box'}}>

      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textTransform:'uppercase',letterSpacing:'0.08em'}}>Option C — Warm callout (tan accent, above the stat cards)</p>

      {/* THE COMPONENT */}
      <div style={{background:'#EBC99B',borderRadius:14,padding:'20px 24px',maxWidth:860,border:'0.5px solid rgba(125,42,3,0.15)'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:20}}>

          {/* Left text block */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:15,fontWeight:800,color:'#1F3D2C'}}>Complete your business profile!</span>
              <span style={{fontSize:11,background:'rgba(31,61,44,0.12)',color:'#1F3D2C',borderRadius:99,padding:'3px 10px',fontWeight:700}}>{pct}% done</span>
            </div>
            <p style={{fontSize:12,color:'rgba(31,61,44,0.7)',margin:'0 0 16px',lineHeight:1.5}}>
              Your team uses these details to write your captions and create on-brand content. The more you share, the better your content.
            </p>

            {/* Progress bar */}
            <div style={{height:6,borderRadius:99,background:'rgba(31,61,44,0.12)',marginBottom:12,overflow:'hidden'}}>
              <div style={{width:`${pct}%`,height:'100%',borderRadius:99,background:'#1F3D2C',transition:'width 0.4s ease'}}/>
            </div>

            {/* Step pills */}
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {steps.map(s => (
                <div key={s.label} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:99,background:s.done?'rgba(31,61,44,0.12)':'#fff',border:`1.5px solid ${s.done?'transparent':'rgba(31,61,44,0.2)'}`,cursor:s.done?'default':'pointer'}}>
                  <span style={{fontSize:11}}>{s.icon}</span>
                  <span style={{fontSize:11,color:'#1F3D2C',fontWeight:s.done?400:600,textDecoration:s.done?'line-through':'none',opacity:s.done?0.5:1}}>{s.label}</span>
                  {s.done
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 14 4 10"/></svg>
                    : <span style={{fontSize:9,color:'#7D2A03',fontWeight:700}}>+</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Right CTA */}
          <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,paddingTop:4}}>
            <a href="/account" style={{background:'#1F3D2C',color:'#EBC99B',borderRadius:9,padding:'12px 22px',fontSize:12,fontWeight:700,cursor:'pointer',textDecoration:'none',whiteSpace:'nowrap',display:'block'}}>
              Complete now →
            </a>
            <button style={{background:'transparent',border:'none',fontSize:11,color:'rgba(31,61,44,0.5)',cursor:'pointer',textDecoration:'underline'}}>Remind me later</button>
          </div>
        </div>
      </div>

      {/* Context preview below */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,opacity:0.4}}>
        {['Posts this month','Approved & queued','GBP views','Engagement rate'].map(l => (
          <div key={l} style={{background:'#fff',borderRadius:10,padding:'14px',border:'0.5px solid rgba(31,61,44,0.07)'}}>
            <div style={{height:7,width:'65%',background:'rgba(31,61,44,0.1)',borderRadius:4,marginBottom:8}}/>
            <div style={{height:22,width:'40%',background:'rgba(31,61,44,0.15)',borderRadius:4}}/>
          </div>
        ))}
      </div>
      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textAlign:'center'}}>↑ stat cards below — callout dismisses per session or until complete</p>
    </div>
  );
}
