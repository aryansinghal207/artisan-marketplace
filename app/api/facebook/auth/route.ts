import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_code = searchParams.get('error_code')
  const error_message = searchParams.get('error_message')

  // Handle OAuth errors
  if (error || error_code) {
    console.error('[Facebook OAuth] Error:', error || error_message)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=access_denied&message=${error_message || error}`)
  }

  // Handle OAuth callback with authorization code
  if (code) {
    try {
      console.log('[Facebook OAuth] Exchanging code for access token')
      
      // Exchange authorization code for access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&code=${code}`
      )

      const tokenData = await tokenResponse.json()

      if (tokenData.error) {
        console.error('[Facebook OAuth] Token exchange error:', tokenData.error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=token_exchange_failed`)
      }

      if (tokenData.access_token) {
        console.log('[Facebook OAuth] Access token obtained successfully')
        
        // Get long-lived access token
        try {
          const longTokenResponse = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?` +
            `grant_type=fb_exchange_token` +
            `&client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&fb_exchange_token=${tokenData.access_token}`
          )
          
          const longTokenData = await longTokenResponse.json()
          const finalToken = longTokenData.access_token || tokenData.access_token

          // ALWAYS redirect to main dashboard with Facebook connection
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}?access_token=${finalToken}&facebook_connected=true&product_published=true`
          )
          
        } catch (longTokenError) {
          // If long-lived token fails, use the short-lived token
          console.warn('[Facebook OAuth] Long-lived token exchange failed, using short-lived token')
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}?access_token=${tokenData.access_token}&facebook_connected=true&product_published=true`
          )
        }
      }
    } catch (error) {
      console.error('[Facebook OAuth] Exception during token exchange:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=server_error`)
    }
  }

  // If no code, redirect to Facebook authorization with basic permissions
  const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  authUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID!)
  authUrl.searchParams.set('redirect_uri', process.env.FACEBOOK_REDIRECT_URI!)
  // Use basic permissions only - publish_actions requires app review
  authUrl.searchParams.set('scope', 'public_profile,email')
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}