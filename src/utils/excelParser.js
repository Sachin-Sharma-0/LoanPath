// This is the optional method if populatedata() method doesn't work for SQL. Required code to run this method is below 

const xlsx = require('xlsx');

/**
 * Parse an Excel file and return data as an array of objects.
 * @param {string} filePath - Path to the Excel file.
 * @returns {Array} Array of objects containing data from the Excel file.
 */
function parseExcel(filePath) {

    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);

    return data;
}

module.exports = parseExcel;

//This is the required code if you want to use this method, use below code wherever required.

/*
const excelParser = require('./utils/excelParser');

// Path to the Excel file
const filePath = 'path/to/your/excel/file.xlsx';

// Parse Excel file
const data = excelParser(filePath);

// Use the parsed data
console.log(data);
*/