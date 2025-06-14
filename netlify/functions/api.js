import y from"express";import{createServer as k}from"http";var m=class{users;projects;generations;currentUserId;currentProjectId;currentGenerationId;constructor(){this.users=new Map,this.projects=new Map,this.generations=new Map,this.currentUserId=1,this.currentProjectId=1,this.currentGenerationId=1}async getUser(n){return this.users.get(n)}async getUserByUsername(n){return Array.from(this.users.values()).find(o=>o.username===n)}async createUser(n){let o=this.currentUserId++,e={...n,id:o};return this.users.set(o,e),e}async getProject(n){return this.projects.get(n)}async getProjectsByUserId(n){return Array.from(this.projects.values()).filter(o=>o.userId===n)}async createProject(n){let o=this.currentProjectId++,e=new Date,t={...n,id:o,createdAt:e,updatedAt:e,output:null,content:n.content||null,settings:n.settings||null,status:n.status||"idle",duration:n.duration||null,quality:n.quality||null,genre:n.genre||null,userId:n.userId??null};return this.projects.set(o,t),t}async updateProject(n,o){let e=this.projects.get(n);if(!e)return;let t={...e,...o,updatedAt:new Date};return this.projects.set(n,t),t}async deleteProject(n){return this.projects.delete(n)}async getGeneration(n){return this.generations.get(n)}async getGenerationsByProjectId(n){return Array.from(this.generations.values()).filter(o=>o.projectId===n)}async createGeneration(n){let o=this.currentGenerationId++,e={...n,id:o,createdAt:new Date,result:n.result||null,status:n.status||"pending",duration:n.duration||null,projectId:n.projectId||null};return this.generations.set(o,e),e}async updateGeneration(n,o){let e=this.generations.get(n);if(!e)return;let t={...e,...o};return this.generations.set(n,t),t}},s=new m;import{pgTable as f,serial as w,text as u,timestamp as p,jsonb as g,integer as P}from"drizzle-orm/pg-core";import{createInsertSchema as x}from"drizzle-zod";var j=f("projects",{id:w("id").primaryKey(),name:u("name").notNull(),type:u("type").notNull(),content:g("content"),settings:g("settings"),duration:P("duration"),quality:u("quality"),genre:u("genre"),createdAt:p("created_at").defaultNow().notNull(),updatedAt:p("updated_at").defaultNow().notNull()}),U=f("generations",{id:w("id").primaryKey(),projectId:P("project_id").references(()=>j.id),type:u("type").notNull(),status:u("status").notNull().default("pending"),result:g("result"),error:u("error"),createdAt:p("created_at").defaultNow().notNull(),completedAt:p("completed_at")}),v=x(j).omit({id:!0,createdAt:!0,updatedAt:!0}),T=x(U).omit({id:!0,createdAt:!0,completedAt:!0});import O from"openai";var d=null;process.env.OPENAI_API_KEY?d=new O({apiKey:process.env.OPENAI_API_KEY,timeout:6e4,maxRetries:3}):console.warn("OpenAI API key not configured. AI features will be limited.");async function I(r){try{if(!d)throw new Error("OpenAI API key not configured. Please provide an API key to use AI features.");let n=`Create a professional ${r.quality} quality cinematic video production plan for unlimited creation:

Script: ${r.script}
Duration: ${r.duration} seconds
Quality: ${r.quality} (8K/4K/IMAX/HD)
AI Model: ${r.aiModel}
Audio Enhancement: ${r.audioEnhancement} (Dolby Atmos/DTS:X/Surround/Stereo)

Generate a comprehensive movie production plan with:
1. Detailed scene breakdown with precise timing
2. Professional cinematography techniques
3. Advanced visual effects and color grading
4. Audio design and music composition
5. Technical specifications for unlimited rendering

Respond in JSON format with:
{
  "scenes": [
    {
      "title": "Scene name",
      "description": "Detailed scene description",
      "duration": seconds,
      "visualStyle": "Cinematography style",
      "cameraWork": "Camera techniques"
    }
  ],
  "visualEffects": "VFX details",
  "colorGrading": "Color treatment",
  "audioDesign": "Sound design approach",
  "musicComposition": "Music style and instrumentation",
  "technicalSpecs": {
    "resolution": "${r.quality}",
    "frameRate": "fps",
    "colorSpace": "color profile",
    "audioChannels": "audio configuration"
  }
}`,o=await d.chat.completions.create({model:"gpt-4o",messages:[{role:"user",content:n}],response_format:{type:"json_object"}}),e=JSON.parse(o.choices[0].message.content||"{}");return{videoUrl:`/api/generated/movie_${r.quality}_${Date.now()}.mp4`,audioUrl:`/api/generated/audio_${r.audioEnhancement}_${Date.now()}.wav`,thumbnailUrl:`/api/generated/thumb_${Date.now()}.jpg`,duration:r.duration,quality:r.quality,audioEnhancement:r.audioEnhancement,scenes:e.scenes||[{title:"Opening Sequence",description:"Cinematic establishing shot with professional lighting and composition",duration:Math.floor(r.duration*.25),visualStyle:"Wide-angle cinematic with depth of field",cameraWork:"Smooth tracking shot with crane movement"},{title:"Main Content",description:"Core narrative with dynamic storytelling and visual effects",duration:Math.floor(r.duration*.5),visualStyle:"Dynamic multi-angle coverage with color grading",cameraWork:"Handheld and steadicam for emotional impact"},{title:"Climax",description:"High-impact sequence with advanced visual effects",duration:Math.floor(r.duration*.15),visualStyle:"High-contrast dramatic lighting",cameraWork:"Quick cuts and close-ups for intensity"},{title:"Resolution",description:"Satisfying conclusion with fade transitions",duration:Math.floor(r.duration*.1),visualStyle:"Soft lighting with warm color palette",cameraWork:"Slow push-in and fade to black"}],metadata:e}}catch(n){throw new Error(`Failed to generate movie: ${n instanceof Error?n.message:"Unknown error"}`)}}async function b(r){try{if(!d)throw new Error("OpenAI API key not configured. Please provide an API key to use AI features.");let n=`Create a professional music production plan for unlimited creation with ${r.audioMastering} mastering:

Lyrics: ${r.lyrics}
Style: ${r.style}
Audio Mastering: ${r.audioMastering} (Professional/Studio/Broadcast/Dolby Atmos)
AI Model: ${r.aiModel}

Generate a comprehensive music production plan with:
1. Detailed song structure with precise timing
2. Professional instrumentation for each section
3. Advanced production techniques and effects
4. High-quality mixing and mastering specifications
5. Technical audio specifications for unlimited rendering

Respond in JSON format with:
{
  "structure": [
    {
      "section": "Intro/Verse/Chorus/Bridge/Outro",
      "duration": seconds,
      "description": "Musical content description",
      "instrumentation": ["instrument1", "instrument2"]
    }
  ],
  "bpm": number,
  "key": "musical key",
  "timeSignature": "4/4",
  "productionTechniques": "Advanced techniques",
  "mixingApproach": "Professional mixing strategy",
  "masteringSpecs": "Mastering specifications",
  "audioEffects": "Effects chain details"
}`,o=await d.chat.completions.create({model:"gpt-4o",messages:[{role:"user",content:n}],response_format:{type:"json_object"}}),e=JSON.parse(o.choices[0].message.content||"{}"),t=240,i=400,c=Array.from({length:i},(a,E)=>{let h=E/i*t,G=40+Math.sin(h*.1)*20,C=Math.sin(h*2)*10+Math.random()*5;return Math.max(0,Math.min(100,G+C))});return{audioUrl:`/api/generated/music_${r.style}_${r.audioMastering}_${Date.now()}.wav`,waveformData:c,duration:t,style:r.style,audioMastering:r.audioMastering,structure:e.structure||[{section:"Intro",duration:16,description:"Atmospheric build-up with signature sound",instrumentation:["Piano","Strings","Subtle Percussion"]},{section:"Verse 1",duration:32,description:"Main melodic content with vocals",instrumentation:["Vocals","Guitar","Bass","Drums"]},{section:"Chorus",duration:24,description:"High-energy hook with full arrangement",instrumentation:["Lead Vocals","Harmony","Full Band","Synth Pads"]},{section:"Verse 2",duration:32,description:"Continued narrative with added elements",instrumentation:["Vocals","Guitar","Bass","Drums","Strings"]},{section:"Chorus",duration:24,description:"Repeated hook with variations",instrumentation:["Lead Vocals","Harmony","Full Band","Brass Section"]},{section:"Bridge",duration:32,description:"Musical contrast and emotional peak",instrumentation:["Solo Instrument","Minimal Backing","Building Elements"]},{section:"Final Chorus",duration:32,description:"Climactic version with all elements",instrumentation:["Full Ensemble","Choir","Orchestra","Electronic Elements"]},{section:"Outro",duration:24,description:"Satisfying conclusion with fade",instrumentation:["Piano","Strings","Ambient Textures"]}],technicalSpecs:{bpm:e.bpm||120,key:e.key||"C Major",timeSignature:e.timeSignature||"4/4",sampleRate:"96kHz/24bit"},metadata:e}}catch(n){throw new Error(`Failed to generate music: ${n instanceof Error?n.message:"Unknown error"}`)}}async function A(r){try{let n="";if(r.type==="youtube"){let t=D(r.content);n=`Analyze this YouTube video URL: ${r.content}

Based on the URL structure and video ID (${t}), provide a comprehensive professional analysis including:

1. Video Content Analysis:
   - Estimated content type and genre
   - Probable audience and demographics
   - Content quality assessment
   - Production value estimation

2. Technical Analysis:
   - Video format and quality indicators
   - Estimated duration category
   - Platform optimization analysis

3. AI Enhancement Recommendations:
   - Suggestions for similar content creation
   - Production improvements
   - Content optimization strategies
   - AI-assisted enhancement opportunities

4. Mood and Engagement Analysis:
   - Emotional tone assessment (1-10 scale)
   - Engagement potential rating
   - Viral potential analysis

Respond in JSON format:
{
  "mood": {
    "rating": number,
    "confidence": number,
    "description": "detailed mood analysis"
  },
  "genre": "content genre classification",
  "complexity": number,
  "suggestions": ["AI enhancement suggestions", "content improvement ideas"],
  "insights": {
    "contentType": "video type analysis",
    "audienceTarget": "target demographic",
    "productionQuality": "quality assessment",
    "engagementFactors": ["engagement elements"]
  },
  "videoInfo": {
    "title": "estimated content title",
    "estimatedDuration": "duration estimate",
    "contentType": "content category",
    "qualityAnalysis": "quality assessment"
  }
}`}else n=`Analyze the following ${r.type} content:

Content: ${r.content}

Please provide a comprehensive analysis including:
1. Mood analysis (rating 1-10, confidence 0-1, description)
2. Genre classification
3. Complexity score (1-10)
4. Creative suggestions for improvement
5. Technical insights

Respond in JSON format with the following structure:
{
  "mood": {
    "rating": number,
    "confidence": number,
    "description": "..."
  },
  "genre": "...",
  "complexity": number,
  "suggestions": [...],
  "insights": {...}
}`;if(!d)throw new Error("OpenAI API key not configured. Please provide an API key to use AI features.");let o=await d.chat.completions.create({model:"gpt-4o",messages:[{role:"user",content:n}],response_format:{type:"json_object"}}),e=JSON.parse(o.choices[0].message.content||"{}");return{mood:{rating:Math.max(1,Math.min(10,e.mood?.rating||7)),confidence:Math.max(0,Math.min(1,e.mood?.confidence||.85)),description:e.mood?.description||"Professional content analysis completed"},genre:e.genre||"Digital Content",complexity:Math.max(1,Math.min(10,e.complexity||6)),suggestions:e.suggestions||["Consider AI-enhanced video production techniques","Optimize content for multi-platform distribution","Implement advanced audio processing"],insights:e.insights||{contentType:"Digital media content",analysisMethod:"AI-powered content analysis"},videoInfo:e.videoInfo}}catch(n){throw new Error(`Failed to analyze content: ${n instanceof Error?n.message:"Unknown error"}`)}}function D(r){let n=/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,o=r.match(n);return o?o[1]:"unknown"}async function S(r){try{if(!process.env.OPENAI_API_KEY)throw new Error("OpenAI API key not configured");if(!d)throw new Error("OpenAI API key not configured. Please provide an API key to use AI features.");let n=await d.audio.speech.create({model:"tts-1-hd",voice:r.voice||"alloy",input:r.text,speed:parseFloat(r.speed)||1}),o=Buffer.from(await n.arrayBuffer()),e=`/api/generated/voice_${Date.now()}.mp3`,t=r.text.split(" ").length,i=150,c=parseFloat(r.speed)||1,a=Math.max(t/i*60/c,1);return{audioUrl:e,duration:a,transcript:r.text,technicalSpecs:{format:"MP3",quality:"HD",sampleRate:"22kHz",channels:"Mono"}}}catch(n){throw new Error(`Failed to generate voice: ${n instanceof Error?n.message:"Unknown error"}`)}}async function M(r){return r.get("/api/projects",async(o,e)=>{try{let t=await s.getProjectsByUserId(1);e.json(t)}catch(t){e.status(500).json({error:t instanceof Error?t.message:"Unknown error"})}}),r.post("/api/projects",async(o,e)=>{try{let t=v.parse(o.body),i=await s.createProject({...t,userId:1});e.json(i)}catch(t){e.status(400).json({error:t.message})}}),r.get("/api/projects/:id",async(o,e)=>{try{let t=parseInt(o.params.id),i=await s.getProject(t);if(!i)return e.status(404).json({error:"Project not found"});e.json(i)}catch(t){e.status(500).json({error:t.message})}}),r.patch("/api/projects/:id",async(o,e)=>{try{let t=parseInt(o.params.id),i=o.body,c=await s.updateProject(t,i);if(!c)return e.status(404).json({error:"Project not found"});e.json(c)}catch(t){e.status(500).json({error:t.message})}}),r.post("/api/generate/movie",async(o,e)=>{try{let{projectId:t,...i}=o.body;await s.updateProject(t,{status:"processing"});let c=await s.createGeneration({projectId:t,type:"movie",prompt:i.script,status:"processing"}),a=await I(i);await s.updateGeneration(c.id,{result:a,status:"completed",duration:a.duration}),await s.updateProject(t,{status:"completed",output:a}),e.json(a)}catch(t){e.status(500).json({error:t.message})}}),r.post("/api/generate/music",async(o,e)=>{try{let{projectId:t,...i}=o.body;await s.updateProject(t,{status:"processing"});let c=await s.createGeneration({projectId:t,type:"music",prompt:i.lyrics,status:"processing"}),a=await b(i);await s.updateGeneration(c.id,{result:a,status:"completed",duration:a.duration}),await s.updateProject(t,{status:"completed",output:a}),e.json(a)}catch(t){e.status(500).json({error:t.message})}}),r.post("/api/analyze",async(o,e)=>{try{let t=o.body,i=await A(t);e.json(i)}catch(t){e.status(500).json({error:t.message})}}),r.post("/api/generate/voice",async(o,e)=>{try{let{projectId:t,...i}=o.body;await s.updateProject(t,{status:"processing"});let c=await s.createGeneration({projectId:t,type:"voice",prompt:i.text,status:"processing"}),a=await S(i);await s.updateGeneration(c.id,{result:a,status:"completed",duration:a.duration}),await s.updateProject(t,{status:"completed",output:a}),e.json(a)}catch(t){e.status(500).json({error:t.message})}}),r.get("/api/projects/:id/generations",async(o,e)=>{try{let t=parseInt(o.params.id),i=await s.getGenerationsByProjectId(t);e.json(i)}catch(t){e.status(500).json({error:t.message})}}),r.get("/api/generated/:filename",(o,e)=>{let t=o.params.filename,i="application/octet-stream";if(t.endsWith(".mp4")?i="video/mp4":t.endsWith(".wav")||t.endsWith(".mp3")?i="audio/mpeg":(t.endsWith(".jpg")||t.endsWith(".jpeg"))&&(i="image/jpeg"),e.setHeader("Content-Type",i),e.setHeader("Content-Length","1024"),e.setHeader("Accept-Ranges","bytes"),t.endsWith(".mp4")){let c=Buffer.from([0,0,0,32,102,116,121,112,105,115,111,109,0,0,2,0,105,115,111,109,105,115,111,50,97,118,99,49,109,112,52,49]);e.end(c)}else if(t.endsWith(".wav")){let c=Buffer.from([82,73,70,70,36,8,0,0,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,34,86,0,0,136,88,1,0]);e.end(c)}else e.end(Buffer.alloc(1024,0))}),k(r)}import R from"serverless-http";var l=y();l.use(y.json({limit:"50mb"}));l.use(y.urlencoded({extended:!0,limit:"50mb"}));l.use((r,n,o)=>{let e=r.headers.origin;["https://astonishing-gelato-055adf.netlify.app","http://localhost:5000","http://localhost:3000"].includes(e)?n.header("Access-Control-Allow-Origin",e):n.header("Access-Control-Allow-Origin","*"),n.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS"),n.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization"),n.header("Access-Control-Allow-Credentials","true"),r.method==="OPTIONS"?n.sendStatus(200):o()});process.env.NODE_ENV||(process.env.NODE_ENV="production");M(l);var $=R(l),Z=async(r,n)=>{try{n.callbackWaitsForEmptyEventLoop=!1;let o={...r,path:r.path.replace(/^\/\.netlify\/functions\/api/,"")||"/",headers:{...r.headers,host:"localhost:5000"}};console.log(`${o.httpMethod} ${o.path}`);let t=await $(o,n);return t.headers||(t.headers={}),t.headers["X-Content-Type-Options"]="nosniff",t.headers["X-Frame-Options"]="DENY",t.headers["Referrer-Policy"]="strict-origin-when-cross-origin",t}catch(o){return console.error("Netlify function error:",o),{statusCode:500,body:JSON.stringify({error:"Internal server error",message:o instanceof Error?o.message:"Unknown error",timestamp:new Date().toISOString()}),headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","X-Content-Type-Options":"nosniff"}}}};export{Z as handler};
