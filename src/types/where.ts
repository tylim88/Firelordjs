import { WhereConstraint } from './constraints'
import { MetaType } from './metaTypeCreator'
import { WhereFilterOp } from './alias'
import { __name__ } from './fieldPath'

export type Where = <
	T extends MetaType,
	FieldPath extends (keyof T['writeFlatten'] & string) | __name__,
	OpStr extends WhereFilterOp,
	const Value
>(
	fieldPath: FieldPath,
	opStr: OpStr,
	value: Value
) => WhereConstraint<T, FieldPath, OpStr, Value>
