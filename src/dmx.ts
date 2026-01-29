import { DmxElement } from './dmxelement';

export class Dmx {
	root: DmxElement | null = null;
	format = '';
	version = 0;

	constructor(format: string = '', version = 0) {
		this.format = format;
		this.version = version;
	}

	/*
	setRoot(root: DmxElement): void {
		this.#root = root;
	}

	getRoot(): DmxElement | null {
		return this.#root;
	}
	*/
}
