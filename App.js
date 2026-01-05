import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Radio, Activity, ArrowUp, Zap, Video, Eye, Sun, Moon, Telescope, Disc, Info, RefreshCw, Globe, Volume2, Image as ImageIcon, ChevronRight, Signal, Search, XCircle, CheckCircle, Star, Terminal, Cpu, Code, Layers, ExternalLink, CheckSquare, Award } from 'lucide-react';

const MAA_App = () => {
  const [activeTab, setActiveTab] = useState('lunar_link');
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState(["System Initialized.", "Deep Space Network (DSN) Standing by..."]);
  const [audioContext, setAudioContext] = useState(null);
  const oscillatorRef = useRef(null);
  
  // Telescope Data State
  const [currentFeed, setCurrentFeed] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);

  // DEEP SPACE DATABASE (No Solar System Objects)
  const satelliteDb = [
    { id: "JWST-NIRCAM-01", name: "James Webb (NIRCam)", target: "Carina Nebula", type: "Optical/IR", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/03-NIRCAM_Image_of_the_Carina_Nebula.jpg/1280px-03-NIRCAM_Image_of_the_Carina_Nebula.jpg", desc: "The 'Cosmic Cliffs' of NGC 3324. A star-forming region in the Carina Nebula." },
    { id: "JWST-MIRI-04", name: "James Webb (MIRI)", target: "Stephan's Quintet", type: "Mid-Infrared", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Stephan%27s_Quintet_NIRCam_and_MIRI_Imaging.jpg/1024px-Stephan%27s_Quintet_NIRCam_and_MIRI_Imaging.jpg", desc: "Five galaxies locked in a cosmic dance of repeated close encounters." },
    { id: "JWST-SMACS-0723", name: "James Webb (Deep Field)", target: "SMACS 0723", type: "Deep Field", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Main_image_deep_field_smacs0723-5MB.jpg/1280px-Main_image_deep_field_smacs0723-5MB.jpg", desc: "The deepest and sharpest infrared image of the distant universe to date." },
    { id: "JWST-TARANTULA", name: "James Webb (NIRCam)", target: "Tarantula Nebula", type: "Infrared", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_Tarantula_Nebula_captured_by_JWST.jpg/1024px-The_Tarantula_Nebula_captured_by_JWST.jpg", desc: "Star-forming region 30 Doradus, home to the hottest, most massive stars known." },
    { id: "JWST-S-RING", name: "James Webb (NIRCAM)", target: "Southern Ring Nebula", type: "Near-IR", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Southern_Ring_Nebula_NIRCam.jpg/1024px-Southern_Ring_Nebula_NIRCam.jpg", desc: "A dying star cloaked in dust, expelling shells of gas and dust." },
    { id: "JWST-PHANTOM", name: "James Webb (MIRI)", target: "Phantom Galaxy (M74)", type: "Mid-IR", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/M74_Webb_Judy_Schmidt.jpg/1024px-M74_Webb_Judy_Schmidt.jpg", desc: "A grand design spiral galaxy with clearly defined spiral arms." },
    { id: "HST-PILLARS", name: "Hubble Space Telescope", target: "Pillars of Creation", type: "Visible Light", url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Eagle_Nebula_Pillars_of_Creation.jpg", desc: "Iconic towering columns of gas and dust in the Eagle Nebula (M16)." },
    { id: "HST-SOMBRERO", name: "Hubble Space Telescope", target: "Sombrero Galaxy (M104)", type: "Optical", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/1280px-M104_ngc4594_sombrero_galaxy_hi-res.jpg", desc: "A galaxy in the constellation Virgo with a bright nucleus and dust lane." },
    { id: "HST-BUTTERFLY", name: "Hubble WFC3", target: "Butterfly Nebula", type: "UV/Visible", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/NGC_6302_Hubble_2009.full.jpg/1280px-NGC_6302_Hubble_2009.full.jpg", desc: "Wings of gas heated to more than 36,000 degrees Fahrenheit tearing through space." },
    { id: "HST-BUBBLE", name: "Hubble Space Telescope", target: "Bubble Nebula (NGC 7635)", type: "Optical", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/NGC_7635_by_HST.jpg/1024px-NGC_7635_by_HST.jpg", desc: "An emission nebula located 8,000 light-years away in Cassiopeia." },
    { id: "ESA-EUCLID", name: "ESA Euclid", target: "Perseus Cluster", type: "VIS/NISP", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Euclid_first_images_-_Perseus_Cluster_%283%29.jpg/1280px-Euclid_first_images_-_Perseus_Cluster_%283%29.jpg", desc: "A massive structure of thousands of galaxies, mapping dark matter." },
    { id: "JAXA-AKARI", name: "JAXA Akari", target: "Large Magellanic Cloud", type: "Infrared", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LMC_Akari.jpg/1024px-LMC_Akari.jpg", desc: "Infrared survey of a satellite galaxy of the Milky Way." },
    { id: "EHT-M87", name: "Event Horizon Telescope", target: "M87* Black Hole", type: "Radio Interferometry", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/1024px-Black_hole_-_Messier_87_crop_max_res.jpg", desc: "The shadow of a supermassive black hole, 55 million light years away." },
    { id: "GALEX-ANDROMEDA", name: "GALEX", target: "Andromeda Galaxy", type: "Ultraviolet", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/M31_the_Andromeda_Galaxy_NOW.jpg/1280px-M31_the_Andromeda_Galaxy_NOW.jpg", desc: "Ultraviolet view showing hot young stars in Andromeda's spiral arms." }
  ];

  // Real Moon Data State
  const [moonData, setMoonData] = useState({
    phase: 0,
    illumination: 0,
    age: 0,
    distance: 384400,
    name: 'Waxing Crescent'
  });

  const calculateMoonPhase = () => {
    const date = new Date();
    const synodic = 29.53058867;
    const baseDate = new Date('2000-01-06T18:14:00Z');
    const diff = date.getTime() - baseDate.getTime();
    const currentCycle = (diff / (24 * 60 * 60 * 1000) / synodic) % 1;
    const illumination = (1 - Math.abs(currentCycle - 0.5) * 2) * 100;
    
    let phaseName = 'New Moon';
    if (currentCycle < 0.03) phaseName = 'New Moon';
    else if (currentCycle < 0.22) phaseName = 'Waxing Crescent';
    else if (currentCycle < 0.28) phaseName = 'First Quarter';
    else if (currentCycle < 0.47) phaseName = 'Waxing Gibbous';
    else if (currentCycle < 0.53) phaseName = 'Full Moon';
    else if (currentCycle < 0.72) phaseName = 'Waning Gibbous';
    else if (currentCycle < 0.78) phaseName = 'Last Quarter';
    else if (currentCycle < 0.97) phaseName = 'Waning Crescent';

    setMoonData({
      phase: currentCycle,
      illumination: illumination,
      age: currentCycle * synodic,
      distance: 384400 + (Math.cos(currentCycle * 2 * Math.PI) * 20000), 
      name: phaseName
    });
  };

  useEffect(() => {
    calculateMoonPhase();
    const interval = setInterval(calculateMoonPhase, 60000); 
    return () => clearInterval(interval);
  }, []);

  const findWorkingFeed = (startIndex) => {
    setIsScanning(true);
    setCurrentFeed(null); 
    addLog(`SCAN: Initializing Deep Space Scan from Sector ${startIndex}...`);

    let checkIndex = startIndex;
    let attempts = 0;
    const safetyLimit = 500; 

    const scanLoop = () => {
      if (attempts >= safetyLimit) {
        addLog("SCAN_TIMEOUT: Network congested. Retrying...");
        attempts = 0; 
      }

      const actualIndex = checkIndex % satelliteDb.length;
      const satellite = satelliteDb[actualIndex];

      setTimeout(() => {
        const signalQuality = Math.random();
        if (signalQuality > 0.4) {
           addLog(`SIGNAL_LOCK: ${satellite.id} [${satellite.name}] - Data Stream Active`);
           setCurrentFeed(satellite);
           setIsScanning(false);
           setScanIndex(actualIndex + 1); 
        } else {
           if (attempts % 4 === 0) addLog(`SEARCHING: Skipping weak signal from ${satellite.id}...`);
           checkIndex++;
           attempts++;
           scanLoop(); 
        }
      }, 500); 
    };
    scanLoop();
  };

  const handleImageError = () => {
      addLog(`ERR_IMG: Visual data corrupted for ${currentFeed?.id}. Rerouting scan...`);
      findWorkingFeed(scanIndex); 
  };

  const addLog = (msg) => {
    setLogs(prev => [`> ${new Date().toLocaleTimeString('en-GB')} : ${msg}`, ...prev].slice(0, 50));
  };

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      addLog("SYS: Link Terminated.");
      setCurrentFeed(null);
      stopTone();
    } else {
      setIsConnected(true);
      addLog("SYS: Deep Space Network Uplink Established.");
      if (activeTab === 'telescope' && !currentFeed) {
          findWorkingFeed(0);
      }
    }
  };

  const playTone = () => {
    if (!isConnected) return;
    if (audioContext) return; // Prevent multiple contexts

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(2200, ctx.currentTime); 
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime); 
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      setAudioContext(ctx);
      oscillatorRef.current = osc;
      addLog("AUDIO: High-Gain Antenna Test [ACTIVE]");
    } catch (e) {
      addLog("AUDIO_ERR: " + e.message);
    }
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    addLog("AUDIO: Test Signal [STOPPED]");
  };

  const toggleAudio = () => {
      if (audioContext) {
          stopTone();
      } else {
          playTone();
      }
  };

  const NavButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
          setActiveTab(id);
          if(id === 'telescope' && isConnected && !currentFeed && !isScanning) {
              findWorkingFeed(scanIndex);
          }
      }}
      className={`group flex flex-col md:flex-row items-center md:space-x-3 w-full p-3 rounded-lg transition-all border border-transparent ${
        activeTab === id 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700'
      }`}
    >
      <Icon size={20} className={activeTab === id ? "animate-pulse" : ""} />
      <span className="text-[10px] md:text-sm font-bold tracking-wider mt-1 md:mt-0">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#030303] text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Padauk:wght@400;700&display=swap');
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .font-sans { font-family: 'Rajdhani', sans-serif; }
        .font-burmese { font-family: 'Padauk', sans-serif; }
        .glass-panel { 
            background: rgba(10, 10, 15, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }
        .scanline {
            background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 51%);
            background-size: 100% 3px;
        }
        .moon-glow {
            box-shadow: 0 0 50px rgba(255, 255, 255, 0.1);
        }
        @keyframes scan-sweep {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .scanner-beam {
            position: absolute;
            left: 0;
            width: 100%;
            height: 20px;
            background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5), transparent);
            animation: scan-sweep 1.5s linear infinite;
        }
      `}</style>

      {/* Sidebar */}
      <aside className="md:w-64 border-b md:border-b-0 md:border-r border-slate-800/50 bg-[#050508] flex flex-row md:flex-col justify-between shrink-0 z-20">
        <div className="p-4 md:p-6 flex items-center gap-3 border-r md:border-r-0 md:border-b border-slate-800/50">
           <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
             <Rocket className="text-white" size={20} />
           </div>
           <div>
              <h1 className="font-bold text-white text-xl tracking-widest font-tech">MAA<span className="text-blue-500">_SAT</span></h1>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-[10px] text-slate-500 font-tech">{isConnected ? 'LINK_ACTIVE' : 'OFFLINE'}</span>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-2 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          <NavButton id="lunar_link" icon={Moon} label="LUNAR_ORBITER" />
          <NavButton id="telescope" icon={Telescope} label="DEEP_SPACE_EYES" />
          <NavButton id="telemetry" icon={Activity} label="SYSTEM_DATA" />
        </nav>

        <div className="p-4 hidden md:block border-t border-slate-800/50">
          <button 
            onClick={toggleConnection}
            className={`w-full py-3 rounded-sm font-bold text-sm tracking-widest transition-all border flex items-center justify-center gap-3 font-tech ${
                isConnected 
                ? 'bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/40' 
                : 'bg-green-600 hover:bg-green-500 text-white border-transparent shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            }`}
          >
            {isConnected ? 'CUT_FEED' : 'CONNECT_SAT'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col bg-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute inset-0 scanline pointer-events-none z-50 opacity-20"></div>
        
        <div className="relative z-10 flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
             <div>
                <h2 className="text-2xl font-bold text-white font-tech uppercase tracking-widest flex items-center gap-2">
                    {activeTab === 'lunar_link' && <><Disc size={24} className="text-slate-200"/> LUNAR_RECON_ORBITER</>}
                    {activeTab === 'telescope' && <><Telescope size={24} className="text-purple-500"/> DEEP_SPACE_SCANNER</>}
                    {activeTab === 'telemetry' && <><Activity size={24} className="text-blue-500"/> SATELLITE_HEALTH</>}
                </h2>
                <p className="text-xs text-slate-500 font-tech mt-1">
                    {activeTab === 'lunar_link' ? 'TARGET: THE_MOON // DIST: ~384,400 KM' : 'MODE: INTERSTELLAR_SURVEY'}
                </p>
             </div>
          </div>

          {/* LUNAR ORBITER TAB */}
          {activeTab === 'lunar_link' && (
             <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
                 {/* Main Visual */}
                 <div className="flex-1">
                    <div className="aspect-square md:aspect-video bg-black rounded-sm border border-slate-800 relative overflow-hidden flex items-center justify-center group">
                        {!isConnected ? (
                            <div className="text-center p-6">
                                <Moon size={48} className="text-slate-700 mx-auto mb-4 opacity-50" />
                                <h3 className="text-slate-500 font-tech tracking-widest">NO SIGNAL</h3>
                                <p className="text-slate-600 text-xs mt-2">ESTABLISH UPLINK TO RECEIVE LUNAR DATA</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] moon-glow rounded-full overflow-hidden transition-all duration-1000">
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" 
                                        alt="Moon" 
                                        className="w-full h-full object-cover filter grayscale contrast-125"
                                        style={{transform: 'rotate(-15deg)'}}
                                    />
                                    <div 
                                        className="absolute inset-0 bg-black transition-all duration-1000 mix-blend-multiply"
                                        style={{
                                            opacity: 0.85,
                                            transform: `translateX(${(moonData.phase - 0.5) * 200}%) blur(20px)`
                                        }}
                                    ></div>
                                </div>
                                
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-2 border-l-2 border-white">
                                    <div className="text-white font-tech text-lg">{moonData.name.toUpperCase()}</div>
                                    <div className="text-blue-400 font-tech text-xs">ILLUMINATION: {moonData.illumination.toFixed(1)}%</div>
                                </div>

                                <div className="absolute bottom-4 right-4 text-right">
                                     <div className="text-red-500 font-tech text-xs animate-pulse">● LIVE_SIMULATION</div>
                                     <div className="text-slate-500 font-tech text-[10px]">LRO_DATA_MODEL_V2</div>
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
                    </div>
                 </div>

                 {/* Side Data */}
                 <div className="w-full lg:w-80 space-y-4">
                     <div className="glass-panel p-4 border-t-2 border-t-blue-500">
                         <h3 className="text-slate-400 text-xs font-tech mb-2">ORBITAL TELEMETRY</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-[10px] text-slate-500 block">CURRENT DISTANCE</label>
                                 <span className="text-2xl text-white font-mono">{isConnected ? Math.round(moonData.distance).toLocaleString() : '---,---'}</span> <span className="text-xs text-slate-500">km</span>
                             </div>
                             <div>
                                 <label className="text-[10px] text-slate-500 block">LUNAR AGE</label>
                                 <span className="text-xl text-white font-mono">{isConnected ? moonData.age.toFixed(2) : '--.--'}</span> <span className="text-xs text-slate-500">days</span>
                             </div>
                         </div>
                     </div>
                     
                     <div className="glass-panel p-4 flex-1">
                        <h3 className="text-green-500 text-xs font-tech mb-2">{">>"} DATA_LOGS</h3>
                        <div className="text-[10px] font-mono text-slate-400 h-40 overflow-y-auto space-y-1 scrollbar-hide">
                            {logs.map((log, i) => <div key={i} className="border-b border-white/5 pb-1">{log}</div>)}
                        </div>
                     </div>
                 </div>
             </div>
          )}

          {/* TELESCOPE TAB (SCANNER) */}
          {activeTab === 'telescope' && (
              <div className="animate-fade-in max-w-5xl mx-auto">
                  {!isConnected ? (
                      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-lg">
                          <Telescope size={48} className="text-slate-600 mb-4" />
                          <p className="text-slate-400 font-tech">CONNECT SYSTEM TO INITIATE DEEP SPACE SCAN</p>
                      </div>
                  ) : (
                      <div className="space-y-6">
                          {isScanning ? (
                              <div className="h-96 flex flex-col items-center justify-center bg-slate-900/50 rounded border border-slate-800 relative overflow-hidden">
                                  <div className="scanner-beam"></div>
                                  <Search className="animate-pulse text-blue-500 mb-4" size={48} />
                                  <span className="text-white font-tech text-xl tracking-widest">SEARCHING DEEP SPACE...</span>
                                  <p className="text-slate-500 font-mono text-xs mt-2">SCANNING SECTOR {scanIndex + 1} // FILTERING SOLAR NOISE</p>
                                  
                                  {/* Fake scrolling satellite IDs */}
                                  <div className="mt-8 font-mono text-[10px] text-slate-600 opacity-50">
                                      PINGING: {satelliteDb[scanIndex % satelliteDb.length]?.id || "UNKNOWN"}...
                                  </div>
                              </div>
                          ) : currentFeed ? (
                              <>
                                <div className="relative group rounded-sm overflow-hidden border border-slate-700 bg-black">
                                    {/* Auto-skip on image error added here */}
                                    <img 
                                        src={currentFeed.url} 
                                        alt={currentFeed.name} 
                                        onError={handleImageError}
                                        className="w-full h-auto object-contain max-h-[70vh]" 
                                    />
                                    
                                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black via-black/50 to-transparent">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider animate-pulse flex items-center gap-1">
                                                <Signal size={10} /> SIGNAL LOCKED
                                            </div>
                                            <span className="text-white font-tech text-xs tracking-widest">{currentFeed.id}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Star size={12} className="text-yellow-500" fill="currentColor" />
                                                <span className="text-yellow-500 font-tech text-xs tracking-wider">DEEP SPACE OBJECT</span>
                                            </div>
                                            <h2 className="text-2xl md:text-4xl font-bold text-white font-tech mb-2">{currentFeed.target}</h2>
                                            <p className="text-blue-300 font-mono text-xs mb-1">SOURCE: {currentFeed.name} ({currentFeed.type})</p>
                                        </div>
                                    </div>
                                    
                                    {/* Manual Next Button */}
                                    <button 
                                      onClick={() => findWorkingFeed(scanIndex)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-500/30 transition-all border border-white/20 hover:scale-110 group-hover:opacity-100 opacity-80"
                                      title="Scan Next Frequency"
                                    >
                                      <ChevronRight size={32} className="text-white" />
                                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-tech text-blue-300 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border border-blue-500/30">NEXT FEED</span>
                                    </button>
                                </div>
                                <div className="glass-panel p-6 border-l-4 border-purple-500">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-bold font-tech text-lg mb-2">DECODED DATA PACKET</h3>
                                            <p className="text-slate-300 text-sm leading-relaxed font-mono">
                                                {currentFeed.desc}
                                            </p>
                                        </div>
                                        <CheckCircle className="text-purple-500 opacity-50" size={32} />
                                    </div>
                                </div>
                              </>
                          ) : (
                              <div className="text-center text-red-400 font-tech border border-red-500/30 p-8 rounded bg-red-900/10">
                                  <XCircle className="mx-auto mb-2" />
                                  SIGNAL LOST. RE-INITIALIZE SCAN.
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'telemetry' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="glass-panel p-6 border border-slate-700">
                      <h3 className="text-blue-400 font-tech mb-4">SYSTEM DIAGNOSTICS</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-sm text-slate-400">UPLINK_STATUS</span>
                              <span className={`text-xs font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>{isConnected ? 'STABLE' : 'DISCONNECTED'}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-sm text-slate-400">DATA_LATENCY</span>
                              <span className="text-xs text-white font-mono">1.28 SEC (LIGHT SPEED)</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-sm text-slate-400">ENCRYPTION</span>
                              <span className="text-xs text-white font-mono">AES-256-GCM</span>
                          </div>
                      </div>
                      <button 
                         onClick={toggleAudio}
                         disabled={!isConnected}
                         className={`mt-6 w-full py-3 rounded text-xs font-tech tracking-widest flex items-center justify-center gap-2 transition-all ${
                             audioContext 
                             ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' 
                             : 'bg-slate-800 hover:bg-slate-700 text-white'
                         }`}
                      >
                          <Volume2 size={14} /> {audioContext ? 'STOP AUDIO TEST' : 'TEST AUDIO DOWNLINK'}
                      </button>
                  </div>
                  <div className="glass-panel p-6 border border-slate-700 flex items-center justify-center">
                      <div className="text-center">
                          <Globe size={64} className="text-blue-900 mx-auto mb-4 animate-pulse" />
                          <div className="text-slate-500 font-tech text-xs">GLOBAL NETWORK COVERAGE</div>
                          <div className="text-white font-bold text-2xl mt-2">100%</div>
                      </div>
                  </div>
              </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MAA_App;
