import { quat, vec4, vec3, vec2 } from 'gl-matrix';
import { BinaryReader } from 'harmony-binary-reader';
import { Color } from 'harmony-utils';

class Dmx {
    root = null;
    format = '';
    version = 0;
    constructor(format = '', version = 0) {
        this.format = format;
        this.version = version;
    }
}

var DmxAttributeType;
(function (DmxAttributeType) {
    // TODO: check values
    DmxAttributeType[DmxAttributeType["Unknown"] = 0] = "Unknown";
    DmxAttributeType[DmxAttributeType["Element"] = 1] = "Element";
    DmxAttributeType[DmxAttributeType["Integer"] = 2] = "Integer";
    DmxAttributeType[DmxAttributeType["Float"] = 3] = "Float";
    DmxAttributeType[DmxAttributeType["Boolean"] = 4] = "Boolean";
    DmxAttributeType[DmxAttributeType["String"] = 5] = "String";
    DmxAttributeType[DmxAttributeType["Binary"] = 6] = "Binary";
    DmxAttributeType[DmxAttributeType["Time"] = 7] = "Time";
    DmxAttributeType[DmxAttributeType["Color"] = 8] = "Color";
    DmxAttributeType[DmxAttributeType["Vec2"] = 9] = "Vec2";
    DmxAttributeType[DmxAttributeType["Vec3"] = 10] = "Vec3";
    DmxAttributeType[DmxAttributeType["Vec4"] = 11] = "Vec4";
    DmxAttributeType[DmxAttributeType["QAngle"] = 12] = "QAngle";
    DmxAttributeType[DmxAttributeType["Quaternion"] = 13] = "Quaternion";
    DmxAttributeType[DmxAttributeType["VMatrix"] = 14] = "VMatrix";
    DmxAttributeType[DmxAttributeType["ElementArray"] = 15] = "ElementArray";
    DmxAttributeType[DmxAttributeType["IntegerArray"] = 16] = "IntegerArray";
    DmxAttributeType[DmxAttributeType["FloatArray"] = 17] = "FloatArray";
    DmxAttributeType[DmxAttributeType["BooleanArray"] = 18] = "BooleanArray";
    DmxAttributeType[DmxAttributeType["StringArray"] = 19] = "StringArray";
    DmxAttributeType[DmxAttributeType["BinaryArray"] = 20] = "BinaryArray";
    DmxAttributeType[DmxAttributeType["TimeArray"] = 21] = "TimeArray";
    DmxAttributeType[DmxAttributeType["ColorArray"] = 22] = "ColorArray";
    DmxAttributeType[DmxAttributeType["Vec2Array"] = 23] = "Vec2Array";
    DmxAttributeType[DmxAttributeType["Vec3Array"] = 24] = "Vec3Array";
    DmxAttributeType[DmxAttributeType["Vec4Array"] = 25] = "Vec4Array";
    DmxAttributeType[DmxAttributeType["QAngleArray"] = 26] = "QAngleArray";
    DmxAttributeType[DmxAttributeType["QuaternionArray"] = 27] = "QuaternionArray";
    DmxAttributeType[DmxAttributeType["VMatrixArray"] = 28] = "VMatrixArray";
})(DmxAttributeType || (DmxAttributeType = {}));
class DmxAttribute {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class DmxElement {
    id;
    class;
    name;
    attributes = new Map;
    constructor(id, clas, name) {
        this.id = id;
        this.class = clas;
        this.name = name;
    }
    addAttribute(name, attribute) {
        this.attributes.set(name, attribute);
    }
    addElementAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Element, value));
    }
    addIntegerAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Integer, value));
    }
    addFloatAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Float, value));
    }
    addBooleanAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Boolean, value));
    }
    addStringAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.String, value));
    }
    addBinaryAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Binary, value));
    }
    addTimeAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Time, value));
    }
    addColorAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Color, value));
    }
    addVec2Attribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec2, value));
    }
    addVec3Attribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec3, value));
    }
    addVec4Attribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec4, value));
    }
    addQAngleAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.QAngle, value));
    }
    addQuaternionAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Quaternion, value));
    }
    addVMatrixAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.VMatrix, value));
    }
    // Start of arrays
    addElementArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.ElementArray, value));
    }
    addIntegerArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.IntegerArray, value));
    }
    addFloatArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.FloatArray, value));
    }
    addBooleanArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.BooleanArray, value));
    }
    addStringArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.StringArray, value));
    }
    addBinaryArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.BinaryArray, value));
    }
    addTimeArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.TimeArray, value));
    }
    addColorArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.ColorArray, value));
    }
    addVec2ArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec2Array, value));
    }
    addVec3ArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec3Array, value));
    }
    addVec4ArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec4Array, value));
    }
    addQAngleArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.QAngleArray, value));
    }
    addQuaternionArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.QuaternionArray, value));
    }
    addVMatrixArrayAttribute(name, value) {
        this.attributes.set(name, new DmxAttribute(DmxAttributeType.VMatrixArray, value));
    }
}

const FLOAT_DECIMALS = 6;
function serializeDmxText(dmx) {
    const result = serializeDmxTextWithLines(dmx);
    if (result) {
        return result.text;
    }
    return null;
}
function serializeDmxTextWithLines(dmx) {
    const root = dmx.root;
    if (!root) {
        return null;
    }
    const lines = [];
    const inlineElements = inlineSubElements(root);
    const context = { tabs: 0, inlineSubElements: inlineElements, line: 1, elementsLine: new Map() };
    lines.push(dmxElementToSTring(root, context));
    ++context.line;
    for (const [subElement, inline] of inlineElements) {
        if (!inline) {
            lines.push(dmxElementToSTring(subElement, context));
            ++context.line;
            lines.push('');
            ++context.line;
        }
    }
    return { text: lines.join('\n'), elementsLine: context.elementsLine };
}
function inlineSubElements(element) {
    const subs = new Map();
    const done = new Set();
    let current;
    const stack = [element];
    do {
        current = stack.pop();
        if (!current || done.has(current)) {
            continue;
        }
        done.add(current);
        if (subs.has(current)) {
            subs.set(current, false);
        }
        else {
            subs.set(current, true);
        }
        for (const [, attribute] of current.attributes) {
            switch (attribute.type) {
                case DmxAttributeType.Element:
                    // prevent inlining
                    subs.set(attribute.value, false);
                    stack.push(attribute.value);
                    break;
                case DmxAttributeType.ElementArray:
                    for (const subElement of attribute.value) {
                        stack.push(subElement);
                    }
                    break;
            }
        }
    } while (stack.length);
    return subs;
}
function dmxElementToSTring(element, context) {
    let lines = [];
    if (element) {
        context.elementsLine.set(element.id, context.line);
    }
    let isDmeParticleSystemDefinition = false;
    if (element?.name == 'DmeParticleSystemDefinition') {
        isDmeParticleSystemDefinition = true;
    }
    lines.push(makeTabs(context.tabs) + `"${element?.class}"`);
    ++context.line;
    lines.push(makeTabs(context.tabs) + '{');
    ++context.line;
    ++context.tabs;
    lines.push(makeTabs(context.tabs) + `"id" "elementid" "${element?.id}"`);
    if (element && isDmeParticleSystemDefinition) {
        context.elementsLine.set(element.name, context.line);
    }
    ++context.line;
    lines.push(makeTabs(context.tabs) + `"name" "string" "${element?.name}"`);
    ++context.line;
    if (element) {
        for (const [name, attribute] of element.attributes) {
            lines.push(makeTabs(context.tabs) + dmxAttributeToSTring(name, attribute, context));
            ++context.line;
        }
    }
    --context.tabs;
    lines.push(makeTabs(context.tabs) + '}');
    //++context.line;
    return lines.join('\n');
}
function dmxAttributeToSTring(name, attribute, context) {
    let line = makeTabs(context.tabs);
    line = `"${name}"`;
    const attributeType = attribute.type;
    const attributeValue = attribute.value;
    switch (attributeType) {
        case DmxAttributeType.Element:
            line += ` "element" "${attributeValue?.id ?? 'null'}"`;
            break;
        case DmxAttributeType.Integer:
            line += ` "int" ${attributeValue}`;
            break;
        case DmxAttributeType.Float:
            line += ` "float" ${attributeValue}`;
            break;
        case DmxAttributeType.Boolean:
            line += ` "bool" ${attributeValue ? '1' : '0'}`;
            break;
        case DmxAttributeType.String:
            line += ` "string" "${attributeValue}"`;
            break;
        case DmxAttributeType.Color:
            line += ` "color" "${getAttributeValue(attributeType, attributeValue)}"`;
            break;
        case DmxAttributeType.Vec2:
            line += ` "vector2" "${getAttributeValue(attributeType, attributeValue)}"`;
            break;
        case DmxAttributeType.Vec3:
            line += ` "vector3" "${getAttributeValue(attributeType, attributeValue)}"`;
            break;
        case DmxAttributeType.Vec4:
            line += ` "vector4" "${getAttributeValue(attributeType, attributeValue)}"`;
            break;
        case DmxAttributeType.Quaternion:
            line += ` "quaternion" "${getAttributeValue(attributeType, attributeValue)}"`;
            break;
        case DmxAttributeType.ElementArray:
            line += ' "element_array"\n';
            ++context.line;
            line += makeTabs(context.tabs);
            line += '[\n';
            ++context.line;
            ++context.tabs;
            line += dmxElementsToSTring(attributeValue, context);
            line += '\n';
            ++context.line;
            --context.tabs;
            line += makeTabs(context.tabs);
            line += ']';
            break;
        case DmxAttributeType.IntegerArray:
        case DmxAttributeType.FloatArray:
        case DmxAttributeType.Vec2Array:
        case DmxAttributeType.Vec3Array:
        case DmxAttributeType.Vec4Array:
        case DmxAttributeType.QuaternionArray:
            line += ` "${getAttributeTypeName(attribute.type)}_array" [`;
            for (let i = 0, len = attributeValue.length; i < len; i++) {
                const value = attributeValue[i];
                line += ` "${getAttributeValue(attributeType, value)}"`;
                if (i < len - 1) {
                    line += ',';
                }
            }
            line += ' ]';
            break;
        default:
            console.error('do type ', attribute.type, attribute);
    }
    return line;
}
function getAttributeTypeName(type) {
    switch (type % 14) {
        case DmxAttributeType.Element: return 'element';
        case DmxAttributeType.Integer: return 'int';
        case DmxAttributeType.Float: return 'float';
        case DmxAttributeType.Boolean: return 'bool';
        case DmxAttributeType.String: return 'string';
        case DmxAttributeType.Binary: return 'binary';
        case DmxAttributeType.Color: return 'color';
        case DmxAttributeType.Vec2: return 'vector2';
        case DmxAttributeType.Vec3: return 'vector3';
        case DmxAttributeType.Vec4: return 'vector4';
        case DmxAttributeType.QAngle: return 'qangle';
        case DmxAttributeType.Quaternion: return 'quaternion';
        case DmxAttributeType.VMatrix: return 'matrix';
        default: return '';
    }
}
function toFixed(input) {
    return String(+input.toFixed(FLOAT_DECIMALS));
}
function getAttributeValue(type, value) {
    switch (type % 14) {
        case DmxAttributeType.Integer:
            return `${value}`;
        case DmxAttributeType.Float:
            return toFixed(value);
        case DmxAttributeType.Color:
            return `${value.red * 255} ${value.green * 255} ${value.blue * 255} ${value.alpha * 255}`;
        case DmxAttributeType.Vec2:
            return `${toFixed(value[0])} ${toFixed(value[1])}`;
        case DmxAttributeType.Vec3:
            return `${toFixed(value[0])} ${toFixed(value[1])} ${toFixed(value[2])}`;
        case DmxAttributeType.Vec4:
        case DmxAttributeType.Quaternion:
            return `${toFixed(value[0])} ${toFixed(value[1])} ${toFixed(value[2])} ${toFixed(value[3])}`;
        //case DmxAttributeType.QAngle: return 'qangle';
        //case DmxAttributeType.VMatrix: return 'matrix';
        default:
            console.error('TODO: getAttributeValue for', type);
            return '';
    }
}
function dmxElementsToSTring(elements, context) {
    let lines = [];
    for (const element of elements) {
        if (context.inlineSubElements.get(element)) {
            lines.push(dmxElementToSTring(element, context) + ',');
            ++context.line;
        }
        else {
            lines.push(`${makeTabs(context.tabs)}${element.name} "element" "${element.id}",`);
            ++context.line;
        }
    }
    if (lines.length > 0) {
        --context.line;
    }
    return lines.join('\n');
}
function makeTabs(count) {
    let s = '';
    for (let i = 0; i < count; i++) {
        s += '\t';
    }
    return s;
}

const dataSize = [
    0, 4, 4, 4, 1, 0, 0, 4, 4, 8, 12, 16, 12, 16, 64,
    4, 4, 4, 1, 0, 0, 4, 4, 8, 12, 16, 12, 16, 64,
];
async function unserializeDmx(content) {
    if (content instanceof File) {
        const fileReader = new FileReader();
        let promiseResolve;
        const promise = new Promise((resolve) => {
            promiseResolve = resolve;
        });
        fileReader.onload = async () => {
            if (fileReader.result) {
                promiseResolve(await unserialize(new BinaryReader(fileReader.result)));
            }
            else {
                promiseResolve(null);
            }
        };
        fileReader.readAsArrayBuffer(content);
        return promise;
    }
    else {
        return unserialize(new BinaryReader(content));
    }
}
function unserializeDmxSync(content) {
    return unserialize(new BinaryReader(content));
}
function unserialize(reader) {
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
        return unserializeBinary({
            dmx,
            reader,
            encodingVersion,
            elements: [],
            strings: [],
        }, startOffset);
    }
    else {
        return unserializeText();
    }
}
function unserializeBinary(context, startOffset) {
    unserializeHeader(context, startOffset);
    return context.dmx;
}
function unserializeHeader(context, startOffset) {
    const reader = context.reader;
    reader.seek(startOffset);
    let nStrings = 0;
    let nElements = 0;
    if (context.encodingVersion < 5) {
        nStrings = reader.getUint16();
    }
    else {
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
            unserializeAttribute(context, elements[i]);
        }
    }
    context.dmx.root = elements[0] ?? null;
    return;
}
function unserializeElement(context) {
    const reader = context.reader;
    let type;
    let name;
    if (context.encodingVersion < 5) {
        type = getString(context, reader.getUint16());
    }
    else {
        type = getString(context, reader.getUint32());
    }
    if (context.encodingVersion < 5) {
        name = reader.getNullString();
    }
    else {
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
function unserializeAttribute(context, element) {
    const reader = context.reader;
    let typeName;
    let type;
    let value;
    if (context.encodingVersion < 5) {
        typeName = getString(context, reader.getUint16());
    }
    else {
        typeName = getString(context, reader.getUint32());
    }
    type = reader.getUint8();
    if (type > 14) {
        value = unserializeArray(context, type);
    }
    else {
        value = unserializeValue(context, type);
    }
    element.addAttribute(typeName, new DmxAttribute(type, value));
}
function unserializeArray(context, type) {
    const valuesCount = context.reader.getUint32();
    const value = new Array(valuesCount);
    for (let i = 0; i < valuesCount; ++i) {
        value[i] = unserializeValue(context, type);
    }
    return value;
}
function unserializeValue(context, type) {
    let size = dataSize[type];
    let value;
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
            }
            else {
                value = getString(context, reader.getInt32());
            }
            break;
        case DmxAttributeType.Binary:
            size = reader.getInt32();
            reader.seek(reader.tell() + size);
            break;
        default:
            console.error('unknown type', type, 'in #parseValue', context);
            throw 'fix me';
    }
    return value;
}
function getString(context, index) {
    const s = context.strings[index];
    if (s) {
        return s;
    }
    else {
        return '';
    }
}
function getElement(context, index) {
    const e = context.elements[index];
    if (e) {
        return e;
    }
    else {
        return null;
    }
}
function guidToString(bytes) {
    let a = Array.from(bytes);
    // Reverse some bytes because microsoft
    a = a.slice(0, 4).reverse().concat(a.slice(4, 6).reverse()).concat(a.slice(6, 8).reverse()).concat(a.slice(8));
    return a.map((b) => ('00' + b.toString(16)).slice(-2))
        .join('')
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}
function unserializeText(context) {
    throw new Error('TODO');
}

export { Dmx, DmxAttribute, DmxAttributeType, DmxElement, guidToString, serializeDmxText, serializeDmxTextWithLines, unserializeDmx, unserializeDmxSync };
