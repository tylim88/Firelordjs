import {
	updateDoc,
	MetaTypeCreator,
	getFirelord,
	DeleteField,
	deleteField,
} from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number | DeleteField
		b: number
	},
	'abc',
	string
>

const firelord = getFirelord()

const docRef = firelord<abc>('abc').doc('efg')

updateDoc(docRef, { a: deleteField(), b: deleteField() })
