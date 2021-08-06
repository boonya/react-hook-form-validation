export enum VALIDATORS {
	required = 'required',
	minLength = 'minLength',
	maxLength = 'maxLength',
	email = 'email',
	url = 'url',
	pattern = 'pattern',
	custom = 'custom',
}

export enum VALIDATION_MESSAGES {
	required = 'required',
	minLength = 'min-length',
	maxLength = 'max-length',
	email = 'email',
	url = 'url',
	pattern = 'pattern',
	invalid = 'invalid',
}

export type ValidationMessage = string | ((...args: unknown[]) => string);

export type ValidatorCommonParams = { message?: ValidationMessage };
export type ValidatorLengthParams = ValidatorCommonParams & { expected: number };
export type ValidatorPatternParams = ValidatorCommonParams & { pattern: RegExp };
export type ValidatorCustomParams = ValidatorCommonParams & { func: (...args: unknown[]) => boolean };

export type LengthValue = string | number | Array<unknown>;

export type FormPayload = { [key: string]: unknown[] };

export type FieldState = {
	name: string;
	index: number;
	pristine: boolean;
	error: boolean;
	message?: string;
};

export const DEFAULT_FIELD_STATE: Omit<FieldState, 'name'> = {
	index: 0,
	pristine: true,
	error: false,
	message: undefined,
};

export type Condition = [(...args: unknown[]) => boolean, ...string[]];

export type FieldRule = {
	validator: VALIDATORS;
	condition?: Condition;
};

export type FieldRuleSet = FieldRule[];

export type ValidationRule = {
	field: string;
	rules?: FieldRuleSet;
};

export type Processor = (payload: FormPayload, field: string, index: number) => FieldState;

export type ValidationRuleSet = ValidationRule[];

type checkFunction = (field?: string, index?: number) => boolean;

export interface FormValidity {
	values: () => FieldState[];
	isValid: checkFunction;
	isError: checkFunction;
	isPristine: checkFunction;
	isDirty: checkFunction;
	getMessage: (field: string, index?: number) => string | undefined;
	getFormMessages: () => string[];
}

export type ValidateFormFunction = (payload: FormPayload) => FormValidity;

export type ValidateFieldFunction = (payload: FormPayload, name: string, index?: number) => FormValidity;

export type ResetFormFunction = () => FormValidity;

export type HookResult = {
	validateForm: ValidateFormFunction,
	validateField: ValidateFieldFunction,
	validity: FormValidity,
	resetForm: ResetFormFunction,
};
