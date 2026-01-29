import { Color } from 'harmony-utils';
import { mat4 } from 'gl-matrix';
import { quat } from 'gl-matrix';
import { vec2 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import { vec4 } from 'gl-matrix';

export declare class Dmx {
    root: DmxElement | null;
    format: string;
    version: number;
    constructor(format?: string, version?: number);
}

export declare class DmxAttribute {
    type: DmxAttributeType;
    value: DmxAttributeValue;
    constructor(type: DmxAttributeType, value: DmxAttributeValue);
}

export declare type DmxAttributeArray = DmxElement[] | number[] | boolean[] | string[] | Uint8Array[] | Color[] | vec2[] | vec3[] | vec4[] | mat4[];

export declare type DmxAttributeSingle = DmxElement | number | boolean | string | Uint8Array | Color | vec2 | vec3 | vec4 | mat4;

export declare enum DmxAttributeType {
    Unknown = 0,
    Element = 1,
    Integer = 2,
    Float = 3,
    Boolean = 4,
    String = 5,
    Binary = 6,
    Time = 7,
    Color = 8,//rgba
    Vec2 = 9,
    Vec3 = 10,
    Vec4 = 11,
    QAngle = 12,
    Quaternion = 13,
    VMatrix = 14,
    ElementArray = 15,
    IntegerArray = 16,
    FloatArray = 17,
    BooleanArray = 18,
    StringArray = 19,
    BinaryArray = 20,
    TimeArray = 21,
    ColorArray = 22,
    Vec2Array = 23,
    Vec3Array = 24,
    Vec4Array = 25,
    QAngleArray = 26,
    QuaternionArray = 27,
    VMatrixArray = 28
}

export declare type DmxAttributeValue = DmxAttributeSingle | DmxAttributeArray;

export declare class DmxElement {
    id: string;
    class: string;
    name: string;
    readonly attributes: Map<string, DmxAttribute>;
    constructor(id: string, clas: string, name: string);
    addAttribute(name: string, attribute: DmxAttribute): void;
    addElementAttribute(name: string, value: DmxElement): void;
    addIntegerAttribute(name: string, value: number): void;
    addFloatAttribute(name: string, value: number): void;
    addBooleanAttribute(name: string, value: boolean): void;
    addStringAttribute(name: string, value: string): void;
    addBinaryAttribute(name: string, value: Uint8Array): void;
    addTimeAttribute(name: string, value: number): void;
    addColorAttribute(name: string, value: Color): void;
    addVec2Attribute(name: string, value: vec2): void;
    addVec3Attribute(name: string, value: vec3): void;
    addVec4Attribute(name: string, value: vec4): void;
    addQAngleAttribute(name: string, value: vec3): void;
    addQuaternionAttribute(name: string, value: quat): void;
    addVMatrixAttribute(name: string, value: mat4): void;
    addElementArrayAttribute(name: string, value: DmxElement[]): void;
    addIntegerArrayAttribute(name: string, value: number[]): void;
    addFloatArrayAttribute(name: string, value: number[]): void;
    addBooleanArrayAttribute(name: string, value: boolean[]): void;
    addStringArrayAttribute(name: string, value: string[]): void;
    addBinaryArrayAttribute(name: string, value: Uint8Array[]): void;
    addTimeArrayAttribute(name: string, value: number[]): void;
    addColorArrayAttribute(name: string, value: Color[]): void;
    addVec2ArrayAttribute(name: string, value: vec2[]): void;
    addVec3ArrayAttribute(name: string, value: vec3[]): void;
    addVec4ArrayAttribute(name: string, value: vec4[]): void;
    addQAngleArrayAttribute(name: string, value: vec3[]): void;
    addQuaternionArrayAttribute(name: string, value: quat[]): void;
    addVMatrixArrayAttribute(name: string, value: mat4[]): void;
}

export declare function guidToString(bytes: Uint8Array): string;

export declare function serializeDmxText(dmx: Dmx): string | null;

export declare function unserializeDmx(content: File | string | ArrayBuffer): Promise<Dmx | null>;

export declare function unserializeDmxSync(content: string | ArrayBuffer): Dmx | null;

export { }
