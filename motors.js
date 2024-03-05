import LibraryClientConstants from '@thzero/library_client/constants';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

import LibraryMomentUtility from '@thzero/library_common/utility/moment';

import BaseService from '@thzero/library_client/service/index';

class MotorsService extends BaseService {
	constructor() {
		super();

		this._serviceCommunicationRest = null;

		this._ttlDefault = 7 * 24 * 60 * 60 * 1000;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceCommunicationRest = injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_COMMUNICATION_REST);
	}

	nameLocale() {
		this.notImplementedError();
	}

	async manufacturers(correlationId, cached) {
		try {
			const now = LibraryMomentUtility.getTimestamp();
			let ttl = LibraryMomentUtility.getTimestamp() + this._ttlDefault;
			if (cached) {
				if (!cached.ttl)
					cached.ttl = ttl;
				ttl = cached.ttl;
			}

			if ((ttl > now) && (cached.manufacturers && cached.manufacturers.length > 0))
				return this._successResponse(cached, correlationId);

			const response = await this._manufacturers(correlationId);
			this._logger.debug('MotorsService', 'manufacturers', 'response', response, correlationId);

			return this._successResponse({
				manufacturers: response.results,
				ttl: ttl,
				last: now
			}, correlationId);
		}
		catch (err) {
			return this._error('MotorsService', 'manufacturers', null, err, null, null, correlationId);
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
				return this._error('MotorsService', 'motor', 'Invalid motor', null, null, null, correlationId);

			if (!motor.samples || motor.samples.length === 0) {
				const response = await this._motor(correlationId, motorId);
				this._logger.debug('MotorsService', 'motor', 'response', response, correlationId);
				if (this._hasFailed(response))
					return response;

				motor.samples = motor.samples ?? [];
				if (response.results && response.results.data && (response.results.data.length > 0)) {
					// motor.samples = response.results.samples;
					let motorData = response.results.data.find(l => l.format === 'RASP');
					if (!motorData)
						motorData = response.results.data[0];
					motor.samples = motorData ? motorData.samples : [];
				}
			}

			cache.last = LibraryMomentUtility.getTimestamp();

			return this._successResponse({
				motor: motor,
				data: cache
			}, correlationId);
		}
		catch (err) {
			return this._error('MotorsService', 'motor', null, err, null, correlationId);
		}
	}

	async search(correlationId, criteria, cached) {
		try {
			const now = LibraryMomentUtility.getTimestamp();
			const ttl = LibraryMomentUtility.getTimestamp() + this._ttlDefault;

			if (!String.isNullOrEmpty(criteria.motorDiameter)) {
				criteria.diameter = criteria.motorDiameter;
				delete criteria.motorDiameter;
			}
			if (!String.isNullOrEmpty(criteria.motorImpulseClass)) {
				criteria.impulseClass = criteria.motorImpulseClass;
				delete criteria.motorImpulseClass;
			}
			criteria.impulseClass = criteria.impulseClass ?? null;

			/*
			// TODO: This was put in place to reduce the usage of an external API and not overload it, setc.
			// Since we are syncing behind the scenes, its not necessary to leverage the API directly.
			// However, it would still be good idea to try and leverage client side caching.
			// console.log('MotorsService.search.cached');
			// console.dir(cached);
			if (cached && (cached.ttl !== null && cached.ttl > now) && (cached.data && cached.data.length > 0)) {
				const responseFilter = this._searchFilter(correlationId, criteria, cached.data);
				// console.log('MotorsService.search.responseFilter');
				// console.dir(responseFilter);
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
			*/

			cached = cached || {};
			cached.data = cached.data || [];

			let data = [ ...cached.data ];

			const response = await this._search(correlationId, criteria);
			// console.log('MotorsService.search.response');
			// console.dir(response);
			this._logger.debug('MotorsService', 'search', 'response', response, correlationId);
			if (this._hasFailed(response)) {
				// console.log('MotorsService.search failed');
				return response;
			}

			// If succeeded, then update data set.
			if (this._hasSucceeded(response)) {
				const responseUpdate = this._searchUpdateCache(correlationId, response.results, data, cached.data);
				// console.log('MotorsService.search.responseUpdate');
				// console.dir(responseUpdate);
				if (this._successResponse(responseUpdate))
					data = response.results;
			}

			// console.log('MotorsService.search.data');
			// console.dir(data);
			// Filter the data set for results...
			const responseFilter = this._searchFilter(correlationId, criteria, data);
			// console.log('MotorsService.search.responseFilter');
			// console.dir(responseFilter);
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
			return this._error('MotorsService', 'search', null, err, null, correlationId);
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
		throw new NotImplementedError();
	}

	async _motor(correlationId, motorId) {
		throw new NotImplementedError();
	}

	async _search(correlationId, criteria) {
		throw new NotImplementedError();
	}

	_searchFilter(correlationId, criteria, data) {
		let total = 0;
		const output = [];

		// console.log('MotorsService._searchFilter.criteria');
		// console.dir(criteria);

		if (!data || !Array.isArray(data)) {
			// console.log('MotorsService._searchFilter.no data');
			return this._successResponse({ output: [], total: 0 }, correlationId);
		}

		for (const item of data) {
			// console.log('MotorsService._searchFilter.id');
			// console.dir(item.id);

			// console.log('MotorsService._searchFilter.impulseClass');
			// console.dir(criteria.motor);
			if (!String.isNullOrEmpty(criteria.motor)) {
				// console.dir(item.commonName);
				// console.dir(item.motor);
				if (String.isNullOrEmpty(item.commonName) || item.commonName.toLowerCase().indexOf(criteria.motor.toLowerCase()) < 0) {
					// console.dir(item.designation);
					if (String.isNullOrEmpty(item.designation) || item.designation.toLowerCase().indexOf(criteria.motor.toLowerCase()) < 0) {
						// console.log('MotorsService._searchFilter.fail');
						continue;
					}
				}

				total++;
				// console.log('MotorsService._searchFilter.id.add.motor');
				output.push(item);
				continue;
			}

			// if (String.isNullOrEmpty(criteria.impulseClass)) {
			// 	// console.log('MotorsService._searchFilter.no impulseclass');
			// 	// console.dir(criteria);
			// 	continue;
			// }

			// console.log('MotorsService._searchFilter.impulseClass');
			// console.dir(criteria.impulseClass.toLowerCase());
			// console.dir(item.impulseClass.toLowerCase());
			// if (item.impulseClass.toLowerCase() !== criteria.impulseClass.toLowerCase()) {
			// 	// console.log('MotorsService._searchFilter.fail');
			// 	continue;
			// }
			if (!criteria.impulseClass || criteria.impulseClass.indexOf(item.impulseClass.toUpperCase()) === -1) {
				// console.log('MotorsService._searchFilter.fail');
				continue;
			}

			total++;

			// console.log('MotorsService._searchFilter.diameter');
			// console.dir(criteria.diameter);
			if (criteria.diameter) {
				// console.dir(item.diameter);
				if (item.diameter !== parseInt(criteria.diameter)) {
					// console.log('MotorsService._searchFilter.fail');
					continue;
				}
			}

			// console.log('MotorsService._searchFilter.sparky');
			// console.dir(criteria.sparky);
			if (criteria.sparky !== null && criteria.sparky) {
				// console.dir(item.sparky);
				if (item.sparky === null || (item.sparky !== null && item.sparky === false)) {
					// console.log('MotorsService._searchFilter.fail');
					continue;
				}
			}

			// console.log('MotorsService._searchFilter.singleUse');
			// console.dir(criteria.singleUse);
			if (criteria.singleUse !== null && criteria.singleUse) {
				// console.dir(item.type);
				if (item.type !== 'SU') {
					// console.log('MotorsService._searchFilter.fail');
					continue;
				}
			}

			// console.log('MotorsService._searchFilter.manufacturer');
			// console.dir(criteria.manufacturer);
			if (Array.isArray(criteria.manufacturers) && criteria.manufacturers.length > 0) {
				// console.dir(item.manufacturerId);
				if (!criteria.manufacturers.includes(item.manufacturerId)) {
					// console.log('MotorsService._searchFilter.fail');
					continue;
				}
			}

			// console.log('MotorsService._searchFilter.manufacturerStockId');
			// console.dir(criteria.manufacturerStockId);
			if (!String.isNullOrEmpty(criteria.manufacturerStockId)) {
				// console.dir(item.manufacturerStockId);
				if (item.manufacturerStockId.toLowerCase().equals((criteria.manufacturerStockId ?? '').toLowerCase())) {
					// console.log('MotorsService._searchFilter.fail');
					continue;
				}
			}

			// console.log('MotorsService._searchFilter.id.add');
			// console.dir(item.id);
			output.push(item);
		}

		// console.log('MotorsService._searchFilter.output');
		// console.dir(output);
		total = output.length;
		return this._successResponse({ output: output, total: total }, correlationId);
	}

	_searchUpdateCache(correlationId, results, data, cached) {
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

export default MotorsService;
