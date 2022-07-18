import { onSnapshot as onSnapshot_ } from 'firebase/firestore'
import {
	MetaType,
	Query,
	DocumentReference,
	OriFirestoreError,
	OriSnapshotListenOptions,
	OriQuery,
	Unsubscribe,
	DocumentSnapshot,
	QuerySnapshot,
	FirestoreError,
	SnapshotListenOptions,
} from '../types'

export const isOptions = (
	arg:
		| ((error: OriFirestoreError) => void)
		| (() => void)
		| OriSnapshotListenOptions
		| undefined
): arg is OriSnapshotListenOptions => {
	const v = arg as Partial<OriSnapshotListenOptions>
	return v?.includeMetadataChanges !== undefined // includeMetadataChanges is boolean, so check for undefined
}

export const onSnapshot: OnSnapshot = (
	reference,
	onNext,
	onError?: ((error: FirestoreError) => void) | OriSnapshotListenOptions,
	options?: OriSnapshotListenOptions
) => {
	const newOnError = isOptions(onError) ? undefined : onError
	const newOptions = options || (isOptions(onError) ? onError : undefined)

	return newOptions
		? onSnapshot_(reference as OriQuery, newOptions, {
				// @ts-expect-error
				next: onNext,
				error: newOnError,
		  })
		: onSnapshot_(
				reference as OriQuery,
				// @ts-expect-error
				onNext,
				newOnError
		  )
}

type OnSnapshot = {
	/**
	 * Attaches a listener for `DocumentSnapshot` events. You may either pass
	 * individual `onNext` and `onError` callbacks or pass a single observer
	 * object with `next` and `error` callbacks.
	 *
	 * NOTE: Although an `onCompletion` callback can be provided, it will
	 * never be called because the snapshot stream is never-ending.
	 *
	 * @param reference - A reference to the document to listen to.
	 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
	 * is available.
	 * @param onError - An optional callback to be called if the listen fails or is
	 * cancelled. No further callbacks will occur.
	 * @param options - Options controlling the listen behavior.
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Query<T> | DocumentReference<T>>(
		reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void,
		onError?: (error: FirestoreError) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	/**
	 * Attaches a listener for `DocumentSnapshot` events. You may either pass
	 * individual `onNext` and `onError` callbacks or pass a single observer
	 * object with `next` and `error` callbacks.
	 *
	 * NOTE: Although an `onCompletion` callback can be provided, it will
	 * never be called because the snapshot stream is never-ending.
	 *
	 * @param reference - A reference to the document to listen to.
	 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
	 * is available.
	 * @param options - Options controlling the listen behavior.
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Query<T> | DocumentReference<T>>(
		reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
}
