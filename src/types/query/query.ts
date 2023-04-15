import { MetaType } from '../metaTypeCreator'
import { QueryAllConstraints, QueryConstraints } from '../constraints'
import {
	QueryConstraintLimitation,
	FlattenQueryCompositeFilterConstraint,
	ValidateTopLevelQueryCompositeFilterPartOne,
	ValidateTopLevelQueryCompositeFilterPartTwo,
	ValidateOrderByAndInequalityWhere,
} from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'

export type QueryRef = <
	Z extends MetaType,
	Q extends Query<Z> | CollectionReference<Z>,
	const QQCs extends readonly QueryAllConstraints<Z>[]
>(
	query: Q extends never ? Q : Query<Z> | CollectionReference<Z>,
	...queryConstraints: QQCs extends never
		? QQCs
		: Z extends infer T extends MetaType
		? ValidateTopLevelQueryCompositeFilterPartOne<
				T,
				QQCs
		  > extends infer B extends string
			? B
			: ValidateTopLevelQueryCompositeFilterPartTwo<
					T,
					QQCs
			  > extends infer C extends string
			? C
			: FlattenQueryCompositeFilterConstraint<
					T,
					QQCs
			  > extends infer AllFlattenQCs extends QueryConstraints<Z>[]
			? ValidateOrderByAndInequalityWhere<
					T,
					AllFlattenQCs
			  > extends infer K extends string
				? K
				: QueryConstraintLimitation<T, Q, QQCs, [], AllFlattenQCs>
			: never
		: never
) => Query<Z>
