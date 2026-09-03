import type { Metadata } from 'next'
import Link from 'next/link'

import { getCurrentCustomer, sessionToken } from '@/lib/auth/session'
import { loadAccountData } from '@/lib/account'

export const metadata: Metadata = { title: 'My Terrova', robots: { index: false, follow: false } }

function date(value?: string) {
  return value
    ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value))
    : 'To be confirmed'
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount / 100)
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const customer = await getCurrentCustomer()
  const query = await searchParams

  if (!customer) {
    return (
      <main id="main-content" className="account-entry">
        <header>
          <p className="page-eyebrow">My Terrova / Private cellar</p>
          <h1>
            Your taste,
            <br />
            over time.
          </h1>
          <p>
            Sign in to see your next box, bottle history and the preferences your discoveries
            reveal.
          </p>
          {query.created && (
            <p role="status">Account created. Check your email to verify it before signing in.</p>
          )}
          {query.reset && <p role="status">Password updated. You can now sign in.</p>}
          {query.error && (
            <p role="alert">
              We could not complete that request. Check your details and try again.
            </p>
          )}
        </header>
        <div className="account-entry__forms">
          <form action="/api/auth/login" method="post" className="editorial-form">
            <h2>Welcome back</h2>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={12}
                required
              />
            </label>
            <button type="submit">Enter My Terrova</button>
            <Link href="/account/forgot-password">Forgot your password?</Link>
          </form>
          <form action="/api/auth/signup" method="post" className="editorial-form">
            <h2>Begin a cellar</h2>
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
              />
            </label>
            <label className="check-field">
              <input name="terms" value="accepted" type="checkbox" required />I accept the{' '}
              <Link href="/legal/terms">Terms</Link> and confirm I am 18 or older.
            </label>
            <label className="check-field">
              <input name="marketing" value="accepted" type="checkbox" />
              Send me occasional Terrova field notes.
            </label>
            <button type="submit">Create account</button>
          </form>
        </div>
      </main>
    )
  }

  const token = await sessionToken()
  if (!token) return null
  const account = await loadAccountData(customer, token)
  const subscription = account.subscriptions[0]
  const nextOrder = account.orders.find((order) => ['paid', 'preparing'].includes(order.status))

  return (
    <main id="main-content" className="account-shell">
      <header className="account-hero">
        <p className="page-eyebrow">My Terrova / {customer.name ?? 'Member'}</p>
        <h1>
          Your next discovery
          <br />
          starts here.
        </h1>
        <form action="/api/auth/logout" method="post">
          <button className="text-button">Sign out</button>
        </form>
      </header>

      <section className="account-feature" aria-labelledby="next-box-title">
        <p>01 / Next box</p>
        <h2 id="next-box-title">
          {nextOrder?.editionTitle ?? 'The next edition is taking shape.'}
        </h2>
        <p>
          {nextOrder
            ? `Order ${nextOrder.code} is ${nextOrder.status}.`
            : 'We will reveal the edition here once your next allocation is confirmed.'}
        </p>
      </section>

      <section className="account-grid" aria-label="Membership and deliveries">
        <article>
          <p>02 / Membership</p>
          <h2>{subscription?.planName ?? 'No active journey yet'}</h2>
          <p>
            {subscription ? (
              <>
                Status: <strong>{subscription.status.replace('_', ' ')}</strong>
                <br />
                Current period ends {date(subscription.currentPeriodEnd)}.
              </>
            ) : (
              'Choose a journey when you are ready.'
            )}
          </p>
          {account.providerCustomerId ? (
            <form action="/api/commerce/portal" method="post">
              <button>Manage billing & membership</button>
            </form>
          ) : (
            <Link className="button-link" href="/boxes">
              Explore membership
            </Link>
          )}
        </article>
        <article>
          <p>03 / Deliveries</p>
          <h2>
            {account.orders.length ? `${account.orders.length} recorded` : 'No deliveries yet'}
          </h2>
          <ol className="account-list">
            {account.orders.map((order) => (
              <li key={String(order.id)}>
                <span>{order.code}</span>
                <span>{order.status}</span>
                <span>{money(order.total.amount, order.total.currency)}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="account-feature account-feature--paper" aria-labelledby="cellar-title">
        <p>04 / My Cellar</p>
        <h2 id="cellar-title">Bottles become memory.</h2>
        {account.cellar.length ? (
          <ol className="cellar-list">
            {account.cellar.map((item) => (
              <li key={String(item.id)}>
                <div>
                  <strong>{item.wineName}</strong>
                  <span>{item.producerName}</span>
                </div>
                <form action="/api/ratings" method="post" className="rating-form">
                  <input type="hidden" name="cellarEntryId" value={String(item.id)} />
                  <input type="hidden" name="wineId" value={String(item.wineId)} />
                  <label>
                    Rating
                    <select name="score" defaultValue={item.rating ?? ''} required>
                      <option value="" disabled>
                        Choose
                      </option>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <option key={score} value={score}>
                          {score} / 5
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit">Save</button>
                </form>
              </li>
            ))}
          </ol>
        ) : (
          <p>
            Your fulfilled Terrova bottles will appear here. Ratings are only available for bottles
            in your cellar.
          </p>
        )}
      </section>

      <section className="account-grid" aria-label="Taste profile and address">
        <article>
          <p>05 / Taste Profile</p>
          <h2>
            {account.tasteProfile.observedRatings
              ? `${account.tasteProfile.observedRatings} observed moments`
              : 'A profile with room to grow'}
          </h2>
          <p>
            Observed history and inferred preferences are kept distinct. No AI claims, only
            transparent signals from your ratings.
          </p>
          <ul className="signal-list">
            {account.tasteProfile.preferences.slice(0, 6).map((signal) => (
              <li key={`${signal.category}-${signal.key}`}>
                <span>{signal.label}</span>
                <span>
                  {signal.score > 0 ? '+' : ''}
                  {signal.score} · {signal.observations}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <p>06 / Delivery address</p>
          <h2>{account.addresses[0]?.label ?? 'Add an address'}</h2>
          {account.addresses[0] && (
            <address>
              {account.addresses[0].recipientName}
              <br />
              {account.addresses[0].line1}
              <br />
              {account.addresses[0].postalCode} {account.addresses[0].city}
            </address>
          )}
          <form
            action="/api/account/address"
            method="post"
            className="editorial-form editorial-form--compact"
          >
            <label>
              Recipient
              <input
                name="recipientName"
                defaultValue={account.addresses[0]?.recipientName}
                required
              />
            </label>
            <label>
              Address
              <input name="line1" defaultValue={account.addresses[0]?.line1} required />
            </label>
            <label>
              City
              <input name="city" defaultValue={account.addresses[0]?.city} required />
            </label>
            <label>
              Postal code
              <input name="postalCode" defaultValue={account.addresses[0]?.postalCode} required />
            </label>
            <input type="hidden" name="addressId" value={String(account.addresses[0]?.id ?? '')} />
            <button type="submit">Save address</button>
          </form>
        </article>
      </section>

      <section className="account-security">
        <p>07 / Profile & security</p>
        <p>{customer.email}</p>
        <Link href="/account/forgot-password">Change password</Link>
      </section>
    </main>
  )
}
