
import nextEnv from '@next/env'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

async function testSupabase() {
  if (!url || !key) {
    console.error('FAILED: Environment variables are missing.')
    process.exitCode = 1
    return
  }

  try {
    console.log('Testing Supabase Auth health...')

    const response = await fetch(`${url}/auth/v1/health`, {
      method: 'GET',
      headers: {
        apikey: key,
      },
    })

    const body = await response.text()

    console.log('HTTP Status:', response.status)

    if (response.ok) {
      console.log('SUCCESS: Supabase connection is working!')
      console.log('Response:', body)
    } else {
      console.error('FAILED: Supabase returned an error.')
      console.error(body)
      process.exitCode = 1
    }
  } catch (error) {
    console.error('Connection failed:', error.message)
    process.exitCode = 1
  }
}

await testSupabase()
