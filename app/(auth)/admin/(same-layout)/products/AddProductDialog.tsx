"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SquarePlusIcon } from "lucide-react"
import PostProductForm from "@/components/forms/PostProductForm"

const AddProductDialog = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNextStep = () => setCurrentStep((prev) => prev + 1)
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1)

  const isLastStep = currentStep === 4

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Step 1: Basic Info"
      case 2:
        return "Step 2: Variants"
      case 3:
        return "Step 3: Upload Product Image"
      case 4:
        return "Step 4: Review & Submit"
      default:
        return "Step 1: Basic Info"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <SquarePlusIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PostProductForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          isLastStep={isLastStep}
          title={getStepTitle()}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddProductDialog
