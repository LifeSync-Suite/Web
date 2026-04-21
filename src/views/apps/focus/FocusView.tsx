'use client'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const FocusView = () => {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Focus Timer</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-focus-2 text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Focus Timer is coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Deep work sessions with Pomodoro timers, ambient soundscapes, custom templates, and automatic task logging.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default FocusView
