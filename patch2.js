const fs = require('fs');
const path = 'src/app/primeira-consulta/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const addressBlock = `<address className="text-[#1d1d1f]/90 not-italic font-medium mb-4 text-sm">
                R. Jericó, 255 - Cj 81<br/>
                Sumarezinho, São Paulo - SP<br/>
                CEP: 05435-040
              </address>`;

const mapBlock = `<address className="text-[#1d1d1f]/90 not-italic font-medium mb-4 text-sm">
                R. Jericó, 255 - Cj 81<br/>
                Sumarezinho, São Paulo - SP<br/>
                CEP: 05435-040
              </address>
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4 opacity-90 hover:opacity-100 transition-opacity">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.4093950664916!2d-46.69238882467026!3d-23.551416461246187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5795891fcbb5%3A0x7b34292d6f56491!2sDr.%20Mario%20Warde%20%7C%20Cirurgia%20Pl%C3%A1stica%20-%20Vila%20Madalena%2C%20S%C3%A3o%20Paulo!5e0!3m2!1spt-BR!2sbr!4v1714589973215!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>`;

content = content.replace(addressBlock, mapBlock);

// Also add a mention about the subway
content = content.replace(
  '<div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Acessibilidade total',
  '<div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Próximo ao Metrô V. Madalena'
);

fs.writeFileSync(path, content, 'utf8');
