'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BeekeeperProfileForm } from '@/components/profile/beekeeper-profile-form'
import { Edit } from 'lucide-react'
import { BeekeeperProfile } from '@/types'

interface EditBeekeeperProfileDialogProps {
  profile: BeekeeperProfile
  children?: React.ReactNode
}

export function EditBeekeeperProfileDialog({ 
  profile, 
  children 
}: EditBeekeeperProfileDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Beekeeper Profile</DialogTitle>
          <DialogDescription>
            Update your beekeeper profile information
          </DialogDescription>
        </DialogHeader>
        <BeekeeperProfileForm 
          profile={profile}
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
