import AppConstants from '@/utility/constants';

import ToolsService from '@/service/tools/index';

class FoamToolsService extends ToolsService {
	constructor() {
		super();
	}

    init(injector) {
		this._serviceCalculationEngine = injector.getService(AppConstants.InjectorKeys.SERVICE_TOOLS_CALCULATION_ENGINE);
    }

	foams(correlationId) {
		return this._successResponse([
			{
				manufacturer: 'FOAM-IT',
				expansion: 10,
				densityM: 0.080092317,
				densityE: 0.046296296
			},
			{
				manufacturer: 'Mac Performance',
				expansion: 15,
				densityM: 0.064073853,
				densityE: 0.037037037
			},
			{
				manufacturer: 'Public Missiles',
				expansion: 10,
				densityM: 0.09611078,
				densityE: 0.055555556
			},
			{
				manufacturer: 'Public Missiles',
				expansion: 15,
				densityM: 0.064073853,
				densityE: 0.037037037
			},
			{
				manufacturer: 'Public Missiles',
				expansion: 20,
				densityM: 0.04805539,
				densityE: 0.027777778
			}
		]);
	}

	initialize() {
		return {
			bodyTubeID: null,
			finRootLength: null,
			finTabLength: null,
			finWidth: null,
			motorTubeOD: null,
			numberFins: null
		};
	}

	async initializeCalculation(correlationId, data, outputMeasurementUnitsId) {
		this._enforceNotNull('FoamToolsService', 'initializeCalculation', data, 'data', correlationId);
		this._enforceNotEmpty('FoamToolsService', 'initializeCalculation', outputMeasurementUnitsId, 'outputMeasurementUnitsId', correlationId);

		const fluidMeasurementUnit = this._measurementUnitFromId(correlationId, data.fluidMeasurementUnitsId, AppConstants.MeasurementUnits.fluid.id, data.fluidMeasurementUnitId);
		let response = this._enforceNotNullResponse('FoamToolsService', 'initializeCalculation', fluidMeasurementUnit, 'fluidMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		const lengthMeasurementUnit = this._measurementUnitFromId(correlationId, data.lengthMeasurementUnitsId, AppConstants.MeasurementUnits.length.id, data.lengthMeasurementUnitId);
		response = this._enforceNotNullResponse('FoamToolsService', 'initializeCalculation', lengthMeasurementUnit, 'lengthMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;

		const calculationSteps = [
			{
				type: this._serviceCalculationEngine.symTypeSet,
				data: {
					bodyTubeID: data.bodyTubeID,
					finRootLength: data.finRootLength,
					finTabLength: data.finTabLength,
					finWidth: data.finWidth,
					motorTubeOD: data.motorTubeOD
				},
				units: {
					from: lengthMeasurementUnit,
					to: AppConstants.MeasurementUnits.metrics.length.mm
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'volumeBodyTube',
				evaluate: 'pi * ((bodyTubeID / 2) ^ 2) * finRootLength'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'volumeMotorTube',
				evaluate: 'pi * ((motorTubeOD / 2) ^ 2) * finRootLength'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'volumeDifferenceBetweenBodyTube',
				evaluate: 'volumeBodyTube - volumeMotorTube'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'volumeFins',
				evaluate: '(finTabLength ? finTabLength : finRootLength) * finWidth * (bodyTubeID - motorTubeOD)'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'volumeDifferenceWithoutFins',
				evaluate: 'volumeDifferenceBetweenBodyTube - volumeFins'
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'totalVolume',
				evaluate: 'volumeBodyTube - volumeMotorTube - volumeFins',
				result: true,
				format: this._serviceCalculationEngine.formatFixed(),
				unit: fluidMeasurementUnit
			}
		];

		return this._successResponse({
			steps: calculationSteps,
			instance: this._serviceCalculationEngine.initialize(correlationId)
		}, correlationId);
	}

	async initializeCalculationFoam(correlationId, data, outputMeasurementUnitsId) {
		this._enforceNotNull('FoamToolsService', 'initializeCalculationFoam', data, 'data', correlationId);
		this._enforceNotEmpty('FoamToolsService', 'initializeCalculationFoam', outputMeasurementUnitsId, 'outputMeasurementUnitsId', correlationId);

		const calculationSteps = [
			{
				type: this._serviceCalculationEngine.symTypeSet,
				data: {
					manufacturer: data.manufacturer,
					expansion: data.expansion
				},
				result: true
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'totalVolume',
				evaluate: data.totalVolume,
				unit: AppConstants.MeasurementUnits.metrics.fluid.ml
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'density',
				value: data.densityM,
				unit: 'g/ml'
				// result: true,
				// format: this._serviceCalculationEngine.formatFixed()
			},
			// {
			// 	type: this._serviceCalculationEngine.symTypeSet,
			// 	var: 'densityE',
			// 	value: data.densityE,
			// 	unit: 'oz/in^3',
			// 	result: true,
			// 	format: this._serviceCalculationEngine.formatFixed()
			// },
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'foamWeight',
				evaluate: 'density * totalVolume',
				unit: AppConstants.MeasurementUnits[outputMeasurementUnitsId].weight.default,
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			},
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'requiredAmount',
				evaluate: 'totalVolume / expansion',
				result: true,
				unit: AppConstants.MeasurementUnits[outputMeasurementUnitsId].fluid.default,
				format: this._serviceCalculationEngine.formatFixed()
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'densityMD',
				value: data.densityM,
				unit: 'g/ml',
				result: true,
				format: this._serviceCalculationEngine.formatFixed()
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'densityED',
				value: data.densityE,
				unit: 'oz/in^3',
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

export default FoamToolsService;
