'use client'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const HabitsView = () => {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Habit Builder</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-flame text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Habit Builder is coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Build lasting habits with daily streaks, heatmap calendars, gamification, and milestone badges.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default HabitsView
