import AppSharedConstants from '@/utility/constants';

import MotorSearchExternalService from '@/service/external/motorSearch';

class PartsMotorSearchExternalService extends MotorSearchExternalService {
	constructor() {
		super();

		this._serviceParts = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceParts = injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
	}

	nameLocale() {
		return 'menu.thrustcurve';
	}

	async _motor(correlationId, motorId) {
		const response = await this._serviceParts.retrieveMotor(correlationId, motorId);
		this._logger.debug('PartsMotorSearchExternalService', '_motor', 'response', response, correlationId);
		return response;
	}

	async _search(correlationId, criteria) {
		try {
			const params = {};
			if (!String.isNullOrEmpty(criteria.diameter))
				params.diameter = criteria.diameter;
			if (!String.isNullOrEmpty(criteria.impulseClass))
				params.impulseClass = criteria.impulseClass;

			if (!String.isNullOrEmpty(criteria.motor)) {
				params.name = criteria.motor;
				params.designation = criteria.motor;
				// Search on common name and designation to find the motor...
				const response = await this._serviceParts.searchMotors(correlationId, params);
				delete params.name;
				delete params.designation;
				if (response && response.results && response.results.data && (response.results.data.length > 0))
					params.impulseClass = response.results[0].impulseClass;
			}

			// Either from criteria or from motor need the impulse class...
			if (String.isNullOrEmpty(params.impulseClass))
				//return this._error('PartsMotorSearchExternalService', 'search', 'Invalid criteira', null, null, null, correlationId);
				return this._successResponse([], correlationId);

			params.motorSearch = true;

			// Search to get all the motors for this impulse class; then filtering will be applied upstream...
			const response = await this._serviceParts.searchMotors(correlationId, params);
			this._logger.debug('PartsMotorSearchExternalService', '_search', 'response', response, correlationId);
			if (response && response.results && response.results.data && (response.results.data.length > 0))
				return this._successResponse(response.results.data, correlationId);

			return this._successResponse([], correlationId);
		}
		catch (err) {
			this._logger.exception('PartsMotorSearchExternalService', 'search', err, correlationId);
			return this._hasFailed(correlationId);
		}
	}

	_urlKey() {
		return AppSharedConstants.ExternalKeys.MotorSearch + 'ThrustCurve';
	}
}

export default PartsMotorSearchExternalService;
