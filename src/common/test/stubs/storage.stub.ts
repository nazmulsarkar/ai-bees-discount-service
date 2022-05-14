import * as fs from 'fs';

const filePath = '../../__mocks__/testfile.png'; // `${process.env.TEST_FILE_PATH}`;
// const fileBuffer: Buffer = fs.readFileSync(__dirname + filePath);
export const fileBuffer = fs.createReadStream(__dirname + filePath);
