import VersionService from '@thzero/library_client/service/version';

// eslint-disable-next-line
// const modules = import.meta.globEager('../../package.json');
const modules = import.meta.glob('../../package.json' ,{ eager: true });
// eslint-disable-next-line camelcase
const { version_major, version_minor, version_patch, version_date, copyright, author, author_url } = modules['../../package.json'];

class AppVersionService extends VersionService {
	async _version(correlationId) {
		// eslint-disable-next-line
		return this._generate(correlationId, version_major, version_minor, version_patch, version_date, copyright, author, author_url);
	}
}

export default AppVersionService;
