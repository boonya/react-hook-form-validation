import React, {forwardRef, useMemo} from 'react';

const Button = forwardRef(({type, ...props}, ref) => {
	const className = useMemo(() => {
		const classes = ['btn me-3'];

		if (type === 'reset') {
			classes.push('btn-secondary')
		}
		else {
			classes.push('btn-primary')
		}

		return classes.join(' ');
	}, [type]);


	return (
		<button
			ref={ref}
			type={type || 'button'}
			className={className}
			{...props}
		/>
	);
});

Button.displayName = 'Button';

export default Button;
