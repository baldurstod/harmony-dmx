import { quat, vec2, vec3, vec4 } from 'gl-matrix';
import { BinaryReader } from 'harmony-binary-reader';
import { Color } from 'harmony-utils';
import { Dmx } from './dmx';
import { DmxAttribute, DmxAttributeArray, DmxAttributeSingle, DmxAttributeType, DmxAttributeValue } from './dmxattribute';
import { DmxElement } from './dmxelement';

type UnserializeContext = {
	reader: BinaryReader;
	dmx: Dmx;
	encodingVersion: number;
	elements: DmxElement[];
	strings: string[];
}

const dataSize = [
	0, 4, 4, 4, 1, 0, 0, 4, 4, 8, 12, 16, 12, 16, 64,
	4, 4, 4, 1, 0, 0, 4, 4, 8, 12, 16, 12, 16, 64,
];

export async function unserializeDmx(content: File | string | ArrayBuffer): Promise<Dmx | null> {
	if (content instanceof File) {
		const fileReader = new FileReader();

		let promiseResolve: (value: Dmx | null) => void;
		const promise = new Promise<Dmx | null>((resolve) => {
			promiseResolve = resolve;
		});

		fileReader.onload = async (): Promise<void> => {
			if (fileReader.result) {
				promiseResolve(await unserialize(new BinaryReader(fileReader.result)));

			} else {
				promiseResolve(null);
			}
		};

		fileReader.readAsArrayBuffer(content);

		return promise;
	} else {
		return unserialize(new BinaryReader(content));
	}
}

export function unserializeDmxSync(content: string | ArrayBuffer): Dmx | null {
	return unserialize(new BinaryReader(content));
}

function unserialize(reader: BinaryReader): Dmx | null {
	const str = reader.getString(Math.min(1000, reader.byteLength));

	let startOffset = str.indexOf('-->');
	if (startOffset === 0) {
		return null;
	}
	startOffset += 5;

	const result = /<!-- dmx encoding (.+) (\d+) format (.+) (\d+) -->/.exec(str.substring(0, startOffset));

	if (!result || result?.length < 5) {
		return null;
	}

	const dmx = new Dmx(result[3], Number(result[4]));
	const encodingVersion = Number(result[2]);
	if (result[1] == 'binary') {
		return unserializeBinary(
			{
				dmx,
				reader,
				encodingVersion,
				elements: [],
				strings: [],
			},
			startOffset,
		);
	} else {
		return unserializeText({
			dmx,
			reader,
			encodingVersion,
			elements: [],
			strings: [],
		});
	}
}

function unserializeBinary(context: UnserializeContext, startOffset: number): Dmx {
	unserializeHeader(context, startOffset);

	return context.dmx;
}

function unserializeHeader(context: UnserializeContext, startOffset: number): void {
	const reader = context.reader;
	reader.seek(startOffset);

	let nStrings = 0;
	let nElements = 0
	if (context.encodingVersion < 5) {
		nStrings = reader.getUint16();
	} else {
		nStrings = reader.getUint32();
	}

	for (let i = 0; i < nStrings; ++i) {
		context.strings.push(reader.getNullString());
	}

	nElements = reader.getUint32();
	context.elements = new Array(nElements);
	const elements = context.elements;

	for (let i = 0; i < nElements; i++) {
		elements[i] = unserializeElement(context);
	}

	for (let i = 0; i < nElements; i++) {
		const nAttributes = context.reader.getUint32();
		for (let j = 0; j < nAttributes; ++j) {
			unserializeAttribute(context, elements[i]!);
		}
	}

	context.dmx.root = elements[0] ?? null;

	return;
}

function unserializeElement(context: UnserializeContext): DmxElement {
	const reader = context.reader;

	let type: string;
	let name: string;
	if (context.encodingVersion < 5) {
		type = getString(context, reader.getUint16());
	} else {
		type = getString(context, reader.getUint32());
	}

	if (context.encodingVersion < 5) {
		name = reader.getNullString();
	} else {
		name = getString(context, reader.getUint32());
	}

	const element = new DmxElement(guidToString(reader.getBytes(16)), type, name);

	return element;
}

/*
function unserializeAttributes(context: UnserializeContext, element: DmxElement): void {
	const nAttributes = context.reader.getUint32();
	for (let i = 0; i < nAttributes; ++i) {
		attributes.push(this.#parseAttribute(reader, pcf));
	}
}
*/

function unserializeAttribute(context: UnserializeContext, element: DmxElement): void {
	const reader = context.reader;

	let typeName: string;
	let type: number;
	let value: DmxAttributeValue;
	if (context.encodingVersion < 5) {
		typeName = getString(context, reader.getUint16());
	} else {
		typeName = getString(context, reader.getUint32());
	}

	type = reader.getUint8()

	if (type > 14) {
		value = unserializeArray(context, type);
	} else {
		value = unserializeValue(context, type);
	}

	element.addAttribute(typeName, new DmxAttribute(type, value));
}

function unserializeArray(context: UnserializeContext, type: number): DmxAttributeArray {
	const valuesCount = context.reader.getUint32();
	const value: DmxAttributeArray = new Array(valuesCount);

	for (let i = 0; i < valuesCount; ++i) {
		value[i] = unserializeValue(context, type);
	}

	return value;
}

function unserializeValue(context: UnserializeContext, type: number): DmxAttributeSingle {
	let size = dataSize[type];
	let value: DmxAttributeSingle | null;
	const reader = context.reader;

	switch (type % 14) {
		case DmxAttributeType.Element:
			value = getElement(context, reader.getInt32());
			break;
		case DmxAttributeType.Integer:
			value = reader.getInt32();
			break;
		case DmxAttributeType.Float:
			value = reader.getFloat32();
			break;
		case DmxAttributeType.Boolean:
			value = reader.getInt8();
			break;
		case DmxAttributeType.Time:
			value = reader.getInt32() / 10000.0;
			break;
		case DmxAttributeType.Color:
			//value = {r:reader.getUint8(), g:reader.getUint8(), b:reader.getUint8(), a:reader.getUint8()};
			value = new Color({ red: reader.getUint8(), green: reader.getUint8(), blue: reader.getUint8(), alpha: reader.getUint8() });
			//value = [reader.getUint8(), reader.getUint8(), reader.getUint8(), reader.getUint8()];
			break;
		case DmxAttributeType.Vec2:
			value = vec2.fromValues(reader.getFloat32(), reader.getFloat32());
			break;
		case DmxAttributeType.Vec3:
			value = vec3.fromValues(reader.getFloat32(), reader.getFloat32(), reader.getFloat32());
			break;
		case DmxAttributeType.Vec4:
			value = vec4.fromValues(reader.getFloat32(), reader.getFloat32(), reader.getFloat32(), reader.getFloat32());
			break;
		case DmxAttributeType.Quaternion:
			value = quat.fromValues(reader.getFloat32(), reader.getFloat32(), reader.getFloat32(), reader.getFloat32());
			break;
		case DmxAttributeType.String:
			if (context.encodingVersion < 5) {
				value = reader.getNullString();
			} else {
				value = getString(context, reader.getInt32())
			}
			break;
		case DmxAttributeType.Binary:
			size = reader.getInt32();
			reader.seek(reader.tell() + size);
			break;
		default:
			console.error('unknown type', type, 'in #parseValue', context);
			throw 'fix me';
			break;
	}

	return value!;
}

function getString(context: UnserializeContext, index: number): string {
	const s = context.strings[index];
	if (s) {
		return s;
	} else {
		return '';
	}
}

function getElement(context: UnserializeContext, index: number): DmxElement | null {
	const e = context.elements[index];
	if (e) {
		return e;
	} else {
		return null;
	}
}

export function guidToString(bytes: Uint8Array): string {
	let a = Array.from(bytes);
	// Reverse some bytes because microsoft
	a = a.slice(0, 4).reverse().concat(a.slice(4, 6).reverse()).concat(a.slice(6, 8).reverse()).concat(a.slice(8));

	return a.map((b) => ('00' + b.toString(16)).slice(-2))
		.join('')
		.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

function unserializeText(context: UnserializeContext): Dmx | null {
	throw new Error('TODO');
	return null;
}
