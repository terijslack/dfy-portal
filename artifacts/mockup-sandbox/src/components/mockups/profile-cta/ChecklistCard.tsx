import './_group.css';

export function ChecklistCard() {
  const fields = [
    {label:'Business name',done:true},
    {label:'Industry',done:false},
    {label:'Address',done:false},
    {label:'Phone number',done:false},
    {label:'Website URL',done:false},
  ];
  const done = fields.filter(f => f.done).length;
  const pct = Math.round(done / fields.length * 100);

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#F5F2EA',padding:'24px',display:'flex',flexDirection:'column',gap:12,minHeight:'100vh',boxSizing:'border-box'}}>

      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textTransform:'uppercase',letterSpacing:'0.08em'}}>Option B — Card with checklist (replaces or sits beside "Your Business Profile")</p>

      {/* THE COMPONENT */}
      <div style={{background:'#fff',border:'0.5px solid rgba(31,61,44,0.12)',borderRadius:12,overflow:'hidden',display:'flex',maxWidth:860}}>

        {/* Left: progress visual */}
        <div style={{background:'#1F3D2C',width:200,flexShrink:0,padding:'28px 24px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
          <div style={{position:'relative',width:90,height:90}}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6"/>
              <circle cx="45" cy="45" r="38" fill="none" stroke="#EBC99B" strokeWidth="6"
                strokeDasharray={`${2*Math.PI*38*pct/100} ${2*Math.PI*38*(1-pct/100)}`}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"/>
            </svg>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
              <div style={{fontSize:22,fontWeight:800,color:'#fff',lineHeight:1}}>{pct}%</div>
              <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',marginTop:2}}>complete</div>
            </div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:4}}>Business Profile</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>{done} of {fields.length} fields filled</div>
          </div>
        </div>

        {/* Right: checklist + CTA */}
        <div style={{flex:1,padding:'24px 28px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:'#1F3D2C',margin:'0 0 4px'}}>Complete your business profile!</p>
            <p style={{fontSize:12,color:'#6B756B',margin:'0 0 18px',lineHeight:1.5}}>
              Your marketing team needs these details to create on-brand content for your business.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {fields.map(f => (
                <div key={f.label} style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${f.done?'#2D6B4F':'rgba(31,61,44,0.2)'}`,background:f.done?'#2D6B4F':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {f.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 14 4 10"/></svg>}
                  </div>
                  <span style={{fontSize:12,color:f.done?'#9aaa9a':'#1F3D2C',textDecoration:f.done?'line-through':'none',fontWeight:f.done?400:500}}>{f.label}</span>
                  {!f.done && <span style={{fontSize:10,color:'#7D2A03',background:'rgba(125,42,3,0.08)',borderRadius:4,padding:'2px 6px',marginLeft:'auto'}}>Missing</span>}
                  {f.done && <span style={{fontSize:10,color:'#2D6B4F',marginLeft:'auto'}}>✓ Added</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:20,display:'flex',gap:10,alignItems:'center'}}>
            <a href="/account" style={{background:'#1F3D2C',color:'#fff',borderRadius:8,padding:'10px 22px',fontSize:12,fontWeight:600,cursor:'pointer',textDecoration:'none'}}>
              Fill in missing details →
            </a>
            <span style={{fontSize:11,color:'#9aaa9a'}}>Takes about 2 minutes</span>
          </div>
        </div>
      </div>

      <p style={{fontSize:11,color:'#9aaa9a',margin:0,textAlign:'center'}}>↑ hides automatically once all fields are filled</p>
    </div>
  );
}
