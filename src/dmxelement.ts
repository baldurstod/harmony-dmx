import { mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';
import { Color } from 'harmony-utils';
import { DmxAttribute, DmxAttributeType } from './dmxattribute';

export class DmxElement {
	id: string;
	class: string;
	name: string;
	readonly attributes = new Map<string, DmxAttribute>;

	constructor(id: string, clas: string, name: string) {
		this.id = id;
		this.class = clas;
		this.name = name;
	}

	addAttribute(name: string, attribute: DmxAttribute): void {
		this.attributes.set(name, attribute);
	}

	addElementAttribute(name: string, value: DmxElement): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Element, value));
	}

	addIntegerAttribute(name: string, value: number): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Integer, value));
	}

	addFloatAttribute(name: string, value: number): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Float, value));
	}

	addBooleanAttribute(name: string, value: boolean): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Boolean, value));
	}

	addStringAttribute(name: string, value: string): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.String, value));
	}

	addBinaryAttribute(name: string, value: Uint8Array): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Binary, value));
	}

	addTimeAttribute(name: string, value: number): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Time, value));
	}

	addColorAttribute(name: string, value: Color): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Color, value));
	}

	addVec2Attribute(name: string, value: vec2): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec2, value));
	}

	addVec3Attribute(name: string, value: vec3): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec3, value));
	}

	addVec4Attribute(name: string, value: vec4): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec4, value));
	}

	addQAngleAttribute(name: string, value: vec3): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.QAngle, value));
	}

	addQuaternionAttribute(name: string, value: quat): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Quaternion, value));
	}

	addVMatrixAttribute(name: string, value: mat4): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.VMatrix, value));
	}

	// Start of arrays
	addElementArrayAttribute(name: string, value: DmxElement[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.ElementArray, value));
	}

	addIntegerArrayAttribute(name: string, value: number[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.IntegerArray, value));
	}

	addFloatArrayAttribute(name: string, value: number[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.FloatArray, value));
	}

	addBooleanArrayAttribute(name: string, value: boolean[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.BooleanArray, value));
	}

	addStringArrayAttribute(name: string, value: string[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.StringArray, value));
	}

	addBinaryArrayAttribute(name: string, value: Uint8Array[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.BinaryArray, value));
	}

	addTimeArrayAttribute(name: string, value: number[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.TimeArray, value));
	}

	addColorArrayAttribute(name: string, value: Color[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.ColorArray, value));
	}

	addVec2ArrayAttribute(name: string, value: vec2[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec2Array, value));
	}

	addVec3ArrayAttribute(name: string, value: vec3[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec3Array, value));
	}

	addVec4ArrayAttribute(name: string, value: vec4[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.Vec4Array, value));
	}

	addQAngleArrayAttribute(name: string, value: vec3[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.QAngleArray, value));
	}

	addQuaternionArrayAttribute(name: string, value: quat[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.QuaternionArray, value));
	}

	addVMatrixArrayAttribute(name: string, value: mat4[]): void {
		this.attributes.set(name, new DmxAttribute(DmxAttributeType.VMatrixArray, value));
	}
}
