import { Button } from '@react-email/button'
import { Html } from '@react-email/html'
import * as React from 'react'

export const SignInEmail: React.FC<{ url: string; siteName: string }> = ({ url, siteName }) => {
  return (
    <Html>
      <Button href={url} style={{ background: '#000', color: '#fff', padding: '12px 20px' }}>
        Sign in to {siteName}
      </Button>
    </Html>
  )
}