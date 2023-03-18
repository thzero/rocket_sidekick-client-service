import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class PartsService extends RestExternalService {
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
}

export default PartsService;
