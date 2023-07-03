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

	async listing(correlationId, params) {
		try {
			const response = await this._listingCommunication(correlationId, params);
			this._logger.debug('PartsService', 'listing', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'listing', null, err, null, null, correlationId);
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

	async _listingCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/listing' }, params);
		this._logger.debug('PartsService', '_listingCommunication', 'response', response, correlationId);
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
