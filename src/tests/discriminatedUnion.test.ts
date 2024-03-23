import {
	MetaTypeCreator,
	getFirelord,
	getFirestore,
	updateDoc,
	query,
	where,
} from '../index'

type DU = MetaTypeCreator<
	| { a: { b: 1; c: 2 } | { b: 'a'; d: 'b' } }
	| { x: { y: 1; z: 2; u: 3 } | { y: 'a'; w: 'b'; v: 'c' } | false }
	| { c: false }
	| { c: true; v: 0 },
	'abc'
>

describe('test discrimination unions', () => {
	it('test update', () => {
		;() => {
			const du = getFirelord<DU>(getFirestore(), 'abc')
			const docRef = du.doc('123')
			updateDoc(docRef, { a: { b: 1 } })
			// @ts-expect-error
			updateDoc(docRef, { a: { b: 2 } })

			updateDoc(docRef, { 'a.b': 1 })
			// @ts-expect-error
			updateDoc(docRef, { 'a.b': 2 })

			updateDoc(docRef, { v: 0 })
			// @ts-expect-error
			updateDoc(docRef, { v: 1 })

			const v = false as boolean

			const x = v
				? {
						y: 1 as const,
				  }
				: {
						w: 'b' as const,
				  }

			// ok as expected
			updateDoc(docRef, {
				x,
			})

			// ok as expected
			updateDoc(docRef, {
				x: v
					? {
							y: 1,
							z: 2,
					  }
					: {
							w: 'b',
							v: 'c',
					  },
			})

			const data = {
				x: v
					? {
							y: 1,
							z: 2,
							u: 3,
					  }
					: {
							y: 'a',
							w: 'b',
							v: 'c',
					  },
			}
			// should be error because no const assertion but ok
			// @ts-expect-error
			updateDoc(docRef, data)
		}
	})

	it('test query', () => {
		;() => {
			const du = getFirelord<DU>(getFirestore(), 'abc')
			query(du.collection(), where('a.b', '==', 1))
			// @ts-expect-error
			query(du.collection(), where('a.b', '==', 2))

			query(du.collection(), where('v', '==', 0))
			// @ts-expect-error
			query(du.collection(), where('v', '==', 1))
		}
	})
})
