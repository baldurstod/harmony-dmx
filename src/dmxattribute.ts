import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { Color } from 'harmony-utils';
import { DmxElement } from './dmxelement';

export enum DmxAttributeType {
	// TODO: check values
	Unknown = 0,
	Element,
	Integer,
	Float,
	Boolean,
	String,
	Binary,
	Time,
	Color,//rgba
	Vec2,
	Vec3,
	Vec4,
	QAngle,
	Quaternion,
	VMatrix,
	ElementArray,
	IntegerArray,
	FloatArray,
	BooleanArray,
	StringArray,
	BinaryArray,
	TimeArray,
	ColorArray,
	Vec2Array,
	Vec3Array,
	Vec4Array,
	QAngleArray,
	QuaternionArray,
	VMatrixArray,
}

export type DmxAttributeSingle = DmxElement | number | boolean | string | Uint8Array | Color | vec2 | vec3 | vec4 | mat4;
export type DmxAttributeArray = DmxElement[] | number[] | boolean[] | string[] | Uint8Array[] | Color[] | vec2[] | vec3[] | vec4[] | mat4[];
export type DmxAttributeValue = DmxAttributeSingle | DmxAttributeArray;

export class DmxAttribute {
	type: DmxAttributeType;
	value: DmxAttributeValue;

	constructor(type: DmxAttributeType, value: DmxAttributeValue) {
		this.type = type;
		this.value = value;
	}
}
