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
import { UserProfileForm } from '@/components/profile/user-profile-form'
import { Edit } from 'lucide-react'

interface EditUserProfileDialogProps {
  children?: React.ReactNode
}

export function EditUserProfileDialog({ children }: EditUserProfileDialogProps) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>
        <UserProfileForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
