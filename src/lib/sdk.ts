import * as zns from '@zero-tech/zns-sdk';
import * as ethers from 'ethers';

const provider = ethers.getDefaultProvider();
const config = zns.configurations.mainnetConfiguration(provider);
const sdk = zns.createInstance(config);

export const domainNameToId = (name: string): string => {
	let hashReturn = ethers.constants.HashZero;

	if (name === '' || undefined || null) {
		return hashReturn;
	}

	const domains = name.split('.');
	for (let i = 0; i < domains.length; i++) {
		hashReturn = getSubnodeHash(hashReturn, ethers.utils.id(domains[i]));
	}
	return hashReturn;
};

const getSubnodeHash = (parentHash: string, labelHash: string): string => {
	const calculatedHash = ethers.utils.keccak256(
		ethers.utils.defaultAbiCoder.encode(
			['bytes32', 'bytes32'],
			[ethers.utils.arrayify(parentHash), ethers.utils.arrayify(labelHash)],
		),
	);

	return calculatedHash;
};

export default sdk;
