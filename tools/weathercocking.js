import AppCommonConstants from 'rocket_sidekick_common/constants';
import AppSharedConstants from '@/utility/constants';

import ToolsService from '@/service/tools/index';

class WeathercockingToolsService extends ToolsService {
    async init(injector) {
		await super.init(injector);

		this._serviceCalculationEngine = injector.getService(AppSharedConstants.InjectorKeys.SERVICE_TOOLS_CALCULATION_ENGINE);
    }

	initialize() {
		return {
			exitVelocity: null,
			exitVelocityMeasurementUnitId: null,
			exitVelocityMeasurementUnitsId: null,
			windVelocity: null,
			windVelocityMeasurementUnitId: null,
			windVelocityMeasurementUnitsId: null
		};
	}

	async initializeCalculation(correlationId, data, outputMeasurementUnitsId) {
		this._enforceNotNull('WeathercockingToolsService', 'initializeCalculation', data, 'data', correlationId);
		this._enforceNotEmpty('WeathercockingToolsService', 'initializeCalculation', outputMeasurementUnitsId, 'outputMeasurementUnitsId', correlationId);

		const exitVelocityMeasurementUnit = this._measurementUnitFromId(correlationId, data.exitVelocityMeasurementUnitsId, AppCommonConstants.MeasurementUnits.velocity.id, data.exitVelocityMeasurementUnitId);
		let response = this._enforceNotNullResponse('WeathercockingToolsService', 'initializeCalculation', exitVelocityMeasurementUnit, 'exitVelocityMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		const windVelocityMeasurementUnit = this._measurementUnitFromId(correlationId, data.windVelocityMeasurementUnitsId, AppCommonConstants.MeasurementUnits.velocity.id, data.windVelocityMeasurementUnitId);
		response = this._enforceNotNullResponse('WeathercockingToolsService', 'initializeCalculation', windVelocityMeasurementUnit, 'windVelocityMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;

		const calculationSteps = [
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'exitVelocity',
				value: data.exitVelocity,
				units: {
					from: exitVelocityMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.velocity.ms
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'windVelocity',
				value: data.windVelocity,
				units: {
					from: windVelocityMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.velocity.ms
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'angleRadians',
				evaluate: 'atan(windVelocity/exitVelocity) radian'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'angleDegrees',
				evaluate: 'angleRadians',
				unit: 'deg'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'temp',
				evaluate: 'angleDegrees / 1 deg'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'weathercocked',
				evaluate: 'temp > 20',
				result: true
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'angleDegrees',
				evaluate: 'angleDegrees',
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			}
		];

		return this._successResponse({
			steps: calculationSteps,
			instance: this._serviceCalculationEngine.initialize(correlationId)
		}, correlationId);
	}
}

export default WeathercockingToolsService;
