import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import UtilityService from '@thzero/library_client/service/utility';

class AppUtilityService extends UtilityService {
	async content(correlationId) {
		try {
			const body = {
				locale: LibraryClientUtility.$trans.locale
			};
			const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'utility/content' }, body);
			this._logger.debug('AppUtilityService', 'content', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('AppUtilityService', 'content', null, err, null, null, correlationId);
		}
	}

	async contentMarkup(correlationId, contentId) {
		this._enforceNotEmpty('AppUtilityService', 'contentMarkup', contentId, 'contentId', correlationId);

		try {
			const body = {
				locale: LibraryClientUtility.$trans.locale,
				contentId: contentId
			};
			const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'utility/content/markup' }, body);
			this._logger.debug('AppUtilityService', 'contentMarkup', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('AppUtilityService', 'contentMarkup', null, err, null, null, correlationId);
		}
	}
}

export default AppUtilityService;
