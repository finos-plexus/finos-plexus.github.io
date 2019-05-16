const fs = require('fs');

fs.copyFileSync('./src/interfaces/interface.ts', './index.d.ts');
