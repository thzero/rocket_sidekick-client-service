import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class RocketsService extends RestExternalService {
	async listing(correlationId, params) {
		try {
			const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing' }, params);
			this._logger.debug('RocketsService', 'listing', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'listing', null, err, null, null, correlationId);
		}
	}

	async listingUser(correlationId, params) {
		try {
			const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing/user' }, params);
			this._logger.debug('RocketsService', 'listingUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'listingUser', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets', id);
			this._logger.debug('RocketsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async retrieveUser(correlationId, id) {
		try {
			const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets/user', id);
			this._logger.debug('RocketsService', 'retrieveUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'retrieveUser', null, err, null, null, correlationId);
		}
	}
}

export default RocketsService;
