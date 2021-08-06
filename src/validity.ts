import { DEFAULT_FIELD_STATE, FormValidity, FieldState } from './types';

export default class Validity implements FormValidity {
	constructor(private validity: FieldState[]) { }

	private getFieldValidity(field: string, index = 0) {
		const result = this.validity.find((i) => i.name === field && i.index === index);
		if (result) {
			return result;
		}
		return { ...DEFAULT_FIELD_STATE, name: field };
	}

	values(): FieldState[] {
		return this.validity;
	}

	isError(field?: string, index?: number): boolean {
		if (field) {
			const { error } = this.getFieldValidity(field, index);
			return error === true;
		}
		return this.validity.length > 0 && this.validity.some(({ error }) => error === true);
	}

	isValid(field?: string, index?: number): boolean {
		return !this.isError(field, index);
	}

	isPristine(field?: string, index?: number): boolean {
		if (field) {
			const { pristine } = this.getFieldValidity(field, index);
			return pristine === true;
		}
		return this.validity.every(({ pristine }) => pristine === true);
	}

	isDirty(field?: string, index?: number): boolean {
		return !this.isPristine(field, index);
	}

	getMessage(field: string, index?: number): string | undefined {
		const { message } = this.getFieldValidity(field, index);
		return message;

	}

	getFormMessages(): string[] {
		return this.validity.map(({ message }) => message).filter((v) => v) as [];
	}
}
