import Handlebars from 'handlebars';

import FlightPathOutputTemmplateService from './index';

class HandlebarsFlightPathOutputTemplateService extends FlightPathOutputTemmplateService {
	get id() {
		return 'handlebars';
	}

	initialize(correlationId, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional) {
		let response = this._setTemplateMain(correlationId, templateMain);
		if (this._hasFailed(response))
			return response;
		response = this._setTemplatePinLaunch(correlationId, templatePinLaunch);
		if (this._hasFailed(response))
			return response;
		response = this._setTemplatePinMaxAltitude(correlationId, templatePinLaunch);
		if (this._hasFailed(response))
			return response;
		response = this._setTemplatePinMaxVelocity(correlationId, templatePinLaunch);
		if (this._hasFailed(response))
			return response;
		response = this._setTemplatePinTouchdown(correlationId, templatePinTouchdown);
		if (this._hasFailed(response))
			return response;
		response = this._setTemplatePinsAdditional(correlationId, templatePinsAdditional);
		if (this._hasFailed(response))
			return response;

		return this._success(correlationId);
	}

	templateMain(correlationId, flightInfo) {
		return this._templateMain({ flightInfo: flightInfo });
	}

	templatePinLaunch(correlationId, flightInfo) {
		return this._templatePinLaunch({ flightInfo: flightInfo });
	}

	templatePinsAdditional(correlationId, flightInfo) {
		return this._templatePinsAdditional({ flightInfo: flightInfo });
	}

	templatePinsMaxAcceleration(correlationId, flightInfo) {
		return this._templatePinsMaxAcceleration({ flightInfo: flightInfo });
	}

	templatePinsMaxAltitude(correlationId, flightInfo) {
		return this._templatePinsMaxAltitude({ flightInfo: flightInfo });
	}

	templatePinsMaxVelocity(correlationId, flightInfo) {
		return this._templatePinsMaxVelocity({ flightInfo: flightInfo });
	}

	templatePinsRecoveryDrogue(correlationId, flightInfo) {
		return this._templatePinsRecoveryDrogue({ flightInfo: flightInfo });
	}

	templatePinsRecoveryMain(correlationId, flightInfo) {
		return this._templatePinsRecoveryMain({ flightInfo: flightInfo });
	}

	templatePinTouchdown(correlationId, flightInfo) {
		return this._templatePinTouchdown({ flightInfo: flightInfo });
	}

	_setTemplate(correlationId, template, defaultTemplate) {
		try {
			template = !String.isNullOrEmpty(template) ? template : defaultTemplate;
			template = Handlebars.compile(template);
			return this._successResponse(template, correlationId);
		}
		catch (err) {
			return this._error('FlightPathOutputTemplateService', 'setTemplate', null, err, null, null, correlationId);
		}
	}

	_setTemplateMain(correlationId, template) {
		const response = this._setTemplate(correlationId, template, this.templateMainDefault);
		if (this._hasFailed(response))
			return response;

		this._templateMain = response.results;
		return this._success(correlationId);
	}

	_setTemplatePinLaunch(correlationId, template) {
		const response = this._setTemplate(correlationId, template, this.templatePinLaunchDefault);
		if (this._hasFailed(response))
			return response;

		this._templatePinLaunch = response.results;
		return this._success(correlationId);
	}

	_setTemplatePinMaxAltitude(correlationId, template) {
		const response = this._setTemplate(correlationId, template, this.templatePinMaxAltitudeDefault);
		if (this._hasFailed(response))
			return response;

		this._templatePinsMaxAltitude = response.results;
		return this._success(correlationId);
	}

	_setTemplatePinMaxVelocity(correlationId, template) {
		const response = this._setTemplate(correlationId, template, this.templatePinMaxVelocityDefault);
		if (this._hasFailed(response))
			return response;

		this._templatePinsMaxVelocity = response.results;
		return this._success(correlationId);
	}

	_setTemplatePinsAdditional(correlationId, template) {
		if (String.isNullOrEmpty(template)) {
			this._templatePinsAdditional = null;
			return this._success(correlationId);
		}

		const response = this._setTemplate(correlationId, template, '');
		if (this._hasFailed(response))
			return response;

		this._templatePinsAdditional = response.results;
		return this._success(correlationId);
	}

	_setTemplatePinTouchdown(correlationId, template) {
		const response = this._setTemplate(correlationId, template, this.templatePinTouchdownDefault);
		if (this._hasFailed(response))
			return response;

		this._templatePinTouchdown = response.results;
		return this._success(correlationId);
	}

	get templateMainDefault() {
		return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
	<Document>
		<name><![CDATA[{{flightInfo.titleFull}}]]></name>
		{{flightInfo.description}}
		<visibility>1</visibility>
		<open>1</open>
		<Folder id="Tracks">
			<name>Tracks</name>
			<visibility>1</visibility>
			<open>0</open>{{{flightInfo.pins}}}
			<Placemark>
				<name><![CDATA[{{flightInfo.translations.flightPath}}]]></name>
				<Style>
					<LineStyle>
						<color>ff{{flightInfo.style.path.flight.color}}</color>
						<width>4</width>
					</LineStyle>
				</Style>
				<MultiGeometry>
					<LineString>
						<tessellate>0</tessellate>
						<altitudeMode>absolute</altitudeMode>
						<coordinates>
{{flightInfo.flightPathCoords}}
						</coordinates>
					</LineString>
				</MultiGeometry>
			</Placemark>
			<Placemark>
				<name><![CDATA[{{flightInfo.translations.groundPath}}]]></name>
				<Style>
					<LineStyle>
						<color>ff{{flightInfo.style.path.ground.color}}</color>
						<width>4</width>
					</LineStyle>
				</Style>
				<MultiGeometry>
					<LineString>
						<tessellate>0</tessellate>
						<altitudeMode>clampToGround</altitudeMode>
						<coordinates>
{{flightInfo.flightPathCoords}}
						</coordinates>
					</LineString>
				</MultiGeometry>
			</Placemark>
		</Folder>
	</Document>
</kml>`;
	}

	get templatePinMaxAccelerationDefault() {
		return `
	<Placemark>
	<name><![CDATA[{{flightInfo.translations.maxAcceleration}]]></name>
		<Style id="highlightPlacemark">
			<IconStyle>
				<Icon>
					<href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href>
				</Icon>
				<color>ff{{flightInfo.style.pin.maxAcceleration.color}}</color>
			</IconStyle>
		</Style>
		<Point>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
{{flightInfo.maxAccelerationCoords}}
			</coordinates>
		</Point>
	</Placemark>`;
	}

	get templatePinMaxAltitudeDefault() {
		return `
	<Placemark>
	<name><![CDATA[{{flightInfo.translations.maxAltitude}} ({{flightInfo.maxAltitude}} {{flightInfo.translations.measurementUnits.distance}})]]></name>
		<Style id="highlightPlacemark">
			<IconStyle>
				<Icon>
					<href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href>
				</Icon>
				<color>ff{{flightInfo.style.pin.maxAltitude.color}}</color>
			</IconStyle>
		</Style>
		<Point>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
{{flightInfo.maxAltitudeCoords}}
			</coordinates>
		</Point>
	</Placemark>`;
	}

	get templatePinMaxVelocityDefault() {
		return `
	<Placemark>
		<name><![CDATA[{{flightInfo.translations.maxVelocity}} ({{flightInfo.maxVelocity}} {{flightInfo.translations.measurementUnits.velocity}})]]></name>
		<Style id="highlightPlacemark">
			<IconStyle>
				<Icon>
					<href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href>
				</Icon>
				<color>ff{{flightInfo.style.pin.maxVelocity.color}}</color>
			</IconStyle>
		</Style>
		<Point>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
{{flightInfo.maxVelocityCoords}}
			</coordinates>
		</Point>
	</Placemark>`;
	}

	get templatePinLaunchDefault() {
		return `
		<Placemark>
			<name><![CDATA[{{flightInfo.translations.launch}}]]></name>
			<Style id="normalPlacemark">
				<IconStyle>
					<color>ff{{flightInfo.style.pin.launch.color}}</color>
				</IconStyle>
			</Style>
			<Point>
				<coordinates>
{{flightInfo.launchCoords}}
				</coordinates>
			</Point>
		</Placemark>`;
	}

	get templatePinRecoveryDrogueDefault() {
		return `
	<Placemark>
	<name><![CDATA[{{flightInfo.translations.recoveryDrogue}}]]></name>
		<Style id="highlightPlacemark">
			<IconStyle>
				<Icon>
					<href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href>
				</Icon>
				<color>ff{{flightInfo.style.pin.recoveryDrogue.color}}</color>
			</IconStyle>
		</Style>
		<Point>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
{{flightInfo.recoveryDrogueCoords}}
			</coordinates>
		</Point>
	</Placemark>`;
	}

	get templatePinRecoveryMainDefault() {
		return `
	<Placemark>
	<name><![CDATA[{{flightInfo.translations.recoveryMain}}]]></name>
		<Style id="highlightPlacemark">
			<IconStyle>
				<Icon>
					<href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href>
				</Icon>
				<color>ff{{flightInfo.style.pin.recoveryMain.color}}</color>
			</IconStyle>
		</Style>
		<Point>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
{{flightInfo.recoveryMainCoords}}
			</coordinates>
		</Point>
	</Placemark>`;
	}

	get templatePinTouchdownDefault() {
		return `
		<Placemark>
			<name><![CDATA[{{flightInfo.translations.touchdown}}]]></name>
			<Style id="normalPlacemark">
				<IconStyle>
					<color>ff{{flightInfo.style.pin.touchdown.color}}</color>
				</IconStyle>
			</Style>
			<Point>
				<coordinates>
{{flightInfo.touchdownCoords}}
				</coordinates>
			</Point>
		</Placemark>`;
	}
}

export default HandlebarsFlightPathOutputTemplateService;
