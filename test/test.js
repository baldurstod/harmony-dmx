import fs from 'fs';
import { unserializeDmxSync } from '../dist/index.js';

var path = '';
//path = './test/taunt_no_harm_done.dmx';
path = './test/smissmas2025_unusuals.pcf';

const data = fs.readFileSync(path, { flag: 'r' });
const dmx = unserializeDmxSync(data);
console.log(dmx);
