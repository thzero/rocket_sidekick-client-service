import AppConstants from '@/constants';

import AppUtility from '@/utility/app';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import BaseService from '@thzero/library_client/service/index';

class FlightPathProcessorService extends BaseService {
	constructor() {
		super();

		this._serviceProcessors = [];
	}

	init(injector) {
		const serviceFlightPathProcessorFeatherweight = injector.getService(AppConstants.InjectorKeys.SERVICE_TOOLS_FLIGHT_PATH_PROCESSOR_FEATHERWEIGHT);
		this.registerProcessor(serviceFlightPathProcessorFeatherweight);
	}

	get styleDefault() {
		return {
			path: {
				flight: {
					color: '#0000ff'
				},
				ground: {
					color: '#000000'
				}
			},
			pin: {
				launch: {
					color: '#ff0000'
				},
				maxAltitude: {
					color: '#00ff00'
				},
				maxVelocity: {
					color: '#00ff00'
				},
				touchdown: {
					color: '#00ff00'
				}
			}
		};
	}

	get serviceProcessors() {
		return this._serviceProcessors;
	}

	process(correlationId, data, processorId, flightInfo, measurementUnits, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional) {
		this._enforceNotNull('FlightPathProcessorService', 'process', data, 'data', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', processorId, 'processorId', correlationId);
		this._enforceNotNull('FlightPathProcessorService', 'process', flightInfo, 'flightInfo', correlationId);
		this._enforceNotNull('FlightPathProcessorService', 'process', measurementUnits, 'measurementUnits', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsId, 'measurementUnitsId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsDistanceId, 'measurementUnitsDistanceId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsVelocityId, 'measurementUnitsVelocityId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsOutputId, 'measurementUnitsOutputId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsDistanceOutputId, 'measurementUnitsDistanceOutputId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsVelocityOutputId, 'measurementUnitsVelocityOutputId', correlationId);

		if (LibraryCommonUtility.isNull(data))
			return this._error('FlightPathProcessorService', 'process', 'Invalid data', null, null, 'errors.process.noInput', correlationId);

		if (String.isNullOrEmpty(processorId))
			return this._error('FlightPathProcessorService', 'process', 'Invalid processor id', null, null, 'errors.process.noProcessor', correlationId);

		const processor = this._determineProcessor(correlationId, processorId);
		if (!processor)
			return this._error('FlightPathProcessorService', 'process', 'Invalid processor', null, null, 'errors.process.noProcessor', correlationId);

		const results = this._initialize(correlationId, flightInfo);
		processor.process(correlationId, this, results, data, measurementUnits, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional);
		AppUtility.debug2('results.info', results.info);

		return this._successResponse(results, correlationId);
	}

	registerProcessor(service) {
		this._enforceNotNull('FlightPathProcessorService', 'registerProcessor', service, 'service');

		this._serviceProcessors.push(service);
	}

	_determineProcessor(correlationId, processorId) {
		this._enforceNotEmpty('FlightPathProcessorService', '_determineProcessor', processorId, 'processorId', correlationId);

		const processor = this._serviceProcessors.find(s => {
			return s.id.toLowerCase() === processorId.toLowerCase();
		});
		return processor;
	}

	_initialize(correlationId, flightInfo) {
		this._enforceNotNull('FlightPathProcessorService', '_initialize', flightInfo, 'flightInfo', correlationId);

		flightInfo.flightPath = [];
		return flightInfo;
	}
}

export default FlightPathProcessorService;
