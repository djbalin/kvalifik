'use client'

import React, { FC, useState } from 'react'
import { Button } from '@chakra-ui/react'

const FetchAPI: FC = () => {
  const [isLoading, setLoading] = useState(false)

  return (
    <Button
      colorScheme='blue'
      onClick={async () => {
        setLoading(true)
        const response = await fetch('/api/users')
        const data = await response.json()

        alert(`Fetched data: ${JSON.stringify(data)}`)
        setLoading(false)
      }}
      isLoading={isLoading}
    >
      Fetch Users from Route Handler
    </Button>
  )
}

export default FetchAPI
