import { Resend } from 'resend'

// Lazy initialization - only create client when needed at runtime
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[v0] RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendPaymentLifecycleEmail(input: {
  email: string
  studentName: string
  subject: string
  heading: string
  message: string
  paymentUrl?: string
}) {
  const resend = getResendClient()
  if (!resend) return false

  try {
    await resend.emails.send({
      from: 'noreply@linguab.com',
      to: input.email,
      subject: input.subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;color:#334155"><h2 style="color:#0f3d5e">${input.heading}</h2><p>Dear ${input.studentName},</p><p style="line-height:1.6">${input.message}</p>${input.paymentUrl ? `<p><a href="${input.paymentUrl}" style="display:inline-block;background:#0f3d5e;color:#fff;padding:12px 20px;text-decoration:none;border-radius:5px">Open secure payment link</a></p>` : ''}<p style="font-size:12px;color:#64748b;margin-top:32px">LinguaBridge · linguab.com</p></div>`,
    })
    return true
  } catch (error) {
    console.error('[LinguaBridge] Failed to send payment email:', error)
    return false
  }
}


export async function sendEnrollmentEmail(email: string, studentName: string, programTitle: string) {
  const resend = getResendClient()
  if (!resend) return false
  
  try {
    await resend.emails.send({
      from: 'noreply@linguab.com',
      to: email,
      subject: `Welcome to ${programTitle} at LinguaBridge`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f4e6; padding: 20px; text-align: center; border-radius: 8px;">
            <h2 style="color: #1a1a1a; margin: 0;">Welcome to LinguaBridge</h2>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px;">Dear ${studentName},</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Congratulations on enrolling in <strong>${programTitle}</strong> at the International Institute for Certified Administrative Resources (LinguaBridge).
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              You now have access to all course materials, lessons, and assessments. Log in to your dashboard to begin your learning journey.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://linguab.com/dashboard" style="background-color: #184f7b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact our support team.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">
              © 2024 LinguaBridge. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
    console.log('[v0] Enrollment email sent to:', email)
    return true
  } catch (err) {
    console.error('[v0] Failed to send enrollment email:', err)
    return false
  }
}

export async function sendExamCompletionEmail(email: string, studentName: string, programTitle: string, score: number) {
  const resend = getResendClient()
  if (!resend) return false
  
  try {
    const passed = score >= 70
    await resend.emails.send({
      from: 'noreply@linguab.com',
      to: email,
      subject: passed ? `Congratulations! You Passed ${programTitle}` : `Final Exam Results for ${programTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${passed ? '#d1fae5' : '#fee2e2'}; padding: 20px; text-align: center; border-radius: 8px;">
            <h2 style="color: ${passed ? '#065f46' : '#7f1d1d'}; margin: 0;">
              ${passed ? '✓ Exam Passed!' : 'Exam Completed'}
            </h2>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px;">Dear ${studentName},</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Thank you for completing the final exam for <strong>${programTitle}</strong>.
            </p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: #666; font-size: 14px; margin: 0;">Final Score</p>
              <p style="color: ${passed ? '#059669' : '#dc2626'}; font-size: 32px; font-weight: bold; margin: 10px 0;">${score}%</p>
              <p style="color: #666; font-size: 14px; margin: 0;">${passed ? 'PASSED' : 'NOT YET - Review the materials and try again'}</p>
            </div>
            ${passed ? `
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Your certificate is ready to download from your dashboard. You can share it with employers or on professional networks.
              </p>
            ` : ''}
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://linguab.com/dashboard/certificates" style="background-color: #184f7b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                ${passed ? 'Download Certificate' : 'View Results'}
              </a>
            </div>
          </div>
        </div>
      `,
    })
    console.log('[v0] Exam completion email sent to:', email)
    return true
  } catch (err) {
    console.error('[v0] Failed to send exam completion email:', err)
    return false
  }
}

export async function sendCertificateEmail(email: string, studentName: string, programTitle: string, certificatePdfUrl: string) {
  const resend = getResendClient()
  if (!resend) return false
  
  try {
    await resend.emails.send({
      from: 'noreply@linguab.com',
      to: email,
      subject: `Your ${programTitle} Certificate from LinguaBridge`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #fef3c7; padding: 20px; text-align: center; border-radius: 8px;">
            <h2 style="color: #92400e; margin: 0;">🎓 Certificate of Completion</h2>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px;">Dear ${studentName},</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Congratulations on successfully completing <strong>${programTitle}</strong>!
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Your professional certificate has been generated and is attached to this email. You can also download it anytime from your dashboard.
            </p>
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0; border-radius: 4px;">
              <p style="color: #92400e; font-size: 13px; margin: 0;">
                <strong>Certificate Details:</strong><br>
                Program: ${programTitle}<br>
                Status: ✓ Completed<br>
                Issuing Organization: LinguaBridge
              </p>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              You can verify your certificate using the verification link on our website.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://linguab.com/dashboard/certificates" style="background-color: #184f7b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View All Certificates
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">
              © 2024 LinguaBridge. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
    console.log('[v0] Certificate email sent to:', email)
    return true
  } catch (err) {
    console.error('[v0] Failed to send certificate email:', err)
    return false
  }
}
