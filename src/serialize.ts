import { vec2, vec3, vec4 } from 'gl-matrix';
import { Color } from 'harmony-utils';
import { Dmx } from './dmx';
import { DmxAttribute, DmxAttributeType } from './dmxattribute';
import { DmxElement } from './dmxelement';

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
	} while (current);

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

	switch (attribute.type) {
		case DmxAttributeType.Element:
			line += ` "element" "${(attribute.value as (DmxElement | null))?.id ?? 'null'}"`;
			break;
		case DmxAttributeType.Integer:
			line += ` "int" ${attribute.value}`;
			break;
		case DmxAttributeType.Float:
			line += ` "float" ${attribute.value}`;
			break;
		case DmxAttributeType.Boolean:
			line += ` "bool" ${attribute.value ? '1' : '0'}`;
			break;
		case DmxAttributeType.String:
			line += ` "string" "${attribute.value}"`;
			break;
		case DmxAttributeType.Color:
			line += ` "color" "${(attribute.value as Color).red * 255} ${(attribute.value as Color).green * 255} ${(attribute.value as Color).blue * 255} ${(attribute.value as Color).alpha * 255}"`;
			break;
		case DmxAttributeType.Vec2:
			line += ` "vector2" "${(attribute.value as vec2)[0]} ${(attribute.value as vec2)[1]}"`;
			break;
		case DmxAttributeType.Vec3:
			line += ` "vector3" "${(attribute.value as vec3)[0]} ${(attribute.value as vec3)[1]} ${(attribute.value as vec3)[2]}"`;
			break;
		case DmxAttributeType.Vec4:
			line += ` "vector4" "${(attribute.value as vec4)[0]} ${(attribute.value as vec4)[1]} ${(attribute.value as vec4)[2]} ${(attribute.value as vec4)[3]}"`;
			break;
		case DmxAttributeType.Quaternion:
			line += ` "quaternion" "${(attribute.value as vec4)[0]} ${(attribute.value as vec4)[1]} ${(attribute.value as vec4)[2]} ${(attribute.value as vec4)[3]}"`;
			break;
		case DmxAttributeType.ElementArray:
			line += ' "element_array"\n';
			++context.line;
			line += makeTabs(context.tabs);
			line += '[\n';
			++context.line;
			++context.tabs;
			line += dmxElementsToSTring(attribute.value as DmxElement[], context);
			line += '\n';
			++context.line;
			--context.tabs;
			line += makeTabs(context.tabs);
			line += ']';
			break;
		default:
			console.error('do type ', attribute.type, attribute);
	}

	return line;
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
