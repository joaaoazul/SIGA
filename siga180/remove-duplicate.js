// remove-duplicate-layouts.js
// Coloca este ficheiro na raiz do projeto e executa: node remove-duplicate-layouts.js

const fs = require('fs');
const path = require('path');

// Lista de ficheiros para verificar
const pagesToCheck = [
  './src/modules/trainer/pages/Dashboard.js',
  './src/modules/trainer/pages/Athletes.js',
  './src/modules/trainer/pages/AthleteDetail.js',
  './src/modules/trainer/pages/AddAthlete.js',
  './src/modules/trainer/pages/AddAthleteFull.js',
  './src/modules/trainer/pages/EditAthlete.js',
  './src/modules/trainer/pages/WorkoutPlans.js',
  './src/modules/trainer/pages/Analytics.js',
  './src/modules/athlete/pages/Dashboard.js',
  './src/modules/athlete/pages/MyWorkouts.js',
  './src/modules/athlete/pages/Progress.js',
  './src/modules/athlete/pages/Nutrition.js',
  './src/modules/athlete/pages/CheckIn.js',
  './src/modules/shared/pages/Messages.js'
];

pagesToCheck.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove import do Layout
      content = content.replace(/import Layout from ['"].*Layout['"];?\n/g, '');
      
      // Remove <Layout> wrapper
      content = content.replace(/<Layout[^>]*>/g, '');
      content = content.replace(/<\/Layout>/g, '');
      
      // Remove return ( <Layout... ) patterns
      content = content.replace(/return\s*\(\s*<Layout[^>]*>\s*\n/g, 'return (\n');
      content = content.replace(/\s*<\/Layout>\s*\);\s*}/g, '\n  );\n}');
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Cleaned: ${filePath}`);
    } else {
      console.log(`⚠️  Not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n✨ Done! Now all pages should work with the Layout in TrainerRoutes.');