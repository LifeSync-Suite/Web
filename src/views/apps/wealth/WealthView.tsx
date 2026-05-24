'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function WealthView() {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Wealth</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-report-money text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Wealth — coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Track net worth, manage accounts, monitor cash flow, and stay on top of budgets and upcoming bills.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
