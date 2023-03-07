
import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import RestCommunicationService from '@thzero/library_client/service/restCommunication';

class InterceptorCommunicationService extends RestCommunicationService {
	constructor() {
		super();

	}

	async delete(correlationId, key, url, options) {
		if (LibraryClientUtility.online)
			return await super.delete(correlationId, key, url, options);

		return null;
	}

	async deleteById(correlationId, key, url, id, options) {
		if (LibraryClientUtility.online)
			return await super.deleteById(correlationId, key, url, id, options);

		return null;
	}

	async get(correlationId, key, url, options) {
		if (LibraryClientUtility.online)
			return await super.get(correlationId, key, url, options);

		return null;
	}

	async getById(correlationId, key, url, id, options) {
		if (LibraryClientUtility.online)
			return await super.get(correlationId, key, url, id, options);

		return null;
	}

	async post(correlationId, key, url, body, options) {
		if (LibraryClientUtility.online)
			return await super.post(correlationId, key, url, body, options);

		return null;
	}

	async postById(correlationId, key, url, id, body, options) {
		if (LibraryClientUtility.online)
			return await super.postById(correlationId, key, url, id, body, options);

		return null;
	}
}

export default InterceptorCommunicationService;
