import AppSharedConstants from '@/utility/constants';

import MotorSearchExternalService from '@/service/motors';

class ThrustCurveMotorSearchExternalService extends MotorSearchExternalService {
	nameLocale() {
		return 'menu.thrustcurve';
	}

	async _manufacturers(correlationId) {
		const opts = {
			ignoreCorrelationId: true,
			ignoreToken: true
		};
		const response = await this._serviceCommunicationRest.get(correlationId, this._urlKey(), { url: 'metadata.json' }, opts);
		this._logger.debug('ThrustCurveMotorSearchExternalService', '_manufacturers', 'response', response, correlationId);
		if (response) {
			const manufacturers = response.manufacturers;
			return this._successResponse(manufacturers, correlationId);
		}

		return response;
	}

	async _motor(correlationId, motorId) {
		const opts = {
			ignoreCorrelationId: true,
			ignoreToken: true
		};
		const body = {
			motorId: motorId,
			format: 'RASP',
			data: 'samples',
			maxResults: 200
		};
		const response = await this._serviceCommunicationRest.post(correlationId, this._urlKey(), { url: 'download.json' }, body, opts);
		this._logger.debug('ThrustCurveMotorSearchExternalService', '_motor', 'response', response, correlationId);
		if (response && response.results) {
			let motor = null;
			for (const item of response.results) {
				if (item.motorId !== motorId)
					continue;

				motor = item;
				break;
			}

			return this._successResponse(motor, correlationId);
		}

		return response;
	}

	async _search(correlationId, criteria) {
		try {
			const opts = {
				ignoreCorrelationId: true,
				ignoreToken: true
			};
			const body = {
				availability: 'available',
				maxResults: 500
			};
			if (!String.isNullOrEmpty(criteria.impulseClass))
				body.impulseClass = criteria.impulseClass;

			if (!String.isNullOrEmpty(criteria.motor)) {
				body.commonName = criteria.motor;
				// Search on common name...
				let response = await this._serviceCommunicationRest.post(correlationId, this._urlKey(), { url: 'search.json' }, body, opts);
				delete body.commonName;
				if (!response || !response.results || (response.results && (response.results.length === 0))) {
					body.commonName = criteria.motor;
					// If nothing found, then search on designation...
					body.designation = criteria.motor;
					response = await this._serviceCommunicationRest.post(correlationId, this._urlKey(), { url: 'search.json' }, body, opts);
					delete body.designation;
				}

				if (response && response.results && (response.results.length > 0))
					body.impulseClass = response.results[0].impulseClass;
			}

			// Either from criteria or from motor need the impulse class...
			if (String.isNullOrEmpty(body.impulseClass))
				return this._error('ThrustCurveMotorSearchExternalService', 'search', 'Invalid criteira', null, null, null, correlationId);

			// Search to get all the motors for this impulse class; then filtering will be applied upstream...
			const response = await this._serviceCommunicationRest.post(correlationId, this._urlKey(), { url: 'search.json' }, body, opts);
			this._logger.debug('ThrustCurveMotorSearchExternalService', '_search', 'response', response, correlationId);
			return this._successResponse(response.results, correlationId);
		}
		catch (err) {
			this._logger.exception('ThrustCurveMotorSearchExternalService', 'search', err, correlationId);
			return this._hasFailed(correlationId);
		}
	}

	_urlKey() {
		return AppSharedConstants.ExternalKeys.MotorSearch + 'ThrustCurve';
	}
}

export default ThrustCurveMotorSearchExternalService;
