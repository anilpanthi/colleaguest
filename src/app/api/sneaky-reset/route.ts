import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const newPassword = searchParams.get('newPassword')

  if (!email || !newPassword) {
    return Response.json(
      {
        error: 'Missing email or newPassword query parameters.',
        usage: '?email=your-email@example.com&newPassword=NewSecurePassword123',
      },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config })

    // Find the user first to make sure they exist
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      overrideAccess: true,
    })

    if (users.length === 0) {
      return Response.json({ error: `User with email "${email}" not found.` }, { status: 404 })
    }

    const userId = users[0].id

    // Update the password
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        password: newPassword,
      },
      overrideAccess: true,
    })

    return Response.json({
      message: 'Password updated successfully. You can now log in with your new password.',
      nextStep: 'IMMEDIATELY DELETE THIS FILE (src/app/api/sneaky-reset/route.ts) to secure your site.',
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    return Response.json({ error: error.message || 'An internal error occurred' }, { status: 500 })
  }
}
