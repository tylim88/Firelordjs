import { WhereConstraint } from './query'
import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'

export type QueryCompositeFilterConstraint<
	T extends MetaType,
	Y extends 'and' | 'or'
> = {
	type: Y
	'do_not_access.query_filter_constraint': QueryFilterConstraints<T>[]
}

export type QueryFilterConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| QueryCompositeFilterConstraint<T, 'and' | 'or'>
