const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changed = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace >${val} with >ETB ${val}
    let newContent = content.replace(/>\$\{/g, '>ETB ${');
    
    // Replace placeholder="$0" with placeholder="ETB 0"
    newContent = newContent.replace(/"\$/g, '"ETB ');
    
    // Replace -${val} with -ETB ${val}
    newContent = newContent.replace(/>-\$\{/g, '>-ETB ${');
    
    // Check if there are other literal '$' signs that are not part of template string literals
    // e.g., >$1000 -> >ETB 1000
    newContent = newContent.replace(/>\$([0-9])/g, '>ETB $1');
    
    // >-$1000 -> >-ETB 1000
    newContent = newContent.replace(/>-\$([0-9])/g, '>-ETB $1');

    if (content !== newContent) {
        fs.writeFileSync(f, newContent);
        changed++;
        console.log('Updated ' + f);
    }
});

console.log('Total files updated: ' + changed);
