import { PartialNoUndefinedAndNoUnknownMemberNoEmptyMember } from './partialNoUndefinedAndNoUnknownMember'
import { DocumentReference } from './refs'
import { DocumentData } from './alias'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'
import { MetaType } from './metaTypeCreator'

export type UpdateCreator<U, NoFlatten extends boolean> = <
	T extends MetaType,
	Data extends DocumentData
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['writeFlatten'],
				Data,
				false,
				NoFlatten,
				true
		  >
) => U

export type Update = UpdateCreator<Promise<void>, false>

export type UpdateNoFlatten = UpdateCreator<Promise<void>, true>

export type TransactionUpdate = UpdateCreator<Transaction, false>

export type TransactionUpdateNoFlatten = UpdateCreator<
	Transaction | undefined,
	true
>

export type WriteBatchUpdate = UpdateCreator<WriteBatch, false>

export type WriteBatchUpdateNoFlatten = UpdateCreator<
	WriteBatch | undefined,
	true
>
