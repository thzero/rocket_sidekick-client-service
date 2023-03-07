import BaseService from '@thzero/library_client/service/index';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

class FlightPathOutputTemplateService extends BaseService {
	constructor() {
		super();

		this._templateMain = null;
		this._templatePinLaunch = null;
		this._templatePinsAdditional = null;
		this._templatePinsMaxAcceleration = null;
		this._templatePinsMaxAltitude = null;
		this._templatePinsMaxVelocity = null;
		this._templatePinsRecoveryDrogue = null;
		this._templatePinsRecoveryMain = null;
		this._templatePinTouchdown = null;
	}

	initialize(correlationId, templateMain, templatePinLaunch, templatePinTouchdown, templatePinsAdditional) {
		throw NotImplementedError();
	}

	templateMain(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinLaunch(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsAdditional(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsMaxAcceleration(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsMaxAltitude(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsMaxVelocity(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsRecoveryDrogue(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinsRecoveryMain(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	templatePinTouchdown(correlationId, flightInfo) {
		throw NotImplementedError();
	}

	_setTemplate(correlationId, template, defaultTemplate) {
		throw NotImplementedError();
	}

	_setTemplateMain(correlationId, engine, template) {
		throw NotImplementedError();
	}

	_setTemplatePinLaunch(correlationId, engine, template) {
		throw NotImplementedError();
	}

	_setTemplatePinMaxAltitude(correlationId, engine, template) {
		throw NotImplementedError();
	}

	_setTemplatePinsAdditional(correlationId, engine, template) {
		throw NotImplementedError();
	}

	_setTemplatePinTouchdown(correlationId, engine, template) {
		throw NotImplementedError();
	}
}

export default FlightPathOutputTemplateService;
