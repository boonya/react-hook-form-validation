import React, {forwardRef, useMemo} from 'react';

const Input = forwardRef(({
	id,
	label,
	description,
	required,
	['aria-invalid']: invalid,
	...props
}, ref) => {

	const inputClassName = useMemo(() => {
		const classes = ['form-control'];

		if (invalid === true) {
			classes.push('is-invalid');
		}

		if (invalid === false) {
			classes.push('is-valid');
		}

		return classes.join(' ');
	}, [invalid]);

	return (
		<div className="mb-3">
			<label htmlFor={id} className="form-label">
				{label}
				{required && <span aria-hidden="true"> *</span>}
			</label>
			<input
				ref={ref}
				id={id}
				className={inputClassName}
				aria-describedby={id && description && `${id}-description`}
				autoComplete="off"
				aria-invalid={invalid}
				{...props}
			/>
			{description && (
				<p
					id={id && `${id}-description`}
					className={invalid ? 'invalid-feedback' : 'valid-feedback'}
				>
					{description}
				</p>
			)}
		</div>
	);
});

Input.displayName = 'Input';

export default Input;
