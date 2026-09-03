import { NextResponse } from 'next/server'

import { getCurrentCustomer, sessionToken } from '@/lib/auth/session'
import { cmsRequest } from '@/lib/cms'
import { requestBrand } from '@/lib/content'
import { assertSameOrigin, cleanText, requestData } from '@/lib/security'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const [customer, token, { brand }] = await Promise.all([
      getCurrentCustomer(),
      sessionToken(),
      requestBrand(),
    ])
    if (!customer || !token) return NextResponse.redirect(new URL('/account', request.url), 303)
    const data = await requestData(request)
    const addressId = cleanText(data.addressId, 80)
    const address = {
      customer: customer.id,
      brand: brand.id,
      label: 'Home',
      recipientName: cleanText(data.recipientName, 120),
      line1: cleanText(data.line1, 180),
      city: cleanText(data.city, 100),
      postalCode: cleanText(data.postalCode, 24),
      countryCode: 'PT',
      isDefault: true,
    }
    if (!address.recipientName || !address.line1 || !address.city || !address.postalCode) {
      throw new Error('Address fields are required')
    }
    await cmsRequest(addressId ? `/api/addresses/${addressId}` : '/api/addresses', {
      token,
      method: addressId ? 'PATCH' : 'POST',
      body: JSON.stringify(address),
    })
    return NextResponse.redirect(new URL('/account?address=saved', request.url), 303)
  } catch {
    return NextResponse.redirect(new URL('/account?error=address', request.url), 303)
  }
}
