import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryMomentUtility from '@thzero/library_common/utility/moment';

import RestExternalService from '@thzero/library_client/service/externalRest';

class InventoryService extends RestExternalService {
	async retrieve(correlationId) {
		try {
			const response = await this._retrieveCommunication(correlationId);
			this._logger.debug('InventoryService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('InventoryService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, launch) {
		try {
			this._enforceNotNull('InventoryService', 'save', launch, 'launch', correlationId);

			launch.date = launch.date ? LibraryMomentUtility.convertTimestampFromLocal(launch.date) : null;

			if (launch) {
				delete launch.location;
				delete launch.rocket;
			}

			const response = await this._saveCommunication(correlationId, launch);
			this._logger.debug('InventoryService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('InventoryService', 'save', null, err, null, null, correlationId);
		}
	}

	async _retrieveCommunication(correlationId) {
		const response = await this._serviceCommunicationRest.get(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'inventory');
		this._logger.debug('InventoryService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'inventory' }, params);
		this._logger.debug('InventoryService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}
}

export default InventoryService;
