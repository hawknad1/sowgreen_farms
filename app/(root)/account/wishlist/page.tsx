import React from "react"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const WishlistPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">Your wishlist is empty</p>
            <Link href="/products">
              <Button variant="outline" className="mt-4">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default WishlistPage
