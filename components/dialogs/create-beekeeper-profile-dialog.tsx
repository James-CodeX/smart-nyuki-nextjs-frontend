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
import { Plus } from 'lucide-react'

interface CreateBeekeeperProfileDialogProps {
  children?: React.ReactNode
}

export function CreateBeekeeperProfileDialog({ children }: CreateBeekeeperProfileDialogProps) {
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
            <Plus className="mr-1 h-3 w-3" />
            Create
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Beekeeper Profile</DialogTitle>
          <DialogDescription>
            Create your beekeeper profile to start managing your apiaries
          </DialogDescription>
        </DialogHeader>
        <BeekeeperProfileForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
