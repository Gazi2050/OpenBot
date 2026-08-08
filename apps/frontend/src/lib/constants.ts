export const API_BASE = '';

export const API_PATHS = {
	CHAT: `${API_BASE}/api/ai/chat`,
	MODELS: `${API_BASE}/api/ai/models`,
	CONVERSATIONS: `${API_BASE}/api/conversations`
} as const;

export const ROUTES = {
	CHAT: '/c/',
	SIGN_IN: '/sign-in',
	HOME: '/'
} as const;

export const TITLE_MAX_LENGTH = 50;
export const STORAGE_KEY = 'openbot.activeConversationId';
