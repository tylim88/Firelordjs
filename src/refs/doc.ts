import {
	MetaType,
	DocumentReference,
	FirelordFirestore,
	IsValidID,
} from '../types'
import { doc as doc_ } from 'firebase/firestore'
import { isFirestore } from '../utils'

// tested with update
export const docCreator =
	<T extends MetaType>(
		fStore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	): Doc<T> => // @ts-expect-error
	(firestore, documentId) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docId = isFirestore(firestore) ? documentId : firestore
		return doc_(
			fs,
			collectionPath + '/' + docId
		) as unknown as DocumentReference<T>
	}

type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param path - A slash-separated path to a document.
	 * @throws If the final path has an odd number of segments and does not point to
	 * a document.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document'>
			? T['docID']
			: IsValidID<DocumentId, 'Document'>
	): DocumentReference<T>
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param firestore - A reference to the root `Firestore` instance.
	 * @param path - A slash-separated path to a document.
	 * @throws If the final path has an odd number of segments and does not point to
	 * a document.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		firestore: FirelordFirestore.Firestore,
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document'>
			? T['docID']
			: IsValidID<DocumentId, 'Document'>
	): DocumentReference<T>
}
