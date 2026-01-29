import { vec2, vec3, vec4 } from 'gl-matrix';
import { Color } from 'harmony-utils';
import { Dmx } from './dmx';
import { DmxAttribute, DmxAttributeType, DmxAttributeValue } from './dmxattribute';
import { DmxElement } from './dmxelement';

const FLOAT_DECIMALS = 6;

type SerializeContext = {
	tabs: number;
	inlineSubElements: Map<DmxElement, boolean>;
	line: number;
	elementsLine: Map<string, number>;
}

export function serializeDmxText(dmx: Dmx): string | null {
	const result = serializeDmxTextWithLines(dmx);
	if (result) {
		return result.text;
	}
	return null;
}

export function serializeDmxTextWithLines(dmx: Dmx): { text: string, elementsLine: Map<string, number> } | null {
	const root = dmx.root;
	if (!root) {
		return null;
	}

	const lines: string[] = [];

	const inlineElements = inlineSubElements(root);

	const context: SerializeContext = { tabs: 0, inlineSubElements: inlineElements, line: 1, elementsLine: new Map<string, number>() };

	lines.push(`<!-- dmx encoding keyvalues2 4 format ${dmx.format} ${dmx.version} -->`);
	++context.line;
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

function inlineSubElements(element: DmxElement): Map<DmxElement, boolean> {
	const subs = new Map<DmxElement, boolean>()
	const done = new Set<DmxElement>()

	let current: DmxElement | undefined;
	const stack: DmxElement[] = [element];

	do {
		current = stack.pop();
		if (!current || done.has(current)) {
			continue;
		}
		done.add(current);
		if (subs.has(current)) {
			subs.set(current, false);
		} else {
			subs.set(current, true);
		}

		for (const [, attribute] of current.attributes) {
			switch (attribute.type) {
				case DmxAttributeType.Element:
					// prevent inlining
					subs.set(attribute.value as DmxElement, false);
					stack.push(attribute.value as DmxElement);
					break;
				case DmxAttributeType.ElementArray:
					for (const subElement of attribute.value as DmxElement[]) {
						stack.push(subElement);
					}
					break;
			}
		}
	} while (stack.length);

	return subs;
}

function dmxElementToSTring(element: DmxElement | null, context: SerializeContext): string {
	let lines: string[] = [];

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

function dmxAttributeToSTring(name: string, attribute: DmxAttribute, context: SerializeContext): string {
	let line = makeTabs(context.tabs);

	line = `"${name}"`;

	const attributeType = attribute.type;
	const attributeValue = attribute.value;
	switch (attributeType) {
		case DmxAttributeType.Element:
			line += ` "element" "${(attributeValue as (DmxElement | null))?.id ?? 'null'}"`;
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
			line += dmxElementsToSTring(attributeValue as DmxElement[], context);
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
			for (let i = 0, len = (attributeValue as number[]).length; i < len; i++) {
				const value = (attributeValue as number[])[i]!;
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

function getAttributeTypeName(type: DmxAttributeType): string {
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

function toFixed(input: number): string {
	return String(+input.toFixed(FLOAT_DECIMALS));
}

function getAttributeValue(type: DmxAttributeType, value: DmxAttributeValue): string {
	switch (type % 14) {
		case DmxAttributeType.Integer:
			return `${value}`;
		case DmxAttributeType.Float:
			return toFixed(value as number);
		case DmxAttributeType.Color:
			return `${(value as Color).red * 255} ${(value as Color).green * 255} ${(value as Color).blue * 255} ${(value as Color).alpha * 255}`;
		case DmxAttributeType.Vec2:
			return `${toFixed((value as vec2)[0])} ${toFixed((value as vec2)[1])}`;
		case DmxAttributeType.Vec3:
			return `${toFixed((value as vec3)[0])} ${toFixed((value as vec3)[1])} ${toFixed((value as vec3)[2])}`;
		case DmxAttributeType.Vec4:
		case DmxAttributeType.Quaternion:
			return `${toFixed((value as vec4)[0])} ${toFixed((value as vec4)[1])} ${toFixed((value as vec4)[2])} ${toFixed((value as vec4)[3])}`;
		//case DmxAttributeType.QAngle: return 'qangle';
		//case DmxAttributeType.VMatrix: return 'matrix';
		default:
			console.error('TODO: getAttributeValue for', type);
			return '';
	}
}

function dmxElementsToSTring(elements: DmxElement[], context: SerializeContext): string {
	let lines: string[] = [];

	for (const element of elements) {
		if (context.inlineSubElements.get(element)) {
			lines.push(dmxElementToSTring(element, context) + ',');
			++context.line;
		} else {
			lines.push(`${makeTabs(context.tabs)}${element.name} "element" "${element.id}",`);
			++context.line;
		}
	}

	if (lines.length > 0) {
		--context.line;
	}

	return lines.join('\n');
}

function makeTabs(count: number): string {
	let s = '';
	for (let i = 0; i < count; i++) {
		s += '\t';
	}
	return s;
}
