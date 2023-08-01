import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryAllConstraints,
	QueryFilterConstraints,
	CursorType,
	QueryCompositeFilterConstraint,
} from '../queryConstraints'
import { GeneralQuery } from '../refs'
import { LimitToLastConstraintLimitation } from './limit'
import { CursorConstraintLimitation } from './cursor'
import { GetFirstOrderBy } from './orderBy'
import {
	GetFirstInequalityWhere,
	WhereConstraintLimitation,
	ValidateWhereArrayContainsArrayContainsAny,
} from './where'
import { InequalityOpStr } from './utils'
import { IsSame } from '../utils'
import { ErrorWhereOrderByAndInEquality } from '../error'
import {
	FlattenQueryCompositeFilterConstraint,
	QueryFilterConstraintLimitation,
} from './composite'

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
export type ValidateOrderByAndInequalityWhere<
	T extends MetaType,
	AllQCs extends readonly QueryConstraints<T>[]
> = GetFirstInequalityWhere<T, AllQCs> extends infer W extends WhereConstraint<
	T,
	string,
	InequalityOpStr,
	unknown
>
	? GetFirstOrderBy<T, AllQCs> extends infer O
		? O extends OrderByConstraint<string>
			? IsSame<W['fieldPath'], O['fieldPath']> extends true
				? true
				: ErrorWhereOrderByAndInEquality<O['fieldPath'], W['fieldPath']>
			: true // orderBy not found
		: true // inequality Where not found
	: true // impossible route

export type QueryConstraintLimitation<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	RestQQCs extends readonly QueryAllConstraints<T>[],
	PreviousQCs extends readonly QueryConstraints<T>[],
	AllQCs extends readonly QueryConstraints<T>[]
> = RestQQCs extends [
	infer Head extends QueryAllConstraints<T>,
	...infer Rest extends QueryAllConstraints<T>[]
]
	? [
			Head extends LimitConstraint<'limit'> | OrderByConstraint<string>
				? Head
				: Head extends LimitConstraint<'limitToLast'>
				? LimitToLastConstraintLimitation<T, Head, AllQCs>
				: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
				? ValidateWhereArrayContainsArrayContainsAny<
						T,
						Head,
						PreviousQCs
				  > extends infer J extends string
					? J
					: WhereConstraintLimitation<T, Q, Head, PreviousQCs>
				: Head extends CursorConstraint<CursorType, unknown[]>
				? CursorConstraintLimitation<T, Q, Head, PreviousQCs>
				: Head extends QueryCompositeFilterConstraint<
						T,
						'and' | 'or',
						QueryFilterConstraints<T>[]
				  >
				? QueryFilterConstraintLimitation<
						T,
						Q,
						[Head],
						PreviousQCs,
						Head
				  > extends [infer P]
					? P
					: never // impossible route
				: never, // impossible route
			...QueryConstraintLimitation<
				T,
				Q,
				Rest,
				[...PreviousQCs, ...FlattenQueryCompositeFilterConstraint<T, [Head]>],
				AllQCs
			>
	  ]
	: RestQQCs // indicate RestQCs is []
