import AppConstants from '@/utility/constants';

import BaseFeaturesService from '@thzero/library_client/service/features';

class FeatureService extends BaseFeaturesService {
	features() {
		return AppConstants.Features;
	}
}

export default FeatureService;
