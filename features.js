import AppSharedConstants from '@/utility/constants';

import BaseFeaturesService from '@thzero/library_client/service/features';

class FeatureService extends BaseFeaturesService {
	features() {
		return AppSharedConstants.Features;
	}
}

export default FeatureService;
