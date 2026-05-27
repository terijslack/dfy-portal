import './_group.css';

export function SlimBanner() {
  const pct = 35;
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',padding:'24px',display:'flex',flexDirection:'column',gap:12,minHeight:'100vh',boxSizing:'border-box'}}>

      {/* Label */}
      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textTransform:'uppercase',letterSpacing:'0.08em'}}>Option A — Slim Banner (sits below the page heading)</p>

      {/* THE COMPONENT */}
      <div style={{background:'#fff',border:'0.5px solid rgba(31,61,44,0.12)',borderRadius:12,padding:'16px 22px',display:'flex',alignItems:'center',gap:20}}>

        {/* Progress ring (SVG arc) */}
        <div style={{flexShrink:0,width:52,height:52,position:'relative'}}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(31,61,44,0.08)" strokeWidth="4"/>
            <circle cx="26" cy="26" r="21" fill="none" stroke="#2D6B4F" strokeWidth="4"
              strokeDasharray={`${2*Math.PI*21*pct/100} ${2*Math.PI*21*(1-pct/100)}`}
              strokeLinecap="round"
              transform="rotate(-90 26 26)"/>
          </svg>
          <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:11,fontWeight:800,color:'#1F3D2C'}}>{pct}%</span>
        </div>

        {/* Text */}
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontSize:13,fontWeight:700,color:'#1F3D2C',margin:'0 0 3px'}}>Complete your business profile</p>
          <p style={{fontSize:12,color:'#6B756B',margin:0}}>Add your address, phone, website, and industry so your team can get to work.</p>
        </div>

        {/* Progress bar */}
        <div style={{width:140,flexShrink:0}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
            <span style={{fontSize:10,color:'#6B756B'}}>Profile complete</span>
            <span style={{fontSize:10,fontWeight:700,color:'#1F3D2C'}}>{pct}%</span>
          </div>
          <div style={{height:5,borderRadius:99,background:'rgba(31,61,44,0.08)'}}>
            <div style={{width:`${pct}%`,height:'100%',borderRadius:99,background:'#2D6B4F'}}/>
          </div>
        </div>

        {/* CTA */}
        <a href="/account" style={{flexShrink:0,background:'#1F3D2C',color:'#fff',border:'none',borderRadius:8,padding:'10px 20px',fontSize:12,fontWeight:600,cursor:'pointer',textDecoration:'none',whiteSpace:'nowrap'}}>
          Complete profile →
        </a>

        {/* Dismiss */}
        <button style={{flexShrink:0,background:'transparent',border:'none',color:'#9aaa9a',cursor:'pointer',fontSize:16,lineHeight:1,padding:'4px'}}>×</button>
      </div>

      {/* Context: show how it sits in the dashboard */}
      <div style={{background:'#fff',border:'0.5px solid rgba(31,61,44,0.07)',borderRadius:12,padding:'16px 22px',opacity:0.45}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          {['Posts this month','Approved & queued','GBP views','Engagement rate'].map(l => (
            <div key={l} style={{padding:'12px',borderRadius:8,background:'rgba(31,61,44,0.04)'}}>
              <div style={{height:8,width:'60%',background:'rgba(31,61,44,0.1)',borderRadius:4,marginBottom:8}}/>
              <div style={{height:20,width:'40%',background:'rgba(31,61,44,0.15)',borderRadius:4}}/>
            </div>
          ))}
        </div>
      </div>
      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textAlign:'center'}}>↑ stat cards below, banner dismisses once profile is 100%</p>
    </div>
  );
}
