(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{1723:(e,t,a)=>{Promise.resolve().then(a.bind(a,9809))},9809:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>y});var l=a(5155),i=a(2115),n=a(565),r=a(2340),s=a(4345),o=a(7483),d=a(8198),c=a(7145),u=a(8950);let{Option:h}=n.A,m={ข้าว:["อุ่มท้อง","ติดเม็ด"],อ้อย:["แง้ง","เร่งให้ลงหัว"],ข้าวโพด:["เจริญเติบโต","ติดฝักอ่อน"]},g={ทางใบ:{ข้าว:{อุ่มท้อง:{"ไนโตรเจน พลัส":20,"เอ็นเทค พลัส":80},ติดเม็ด:{"ไนโตรเจน พลัส":40,"เอ็นเทค พลัส":40}},อ้อย:{แง้ง:{"ไนโตรเจน พลัส":50,"เอ็นเทค พลัส":60},เร่งให้ลงหัว:{"ไนโตรเจน พลัส":40,"เอ็นเทค พลัส":40}},ข้าวโพด:{เจริญเติบโต:{"ไนโตรเจน พลัส":60,"เอ็นเทค พลัส":40},ติดฝักอ่อน:{"ไนโตรเจน พลัส":40,"เอ็นเทค พลัส":40}}},ทางดิน:{ข้าว:{อุ่มท้อง:{"ไนโตรเจน พลัส":30,"เอ็นเทค พลัส":90},ติดเม็ด:{"ไนโตรเจน พลัส":50,"เอ็นเทค พลัส":50}},อ้อย:{แง้ง:{"ไนโตรเจน พลัส":60,"เอ็นเทค พลัส":70},เร่งให้ลงหัว:{"ไนโตรเจน พลัส":50,"เอ็นเทค พลัส":50}},ข้าวโพด:{เจริญเติบโต:{"ไนโตรเจน พลัส":70,"เอ็นเทค พลัส":50},ติดฝักอ่อน:{"ไนโตรเจน พลัส":50,"เอ็นเทค พลัส":50}}}},x={"ไนโตรเจน พลัส":100,"เอ็นเทค พลัส":150},j={ข้าว:"/rice.jpg",อ้อย:"/sugarcane.jpg",ข้าวโพด:"/corn.jpg"},y=()=>{let[e,t]=(0,i.useState)("ทางใบ"),[a,y]=(0,i.useState)(null),[p,b]=(0,i.useState)(null),[A,v]=(0,i.useState)(0),[k,f]=(0,i.useState)(1),[w,C]=(0,i.useState)([]),S=w.reduce((e,t)=>e+t.price,0);return(0,l.jsx)(r.Ay,{theme:{token:{colorPrimary:"#388e3c",colorLink:"#388e3c",colorLinkHover:"#66bb6a",borderRadius:8,colorBgLayout:"#e8f5e9",colorText:"#2e7d32",colorBgContainer:"#f1f8e9"}},children:(0,l.jsxs)("div",{style:{padding:24,maxWidth:800,margin:"0 auto",textAlign:"center",fontFamily:"Arial, sans-serif",borderRadius:"10px"},children:[(0,l.jsx)(s.A,{src:"/logo.jpg",width:150,alt:"Logo",style:{marginBottom:16}}),(0,l.jsx)("h3",{style:{marginBottom:24},children:"คำนวนปริมาณปุ๋ยที่ต้องใช้"}),(0,l.jsxs)(o.A,{defaultActiveKey:"ทางใบ",onChange:e=>{t(e),y(null),b(null)},style:{marginBottom:24},children:[(0,l.jsx)(o.A.TabPane,{tab:"ทางใบ"},"ทางใบ"),(0,l.jsx)(o.A.TabPane,{tab:"ทางดิน"},"ทางดิน")]}),(0,l.jsxs)("div",{style:{marginBottom:16},children:[(0,l.jsx)(n.A,{placeholder:"เลือกชนิดพืช",style:{width:200,marginRight:16},onChange:e=>{y(e),b(null)},children:Object.keys(m).map(e=>(0,l.jsx)(h,{value:e,children:e},e))}),(0,l.jsx)(n.A,{placeholder:"เลือกจังหวะพืช",style:{width:200,marginRight:16},disabled:!a,onChange:e=>b(e),children:(m[a]||[]).map(e=>(0,l.jsx)(h,{value:e,children:e},e))}),(0,l.jsx)(d.A,{placeholder:"จำนวนไร่",min:1,style:{width:120,marginRight:16},onChange:e=>v(e||0)}),(0,l.jsx)(n.A,{placeholder:"เลือกขนาดพุ่ม",style:{width:200,marginRight:16},defaultValue:1,onChange:e=>f(e),children:[{label:"ขนาดปกติ",value:1},{label:"พุ่มปานกลาง",value:1.5},{label:"พุ่มใหญ่",value:2}].map(e=>(0,l.jsx)(h,{value:e.value,children:e.label},e.value))}),(0,l.jsx)(c.Ay,{type:"primary",onClick:()=>{a&&p&&A>0&&C(Object.entries(g[e][a][p]).map(e=>{let[t,a]=e,l=a*A*k,i=Math.ceil(l/1e3),n=i*x[t];return{item:t,amount:l,defaultAmount:a,liters:i,price:n}}))},children:"คำนวน"})]}),a&&(0,l.jsx)("img",{src:j[a],alt:a,style:{width:"100%",maxHeight:200,objectFit:"cover",marginBottom:24,borderRadius:"10px"}}),(0,l.jsx)(u.A,{columns:[{title:"ปุ๋ย",dataIndex:"item",key:"item"},{title:"ปริมาณที่ต้องใช้ต่อไร่ (ซีซี)",dataIndex:"defaultAmount",key:"defaultAmount"},{title:"ปริมาณที่ต้องใช้ (ซีซี)",dataIndex:"amount",key:"amount"},{title:"ขนาด (ลิตร)",dataIndex:"liters",key:"liters"},{title:"ราคา (บาท)",dataIndex:"price",key:"price"}],dataSource:w,rowKey:"item",pagination:!1}),w.length>0&&(0,l.jsxs)("h4",{style:{marginTop:16},children:["ราคาทั้งหมด: ",S.toLocaleString()," บาท"]})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[827,441,517,358],()=>t(1723)),_N_E=e.O()}]);