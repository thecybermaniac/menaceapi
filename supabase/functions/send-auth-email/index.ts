import React from 'https://esm.sh/react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { PasswordResetEmail } from './_templates/password-reset.tsx'
import { EmailConfirmationEmail } from './_templates/email-confirmation.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  
  let emailData: {
    user: { email: string }
    email_data: {
      token: string
      token_hash: string
      redirect_to: string
      email_action_type: string
      site_url: string
    }
  }

  // Verify webhook signature
  try {
    const wh = new Webhook(hookSecret)
    emailData = wh.verify(payload, headers) as typeof emailData
  } catch (error) {
    console.error('Webhook verification failed:', error)
    return new Response(
      JSON.stringify({ error: { message: 'Invalid webhook signature' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { user, email_data } = emailData
  const { token_hash, redirect_to, email_action_type } = email_data
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''

  console.log(`Processing ${email_action_type} email for ${user.email}`)

  let html: string
  let subject: string

  try {
    switch (email_action_type) {
      case 'recovery':
        html = await renderAsync(
          React.createElement(PasswordResetEmail, {
            supabase_url: supabaseUrl,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Reset your Menace API password'
        break

      case 'signup':
      case 'email_change':
        html = await renderAsync(
          React.createElement(EmailConfirmationEmail, {
            supabase_url: supabaseUrl,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Confirm your Menace API email'
        break

      default:
        console.log(`Unhandled email action type: ${email_action_type}`)
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    }

    const { error } = await resend.emails.send({
      from: 'Menace API <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log(`Email sent successfully to ${user.email}`)

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
