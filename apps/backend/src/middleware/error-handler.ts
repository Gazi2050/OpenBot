import type { Context } from 'hono'

export function errorHandler(err: Error, c: Context) {
	const status = (err as { status?: number }).status || 500
	return Response.json(
		{ success: false, error: err.message || 'Internal server error' },
		{ status }
	)
}
