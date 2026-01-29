import fs from 'fs';
import { unserializeDmxSync, serializeDmxText, serializeDmxTextWithLines } from '../dist/index.js';

var path = '';
path = './test/taunt_no_harm_done.dmx';
path = './test/smissmas2025_unusuals.pcf';

const data = fs.readFileSync(path, { flag: 'r' });
const dmx = unserializeDmxSync(data);
//console.log(JSON.stringify(dmx));
//console.info(serializeDmxTextWithLines(dmx));
console.info(serializeDmxText(dmx));
//serializeDmxText(dmx);
