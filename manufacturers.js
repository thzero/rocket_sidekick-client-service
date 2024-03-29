import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class ManufacturersService extends RestExternalService {
	async listing(correlationId, params) {
		try {
			const response = await this._listingCommunication(correlationId, params);
			this._logger.debug('ManufacturersService', 'listing', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ManufacturersService', 'listing', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('ManufacturersService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ManufacturersService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async _listingCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'manufacturers/listing' }, params);
		this._logger.debug('ManufacturersService', '_listingCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'manufacturers', id);
		this._logger.debug('ManufacturersService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}
}

export default ManufacturersService;
