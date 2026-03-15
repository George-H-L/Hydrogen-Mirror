import {type MetaFunction, type ActionFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {Form, useActionData, useNavigation} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'FCS Clothing - Coming Soon'},
    {name: 'robots', content: 'noindex, nofollow'},
  ];
};

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return {error: 'Email is required'};
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {error: 'Please enter a valid email address'};
  }

  const shopifyDomain = context.env.PUBLIC_STORE_DOMAIN;
  const adminAccessToken = context.env.PRIVATE_ADMIN_API_TOKEN;

  if (!adminAccessToken || !shopifyDomain) {
    return {error: 'Server configuration error'};
  }

  try {
    // Create customer in Shopify
    const response = await fetch(`https://${shopifyDomain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query: `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer {
                id
                email
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            email: email.trim().toLowerCase(),
            tags: ['coming-soon-signup'],
          },
        },
      }),
    });

    const result = await response.json();

    if (result.data?.customerCreate?.userErrors?.length > 0) {
      const error = result.data.customerCreate.userErrors[0];
      if (error.message.includes('taken') || error.message.includes('already exists')) {
        return {success: "You're already on the list!"};
      }
      return {error: error.message};
    }

    if (result.data?.customerCreate?.customer) {
      return {success: "You're on the list!"};
    }

    return {error: 'Failed to sign up'};
  } catch (error) {
    console.error('Signup error:', error);
    return {error: 'Connection error. Please try again.'};
  }
}

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0787/3816/1952/files/ezgif.com-video-to-gif-converter_1.gif?v=1764091724)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <Form method="post" replace style={{
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
        }}>
          <div style={{
            flex: 1,
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), linear-gradient(135deg, #ffffff 0%, #808080 50%, #c0c0c0 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              required
              style={{
                padding: '0.65rem 0.9rem',
                fontSize: '0.85rem',
                border: 'none',
                background: 'transparent',
                color: '#ffffff',
                outline: 'none',
                width: '100%',
                fontFamily: "'Roboto', Arial, sans-serif",
                letterSpacing: '0.05em',
              }}
              disabled={isSubmitting || !!actionData?.success}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem',
              fontSize: '1.2rem',
              fontWeight: 700,
              border: 'none',
              background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #999999 100%)',
              color: '#000000',
              cursor: isSubmitting || !email.trim() || !!actionData?.success ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !email.trim() || !!actionData?.success ? 0.6 : 1,
              transition: 'all 0.2s ease',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            disabled={isSubmitting || !email.trim() || !!actionData?.success}
            aria-label="Submit"
          >
            {isSubmitting ? '...' : actionData?.success ? '✓' : '→'}
          </button>
        </div>

        {actionData?.error && (
          <p style={{
            color: '#ff6b6b',
            fontSize: '1rem',
            margin: 0,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            fontWeight: 600,
            textAlign: 'center',
          }}>
            {actionData.error}
          </p>
        )}
      </Form>
    </div>
  );
}
