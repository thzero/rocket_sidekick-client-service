import CalculationEngineToolService from '../index';
import MathJsInstanceCalculationEngineToolService from './instance';

class MathJsCalculationEngineToolService extends CalculationEngineToolService {
	constructor() {
		super();
	}

	initialize(correlationId) {
		const instance = new MathJsInstanceCalculationEngineToolService(this);
		instance.init(this._injector);
		return instance;
	}
}

export default MathJsCalculationEngineToolService;
