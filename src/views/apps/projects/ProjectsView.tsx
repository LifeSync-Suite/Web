'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function ProjectsView() {
  return (
    <Box className='flex flex-col gap-6'>
      <Typography variant='h4'>Projects</Typography>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <i className='tabler-briefcase text-6xl text-primary opacity-50' />
          <Typography variant='h5' color='text.secondary'>
            Projects — coming soon
          </Typography>
          <Typography variant='body2' color='text.disabled' className='text-center max-w-sm'>
            Manage client projects, track billable hours, monitor accrued earnings, and stay on top of outstanding invoices.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
