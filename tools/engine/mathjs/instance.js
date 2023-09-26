import { create, all } from 'mathjs';

import InstanceCalculationEngineToolService from '../instance';

class MathJsInstanceCalculationEngineToolService extends InstanceCalculationEngineToolService {
	constructor(engine) {
		super(engine);

		this._math = create(all);
		this._parser = this._math.parser();
		// this._math.import({
		// 		import: function () { throw new Error('Function import is disabled') },
		// 		createUnit: function () { throw new Error('Function createUnit is disabled') },
		// 		evaluate: function () { throw new Error('Function evaluate is disabled') },
		// 		parse: function () { throw new Error('Function parse is disabled') },
		// 		simplify: function () { throw new Error('Function simplify is disabled') },
		// 		derivative: function () { throw new Error('Function derivative is disabled') }
		// 	},
		// 	{
		// 		override: true
		// 	}
		// );

		this._formatters = [];
		this._initFormatters();

		this._watchers = [];
	}

	calculate(correlationId, calculationSteps, evaluationName) {
		this._enforceNotNull('MathJsInstanceCalculationEngineToolService', 'calculate', calculationSteps, 'calculationSteps', correlationId);

		this._evaluationName = !String.isNullOrEmpty(evaluationName) ? evaluationName : '';
		try {
			const results = {};
			const resultSteps = [];
			for (const calculationStep of calculationSteps)
				this._evaluate(correlationId, calculationStep, resultSteps);

			for (const resultStep of resultSteps) {
				if (resultStep.var) {
					results[resultStep.var] = this._parser.get(resultStep.var);
					continue;
				}

				if (resultStep.data) {
					for (const [key] of Object.entries(resultStep.data))
						results[key] = this._parser.get(key);
					continue;
				}
			}

			return this._engine._successResponse(results, correlationId);
		}
		catch (err) {
			return this._engine._error('MathJsInstanceCalculationEngineToolService', 'calculate', null, err, null, null, correlationId);
		}
	}

	evaluate(correlationId, calculationStep) {
		try {
			this._evaluate(correlationId, calculationStep);

			const results = {};
			if (calculationStep.result && !String.isNullOrEmpty(calculationStep.var))
				results[calculationStep.var] = this._parser.get(calculationStep.var);

			return this._engine._successResponse(results, correlationId);
		}
		catch (err) {
			return this._engine._error('MathJsInstanceCalculationEngineToolService', 'evaluate', null, err, null, null, correlationId);
		}
	}

	_evaluate(correlationId, calculationStep, resultSteps) {
		this._enforceNotNull('MathJsInstanceCalculationEngineToolService', '_evaluate', calculationStep, 'calculationStep', correlationId);

		let found = this._evaluateSet(correlationId, calculationStep, resultSteps);
		found |= this._evaluateEvaluate(correlationId, calculationStep, resultSteps);
		if (!found)
			throw Error('Unknown calculation type.');

		for (const watcher of this._watchers) {
			watcher.hasChanged = false;
			watcher.value = this._parser.get(watcher.var);

			for (const listener of this._listeners) {
				if (watcher.hasChanged)
					this._publish(correlationId, listener, this._engine.symTypeSet, watcher.var, watcher.value, this._evaluationName);
			}
		}
	}

	_evaluateEvaluate(correlationId, calculationStep, resultSteps) {
		if (calculationStep.type !== this._engine.symTypeEvaluate)
			return false;

		this._enforceNotEmpty('MathJsInstanceCalculationEngineToolService', '_evaluateEvaluate', calculationStep.evaluate, 'evaluate', correlationId);
		this._enforceNotEmpty('MathJsInstanceCalculationEngineToolService', '_evaluateEvaluate', calculationStep.var, 'var', correlationId);

		const step = `${calculationStep.var} = ${calculationStep.evaluate}`;
		for (const listener of this._listeners)
			this._publish(correlationId, listener, this._engine.symTypeEvaluate, step, null, this._evaluationName);

		this._parser.evaluate(step);
		let value = this._parser.get(calculationStep.var);

		if (calculationStep.unit) {
			const valueC = this._parser.get(calculationStep.var);
			const stepC = `${calculationStep.var} = ${calculationStep.var} to ${calculationStep.unit}`;
			const stepCP = `${calculationStep.var} = ${calculationStep.var} (${valueC}) to ${calculationStep.unit}`;
			for (const listener of this._listeners) {
				this._publish(correlationId, listener, this._engine.symTypeSet, calculationStep.var, value, this._evaluationName);
				this._publish(correlationId, listener, this._engine.symTypeEvaluate, stepCP, null, this._evaluationName);
			}

			this._parser.evaluate(stepC);
			value = this._parser.get(calculationStep.var);
		}

		if (calculationStep.result) {
			this._handleFormatting(correlationId, calculationStep, value);
			resultSteps.push(calculationStep);
		}

		this._initWatchers(correlationId, calculationStep);

		return true;
	}

	_evaluateSet(correlationId, calculationStep, resultSteps) {
		if (calculationStep.type !== this._engine.symTypeSet)
			return false;

		this._enforceNotEmptyEither('MathJsInstanceCalculationEngineToolService', '_evaluateSet', calculationStep.data, calculationStep.var, 'data', 'var', correlationId);

		if (!String.isNullOrEmpty(calculationStep.data)) {
			// turn data object into individual sets...
			let step;
			for (const [key, value] of Object.entries(calculationStep.data)) {
				step = { type: this._engine.symTypeSet, var: key, value: value, convert: calculationStep.convert, unit: calculationStep.unit, units: calculationStep.units, result: calculationStep.result, evaluationName: this._evaluationName };
				this._evaluateSet(correlationId, step, resultSteps);
			}
			return true;
		}

		if (String.isNullOrEmpty(calculationStep.var))
			return false;

		let value = calculationStep.value;
		if (value !== null) {
			if (calculationStep.unit) {
				value = this._math.unit(`${value} ${calculationStep.unit}`);
				for (const listener of this._listeners)
					this._publish(correlationId, listener, this._engine.symTypeSet, calculationStep.var, value, this._evaluationName);
				this._parser.set(calculationStep.var, value);
			}
			else if (calculationStep.units && calculationStep.units.from && calculationStep.units.to) {
				let temp = this._math.unit(`${value} ${calculationStep.units.from}`);
				for (const listener of this._listeners)
					this._publish(correlationId, listener, this._engine.symTypeSet, calculationStep.var, temp, this._evaluationName);
				this._parser.set(calculationStep.var, temp);
				this._parser.evaluate(`${calculationStep.var} = ${calculationStep.var} to ${calculationStep.units.to}`);
			}
			else {
				for (const listener of this._listeners)
					this._publish(correlationId, listener, this._engine.symTypeSet, calculationStep.var, value, this._evaluationName);
				this._parser.set(calculationStep.var, value);
			}
		}
		else
			this._parser.set(calculationStep.var, value);

		if (calculationStep.result) {
			this._handleFormatting(correlationId, calculationStep, value);
			resultSteps.push(calculationStep);
		}

		this._initWatchers(correlationId, calculationStep);

		return true;
	}

	_handleFormatting(correlationId, calculationStep, value) {
		if (!calculationStep.format)
			return false;

		let formatter;
		for (const temp of this._formatters) {
			formatter = temp(correlationId, calculationStep, value);
			if (!formatter)
				continue;
		}
		if (!formatter)
			return false;

		const valueF = this._parser.get(calculationStep.var);
		const stepF = `${calculationStep.var} = ${calculationStep.var} (${valueF}) ${formatter.publish}`;
		for (const listener of this._listeners) {
			this._publish(correlationId, listener, this._engine.symTypeSet, calculationStep.var, value, this._evaluationName);
			this._publish(correlationId, listener, this._engine.symTypeEvaluate, stepF, null, this._evaluationName);
		}

		if (formatter.func)
			formatter.func(correlationId, calculationStep, value);

		return true;
	}

	_handleFormattingFixed(correlationId, calculationStep, value) {
		if (!calculationStep.format)
			return;

		if (calculationStep.format !== this._engine.symFormatFixed)
			return {
				publish: `format fixed(2)`,
				func: ((correlationId, calculationStep, value) => {
					if (value) {
						value = this._math.format(value, {notation: 'fixed', precision: 2});
						this._parser.set(calculationStep.var, value);
					}
				}).bind(this)
			};
	}

	_initFormatters() {
		this._formatters.push(this._handleFormattingFixed.bind(this));
	}

	_initWatchers(correlationId, calculationStep) {
		if (String.isNullOrEmpty(calculationStep.var))
			return;

		this._watchers.push(this._proxy(calculationStep));
	}

	_publish(correlationId, listener, type, name, value) {
		listener(correlationId, type, name, value, this._evaluationName, {
			symTypeEvaluate: this.symTypeEvaluate,
			symTypeSet: this.symTypeSet
		});
	}
}

export default MathJsInstanceCalculationEngineToolService;
