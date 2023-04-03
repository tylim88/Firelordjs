import { QQC, MetaType, QueryFilterConstraints } from '../types'

export const buildPathFromColIDsAndDocIDs = ({
	collectionIDs,
	documentIDs,
}: {
	collectionIDs: string[]
	documentIDs: string[]
}) => {
	return collectionIDs.reduce((acc, collectionId, index) => {
		const documentID = documentIDs[index] ? `${documentIDs[index]}/` : ''
		return `${acc}${collectionId}/${documentID}`
	}, '')
}

export const queryBuilder = (
	queryConstraints: QQC<MetaType>[] | QueryFilterConstraints<MetaType>[]
) =>
	queryConstraints
		// @ts-expect-error
		.reduce((acc, qc) => {
			const type = qc.type
			if (
				type === 'startAt' ||
				type === 'startAfter' ||
				type === 'endAt' ||
				type === 'endBefore'
			) {
				qc.values.length !== 0 && acc.push(qc.ref)
			} else if (
				type === 'or' ||
				type === 'and' ||
				type === 'where' ||
				type === 'orderBy' ||
				type === 'limit' ||
				type === 'limitToLast'
			) {
				acc.push(qc)
			} else {
				acc.push(qc.ref)
			}
			return acc
		}, [])
