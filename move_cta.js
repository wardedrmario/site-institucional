const fs = require('fs');
const path = 'src/app/primeira-consulta/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const ctaRegex = /\s*\{\/\* 6\. FINAL CTA[\s\S]*?<\/section>/;
const match = content.match(ctaRegex);

if (match) {
  const ctaBlock = match[0];
  content = content.replace(ctaRegex, '');
  content = content.replace('      {/* 4. INFORMAÇÕES PRÁTICAS & LOGÍSTICA */}', ctaBlock + '\n\n      {/* 4. INFORMAÇÕES PRÁTICAS & LOGÍSTICA */}');
  
  // also change the bg color of CTA from bg-white to bg-[#f5f5f7] so it blends with Testimonials, 
  // or bg-white to contrast. The testimonials are currently bg-transparent?
  // Let's just swap it exactly as it is.
  fs.writeFileSync(path, content, 'utf8');
  console.log("Moved CTA successfully");
} else {
  console.log("Regex not matched");
}
