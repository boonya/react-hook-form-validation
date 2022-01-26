import React, {forwardRef, useMemo} from 'react';

const Checks = forwardRef(({
	items,
	description,
	label,
	required,
	id,
	name,
	['aria-invalid']: invalid,
}, ref) => {
	const inputClassName = useMemo(() => {
		const classes = ['form-check-input'];

		if (invalid === true) {
			classes.push('is-invalid');
		}

		if (invalid === false) {
			classes.push('is-valid');
		}

		return classes.join(' ');
	}, [invalid]);

	const fieldsetClassName = useMemo(() => {
		const classes = [];

		if (invalid === true) {
			classes.push('is-invalid');
		}

		if (invalid === false) {
			classes.push('is-valid');
		}

		return classes.join(' ');
	}, [invalid]);

	const children = items.map(([itemLabel, value]) => {
		const itemId = `${id}-${itemLabel.toLowerCase().replace(/\s:#/ui, '-')}`;
		return (
			<div className="form-check" key={itemId}>
				<input
					className={inputClassName}
					type="checkbox"
					value={value}
					id={itemId}
					name={name}
				/>
				<label
					className="form-check-label"
					htmlFor={itemId}
				>
					{itemLabel}
				</label>
			</div>
		);
	});

	return (
		<div className="mb-3">
			<legend>
				{label}
				{required && <span aria-hidden="true"> *</span>}
			</legend>
			<fieldset
				ref={ref}
				id={id}
				aria-invalid={invalid}
				aria-describedby={id && description && `${id}-description`}
				className={fieldsetClassName}
			>
				{children}
			</fieldset>
			{description && (
				<p
					id={id && `${id}-description`}
					className={invalid ? 'invalid-feedback' : 'valid-feedback'}
				>
					{description}
				</p>
			)}
		</div>
	)
});

Checks.displayName = 'Checks';

export default Checks;
