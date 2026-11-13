/* Copyright (c) 2026 Munich Quantum Software Company GmbH
 * SPDX-License-Identifier: MIT */
"use strict";
window.SC26 = (() => {
  const A = window.MQSF_ASSETS;
  const deployment = window.MQSF_DATA.presentation?.deployment;
  const providerBrand = deployment ? "braket" : "iqm";
  const deviceId = deployment ? "amazon.braket.iqm.emerald" : "iqm.emerald";
  const deploymentLabel = deployment ? "AWS PCS Workflow" : "Emerald Deployment";
  const blue = "#2f70b8", navy = "#142b45", teal = "#087d92", pale = "#eaf2fa";
  const clamp = x => Math.max(0, Math.min(1, x));
  const text = (x,y,s,size=28,color=navy,anchor="middle") => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${s}</text>`;
  const logo = (name, cls="") => `<img class="${cls}" src="${A[name]}" alt="${name === 'iqm' ? 'IQM Quantum Computers' : name.toUpperCase()}"/>`;
  const mark = (name,x,y,w,h) => `<image href="${A[name]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
  const box = (x,y,w,h,body,active=false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${active?pale:'#fff'}" stroke="${active?blue:'#cbdced'}" stroke-width="${active?3:2}"/>${body}`;
  const path = (d,color=blue,width=3,extra="") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
  const flow = (d,p,color=blue) => `${path(d,'#cbdced',3)}${path(d,color,4,`pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-clamp(p)}"`)} `;
  const svg = (body,label) => `<svg data-morph="sc-diagram-${label}" viewBox="0 0 1080 740" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const repoLink = kind => kind === 'qdmi'
    ? `<div class="sc-qdmi-reference" data-morph="sc-resource-link"><div class="sc-credit-logos">${['tum-mark','lrz-mark','mqv','mqsc'].map(name=>logo(name)).join('')}</div><p>Created by TUM &amp; LRZ<br>Maintained by MQV gGmbH &amp; MQSC</p><a href="https://github.com/Munich-Quantum-Software-Stack/QDMI">${logo('github')}<span>Munich-Quantum-Software-Stack/QDMI</span></a></div>`
    : kind === 'slurm' && (deployment || window.MQSF_DATA.presentation?.orchestratorHighlight)
      ? `<a class="sc-card-resource" data-morph="sc-resource-link" href="https://github.com/munich-quantum-software/orchestrator">${logo('mqsc')}<span>MQSC Orchestrator<br><small>Slurm 26.11 HRES Support<br>github.com/munich-quantum-software/orchestrator</small></span><img src="${A['qr-orchestrator']}" alt="QR code: MQSC Orchestrator"/></a>`
      : kind === 'slurm'
      ? `<a class="sc-card-resource" data-morph="sc-resource-link" href="https://github.com/munich-quantum-toolkit/core/tree/main/examples/slurm">${logo('mqt')}<span>Try the Slurm Playground<br><small>MQT Core · examples/slurm</small></span><img src="${A['qr-slurm']}" alt="QR code: Slurm playground"/></a>`
      : `<a class="sc-card-resource" data-morph="sc-resource-link" href="https://github.com/iqm-finland/QDMI-on-IQM">${logo('iqm')}<span>QDMI-on-IQM<br><small>github.com/iqm-finland/<br>QDMI-on-IQM</small></span><img src="${A['qr-iqm']}" alt="QR code: IQM QDMI device"/></a>`;
  const card = (label,title,body,foot,kind,p,reference=null) => `<section class="sc-detail" data-morph="sc-detail"><p class="sc-eyebrow" style="opacity:${clamp(p*5)}">${label}</p><h3 style="opacity:${clamp(p*5)}">${title}</h3><div class="sc-card-copy" style="opacity:${clamp(p*5)}">${body}${foot?`<p class="sc-detail-foot">${foot}</p>`:''}</div>${reference ?? repoLink(kind)}</section>`;
  const items = rows => `<ul class="sc-items">${rows.map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul>`;
  const resource = (qr,url,title,description) => `<a class="sc-resource" href="https://${url}"><img src="${A['qr-'+qr]}" alt="QR code: ${url}"/><div><h3>${title}</h3><p>${description}</p><span>${url}</span></div></a>`;
  function title() {
    return `<div class="sc-title"><h1>Practical HPCQC<br>Integration with QDMI</h1><p class="sc-title-sub">A Real-Hardware Case Study<br>with IQM Systems</p><div class="sc-authors"><h3>Lukas Burgholzer<span>CTO, MQSC · Senior Researcher, TUM CDA</span></h3><p>Marcel Walter · Patrick Hopf · Álvaro Caride-Tabarés Sánchez<br>Teemu Mattsson · Bernd Hoffmann · Noora Färkkilä<br>Daniel Bulmash · Robert Wille · Eric Mansfield</p><div class="sc-affiliations">${logo('mqsc')}${logo('tum-cda')}${logo('iqm')}<span>Munich Quantum Software Company<br>Technical University of Munich<br>IQM Quantum Computers</span></div></div><aside class="sc-title-reference"><div class="sc-title-device">${logo('iqm')}<div><h3>QDMI-on-IQM</h3><span>HPCQC Integration</span></div></div><div class="sc-powered">Powered by ${logo('qdmi')}</div>${resource('iqm','github.com/iqm-finland/QDMI-on-IQM','The Implementation','Source · Installation · Examples')}${resource('iqm-paper','arxiv.org/abs/2604.19869','The Paper','Burgholzer, Walter, et al., 2026')}</aside></div>`;
  }
  const ease = p => { const t=clamp(p); return t*t*(3-2*t); };
  const mix = (a,b,p) => a+(b-a)*p;
  const geometries = new Map();
  function packet(key,d,progress,kind='program') {
    if(!geometries.has(d)) {
      const element=document.createElementNS('http://www.w3.org/2000/svg','path');
      element.setAttribute('d',d);
      geometries.set(d,{element,length:element.getTotalLength()});
    }
    const {element,length}=geometries.get(d), point=element.getPointAtLength(clamp(progress)*length);
    const visible=clamp(progress*12)*clamp((1-progress)*12);
    const shape=kind==='query'?'<path d="M0 -10L10 0L0 10L-10 0Z"/>':kind==='session'?'<circle r="9"/>':'<rect x="-10" y="-8" width="20" height="16" rx="3"/>';
    return `<g data-morph="${key}" class="sc-packet" transform="translate(${point.x} ${point.y})" opacity="${visible}" fill="${teal}" stroke="white" stroke-width="2">${shape}</g>`;
  }
  const clientRoute = x => `M${x} 170V202H540V235`;
  const deviceRoute = x => `M540 435V500H${x}V520`;
  const interfaceBadge = (y,label) => `<g data-morph="interface-${label.includes('Client') ? 'client' : 'device'}" class="sc-interface-badge"><rect x="215" y="${y}" width="650" height="46" rx="12" fill="white" stroke="#91abc5" stroke-width="2"/>${mark('c',236,y+8,30,30)}${text(562,y+31,label,28)}</g>`;
  const sharedLibrary = (x,y,label=false) => `<g class="sc-shared-library" transform="translate(${x} ${y})"><path d="M0 -7V3H23M4 -12V-1H27" fill="none" stroke="#5b7088" stroke-width="2"/><rect x="8" y="-17" width="23" height="12" rx="2" fill="white" stroke="#5b7088" stroke-width="2"/>${label?text(43,2,'Shared Library',24,navy,'start'):''}</g>`;
  function interfaceScene(step,p,zoom=0,detail=0) {
    const xs=[35,395,755], centers=xs.map(x=>x+145);
    const devices=[
      ['iqm','IQM','iqm-finland','QDMI-on-IQM'],
      ['braket','Amazon Braket','munich-quantum-software','amazon-braket-qdmi-device'],
      ['mqt','MQT DDSIM','munich-quantum-toolkit','core'],
      ['ibm','IBM Quantum','munich-quantum-software','ibm-qdmi-device'],
      ['pasqal','Pasqal','munich-quantum-software','pasqal-qdmi-device']
    ], selected=deployment?1:0, selectedCenter=120+selected*210;
    const top=step===0?clamp(p*2):1, bottom=step===0?clamp((p-.45)*2):1;
    const driverY=mix(235,35,zoom), driverH=mix(200,190,zoom), driverBottom=driverY+driverH;
    const deviceX=mix(23+selected*210,35,zoom), deviceY=mix(520,300,zoom), deviceW=mix(194,1010,zoom), deviceH=mix(155,305,zoom);
    let body=`<g data-morph="qdmi-clients" transform="translate(0 ${-180*zoom})" opacity="${clamp(1-zoom*2)}">`;
    body+=text(35,28,'Clients',28,blue,'start');
    centers.forEach(x=>body+=flow(clientRoute(x),top));
    const brands=[mark('qiskit',52,112,34,34)+text(132,139,'Qiskit',25)+mark('pennylane',188,110,116,40),mark('mqt',418,105,108,52)+mark('mqss',553,97,112,64),mark('slurm',778,102,80,56)+mark('orchestrator',878,103,140,55)];
    ['Applications / SDKs','Compilers','Resource Managers'].forEach((name,i)=>{
      body+=box(xs[i],45,290,125,text(centers[i],82,name,27)+brands[i]);
    });
    if(step===1) body+=packet('session-open',clientRoute(180),p/.25,'session')+packet('session-ready',clientRoute(180),1-(p-.8)/.2,'session');
    if(step===2) body+=packet('compiler-query',clientRoute(540),1-(p-.45)/.45,'query')+packet('scheduler-query',clientRoute(900),1-(p-.55)/.4,'query');
    if(step===3) body+=packet('job-submit',clientRoute(180),p/.2)+packet('job-return',clientRoute(180),1-(p-.85)/.15);
    body+='</g>';
    body+=`<g data-morph="qdmi-other-connections" opacity="${clamp(1-zoom*3)}">${devices.map((_,i)=>i===selected?'':flow(deviceRoute(120+i*210),bottom)).join('')}${text(25,488,'Device Implementations',24,blue,'start')}</g>`;
    body+=flow(`M540 ${driverBottom}V${mix(500,250,zoom)}H${mix(selectedCenter,540,zoom)}V${deviceY}`,bottom);
    body+=`<g data-morph="qdmi-driver">${box(35,driverY,1010,driverH,mark('qdmi',70,mix(267,67,zoom),230,58)+text(625,mix(305,103,zoom),'<tspan font-weight="700">QDMI Driver</tspan>',34)+sharedLibrary(990,mix(284,85,zoom)),true)}`;
    ['Sessions','Queries','Jobs'].forEach((name,i)=>{
      const active=step===i+1;
      body+=`<g data-morph="qdmi-feature-${i}"><rect x="${xs[i]+24}" y="${mix(337,125,zoom)}" width="242" height="55" rx="12" fill="${active?'#fff0d4':'white'}" stroke="${active?'#a96916':'#cbdced'}" stroke-width="2"/>${text(centers[i],mix(373,161,zoom),name,28)}</g>`;
    });
    body+=interfaceBadge(driverY-23,'Implements QDMI Client Interface');
    body+=interfaceBadge(driverBottom-23,'Calls QDMI Device Interface')+'</g>';
    devices.forEach(([brand,name,org,repo],i)=>{
      const chosen=i===selected,x=chosen?deviceX:23+i*210,y=chosen?deviceY:520,w=chosen?deviceW:194,h=chosen?deviceH:155;
      body+=`<g data-morph="qdmi-device-${brand}" opacity="${chosen?1:clamp(1-zoom*3)}">${box(x,y,w,h,'',chosen&&step>0)}${sharedLibrary(x+w-39,y+26)}`;
      body+=`<g opacity="${chosen?1-zoom:1}">${mark(brand,x+24,y+20,brand==='braket'?45:130,42)}${brand==='braket'?text(x+112,y+43,'Amazon',21)+text(x+112,y+68,'Braket',21):brand==='mqt'?text(x+w/2,y+82,'DDSIM',22):''}<a href="https://github.com/${org}/${repo}" tabindex="-1">${mark('github',x+10,y+102,17,17)}${text(x+32,y+113,org,11.5,blue,'start')}${text(x+10,y+137,repo,repo.length>22?12:15,blue,'start')}</a></g>`;
      if(chosen) body+=`<g opacity="${zoom}">${mark('qdmi',deviceX+30,deviceY+22,160,48)}${text(deviceX+deviceW/2,deviceY+55,deployment?'Amazon Braket QDMI Device':'QDMI-on-IQM',32)}</g>`;
      body+='</g>';
    });
    if(step===1) body+=packet('session-init',deviceRoute(selectedCenter),(p-.25)/.35,'session')+packet('session-device-ready',deviceRoute(selectedCenter),1-(p-.6)/.2,'session');
    if(step===2) body+=packet('capabilities',deviceRoute(selectedCenter),1-p/.4,'query');
    if(step===3 && !zoom) body+=packet('job-programs',deviceRoute(selectedCenter),(p-.2)/.25)+packet('job-results',deviceRoute(selectedCenter),1-(p-.65)/.2);
    body+=`<g data-morph="qdmi-library-legend" opacity="${1-zoom}">${sharedLibrary(830,712,true)}</g>`;
    body+=`<g data-morph="iqm-internals" opacity="${detail}">`;
    body+=path('M540 370V395M200 395H880');
    [200,540,880].forEach(x=>body+=path(`M${x} 395V410`));
    (deployment ? [['Session','Region & Auth','Device ARN'],['Device','Topology & Gates','GetDevice'],['Job','Task ARN','Logical Results']] : [['Session Context','Endpoint & Identity','Authentication'],['Device Model','Topology & Gates','Calibration'],['Job Adapter','Submit & Track','Decode Results']]).forEach(([name,a,b],i)=>{
      const x=65+i*340;
      body+=`<g data-morph="iqm-lane-${i}" opacity="${clamp((detail-i*.16)*2)}">${box(x,410,270,110,text(x+135,440,name,27)+text(x+135,474,a,25)+text(x+135,506,b,25))}</g>`;
      body+=path(`M${x+135} 520V535H540V550`);
    });
    body+=box(65,550,950,42,text(540,579,deployment ? 'AWS SDK for C++ · BraketClient · S3Client' : 'TokenManager · APIConfig · Pooled HTTPS Transport',26));
    body+=path('M540 605V635')+box(35,635,1010,58,deployment ? mark('braket',75,642,42,42)+text(310,673,'Amazon Braket API',27)+mark('s3',650,642,42,42)+text(820,673,'Amazon S3',27) : mark('iqm',90,647,125,34)+text(650,673,'IQM Server API · Cloud and On-Premise',28),true);
    return body+'</g>';
  }
  function qdmi(step,p=1,reference=null) {
    const panels=[
      ['QDMI','Open, Vendor-Neutral Interface',items([
        ['Device Discovery','Access devices through a QDMI driver'],['Capabilities and Calibration','Query sites, operations, and device properties'],['Job Execution','Submit programs and retrieve results']
      ]), ''],
      ['1 · Sessions','Session Configuration',items([
        ['Allocate','Create a Session with the driver'],['Configure','Set endpoint and authentication parameters'],['Initialize','Access the configured devices']
      ]),''],
      ['2 · Queries','Device Properties, Sites, and Operations',items([
        ['Compiler','Connectivity and supported operations'],['Calibration','Coherence and operation quality'],['Resource Manager','Device status and queue information']
      ]),''],
      ['3 · Jobs','Job Execution and Results',`<div class="sc-lifecycle">${['Create','Configure','Submit','Check / Wait','Results','Free'].map((s,i)=>`<div data-morph="lifecycle-${i}" style="--activity:${clamp((p-i*.15)*5)}"><b>${i+1}</b>${s}</div>`).join('')}</div>`,'One or more programs per Job.']
    ];
    return `<h2 data-morph="heading">The Quantum Device Management Interface</h2><div class="sc-deep-dive"><div class="sc-architecture" data-morph="sc-architecture">${svg(interfaceScene(step,p),'QDMI clients and device implementations')}</div>${card(...panels[step],'qdmi',p,reference)}</div>`;
  }
  function iqm(step,p=1) {
    const zoom=ease(p/.48), detail=ease((p-.48)/.52);
    const panel=card('Implementation','QDMI-on-IQM',items([
      ['QDMI Device Interface','Sessions, queries, Jobs, and results'],['Shared Support Layer','Token handling, API routes, connection reuse'],['Configured Deployment','IQM endpoint and selected system']
    ]),'','iqm',clamp((p-.25)*3));
    return `<h2 data-morph="heading">Connecting QDMI to IQM Systems</h2><div class="sc-deep-dive"><div class="sc-architecture" data-morph="sc-architecture">${svg(interfaceScene(3,1,zoom,detail),'QDMI clients and device implementations')}</div>${panel}</div>`;
  }
  function braket(p=1) {
    const zoom=ease(p/.4), detail=ease((p-.25)/.4), run=ease((p-.4)/.3), results=ease((p-.65)/.3);
    const dispatch='M310 190V245M150 245H465M150 245V265M465 245V265';
    const collect='M150 465V500H310M465 465V500H310';
    const cloud=`<svg class="booth-cloud" viewBox="0 0 620 650" role="img" aria-label="Braket task submission and execution, S3 result storage and retrieval">
      ${text(310,28,'Quantum Task Flow',30)}
      <g opacity="${ease((p-.15)/.2)}">
        <rect x="10" y="65" width="600" height="420" rx="18" fill="#faf7ff" stroke="#8c4fff" stroke-width="2.5"/>
        <rect x="25" y="42" width="300" height="48" fill="white"/>
        ${mark('braket',35,43,44,44)}${text(95,76,'Amazon Braket',30,navy,'start')}
        ${box(75,112,470,78,text(310,144,'1 · Submit and Track a QuantumTask',26)+text(310,177,'Queue · Status · Results',26))}
      </g>
      <g opacity="${run}">
        ${flow(dispatch,run)}<rect x="65" y="206" width="490" height="32" fill="#faf7ff"/>${text(310,231,'2 · Run on the Selected Device',26)}
        ${box(25,265,250,200,mark('braket-simulator',43,281,42,42)+text(180,309,'Simulators',30)+text(150,346,'SV1',30)+text(150,380,'State Vector',26)+text(150,414,'DM1',30)+text(150,449,'Density Matrix',26))}
        ${box(340,265,255,200,mark('braket-qpu',356,282,40,40)+text(493,308,'QPUs',30)+mark('aqt',362,334,88,30)+mark('ionq',479,332,92,34)+mark('iqm',374,382,64,28)+mark('rigetti-wordmark',479,378,92,36)+mark('quera',411,425,113,32))}
      </g>
      <g opacity="${results}">
        ${flow(collect,results)}${flow('M310 500V540',results)}
        <rect x="100" y="540" width="420" height="72" rx="18" fill="#f5faec" stroke="#7aa116" stroke-width="2.5"/>
        <rect x="120" y="518" width="260" height="46" fill="white"/>
        ${mark('s3',130,519,40,40)}${text(186,551,'Amazon S3',28,navy,'start')}
        ${text(310,592,'3 · Store Result Object',26)}
        ${text(310,644,'4 · Retrieve Application Results',26)}
      </g>
      ${packet('braket-dispatch','M310 238V245H465V265',(p-.4)/.25)}
      ${packet('braket-store','M465 465V500H310V540',(p-.65)/.25,'query')}
    </svg>`;
    return `<h2 data-morph="heading">Connecting QDMI to Amazon Braket</h2><div class="sc-deep-dive"><div class="sc-architecture" data-morph="sc-architecture">${svg(interfaceScene(3,1,zoom,detail),'QDMI clients and device implementations')}</div><section class="sc-detail" data-morph="sc-detail">${cloud}</section></div>`;
  }
  function slurm(step,p=1) {
    const phase=step-1;
    const submit='M165 285V172Q165 140 197 140H365';
    const allocate='M645 235V250Q645 265 661 265H879Q895 265 895 285';
    const monitor='M705 180H730V245H1055V505H1025';
    const offload='M930 410V465';
    const provider='M900 545V580Q900 605 878 605H602Q580 605 580 625';
    const classicalControl='M510 235V285', accounting='M705 140H775';
    const save='M800 410V422Q800 440 784 440H702Q686 440 686 458V489Q686 505 670 505';
    const propagate='M510 465V410';
    let body=`<rect class="${deployment?'aws-pcs-boundary':'hpc-boundary'}" x="10" y="24" width="1060" height="556" rx="18" fill="${deployment?'#fffdf8':'#fafcff'}" stroke="${deployment?'#ed9731':blue}" stroke-width="2"/>`;
    body+=`<g class="service-heading"><rect x="34" y="0" width="${deployment?588:160}" height="52" rx="18" fill="white" stroke="${deployment?'#ed9731':blue}" stroke-width="2"/>${deployment?mark('pcs',51,7,36,36):''}${text(deployment?111:70,35,deployment?'AWS Parallel Computing Service':'HPC',30,navy,'start')}</g>`;
    body+=[submit,allocate,classicalControl,accounting,'M165 410V465',propagate,save,offload,provider].map(d=>path(d,'#b7cce1',3)).join('');
    body+=path(monitor,'#91abc5',2,'stroke-dasharray="5 7"');
    const admission=phase===0?(p<.2?'Job Queued':p<.58?'License Reserved':p<.8?'License Available':'License Allocated'):phase===1?'License Allocated':phase===2&&p<.3?'Returning 1 License':'License Available';
    body+=box(365,85,340,150,mark('slurm',390,104,113,65)+text(604,129,'Controller',28)+text(604,164,'Schedule',28)+text(535,212,admission,28,teal),phase===0);
    body+=box(775,85,250,118,text(900,130,'Accounting',28)+text(900,170,'SlurmDBD · MariaDB',24),phase===2&&p>.8);
    body+=box(35,285,260,125,window.MQSF_VIZ.icon('workstation',52,308,66)+text(205,332,'Login Node',28)+text(205,372,'Submit Jobs',28));
    body+=box(365,285,290,125,window.MQSF_VIZ.icon('server',382,303,65)+text(550,324,'Classical',28)+text(550,357,'Nodes',28)+text(510,390,phase===2?'Propagate Walkers':'compute partition',26),phase===2);
    body+=box(745,285,280,125,window.MQSF_VIZ.icon('server',760,303,65)+text(922,324,'Quantum',28)+text(922,357,'Access Nodes',26)+text(885,390,phase===1?'Compile → Sample':'quantum partition',26),phase===1);
    body+=box(35,465,635,80,text(352,498,'Shared /jobs · Inputs and Results',28)+text(352,530,'One Software Environment',26),phase===2);
    body+=box(745,465,280,80,mark(providerBrand,762,485,deployment ? 46 : 74,40)+mark('qdmi',deployment ? 832 : 845,485,deployment ? 166 : 158,40),phase===1);
    body+=`<g class="quantum-service-boundary ${deployment?'aws-braket-boundary':'iqm-server-boundary'}"><rect x="10" y="625" width="1060" height="110" rx="18" fill="white" stroke="${deployment?'#8c4fff':blue}" stroke-width="2"/>${window.MQSF_VIZ.icon('cryostat',90,663,62)}${deployment?mark('iqm',215,675,100,35):''}${text(665,675,'IQM Emerald · 54 Qubits',30)}${text(665,711,deployment?'OpenQASM 3 · PRX / CZ':'R / CZ · On-Premise or Cloud',28)}</g>`;
    body+=`<g class="service-heading"><rect x="34" y="600" width="${deployment?336:300}" height="52" rx="18" fill="white" stroke="${deployment?'#8c4fff':blue}" stroke-width="2"/>${mark(deployment?'braket':'iqm',45,608,deployment?48:85,36)}${text(deployment?111:148,635,deployment?'Amazon Braket':'Server',30,navy,'start')}</g>`;

    if(phase===0) {
      body+=packet('slurm-submit',submit,p/.2);
      body+=packet('slurm-probe',monitor,(p-.2)/.18,'query');
      body+=packet('slurm-operational',monitor,1-(p-.4)/.18,'query');
      body+=packet('slurm-allocate',allocate,(p-.8)/.2,'session');
    } else if(phase===1) {
      body+=packet('slurm-iqm-properties',provider,1-p/.17,'query');
      body+=packet('slurm-compiler-properties',offload,1-(p-.17)/.13,'query');
      body+=packet('slurm-programs',offload,(p-.4)/.15);
      body+=packet('slurm-iqm-execute',provider,(p-.55)/.18);
      body+=packet('slurm-shadows',provider,1-(p-.76)/.14,'query');
      body+=packet('slurm-results',offload,1-(p-.9)/.1,'query');
    } else if(phase===2) {
      body+=packet('slurm-save',save,p/.3,'query');
      body+=packet('slurm-release',allocate,1-(p-.15)/.2,'session');
      body+=packet('slurm-propagate',propagate,(p-.4)/.2);
      body+=packet('slurm-report',classicalControl,1-(p-.8)/.1,'query');
      body+=packet('slurm-accounting',accounting,(p-.9)/.1,'query');
    }
    const admissionSteps=`<div class="sc-workflow-status">${[['Queue',0],['Probe',.2],['Allocate',.8]].map(([name,start],i)=>`<div style="--activity:${clamp((p-start)*8)}"><b>${i+1}</b>${name}</div>`).join('')}</div>`;
    const panels=[
      [deploymentLabel,'Two Dependent Slurm Jobs',items([
        ['Quantum Stage',deployment ? 'Reserve one QPU license and a quantum access node' : 'Reserve one Emerald license and a quantum access node'],['Shared Results','Write classical shadows to /jobs'],['Classical Stage','Start propagation after successful measurement']
      ]),deployment ? '' : 'Device access fits the existing scheduler.'],
      [deploymentLabel + ' · Schedule','Submit the Quantum Stage',`<pre class="sc-shell">measurement=$(sbatch --parsable \\\n  --partition=quantum \\\n  --licenses=${deviceId}:1${deployment ? ' \\\n  ' : ' '}measure.sh)</pre>${admissionSteps}${items([['Device Availability','The monitor reserves licenses before probing; IDLE or BUSY permits allocation.']])}`,deployment ? '' : 'One license · One concurrent quantum allocation.'],
      [deploymentLabel + ' · Execute','Compile and Sample on a QAN',items([
        [deployment ? 'Compile for Braket Emerald' : 'Compile for IQM Emerald','Use the device topology and native operations'],['Submit through QDMI',deployment ? 'Submit and track Braket QuantumTasks' : 'Submit and track IQM Jobs'],['Retrieve Classical Shadows','Return samples to the application']
      ]),'The quantum stage holds one device license.'],
      [deploymentLabel + ' · Continue','Propagate on Classical Nodes',`<pre class="sc-shell">sbatch --partition=compute \\\n  --dependency=afterok:"$measurement" \\\n  propagate.sh</pre>${items([['Pass Results through /jobs','Measurement completes and returns its license.'],['Run Classical Propagation','128 walkers per trial · Independent allocation']])}`,'afterok requires success; no quantum license is held.'],
      [deploymentLabel + ' · Summary','One Workflow, Two Allocations',`<pre class="sc-shell sc-shell-summary">measurement=$(sbatch --parsable \\\n  --partition=quantum \\\n  --licenses=${deviceId}:1${deployment ? ' \\\n  ' : ' '}measure.sh)

sbatch --partition=compute \\\n  --dependency=afterok:"$measurement" \\\n  propagate.sh</pre>${items([['Scheduler-Enforced Access','One device license, returned after measurement'],['Independent Classical Resources','128 walkers per trial · Shared /jobs']])}`,''],
    ];
    return `<h2 data-morph="heading">${deployment ? "Orchestrating a Workflow on AWS PCS" : "Explore HPCQC Integration with Slurm"}</h2><div class="sc-deep-dive"><div class="sc-architecture ${deployment ? "aws-pcs-environment" : ""}" data-morph="sc-architecture">${svg(body,'QC-AFQMC through the Slurm playground').replace('viewBox="0 0 1080 740"', 'viewBox="0 0 1080 750"')}</div>${card(...panels[step],'slurm',p)}</div>`;
  }
  function conclusion() {
    return `<h2 data-morph="heading">From Interface to Integration</h2><div class="sc-conclusion"><div class="sc-takeaways"><div class="sc-takeaway"><b>1</b><div><h3>A Shared Device Boundary</h3><p>Keep frontend and HPC integration reusable.</p></div></div><div class="sc-takeaway"><b>2</b><div><h3>A Concrete IQM Implementation</h3><p>Sessions, capabilities, jobs, and results<br>across cloud and on-premise deployments.</p></div></div><div class="sc-takeaway"><b>3</b><div><h3>Practical Hybrid Workflows</h3><p>Connect device-aware compilation,<br>quantum execution, and classical computation.</p></div></div><div class="sc-closing-stack"><span>Application</span><b>↔</b>${logo('slurm')}<b>↔</b>${logo('qdmi')}<b>↔</b>${logo('iqm')}</div></div><div class="sc-closing-resources">${resource('iqm-paper','arxiv.org/abs/2604.19869','The Paper','Burgholzer, Walter, et al., 2026')}${resource('iqm','github.com/iqm-finland/QDMI-on-IQM','The Implementation','Source · Installation · Examples')}${resource('qdmi-repo','github.com/Munich-Quantum-Software-Stack/QDMI','The Interface','Open Specification · Ecosystem')}</div></div>`;
  }
  function workflowIntro(progress=1, chapter="chemistry") {
    const p=clamp(progress), centers=[300,880,1460];
    const routes=['M490 260C570 210 610 210 690 260','M1070 260C1150 210 1190 210 1270 260'];
    let body=routes.map((d,i)=>`<g opacity="${ease((p-.16-i*.32)/.24)}">${flow(d,ease((p-.16-i*.32)/.24))}</g>`).join('');
    body+=`<g opacity="${ease((p-.16)/.24)}">${text(590,190,chapter === 'hpc' ? 'Jobs' : 'Programs',25,blue)}</g><g opacity="${ease((p-.48)/.24)}">${text(1170,190,chapter === 'device' ? 'Quantum Tasks' : chapter === 'compiler' ? 'Native Gates' : chapter === 'hpc' ? 'Allocations' : 'Measurements',25,blue)}</g>`;
    (chapter === 'device' ? [['circuit','Native Program','Preserve Device Instructions'],['server','QDMI Device','Submit · Track · Retrieve'],['cryostat','Amazon Braket','Access Quantum Resources']] : chapter === 'compiler' ? [['workstation','Quantum Program','Describe the Application'],['circuit','Device-Aware Compilation','Optimize · Place · Synthesize'],['cryostat','Native Executable',deployment ? 'Submit through Amazon Braket' : 'Submit through QDMI on IQM']] : chapter === 'hpc' ? [['workstation','Hybrid Workflow','Submit Dependent Jobs'],['server','Slurm Allocation','Coordinate Classical and Quantum Work'],['cryostat','Quantum Resource',deployment ? 'Access through QDMI and Braket' : 'Access through QDMI']] : [['molecule','Application & Preparation',(deployment || window.MQSF_DATA.presentation?.modernLayout) ? 'Prepare the Ansatz' : 'Prepare the Trial State'],['cryostat','Quantum Sampling','Collect Classical Shadows'],['server','Classical Computation','Propagate Walkers · Estimate Energy']]).forEach(([name,title,detail],i)=>{
      const reveal=ease((p-i*.16)/.24), x=centers[i];
      body+=`<g data-morph="workflow-role-${i}" opacity="${reveal}" transform="translate(0 ${(1-reveal)*24})"><circle cx="${x}" cy="260" r="181" fill="#f5f9fd"/><circle cx="${x}" cy="260" r="181" fill="none" stroke="#dbe7f2" stroke-width="2"/>${window.MQSF_VIZ.icon(name,x-130,130,260)}${text(x,505,title,34)}${text(x,554,detail,25,'#5b7088')}</g>`;
    });
    routes.forEach((d,i)=>{
      for(let j=0;j<3;j++) body+=packet(`workflow-transfer-${i}-${j}`,d,(p-.22-i*.32-j*.035)/.22,i?'query':'program');
    });
    return `<svg class="sc-workflow-intro" viewBox="0 0 1760 600" role="img" aria-label="${chapter} workflow">${body}</svg>`;
  }
  return {title, qdmi, iqm, braket, slurm, conclusion, workflowIntro};
})();
