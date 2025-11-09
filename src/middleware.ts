import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only handle /mod route
  if (request.nextUrl.pathname !== '/mod') {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  // If no auth header, prompt for credentials
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Moderation Panel"',
      },
    });
  }

  // Decode and check credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Check password against MOD_PASS
  if (password !== process.env.MOD_PASS) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Moderation Panel"',
      },
    });
  }

  // Auth successful, continue
  return NextResponse.next();
}

export const config = {
  matcher: '/mod',
};

