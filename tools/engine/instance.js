import LibraryCommonUtility from '@thzero/library_common/utility/index';

import BaseService from '@thzero/library_client/service/index';

class InstanceCalculationEngineToolService extends BaseService {
	constructor(engine) {
		super();

		this._engine = engine;

		this._listeners = [];
	}

	get symTypeEvaluate() { return this._engine.symTypeEvaluate; }
	get symTypeSet() { return this._engine.symTypeSet; }

	addListener(correlationId, func) {
		if (!func || LibraryCommonUtility.isNotFunction(func))
			return;

		this._listeners.push(func);
	}

	calculate(correlationId) {
		this.notImplementedError();
	}

	initialize(correlationId) {
		this.notImplementedError();
	}

	_proxy(calculationStep) {
		if (!calculationStep)
			throw Error('Invalid calculation step.');

		return new Proxy({ var: calculationStep.var, hasChanged: true, value: null }, this._proxyUpdateHandler)
	}

	_proxyUpdateHandler = {
		set(target, prop, value) {
			if (prop === 'hasChanged') {
				target['hasChanged'] = value;
				return true;
			}

			const previous = target[prop];
			if (previous === value)
				return true;
			
			target[prop] = value;
			target['hasChanged'] = true;
			return true;
		}
	}
}

export default InstanceCalculationEngineToolService;
