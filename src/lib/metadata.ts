import https from 'https';
import { TwitterMedia } from '../types';

const ipfsToHttps = (url: string) => {
	return 'https://ipfs.fleek.co/ipfs/' + url.slice(7);
};

const getHashFromIPFSUrl = (url: string) => {
	if (url.startsWith('ipfs://')) {
		// ipfs://
		return url.slice(7);
	} else {
		// http(s)://
		const hashIndex = url.lastIndexOf('/') + 1;
		return url.slice(hashIndex);
	}
};

export async function getMetadata(
	metadataUrl: string,
): Promise<TwitterMedia | undefined> {
	return new Promise((resolve, reject) => {
		try {
			let requestUrl = metadataUrl;
			if (metadataUrl.startsWith('ipfs://')) {
				requestUrl = ipfsToHttps(metadataUrl);
			}

			https.get(requestUrl, (res) => {
				var str = '';

				res.on('data', (chunk) => {
					str += chunk;
				});

				res.on('end', () => {
					try {
						const metadata = JSON.parse(str);
						const hash = getHashFromIPFSUrl(metadata.image);
						resolve({
							title: metadata.name || metadata.title,
							description: metadata.description,
							ipfsHash: hash,
						});
						resolve(metadata);
					} catch {
						reject();
					}
				});

				res.on('error', (e) => {
					console.error(e);
					reject();
				});
			});
		} catch (e) {
			console.log(e);
			console.error('Failed to retrieve metadata from ' + metadataUrl);
			reject();
		}
	});
}
