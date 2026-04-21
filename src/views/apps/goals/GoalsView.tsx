'use client'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const GoalsView = () => {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Goal Tracking</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-target text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Goal Tracking is coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Set meaningful goals, track your progress with the Dual-Progress System, and always know if you're on pace.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default GoalsView
