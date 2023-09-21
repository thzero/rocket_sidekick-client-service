import AppCommonConstants from 'rocket_sidekick_common/constants';
import AppSharedConstants from '@/utility/constants';

import ToolsService from '@/service/tools/index';

// https://www.apogeerockets.com/education/downloads/Newsletter449.pdf
// http://www.rocketmime.com/rockets/descent.html
class ParachuteSizingToolsService extends ToolsService {
    async init(injector) {
		await super.init(injector);

		this._serviceCalculationEngine = injector.getService(AppSharedConstants.InjectorKeys.SERVICE_TOOLS_CALCULATION_ENGINE);
    }

	initialize() {
		return {
			airDensityMeasurementUnitId: null,
			airDensityMeasurementUnitsId: null,
			coeffDrag: null,
			airDensity: null,
			desiredVelocity: null,
			desiredVelocityMeasurementUnitId: null,
			desiredVelocityMeasurementUnitsId: null
		};
	}

	async initializeCalculation(correlationId, data, outputMeasurementUnitsId) {
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data, 'data', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.airDensity, 'data.airDensity', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.airDensityMeasurementUnitId, 'data.airDensityMeasurementUnitId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.airDensityMeasurementUnitsId, 'data.airDensityMeasurementUnitsId', correlationId);
		this._enforceNotEmpty('ParachuteSizingToolsService', 'initializeCalculation', data.calculationType, 'data.calculationType', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.coeffDrag, 'data.coeffDrag', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.desiredVelocity, 'data.desiredVelocity', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.desiredVelocityMeasurementUnitId, 'data.desiredVelocityMeasurementUnitId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.desiredVelocityMeasurementUnitsId, 'data.desiredVelocityMeasurementUnitsId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.diameterLengthMeasurementUnitId, 'data.diameterLengthMeasurementUnitId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.diameterLengthMeasurementUnitsId, 'data.diameterLengthMeasurementUnitsId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.mass, 'data.mass', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.massWeightMeasurementUnitId, 'data.massWeightMeasurementUnitId', correlationId);
		this._enforceNotNull('ParachuteSizingToolsService', 'initializeCalculation', data.massWeightMeasurementUnitsId, 'data.massWeightMeasurementUnitsId', correlationId);
		this._enforceNotEmpty('ParachuteSizingToolsService', 'initializeCalculation', data.parachuteShape, 'data.parachuteShape', correlationId);
		this._enforceNotEmpty('ParachuteSizingToolsService', 'initializeCalculation', data.spillHoleShape, 'data.spillHoleShape', correlationId);
		this._enforceNotEmpty('ParachuteSizingToolsService', 'initializeCalculation', outputMeasurementUnitsId, 'outputMeasurementUnitsId', correlationId);

		const airDensityMeasurementUnit = this._measurementUnitFromId(correlationId, data.airDensityMeasurementUnitsId, AppCommonConstants.MeasurementUnits.density.id, data.airDensityMeasurementUnitId);
		let response = this._enforceNotNullResponse('ParachuteSizingToolsService', 'initializeCalculation', airDensityMeasurementUnit, 'airDensityMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		data.airDensityMeasurementUnit = airDensityMeasurementUnit;
		const desiredVelocityMeasurementUnit = this._measurementUnitFromId(correlationId, data.desiredVelocityMeasurementUnitsId, AppCommonConstants.MeasurementUnits.velocity.id, data.desiredVelocityMeasurementUnitId);
		response = this._enforceNotNullResponse('ParachuteSizingToolsService', 'initializeCalculation', desiredVelocityMeasurementUnit, 'desiredVelocityMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		data.desiredVelocityMeasurementUnit = desiredVelocityMeasurementUnit;
		const diameterLengthMeasurementUnit = this._measurementUnitFromId(correlationId, data.diameterLengthMeasurementUnitsId, AppCommonConstants.MeasurementUnits.length.id, data.diameterLengthMeasurementUnitId);
		response = this._enforceNotNullResponse('ParachuteSizingToolsService', 'initializeCalculation', diameterLengthMeasurementUnit, 'diameterLengthMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		data.diameterLengthMeasurementUnit = diameterLengthMeasurementUnit;
		const massWeightMeasurementUnit = this._measurementUnitFromId(correlationId, data.massWeightMeasurementUnitsId, AppCommonConstants.MeasurementUnits.weight.id, data.massWeightMeasurementUnitId);
		response = this._enforceNotNullResponse('ParachuteSizingToolsService', 'initializeCalculation', massWeightMeasurementUnit, 'massWeightMeasurementUnit', correlationId);
		if (this._hasFailed(response))
			return response;
		data.massWeightMeasurementUnit = massWeightMeasurementUnit;

		const calculationSteps = [
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'coeffDrag',
				value: data.coeffDrag
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'airDensity',
				value: data.airDensity,
				units: {
					from: airDensityMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.density.kgm3
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'desiredVelocity',
				value: data.desiredVelocity,
				units: {
					from: desiredVelocityMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.velocity.ms
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'mass',
				value: data.mass,
				units: {
					from: massWeightMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.weight.kg
				}
			},
			{
				type: this._serviceCalculationEngine.symTypeSet,
				var: 'airDensity',
				value: data.airDensity,
				units: {
					from: airDensityMeasurementUnit,
					to: AppCommonConstants.MeasurementUnits.metrics.density.kgm3
				}
			}
		];

		if (data.calculationType === AppSharedConstants.Tools.ParachuteSizing.calculationTypes.diameter)
			this._initializeCalculationDiameter(correlationId, calculationSteps, data);
		else if (data.calculationType === AppSharedConstants.Tools.ParachuteSizing.calculationTypes.velocity)
			this._initializeCalculationVelocity(correlationId, calculationSteps, data);
		else 
			throw Error(`Invalid calculation type '${data.calculationType}'.`);

		return this._successResponse({
			steps: calculationSteps,
			instance: this._serviceCalculationEngine.initialize(correlationId)
		}, correlationId);
	}

	_initializeCalculationDiameter(correlationId, calculationSteps, data) {
		calculationSteps.push({
			type: this._serviceCalculationEngine.symTypeEvaluate,
			var: 'denominator',
			evaluate: 'airDensity * coeffDrag * desiredVelocity^2'
		});
		calculationSteps.push({
			type: this._serviceCalculationEngine.symTypeEvaluate,
			var: 'nominator',
			evaluate: '(2 * mass * 9.8 m/s^2)'
		});
		calculationSteps.push({
			type: this._serviceCalculationEngine.symTypeEvaluate,
			var: 'areaTemp',
			evaluate: 'nominator / denominator'
		});

		if (data.spillHolePct) {
			calculationSteps.push({
					type: this._serviceCalculationEngine.symTypeSet,
					var: 'spillHolePct',
					value: data.spillHolePct / 100
			});
			calculationSteps.push({
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'areaSpillHole',
				evaluate: 'areaTemp * spillHolePct'
			});
		}
		else if (data.spillHoleDiameter) {
			calculationSteps.push({
					type: this._serviceCalculationEngine.symTypeSet,
					var: 'spillHoleDiameter',
					value: data.spillHoleDiameter,
					units: {
						from: data.diameterLengthMeasurementUnit,
						to: AppCommonConstants.MeasurementUnits.metrics.length.m
					}
			});
			if (data.spillHoleShape === AppSharedConstants.Tools.ParachuteSizing.shapes.circle) {
				calculationSteps.push(
					{
						type: this._serviceCalculationEngine.symTypeEvaluate,
						var: 'areaSpillHole',
						evaluate: '(pi * spillHoleDiameter^2) / 4'
					}
				);
			}
			else if (data.spillHoleShape === AppSharedConstants.Tools.ParachuteSizing.shapes.hexagon) {
				calculationSteps.push(
					{
						type: this._serviceCalculationEngine.symTypeEvaluate,
						var: 'areaSpillHole',
						evaluate: '(sqrt(3)/2) * spillHoleDiameter'
					}
				);
			}
			else if (data.spillHoleShape === AppSharedConstants.Tools.ParachuteSizing.shapes.octagon) {
				calculationSteps.push(
					{
						type: this._serviceCalculationEngine.symTypeEvaluate,
						var: 'areaSpillHole',
						evaluate: '2 * (sqrt(2) - 1) * spillHoleDiameter^2',
					}
				);
			}
			else
				throw Error(`Invalid spill hole shape '${data.spillHoleShape}'.`);
		}
		else {
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'areaSpillHole',
					evaluate: 'areaTemp * 0',
				}
			);
		}

		calculationSteps.push({
			type: this._serviceCalculationEngine.symTypeEvaluate,
			var: 'area',
			evaluate: 'areaTemp + areaSpillHole'
		});

		if (data.parachuteShape === AppSharedConstants.Tools.ParachuteSizing.shapes.circle) {
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterT',
					evaluate: 'sqrt(4 * area / pi)'
				}
			);
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterSpillHoleT',
					evaluate: 'sqrt(4 * areaSpillHole / pi)'
				}
			);
		}
		else if (data.parachuteShape === AppSharedConstants.Tools.ParachuteSizing.shapes.hexagon) {
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterT',
					evaluate: 'sqrt((2 * area) / sqrt(3))'
				}
			);
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterSpillHoleT',
					evaluate: 'sqrt((2 * areaSpillHole) / sqrt(3))'
				}
			);
		}
		else if (data.parachuteShape === AppSharedConstants.Tools.ParachuteSizing.shapes.octagon) {
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterT',
					evaluate: 'sqrt(area / (2 * (sqrt(2) - 1)))',
				}
			);
			calculationSteps.push(
				{
					type: this._serviceCalculationEngine.symTypeEvaluate,
					var: 'diameterSpillHoleT',
					evaluate: 'sqrt(areaSpillHole / (2 * (sqrt(2) - 1)))',
				}
			);
		}
		else
			throw Error(`Invalid parachute shape '${data.parachuteShape}'.`);
		
		calculationSteps.push(
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'diameter',
				evaluate: 'diameterT',
				result: true,
				format: this._serviceCalculationEngine.formatFixed(),
				unit: data.diameterLengthMeasurementUnit
			}
		);
		calculationSteps.push(
			{
				type: this._serviceCalculationEngine.symTypeEvaluate,
				var: 'diameterSpillHole',
				evaluate: 'diameterSpillHoleT',
				result: true,
				format: this._serviceCalculationEngine.formatFixed(),
				unit: data.diameterLengthMeasurementUnit
			}
		);
	}

	_initializeCalculationVelocity(correlationId, calculationSteps, data) {
	}
}

export default ParachuteSizingToolsService;
