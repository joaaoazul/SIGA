const fs = require('fs');
const path = require('path');

// Mapeamento de imports antigos para novos
const importMappings = {
  // Para páginas do trainer
  '../components/layout/Layout': '../../shared/components/layout/Layout',
  '../components/athletes/': '../components/',
  '../components/dashboard/': '../components/',
  '../hooks/useAthletes': '../../shared/hooks/useAthletes',
  '../hooks/': '../../shared/hooks/',
  
  // Para assets
  '../assets/logo_header.png': '../../../assets/logo_header.png',
  '../../assets/logo_header.png': '../../../../assets/logo_header.png',
};

// Função para atualizar imports num ficheiro
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  Object.entries(importMappings).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport, 'g'), newImport);
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
}

// Percorrer todos os ficheiros .js
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      updateImports(filePath);
    }
  });
}

// Executar
console.log('🔧 Fixing imports...');
walkDir('./src/modules');
console.log('✨ Done!');