export const API_PATHS = {
	CHAT: '/api/ai/chat',
	MODELS: '/api/ai/models',
	CONVERSATIONS: '/api/conversations'
} as const;

export const ROUTES = {
	CHAT: '/c/',
	SIGN_IN: '/sign-in',
	HOME: '/'
} as const;

export const TITLE_MAX_LENGTH = 50;
export const STORAGE_KEY = 'openbot.activeConversationId';
