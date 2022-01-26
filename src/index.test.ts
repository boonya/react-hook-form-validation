[
	'default',
	'validateEmail',
	'validateFunc',
	'validateMax',
	'validateMin',
	'validatePattern',
	'validateRequired',
	'validateUrl',
].forEach((object) => {
	it(`Object "${object}" should be available to be imported.`, async () => {
		const index = await import('./index');

		expect(index[object]).not.toBeUndefined();
	});
});
