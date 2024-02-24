import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

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

	async save(correlationId, inventory) {
		try {
			this._enforceNotNull('InventoryService', 'save', inventory, 'inventory', correlationId);

			inventory = LibraryCommonUtility.cloneDeep(inventory);

			delete inventory.name;
			delete inventory.description;
			delete inventory.searchName;
			delete inventory.items;
			delete inventory.manufacturers;
			for (const type of inventory.types) {
				delete type.title;
				for (const item of type.items) {
					item.delay = item.delay ? Number(item.delay) : null;
					item.quantity = item.quantity ? Number(item.quantity) : null;
					delete item.item;
				}
			}

			const response = await this._saveCommunication(correlationId, inventory);
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
