/* Copyright (c) 2026 Munich Quantum Software Company GmbH; SPDX-License-Identifier: MIT */
"use strict";
{
  const mode = window.SC26_TALK, A = window.MQSF_ASSETS;
  const img = (name, cls = "") => `<img class="${cls}" src="${A[name]}" alt="${name}"/>`;
  const t = (x,y,s,size=30) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="#142b45">${s}</text>`;
  const mark = (name,x,y,w,h) => `<image href="${A[name]}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const box = (key,x,y,w,h,body,active=false) => `<g data-morph="${key}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${active?'#eaf2fa':'white'}" stroke="${active?'#2f70b8':'#cbdced'}" stroke-width="3"/>${body}</g>`;
  const line = (d,dash=false) => `<path d="${d}" fill="none" stroke="#2f70b8" stroke-width="4" ${dash?'stroke-dasharray="9 7"':''}/>`;
  const svg = (body,label,height=700) => `<svg viewBox="0 0 1760 ${height}" role="img" aria-label="${label}">${body}</svg>`;
  const ref = (url,label) => `<a class="talk-source" href="${url}">${label}</a>`;
  const card = (title,body) => `<section class="talk-card"><h3>${title}</h3><p>${body}</p></section>`;
  const resource = (key,url,title) => `<a class="talk-resource" href="https://${url}">${img('qr-'+key)}<div><h3>${title}</h3><span>${url}</span></div></a>`;
  const providers = [['iqm','IQM'],['ibm','IBM Quantum'],['braket','Amazon Braket'],['pasqal','Pasqal'],['mqt','MQT DDSIM']];
  function title(headline,subtitle) {
    return `<div class="talk-title"><div class="talk-title-rule"></div><h1>${headline}</h1><p>${subtitle}</p><div class="talk-author">${img('mqsc')}<div><b>Lukas Burgholzer</b><span>CTO &amp; Co-founder · Munich Quantum Software Company</span></div></div>${resource('openqse','openqse.org','Open Quantum–HPC Software Ecosystem')}</div>`;
  }
  function architecture() {
    const layer = (key,y,h,label,body) => `<g data-morph="architecture-${key}"><rect x="250" y="${y}" width="1500" height="${h}" rx="18" fill="#f4f7fb" stroke="#cbdced" stroke-width="2"/>${label.map((s,i)=>t(115,y+h/2+(i-(label.length-1)/2)*35+10,s,26)).join('')}${body}</g>`;
    return `<div class="talk-diagram reference-diagram">${svg(
      layer('applications',5,85,['Applications'],box('sqd',530,21,430,53,t(745,57,'SQD Workflow'))+box('vqe',1030,21,430,53,t(1245,57,'VQE Workflow')))+
      layer('orchestration',108,155,['System','Orchestration'],
        ['QCSC Prefect','Tierkreis','StreamFlow'].map((n,i)=>box('engine-'+i,290+i*480,123,440,52,t(510+i*480,158,n))).join('')+
        box('slurm',420,192,520,52,mark('slurm',520,199,130,37)+t(765,228,'Slurm'))+box('flux',1050,192,520,52,t(1310,228,'Flux')))+
      layer('middleware',281,299,['Application','Middleware'],
        box('mpi',290,298,1420,45,t(1000,329,'MPI',28))+
        box('qiskit',365,361,330,65,mark('qiskit',390,375,40,40)+t(550,404,'Qiskit'))+
        box('core',835,361,330,65,mark('mqt',859,373,100,40)+t(1050,404,'MQT Core'),mode!=='bof')+
        box('catalyst',1305,361,330,65,t(1470,404,'Catalyst'))+
        box('qpm',455,442,235,50,t(572,476,'QPM'),mode==='bof')+line('M690 467H855')+
        box('qri',855,442,290,50,t(1000,476,'QRI'),mode==='bof')+
        `<g data-morph="qri-interfaces">${line('M1000 492V507M750 520V507H1250V520')}</g>`+
        box('qrmi',610,520,280,50,t(750,554,'QRMI'),mode==='bof')+
        box('qdmi',1110,520,280,50,mark('qdmi',1165,529,170,32),true))+
      (mode==='bof' ? '' : layer('compute',598,148,['QDMI','Device Access'],providers.map(([brand,name],i)=>{
        const x=280+i*290;
        return box('provider-'+brand,x,615,270,112,mark(brand,x+68,626,134,48)+t(x+135,709,name,28),mode!=='bof');
      }).join(''))),
      'openQSE architecture: applications, orchestration, MPI and compilers, QPM and QRI with QRMI and QDMI, and five QDMI device implementations',mode==='bof'?600:760)}
      </div>`;
  }
  function stack(opening,focus) {
    return `<div class="focused-stack focus-${focus}">${opening.render('detail',3,1)}</div>`;
  }
  function qriIntro() {
    const config = (name, body) => `<section class="qri-config"><h3>${name}</h3><pre>${body}</pre></section>`;
    return `<div class="qri-intro"><div class="qri-main-flow"><div class="talk-card"><h3>Quantum Platform Manager · QPM</h3><p>Describes one or more quantum resources and publishes them through the directory service.</p><p>Services for SDK clients, telemetry, schedulers and admission control.</p></div><div class="qri-down">↓</div><div class="talk-card qri-capabilities"><h3>Quantum Resource Interface · QRI</h3><p>Unified capabilities · Normalized data</p><div>${['run_circuit','get_device_info','get_coupling_graph','get_task_timing'].map(x=>`<code>${x}</code>`).join('')}</div></div><div class="qri-down">↓</div><div class="qri-adapters"><b>QRMI</b><span>or</span>${img('qdmi')}</div></div><div class="qri-intro-copy"><p>Resource configuration selects the query preference and execution owner.</p>${config('IBM Cloud · selected configuration fields',`resource-type: IBMQiskitRuntimeService
libraries: [qrmi, qdmi]
preference: qrmi
execution-owner: qrmi
caps:
  run_circuit: [qrmi, qdmi]
  get_backend_info: [qrmi, qdmi]
  get_task_timing: [qrmi, qdmi]`)}${config('IQM · selected configuration fields',`provider: iqm
provider-device-id: default
libraries: [qrmi, qdmi]
preference: qdmi
execution-owner: qdmi
caps:
  run_circuit: [qrmi, qdmi]
  get_task_timing: [qrmi, qdmi]`)}</div></div>`;
  }
  function qri() {
    const logos = items => `<div class="qri-provider-row">${items.map(([b,n])=>`<div>${b?img(b):`<b>${n}</b>`}</div>`).join('')}</div>`;
    return `<div class="qri-overview"><div class="qri-client">Applications · Workflow Engines · Schedulers</div><div class="qri-stem"></div><div class="qri-contract"><b>QPM → QRI</b><span>One resource-facing integration in openQSE</span></div><div class="qri-implementations"><section>${img('qdmi')}<h3>Quantum Device<br>Management Interface</h3><p>C interfaces · Typed properties<br>Sessions, devices and jobs</p>${logos(providers)}</section><section><div class="qrmi-wordmark">QRMI</div><h3>Quantum Resource<br>Management Interface</h3><p>Rust · C, Python, Lua and Go bindings<br>Resource traits and adapters</p>${logos([['iqm','IQM'],['ibm','IBM'],['pasqal','Pasqal'],['alice-bob','Alice & Bob'],['oqtopus','OQTOPUS'],[null,'Maestro Local']])}</section></div></div>`;
  }
  function qrmiOverview() {
    return `<div class="qrmi-overview"><div class="qrmi-clients">${[
      ['Workload Manager Plugins','Slurm · PBS · IBM LSF<br>OCS Grid Engine · Flux'],['Quantum SDKs','Qiskit · Pasqal Pulser<br>Qoro Quantum DIVI'],['Workflow Managers','Prefect · Parsl · Snakemake<br><small>In development</small>']
    ].map(([h,p])=>card(h,p)).join('')}</div><section class="qrmi-library"><header><b>QRMI</b><span>Thin, vendor-agnostic resource control library · Rust</span></header><div class="qrmi-bindings">${['Rust','C','Python','Lua','Go'].map(x=>`<span>${x}</span>`).join('')}</div><div class="qrmi-functions">${['Discover Resources','Acquire Resources','Run Tasks','Accounting and Metrics'].map(x=>`<div>${x}</div>`).join('')}</div><div class="qrmi-backends">${[
      ['ibm','Cloud','Production'],['ibm','On-Premise','Production'],['pasqal','Cloud','Production'],['pasqal','On-Premise','Production'],['alice-bob','Felis','Production'],['iqm','Cloud · ORNL','Evaluation'],['oqtopus','Fujitsu · U Osaka','In Development']
    ].map(([b,n,status])=>`<div>${img(b)}<b>${n}</b><span>${status}</span></div>`).join('')}</div></section><div class="qrmi-community"><b>21 organizations</b><span>National labs · HPC institutions · Vendors</span><span>Production in Italy, Spain, the UK and the US</span></div><div class="source-row">${ref('https://github.com/qiskit-community/qrmi','QRMI · Apache 2.0 · Open for Contributions')}${ref('https://arxiv.org/abs/2506.10052','Resource Management Systems')}${ref('https://arxiv.org/abs/2607.19591','Quantum–HPC Integration')}</div></div>`;
  }
  function integrationChanges(kind) {
    const qrmi=kind==='qrmi';
    const row=(key,name,body,links)=>`<section class="integration-change"><h3><b>${key}</b>${name}</h3><p>${body}</p><div>${links.map(([repo,n])=>ref(`https://github.com/openQSE/${repo}/pull/${n}`,`${repo} #${n}`)).join('')}</div></section>`;
    const changes=qrmi?[
      ['A','Deploy and Configure','Start qsa-sim (IBMQuantumSystem) and S3; deploy site QPM; configure Slurm plugins and resources.',[]],
      ['B','Exercise IBM Circuits','Example circuits run through QFwBackend and the site QPM.',[]],
      ['C · D · E','Serialize Native Programs','Provider defaults: IBM QPY + GZIP across the backend, RPC transport and driver.',[]],
      ['C · E','Pass Execution Options','Forward param_values and compilation_options; accept already-compiled circuits.',[]],
      ['E','Extend Resource Capabilities','Refactor QRMI drivers; add providers and IBMQuantumSystem.',[]],
      ['F','Normalize IBM Results','New qhw-ibm API translates device payloads into shared qhw-data schemas.',[]]
    ]:[
      ['A','Deploy Released Libraries','Install the same released interfaces and provider libraries in the Slurm cluster.',[['QFw-SLURM-Cluster',36],['QFw-SLURM-Cluster',56]]],
      ['B','Use the MQT Core Adapter','Share device discovery, compilation and result conversion through the Qiskit adapter.',[['QFw',147]]],
      ['C','Reuse Provider Adapters','Use the released provider Qiskit adapters in QFw.',[['QFw',209]]],
      ['D','Extend Device Access','Add Amazon Braket, IBM Quantum and Pasqal QDMI routes alongside IQM.',[['QFw',114],['QFw',156],['QFw',182]]],
      ['E','Handle IQM Star Systems','Name the computational resonator and preserve the MOVE-aware transpilation path.',[['QFw',199]]],
      ['F','Configure Both Interfaces','Expose Pasqal through QRMI and QDMI in the same resource configuration.',[['QFw-SLURM-Cluster',83]]]
    ];
    return `<div class="integration-overview"><div class="integration-chain"><div><div class="integration-client-logo">${img('qiskit')}<span>Qiskit</span></div><b>QFwBackend</b></div><span>→</span><div><b>QFw Runtime</b><small>DEFw RPC transport</small></div><span>→</span><section class="integration-cluster"><header>QFw-SLURM-Cluster</header><div><b>QPM</b><span>→</span>${qrmi?'<b>QRMI</b>':img('qdmi')}</div><small>${qrmi?'qsa-sim · IBMQuantumSystem · S3':'Released provider libraries · Device configuration'}</small></section></div><div class="integration-data">${qrmi?`<span>IBM results</span><b>→</b><span>qhw-ibm normalizer</span><b>→</b><span>qhw-data</span>`:providers.map(([brand])=>img(brand)).join('')}</div><div class="integration-changes">${changes.map(x=>row(...x)).join('')}</div></div>`;
  }
  window.MQSC_AWS_BOOTH = {
    partner: mode==='iqm' ? 'iqm' : 'openqse',
    register(ctx) {
      const {add,opening,heading,compilationScene,applicationScene,applicationHeading,hybridExecution,quantumPlayback}=ctx, sc=window.SC26;
      const architectureSlide=()=>add('reference','openQSE · Reference Architecture','Compilation and Resource Interfaces',0,()=>heading('Compilation and Resource Interfaces')+architecture());
      const compilerSlide=()=>add('routing',mode==='iqm'?'MQT Core · Device-Aware Compilation':'OpenQSE · Device-aware Compilation with MQT Core','From Program to Native Gates',8,
        (s,p)=>`<div class="compiler-heading">${heading('From Program to Native Gates')}${(mode==='compiler'||mode==='doe')?resource('core-repo','github.com/munich-quantum-toolkit/core','MQT Core'):''}</div>`+compilationScene(Math.min(s,6),p??1,Math.max(0,s-6)),
        {4:{duration:4500,transition:700}});
      const chapter=(id,section,title,kind)=>add(id,section,title,0,(s,p)=>heading(title)+sc.workflowIntro(p??1,kind),{0:{duration:6500/1.5,transition:350}});
      if(mode==='iqm') {
        add('title','SC26 · Chicago · 15–20 November 2026','Practical HPCQC Integration with QDMI',0,()=>sc.title().replace('TUM CDA','TUM').replace(A['tum-cda'],A.tum).replace('alt="TUM-CDA"','alt="TUM"'));
        for(const [key,title] of [['problem','Connecting the Quantum Ecosystem'],['stack','A Shared Software Stack'],['detail','The MQSC Approach: From the Metal to the User']]) {
          add(key,'01 · System Software',title,opening.phases[key].length-1,(s,p)=>opening.render(key,s,p??1),opening.playbacks[key]);
        }
        add('qdmi-interface','02 · The Device Interface','The Quantum Device Management Interface',4,(s,p)=>s<4?sc.qdmi(s,p??1):sc.iqm(0,p??1),{0:{duration:1600,transition:500},1:{duration:2600},2:{duration:3200},3:{duration:4200},4:{duration:2400,transition:350}});
        chapter('hybrid-chapter','04 · Computational Chemistry · QC-AFQMC','A Classical–Quantum Workflow','hybrid');
        add('hybrid-algorithm','04 · Computational Chemistry · QC-AFQMC','Quantum-Classical Auxiliary-Field Quantum Monte Carlo',2,(s,p)=>applicationHeading()+applicationScene(s,p??1),{0:{duration:2200,transition:700},1:{duration:3000,transition:700},2:{duration:3500,transition:700}});
        add('afqmc-execution','04 · Computational Chemistry · QC-AFQMC','Quantum-Classical Auxiliary-Field Quantum Monte Carlo',3,(s,p)=>applicationHeading()+hybridExecution(s,p??1),{1:{duration:6500/1.5,transition:0},2:{...quantumPlayback,duration:quantumPlayback.duration/1.5},3:{duration:6000/1.5,transition:500}});
        chapter('compile-chapter','05 · Compilation','From Quantum Program to Executable','compiler');
        compilerSlide();
        chapter('slurm-chapter','06 · Try It on a Cluster','From a Workflow to a Cluster','hpc');
        add('slurm-playground','06 · Try It on a Cluster','Explore HPCQC Integration with Slurm',4,(s,p)=>sc.slurm(s,p??1),{1:{duration:6500},2:{duration:7000},3:{duration:6500}});
        add('conclusion','SC26 · Practical HPCQC Integration','From Interface to Integration',0,sc.conclusion);
      } else if(mode==='doe') {
        add('title','SC26 · openQSE Demo','From Architecture to Executable Programs',0,()=>title('From Architecture<br>to Executable Programs','Compilation and Resource Interfaces in openQSE'));
        architectureSlide();
        add('qdmi','openQSE · Device Access','The Quantum Device Management Interface',0,()=>sc.qdmi(0,1));
        compilerSlide();
      } else if(mode==='bof') {
        add('title','SC26 · openQSE BoF · Resource Interface WG','Making Resource Interfaces Work Together',0,()=>title('Making Resource Interfaces<br>Work Together','QRI integration across QDMI and QRMI'));
        architectureSlide();
        add('qri-intro','openQSE · Quantum Resource Interface','Unified Capabilities, Normalized Data',0,()=>heading('Unified Capabilities, Normalized Data')+qriIntro());
        add('qri','openQSE · Resource Integration','One Workflow, Two Resource-Interface Paths',0,()=>heading('One Workflow, Two Resource-Interface Paths')+qri());
        add('qrmi-overview','openQSE · QRMI','Quantum Resource Management Interface',0,()=>heading('Quantum Resource Management Interface')+qrmiOverview());
        add('qrmi-changes','openQSE · QRMI Integration','Connecting IBM On-Premise Systems through QRMI',0,()=>heading('Connecting IBM On-Premise Systems through QRMI')+integrationChanges('qrmi'));
        add('qdmi-changes','openQSE · QDMI Integration','From Provider Libraries to Scheduled Quantum Jobs',0,()=>heading('From Provider Libraries to Scheduled Quantum Jobs')+integrationChanges('qdmi'));
      } else {
        add('compiler-stack','openQSE · Compiler Working Group','From the Metal to the User',0,()=>stack(opening,'compiler'));
        compilerSlide();
      }
    }
  };
}
