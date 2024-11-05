import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
console.log("hello server");

const url = process.env.DOCKER_URL;
console.log(url);
