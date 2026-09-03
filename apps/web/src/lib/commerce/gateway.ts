import {
  CommerceNotConfiguredError,
  StripeCommerceGateway,
  TestCommerceGateway,
  type CommerceGateway,
} from '@terrova/commerce'

export function commerceGateway(): CommerceGateway {
  if (process.env.COMMERCE_MODE === 'test') {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TEST_COMMERCE !== 'true') {
      throw new CommerceNotConfiguredError()
    }
    return new TestCommerceGateway()
  }
  return new StripeCommerceGateway(process.env.STRIPE_SECRET_KEY)
}
