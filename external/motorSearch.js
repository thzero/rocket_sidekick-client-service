import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

import BaseService from '@thzero/library_client/service/index';

class MotorSearchExternalService extends BaseService {
	constructor() {
		super();

		this._serviceCommunicationRest = null;

		this._ttlDefault = 7 * 24 * 60 * 60 * 1000;
	}

	init(injector) {
		super.init(injector);

		this._serviceCommunicationRest = injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_COMMUNICATION_REST);
	}

	nameLocale() {
		this.notImplementedError();
	}

	reset(correlationId) {
		this._calculationData.reset();
	}

	async manufacturers(correlationId, cached) {
		try {
			const now = LibraryCommonUtility.getTimestamp();
			let ttl = LibraryCommonUtility.getTimestamp() + this._ttlDefault;
			if (cached) {
				if (!cached.ttl)
					cached.ttl = ttl;
				ttl = cached.ttl;
			}

			if ((ttl > now) && (cached.manufacturers && cached.manufacturers.length > 0))
				return this._successResponse(cached, correlationId);

			const response = await this._manufacturers(correlationId);
			this._logger.debug('MotorSearchExternalService', 'manufacturers', 'response', response, correlationId);

			return this._successResponse({
				manufacturers: response.results,
				ttl: ttl,
				last: now
			}, correlationId);
		}
		catch (err) {
			return this._error('MotorSearchExternalService', 'manufacturers', null, err, null, null, correlationId);
		}
	}

  async motor(correlationId, motorId, cache) {
    try {
			let motor = null;
			for (const item of cache.data) {
				if (item.motorId !== motorId)
					continue;

				motor = item;
				break;
			}

			if (!motor)
				return this._error('MotorSearchExternalService', 'motor', 'Invalid motor', null, null, null, correlationId);

			if (!motor.samples) {
				const response = await this._motor(correlationId, motorId);
				this._logger.debug('MotorSearchExternalService', 'motor', 'response', response, correlationId);
				if (this._hasFailed(response))
					return response;

				motor.samples = response.results.samples;
			}

			cache.last = LibraryCommonUtility.getTimestamp();

			return this._successResponse({
				motor: motor,
				data: cache
			}, correlationId);
		}
		catch (err) {
			return this._error('MotorSearchExternalService', 'motor', null, err, null, correlationId);
		}
	}

	async search(correlationId, criteria, cached) {
		try {
			const now = LibraryCommonUtility.getTimestamp();
			const ttl = LibraryCommonUtility.getTimestamp() + this._ttlDefault;

			if (cached && (cached.ttl !== null && cached.ttl > now) && (cached.data && cached.data.length > 0)) {
				const responseFilter = this._searchFilter(correlationId, criteria, cached.data);
				// If there total for this impulse class is greater than zero, use the cached results....
				if (responseFilter.results.total > 0) {
					return this._successResponse({
						filtered: this._hasSucceeded(responseFilter) ? responseFilter.results.output : [],
						data: {
							data: cached.data,
							ttl: ttl,
							last: cached.last
						}
					}, correlationId);
				}

				// Otherwise need to go get and cache the data from external...
			}

			cached = cached || {};
			cached.data = cached.data || [];

			let data = [ ...cached.data ];

			const response = await this._search(correlationId, criteria);
			this._logger.debug('MotorSearchExternalService', 'search', 'response', response, correlationId);

			// If succeeded, then update data set.
			if (this._hasSucceeded(response)) {
				const responseUpdate = this._searchUpdateData(correlationId, response.results, data, cached.data);
				if (this._successResponse(responseUpdate))
					data = response.results;
			}

			// Filter the data set for results...
			const responseFilter = this._searchFilter(correlationId, criteria, data);
			return this._successResponse({
				filtered: this._hasSucceeded(responseFilter) ? responseFilter.results.output : [],
				data: {
					data: data,
					ttl: ttl,
					last: now
				}
			}, correlationId);
		}
		catch (err) {
			return this._error('MotorSearchExternalService', 'search', null, err, null, correlationId);
		}
	}

	urlHuman() {
		const config = this._config.getBackend(this._urlKey());
		return config.humanUrl;
	}

	urlMotor(motor) {
		if (String.isNullOrEmpty(motor.manufacturerAbbrev) || String.isNullOrEmpty(motor.designation)) {
			return null;
		}

		const uri = this.urlHuman() + '/motors/' + motor.manufacturerAbbrev + '/' + motor.designation;
		return uri;
	}

	async _manufacturers(correlationId) {
	}

	async _motor(correlationId, motorId) {
	}

	async _search(correlationId, criteria) {
	}

	_searchFilter(correlationId, criteria, data) {
		let total = 0;
		const output = [];

		if (!data || !Array.isArray(data)) {
			return this._successResponse({ output: [], total: 0 }, correlationId);
		}

		for (const item of data) {
			if (!String.isNullOrEmpty(criteria.motor)) {
				if (String.isNullOrEmpty(item.commonName) || item.commonName.toLowerCase().indexOf(criteria.motor.toLowerCase()) < 0) {
					if (String.isNullOrEmpty(item.designation) || item.designation.toLowerCase().indexOf(criteria.motor.toLowerCase()) < 0)
						continue;
				}

				total++;
				output.push(item);
				continue;
			}

			if (!String.isNullOrEmpty(criteria.impulseClass) && (item.impulseClass.toLowerCase() !== criteria.impulseClass.toLowerCase()))
				continue;

			total++;

			if (criteria.diameter) {
				if (item.diameter !== parseInt(criteria.diameter))
					continue;
			}

			if (criteria.diameter) {
				if (item.diameter !== parseInt(criteria.diameter))
					continue;
			}

			if (criteria.sparky !== null && criteria.sparky) {
				if (item.sparky === null || (item.sparky !== null && item.sparky === false))
					continue;
			}

			if (criteria.singleUse !== null && criteria.singleUse) {
				if (item.type !== 'SU')
					continue;
			}

			if (!String.isNullOrEmpty(criteria.manufacturer)) {
				if (!criteria.manufacturer.includes(item.manufacturer))
					continue;
			}

			output.push(item);
		}

		return this._successResponse({ output: output, total: total }, correlationId);
	}

	_searchUpdateData(correlationId, results, data, cached) {
		let result;
		let item;
		if (!results) {
			return this._successResponse(correlationId, []);
		}

		const length = results.length;
		const lengthCached = cached.length;
		let difference = [ ...cached ];
		for (let i = 0; i < length; i++) {
			result = results[i];

			for (let j = 0; j < lengthCached; j++) {
				item = cached[j];
				if (result.motorId !== item.motorId)
					continue;

				data[i] = result;
				difference = difference.filter((l) => l.motorId === result.motorId);
				break;
			}

			data.push(result);
		}

		for (const item of difference) {
			data = data.filter((l) => l.motorId === item.motorId);
		}

		return this._successResponse(correlationId, data);
	}

	_urlKey() {
	}
}

export default MotorSearchExternalService;
