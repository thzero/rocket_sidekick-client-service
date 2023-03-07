import FlightPathOutputService from './index';

class KmlFlightPathOutputService extends FlightPathOutputService {
	get id() {
		return 'kml';
	}

	output(correlationId, flightInfo, data, serviceTemplate) {
		this._enforceNotNull('KmlFlightPathOutputService', 'output', flightInfo, 'flightInfo', correlationId);
		this._enforceNotNull('KmlFlightPathOutputService', 'output', data, 'data', correlationId);
		this._enforceNotNull('KmlFlightPathOutputService', 'output', serviceTemplate, 'serviceTemplate', correlationId);

		flightInfo.style.path.flight.color = this._reverseRgb(flightInfo.style.path.flight.color);
		flightInfo.style.path.ground.color = this._reverseRgb(flightInfo.style.path.ground.color);
		flightInfo.style.pin.launch.color = this._reverseRgb(flightInfo.style.pin.launch.color);
		flightInfo.style.pin.maxAltitude.color = this._reverseRgb(flightInfo.style.pin.maxAltitude.color);
		flightInfo.style.pin.maxVelocity.color = this._reverseRgb(flightInfo.style.pin.maxVelocity.color);
		flightInfo.style.pin.touchdown.color = this._reverseRgb(flightInfo.style.pin.touchdown.color);

		flightInfo.description = '';
		if (flightInfo.date || flightInfo.location) {
			const temp2 = [];
			if (flightInfo.date)
				temp2.push(flightInfo.date.toLocaleString());
			if (flightInfo.location) {
				temp2.push('@');
				temp2.push(flightInfo.location);
			}
			flightInfo.description = `<description><![CDATA[${temp2.join(' ')}]]></description>`;
		}

		flightInfo.titleFull = flightInfo.title;
		if (String.isNullOrEmpty(flightInfo.title))
			flightInfo.titleFull = '';
		if (!String.isNullOrEmpty(flightInfo.titleFull))
			flightInfo.titleFull += ' ';
		flightInfo.titleFull += flightInfo.translations.flightPath;

		flightInfo.pins = '';
		if (flightInfo.style.pin.launch.selected && flightInfo.launchCoords)
			flightInfo.pins += serviceTemplate.templatePinLaunch(correlationId, flightInfo);
		// if (flightInfo.maxAccelerationCoords)
		// 	flightInfo.pins += serviceTemplate.templatePinsMaxAcceleration(correlationId, flightInfo);
		if (flightInfo.style.pin.maxAltitude.selected && flightInfo.maxAltitudeCoords)
			flightInfo.pins += serviceTemplate.templatePinsMaxAltitude(correlationId, flightInfo);
		if (flightInfo.style.pin.maxVelocity.selected && flightInfo.maxVelocityCoords)
			flightInfo.pins += serviceTemplate.templatePinsMaxVelocity(correlationId, flightInfo);
		// if (flightInfo.recoveryDrogueCoords)
		// 	flightInfo.pins += serviceTemplate.templatePinsRecoveryDrogue(correlationId, flightInfo);
		// if (flightInfo.recoveryMainCoords)
		// 	flightInfo.pins += serviceTemplate.templatePinsRecoveryMain(correlationId, flightInfo);
		if (flightInfo.style.pin.touchdown.selected && flightInfo.touchdownCoords)
			flightInfo.pins += serviceTemplate.templatePinTouchdown(correlationId, flightInfo);
		if (this._templatePinsAdditional)
			flightInfo.pins += serviceTemplate.templatePinsAdditional(correlationId, flightInfo);

		return this._successResponse(serviceTemplate.templateMain(correlationId, flightInfo), correlationId);
	}
}

export default KmlFlightPathOutputService;
