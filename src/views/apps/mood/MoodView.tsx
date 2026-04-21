'use client'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const MoodView = () => {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Mood & Journal</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-mood-smile text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Mood & Journal is coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Track 48 emotions on an Energy × Valence axis, write private journal entries, and understand your emotional patterns.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default MoodView
