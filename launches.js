import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class LaunchesService extends RestExternalService {
	async delete(correlationId, id) {
		try {
			this._enforceNotEmpty('LaunchesService', 'delete', id, 'id', correlationId);

			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('LaunchesService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LaunchesService', 'delete', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			this._enforceNotEmpty('LaunchesService', 'retrieve', id, 'id', correlationId);

			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('LaunchesService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LaunchesService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async retrieveGallery(correlationId, id) {
		try {
			this._enforceNotEmpty('LaunchesService', 'retrieveGallery', id, 'id', correlationId);

			const response = await this._retrieveGalleryCommunication(correlationId, id);
			this._logger.debug('LaunchesService', 'retrieveGallery', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LaunchesService', 'retrieveGallery', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, rocket) {
		try {
			this._enforceNotNull('LaunchesService', 'save', rocket, 'rocket', correlationId);

			const response = await this._saveCommunication(correlationId, rocket);
			this._logger.debug('LaunchesService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LaunchesService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('LaunchesService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('LaunchesService', 'search', null, err, null, null, correlationId);
		}
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'launches', id);
		this._logger.debug('LaunchesService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'launches', id);
		this._logger.debug('LaunchesService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'launches' }, params);
		this._logger.debug('LaunchesService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'launches/search' }, params);
		this._logger.debug('LaunchesService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}
}

export default LaunchesService;
