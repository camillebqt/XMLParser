var convert = require('xml-js');
var fs = require("fs");

// Files names
const file1 = (process.argv[2] || 'en') + '.xml';
const file2 = (process.argv[3] || 'fr') + '.xml';

// Arrays
const in_1_not_in_2 = [];
const in_2_not_in_1 = [];

// Read file1 XML content
fs.readFile("files/" + file1, function (err, data) {
  if (err) throw err;
  const xml1 = data.toString();

  // Convert file1 to JSON
  const json1 = JSON.parse(convert.xml2json(xml1, {compact: true, spaces: 4}));
  
  // Read file2 XML content
  fs.readFile("files/" + file2, function (err, data) {
    if (err) throw err;
    const xml2 = data.toString();

    // Convert file2 to JSON
    const json2 = JSON.parse(convert.xml2json(xml2, {compact: true, spaces: 4}));
    
    // For each key of file1, check if doublon
    for(const row of json1.translation.tr) {
      if(in_1_not_in_2.includes(row._attributes.id)) {
        console.warn(`WARN: Doublon of '${row._attributes.id}' in ${file1}`);
      } else {
        in_1_not_in_2.push(row._attributes.id);
      }
    }

    // For each key of file2, check if doublon or check in file1
    for(const row of json2.translation.tr) {
      if(in_2_not_in_1.includes(row._attributes.id)) {
        console.warn(`WARN: Doublon of '${row._attributes.id}' in ${file2}`);
      } else {
        const pos = in_1_not_in_2.indexOf(row._attributes.id);

        // if not in file1 keys
        if(pos == -1) {
          in_2_not_in_1.push(row._attributes.id);
        } else {
          in_1_not_in_2.splice(pos, 1);
        }
      }
    }

    // Display results
    console.log(`In ${file1} but not in ${file2}:`, in_1_not_in_2);
    console.log(`In ${file2} but not in ${file1}:`, in_2_not_in_1);
  });
});

