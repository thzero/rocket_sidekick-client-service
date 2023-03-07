import ToolsService from '@/service/tools/index';

class CalculationEngineToolService extends ToolsService {
	constructor() {
		super();

		this._listeners = [];

		this.symConvertNumber = Symbol('number');

		this.symFormatFixed = Symbol('fixed');

		this.symTypeEvaluate = Symbol('evaluate');
		this.symTypeSet = Symbol('set');
	}

	initialize(correlationId) {
		this.notImplementedError();
	}

	formatFixed(precision) {
		precision = precision || 2;
		return {
			type: this.symFormatFixed,
			precision: 2
		};
	}
}

export default CalculationEngineToolService;
