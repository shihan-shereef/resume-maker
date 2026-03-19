const fs = require('fs');
let file = fs.readFileSync('src/pages/LandingPage.jsx', 'utf8');

// replace Nav Logo
file = file.replace(
  /<svg viewBox="0 0 34 34">.*?<\/svg>\s*<div className="n-logo">Takshila<em>\.<\/em><\/div>/gs,
  '<img src="/logo.png" alt="Takshila" className="n-logo-img" />'
);

// replace Footer Logo
file = file.replace(
  /<div className="ft-logo">Takshila<em>\.<\/em><\/div>/g,
  '<img src="/logo.png" alt="Takshila" className="ft-logo-img" />'
);

// replace Hero Text Layout
file = file.replace(
  /<h1 className="h-h1">.*?<\/h1>/gs,
  '<h1 className="h-h1"><span style={{ display: \'block\' }}>Your Professional Life,</span><span className="uby-wrap" id="uby" style={{ display: \'inline-block\' }}>Unified by Intelligence.</span></h1>'
);

// replace popa broken unsplash images
file = file.replace(
  /<div className="popa"><img src="[^"]+" alt="[^"]*"\s*\/><\/div>/g,
  '<div className="popa" style={{background: "linear-gradient(135deg, #f05523, #ff8a65)", width: "100%", height: "100%"}}></div>'
);

// replace popb broken unsplash images
file = file.replace(
  /<div className="popb"><img src="[^"]+" alt="[^"]*"\s*\/><\/div>/g,
  '<div className="popb" style={{background: "#0d1627", border: "1px solid rgba(255,255,255,0.1)", width: "100%", height: "100%"}}></div>'
);

fs.writeFileSync('src/pages/LandingPage.jsx', file);
console.log("Updated LandingPage.jsx successfully.");
