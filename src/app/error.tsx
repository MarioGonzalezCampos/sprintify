'use client'

import { AlertTriangle } from 'lucide-react'
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='h-screen flex flex-col gap-y-2 items-center justify-center'>
        <AlertTriangle />
        <p className='text-sm text-muted-foreground'>
            Something went wrong
        </p>

    </div>
  )
}

export default ErrorPage