import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class CountriesService extends RestExternalService {
	async listing(correlationId, params) {
		try {
			const response = await this._listingCommunication(correlationId, params);
			this._logger.debug('CountriesService', 'listing', 'response', response, correlationId);

			response.results.data = response.results.data;

			const mainCountries = [];
			mainCountries.push(response.results.data.find(l => l.iso3 === 'USA'));
			mainCountries.push(response.results.data.find(l => l.iso3 === 'CAN'));
			mainCountries.push(response.results.data.find(l => l.iso3 === 'MEX'));
			mainCountries.push(response.results.data.find(l => l.iso3 === 'GBR'));
			mainCountries.push(response.results.data.find(l => l.iso3 === 'AUS'));
			mainCountries.push(response.results.data.find(l => l.iso3 === 'NZL'));

			response.results.data = response.results.data.filter(l => !mainCountries.includes(l.iso3));
			response.results.data = response.results.data.sort((a, b) => a.name.localeCompare(b.name));
			
			response.results.data = [...mainCountries, ...response.results.data];

			return response;
		}
		catch (err) {
			return this._error('CountriesService', 'listing', null, err, null, null, correlationId);
		}
	}

	async _listingCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'countries/listing' }, params);
		this._logger.debug('ManufacturersService', '_listingCommunication', 'response', response, correlationId);
		return response;
	}
}

export default CountriesService;
