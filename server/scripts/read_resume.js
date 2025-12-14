const fs = require('fs');
const pdf = require('pdf-parse');

const resumePath = 'c:/portfilio/Govindraj_print_resume.pdf';

try {
    const dataBuffer = fs.readFileSync(resumePath);
    pdf(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(err => {
        console.error('Error parsing PDF:', err);
    });
} catch (err) {
    console.error('Error reading file:', err);
}
