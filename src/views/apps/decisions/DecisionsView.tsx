'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function DecisionsView() {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Decision Compass</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-compass text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Decision Compass — coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Use structured frameworks (pros/cons, radar charts, weighted scoring) to make better decisions with clarity.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
