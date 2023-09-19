import AppCommonConstants from 'rocket_sidekick_common/constants';
import AppSharedConstants from '@/utility/constants';

import ToolsService from '@/service/tools/index';

class Thrust2WeightToolsService extends ToolsService {
    async init(injector) {
		await super.init(injector);

		this._serviceCalculationEngine = injector.getService(AppSharedConstants.InjectorKeys.SERVICE_TOOLS_CALCULATION_ENGINE);
    }

	initialize() {
		return {
			mass: null,
			maxLaunchRodTime: null,
			motor: null,
			thrustAverage: null,
			thrustInitial: null,
			thrustPeak: null
		};
	}

	async initializeCalculation(correlationId, data, outputMeasurementUnitsId) {
		this._enforceNotNull('Thrust2WeightToolsService', 'initializeCalculation', data, 'data', correlationId);
		this._enforceNotNull('Thrust2WeightToolsService', 'initializeCalculation', data.thrustInitial, 'data.thrustInitial', correlationId);
		this._enforceNotNull('Thrust2WeightToolsService', 'initializeCalculation', data.mass, 'data.mass', correlationId);
		this._enforceNotNull('Thrust2WeightToolsService', 'initializeCalculation', data.unitId, 'data.unitId', correlationId);
		this._enforceNotNull('Thrust2WeightToolsService', 'initializeCalculation', data.maxLaunchRodTime, 'data.maxLaunchRodTime', correlationId);
		this._enforceNotEmpty('Thrust2WeightToolsService', 'initializeCalculation', outputMeasurementUnitsId, 'outputMeasurementUnitsId', correlationId);

		data.thrustAverage = data.thrustAverage ?? null;
		data.thrustPeak = data.thrustPeak ?? null;

		const calculationSteps = [
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'gravity',
				value: 9.8,
				unit: AppCommonConstants.MeasurementUnits.metrics.acceleration.ms2
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'massInKg',
				value: data.mass,
				units: {
					from: data.units,
					to: AppCommonConstants.MeasurementUnits.metrics.weight.kg
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				data: {
					thrustInitial: data.thrustInitial,
					thrustPeak: data.thrustPeak,
					thrustAverage: data.thrustAverage
				},
				unit: 'N'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'massInNewtons',
				evaluate: 'massInKg * gravity'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'initial',
				evaluate: 'thrustInitial / massInNewtons',
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'peak',
				value: '0'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'peak',
				evaluate: 'thrustPeak != null ? thrustPeak / massInNewtons : null',
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'average',
				value: '0'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'average',
				evaluate: 'thrustAverage != null ? thrustAverage / massInNewtons : null',
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			}
		];

		return this._successResponse({
			steps: calculationSteps,
			instance: this._serviceCalculationEngine.initialize(correlationId)
		}, correlationId);
	}

	update(correlationId, motor, data) {
		if (!motor || !motor.samples || (motor.samples.length <= 0) || !data)
			return;

		data.thrustAverage = motor.avgThrustN;
		data.thrustPeak = motor.maxThrustN;
		data.thrustInitial = 0;
		for (const sample of motor.samples) {
			if (sample.time > data.maxLaunchRodTime)
				break;

			if (sample.thrust > data.thrustInitial)
				data.thrustInitial = sample.thrust;
			if (sample.thrust > data.thrustPeak)
				data.thrustPeak = sample.thrust;
		}

		return this._successResponse(data, correlationId);
	}
}

export default Thrust2WeightToolsService;
