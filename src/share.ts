import express from 'express';

// Library
import sdk, { domainNameToId } from './lib/sdk';
import { getMetadata } from './lib/metadata';

const share = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
): Promise<void> => {
	console.log('headers', req.headers);
	const ua = req.headers['user-agent'];
	const { domain } = req.params;

	if (!ua) {
		next(404);
	}

	if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua!)) {
		try {
			const domainId = domainNameToId('wilder.' + domain);
			const domainData = await sdk.getDomainById(domainId);
			const metadata = await getMetadata(domainData.metadataUri);
			if (
				!metadata ||
				!metadata.title ||
				!metadata.description ||
				!metadata.ipfsHash
			) {
				next(503);
			}
			console.log('metadata', metadata);
			console.log('image-url', `https://res.cloudinary.com/fact0ry/image/upload/c_fit,f_auto,h_700,w_700/v1/zns/${metadata!.ipfsHash}.jpg`);
			console.log('video-url', `https://res.cloudinary.com/fact0ry/video/upload/c_fit,f_auto,h_700,w_700/v1/zns/${metadata!.ipfsHash}.jpg`);
			res.render('headers', {
				title: metadata!.title,
				description: metadata!.description,
				ipfsHash: metadata!.ipfsHash,
			});
		} catch(err) {
			console.log('error', err);
			next(503);
		}
	} else {
		res.redirect('https://market.wilderworld.com/#/' + domain);
	}
};

export default share;
