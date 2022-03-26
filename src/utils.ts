import { ObjectFlattenHybrid, FirelordFirestore, IsSame, IsTrue } from './types'

// for update
export const flatten = <T extends Record<string, unknown>>(object: T) => {
	let obj = {}

	const flat = (object: Record<string, unknown>, key: string) => {
		for (const prop in object) {
			const newKey = (key ? key + '.' : key) + prop
			if (
				typeof object[prop] === 'object' &&
				object[prop] !== null &&
				// https://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
				Object.getPrototypeOf(object[prop]) === Object.prototype
			) {
				flat(object[prop] as Record<string, unknown>, newKey)
			} else {
				obj = { ...obj, [newKey]: object[prop] }
			}
		}
	}

	flat(object, '')

	return obj as ObjectFlattenHybrid<T>
}

const firestore = 'firestore'
const lite = 'firestore-lite'

IsTrue<
	IsSame<typeof firestore | typeof lite, FirelordFirestore.Firestore['type']>
>()

export const isFirestore = (
	value: unknown
): value is FirelordFirestore.Firestore => {
	const v = value as Partial<FirelordFirestore.Firestore>
	return v?.type === firestore || v?.type === lite
}
