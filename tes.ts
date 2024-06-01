// Change d/m/yyyy to dd-mm-yyyy
console.log(
	new Date().toLocaleDateString('id-ID', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).split('/').join('-')
);
