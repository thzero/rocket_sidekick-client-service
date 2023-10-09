import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class LocationsService extends RestExternalService {
	async delete(correlationId, id) {
		try {
			this._enforceNotEmpty('LocationsService', 'delete', id, 'id', correlationId);

			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('LocationsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LocationsService', 'delete', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			this._enforceNotEmpty('LocationsService', 'retrieve', id, 'id', correlationId);

			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('LocationsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LocationsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, location) {
		try {
			this._enforceNotNull('LocationsService', 'save', location, 'location', correlationId);
			const response = await this._saveCommunication(correlationId, location);
			this._logger.debug('LocationsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LocationsService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('LocationsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LocationsService', 'search', null, err, null, null, correlationId);
		}
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'locations', id);
		this._logger.debug('LocationsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'locations', id);
		this._logger.debug('LocationsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'locations' }, params);
		this._logger.debug('LocationsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'locations/search' }, params);
		this._logger.debug('LocationsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}
}

export default LocationsService;
