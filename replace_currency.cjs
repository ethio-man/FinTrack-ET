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
    // Save template literal $ signs
    let newContent = content.replace(/(^|[^\\])\$(\{)/g, '$1#TEMPLATELITERAL#$2');
    
    // Replace remaining $ signs with ETB
    newContent = newContent.replace(/\$/g, 'ETB ');
    
    // Restore template literal $ signs
    newContent = newContent.replace(/#TEMPLATELITERAL#/g, '$');
    
    // Some minor cleanup for spacing like "ETB {value}"
    // or maybe "ETB  123" -> "ETB 123"
    newContent = newContent.replace(/ETB \s+/g, 'ETB ');
    
    if (content !== newContent) {
        fs.writeFileSync(f, newContent);
        changed++;
        console.log('Updated ' + f);
    }
});

console.log('Total files updated: ' + changed);
