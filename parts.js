import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class PartsService extends RestExternalService {
	async copy(correlationId, params) {
		try {
			const response = await this._copyCommunication(correlationId, params);
			this._logger.debug('PartsService', 'copy', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'copy', null, err, null, null, correlationId);
		}
	}

	async delete(correlationId, id) {
		try {
			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('PartsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'delete', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			this._enforceNotNull('PartsService', 'search', params, 'params', correlationId);
			this._enforceNotEmpty('PartsService', 'search', params.typeId, 'params.typeId', correlationId);
			
			// TODO: potentially look at caching; look at expanding the motorsearch caching schema at a parts type level.

			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('PartsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'search', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('PartsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, part) {
		try {
			const response = await this._saveCommunication(correlationId, part);
			this._logger.debug('PartsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'save', null, err, null, null, correlationId);
		}
	}

	async _copyCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/copy' }, params);
		this._logger.debug('PartsService', '_copyCommunication', 'response', response, correlationId);
		return response;
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'parts', id);
		this._logger.debug('PartsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/search' }, params);
		this._logger.debug('PartsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'parts', id);
		this._logger.debug('PartsService', 'retrieve', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, part) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts' }, part);
		this._logger.debug('PartsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}
}

export default PartsService;
