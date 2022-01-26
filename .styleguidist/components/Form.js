import React, {forwardRef, useState, useCallback} from 'react';

const Form = forwardRef((props, ref) => {

	return (
		<form
			ref={ref}
			noValidate
			{...props}
		/>
	);
});

Form.displayName = 'Form';

export default Form;
