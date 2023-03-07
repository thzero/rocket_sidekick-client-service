import configureMeasurements, { length, speed } from 'convert-units';

import AppConstants from '@/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import ToolsService from '@/service/tools/index';

class FlightPathProcessorService extends ToolsService {
	constructor() {
		super();

		this._serviceFlightPathOutput = null;
		this._serviceFlightPathOutputTemplate = null;

		this._convert = configureMeasurements({
			length,
			speed
		});
	}

	init(injector) {
		super.init(injector);

		this._serviceFlightPathOutput = injector.getService(AppConstants.InjectorKeys.SERVICE_TOOLS_FLIGHT_PATH_OUTPUT_KML);
		this._serviceFlightPathOutputTemplate = injector.getService(AppConstants.InjectorKeys.SERVICE_TOOLS_FLIGHT_PATH_OUTPUT_TEMPLATE_HANDLEBARS);
	}

	get id() {
		throw Error('Not Implemented');
	}

	get data() {
		return this._data;
	}

	process(correlationId, engine, results, data, measurementUnits, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional) {
		this._enforceNotNull('FlightPathProcessorService', 'process', engine, 'engine', correlationId);
		this._enforceNotNull('FlightPathProcessorService', 'process', results, 'results', correlationId);
		this._enforceNotNull('FlightPathProcessorService', 'process', data, 'data', correlationId);
		this._enforceNotNull('FlightPathProcessorService', 'process', measurementUnits, 'measurementUnits', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsId, 'measurementUnitsId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsDistanceId, 'measurementUnitsDistanceId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsVelocityId, 'measurementUnitsVelocityId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsOutputId, 'measurementUnitsOutputId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsDistanceOutputId, 'measurementUnitsDistanceOutputId', correlationId);
		this._enforceNotEmpty('FlightPathProcessorService', 'process', measurementUnits.measurementUnitsVelocityOutputId, 'measurementUnitsVelocityOutputId', correlationId);

		this._serviceFlightPathOutput.initialize(correlationId);
		this._serviceFlightPathOutputTemplate.initialize(correlationId, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional);

		this._data = new FlightPath();

		const responseProcessData = this._processData(correlationId, data);
		if (this._hasFailed(responseProcessData))
			return responseProcessData;

		const responseProcessDataSort = this._processDataSort(correlationId);
		if (this._hasFailed(responseProcessDataSort))
			return responseProcessDataSort;

		if (responseProcessDataSort.results && LibraryCommonUtility.isFunction(responseProcessDataSort.results))
			this._data.sort(responseProcessDataSort.results);

		const responseProcessDataPost = this._processDataPost(correlationId);
		if (this._hasFailed(responseProcessDataPost))
			return responseProcessDataPost;

		const divisor = this._convert(1).from(measurementUnits.measurementUnitsDistanceId).to('m');
		let coords;
		const path = [];
		let previous = null;
		let temp = this._data.rows.shift();
		results.maxAltitude = 0;
		results.maxVelocity = 0;
		results.launchCoords = `${temp.longitude},${temp.latitude}`;
		while (temp) {
			previous = temp;
			coords = `${temp.longitude},${temp.latitude},${this._round(temp.altitude * divisor)}`;

			// add coords to the path...
			path.push(coords);

			// is this the max altitude?
			if (temp && temp.altitude && (temp.altitude > 0) && (temp.altitude > results.maxAltitude)) {
				results.maxAltitude = this._round(temp.altitude);
				results.maxAltitudeCoords = coords;
			}

			// is this the max velocity?
			if (temp && temp.velocityV && (temp.velocityV > 0) && (temp.velocityV > results.maxVelocity)) {
				results.maxVelocity = this._round(temp.velocityV);
				results.maxVelocityCoords = coords;
			}

			temp = this._data.rows.shift();
			if (!temp)
				results.touchdownCoords = `${previous.longitude},${previous.latitude}`;
		}

		results.maxAltitude = this._convert(results.maxAltitude)
			.from(AppConstants.MeasurementUnits[measurementUnits.measurementUnitsId].distance[measurementUnits.measurementUnitsDistanceId])
			.to(AppConstants.MeasurementUnits[measurementUnits.measurementUnitsOutputId].distance[measurementUnits.measurementUnitsDistanceOutputId]);
		results.maxVelocity = this._convert(results.maxVelocity)
			.from(AppConstants.MeasurementUnits[measurementUnits.measurementUnitsId].velocity[measurementUnits.measurementUnitsVelocityId])
			.to(AppConstants.MeasurementUnits[measurementUnits.measurementUnitsOutputId].velocity[measurementUnits.measurementUnitsVelocityOutputId]);
		results.maxAltitude = Number(results.maxAltitude).toLocaleString();
		results.maxVelocity = Number(results.maxVelocity).toLocaleString();

		results.translations = {};
		results.translations.launch = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.launch');
		results.translations.maxAltitude = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.maxAltitude');
		results.translations.maxVelocity = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.maxVelocity');
		results.translations.touchdown = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.touchdown');
		results.translations.flightPath = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.flightPath');
		results.translations.groundPath = LibraryClientUtility.$trans.t('forms.content.tools.flightPath.groundPath');
		results.translations.measurementUnits = {};
		results.translations.measurementUnits.distance = AppConstants.MeasurementUnits[measurementUnits.measurementUnitsOutputId].distance[measurementUnits.measurementUnitsDistanceOutputId];
		results.translations.measurementUnits.velocity = AppConstants.MeasurementUnits[measurementUnits.measurementUnitsOutputId].velocity[measurementUnits.measurementUnitsVelocityOutputId];

		results.flightPathCoords = path;
		// results.flightPath = this._kml(correlationId, results, path.join('\n'));
		const responseFlightPath = this._serviceFlightPathOutput.output(correlationId, results, path.join('\n'), this._serviceFlightPathOutputTemplate);
		if (this._hasFailed(responseFlightPath))
			return responseFlightPath;
		results.flightPath = responseFlightPath.results;

		return this._successResponse(results, correlationId);
	}

	_processData(correlationId, input) {
		throw Error('Not Implemented');
	}

	_processDataPost(correlationId) {
		this._data.process(correlationId);
		return this._success(correlationId);
	}

	_processDataSort(correlationId) {
		return this._success(correlationId);
	}

	_publish(correlationId, time, altitude, altitudeF, velocity, velocityF, apogee, noseOver, drogue, main, ground) {
		this._data.publish(correlationId, time, altitude, altitudeF, velocity, velocityF, apogee, noseOver, drogue, main, ground);
	}

	_round(value, places = 2) {
		return Number(value.toFixed(places));
	}

	_sort(correlationId, func) {
		this._data.sort(correlationId, func());
	}
}

class FlightPath {
	constructor() {
		this._rows = [];
	}

	get rows() {
		return this._rows;
	}

	publish(correlationId, time, altitude, latitude, longitude, velocityH, velocityV) {
		this._rows.push({
			altitude: Number(altitude),
			latitude: Number(latitude),
			longitude: Number(longitude),
			seconds: null,
			time: Number(time),
			velocityV: Number(velocityV),
			velocityH: velocityH ? Number(velocityH) : null
		});
	}

	process(correlationId) {
		let start = 0;
		let started = false;
		for (const item of this._rows) {
			if (!started && (item.velocityV <= 0))
				continue;

			item.seconds = (item.time - start);

			if (!started) {
				start = item.time;
				started = true;
			}
		}
	}

	sort(correlationId, func) {
		if (!func)
			return;

		this._rows = this.data().sort(func);
	}
}

export default FlightPathProcessorService;
