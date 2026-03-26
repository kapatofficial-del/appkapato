import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'K32hwc6ZTHjaHvxYvPp5yB3LpuTDQ1iTfcxy1sQcQ01sKD6oK6-_e_rGlSV5J1KJ';

export interface ClientPayload {
	id: string;
	email: string;
}

export function signToken(payload: ClientPayload): string {
	return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): ClientPayload | null {
	try {
		return jwt.verify(token, SECRET) as ClientPayload;
	} catch {
		return null;
	}
}

export function getClientFromRequest(request: Request): ClientPayload | null {
	const auth = request.headers.get('Authorization');
	if (!auth?.startsWith('Bearer ')) return null;
	return verifyToken(auth.slice(7));
}
