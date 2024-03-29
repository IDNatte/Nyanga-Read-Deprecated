import { writable } from 'svelte/store';

export type AppType = {
	about: string;
	lang?: {
		code: 'en';
	};
	appVersion?: string;
	update?: {
		checking: boolean;
		info: string;
		status: 'update-available' | 'update-unavailable' | 'error' | 'downloading' | 'downloaded';
	};
};

export default writable<AppType>({ about: '' });
