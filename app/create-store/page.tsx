"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Pill, CheckCircle2, Loader2, Globe, Building2, Upload, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { useAppContext } from '@/hooks/useAppContext'

const templates = [
  {
    id: 'estore',
    name: 'Standard E-Store',
    description: 'Perfect for general retail, fashion, and electronics.',
    icon: ShoppingBag,
    color: 'bg-blue-500',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Store',
    description: 'Optimized for health products, medicine, and wellness.',
    icon: Pill,
    color: 'bg-green-500',
  },
]

export default function CreateStorePage() {
  const { user } = useAppContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    template: 'estore',
    contactEmail: '',
    contactPhone: '',
    address: '',
    paymentAccountName: '',
    paymentBankName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email === 'nil') {
      toast.error('You must be logged in to create a store');
      return;
    }

    if (!formData.name) {
      toast.error('Please enter a store name');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('template', formData.template);
      formDataToSend.append('ownerId', user.id);
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('contactPhone', formData.contactPhone);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.paymentAccountName) formDataToSend.append('paymentAccountName', formData.paymentAccountName);
      if (formData.paymentBankName) formDataToSend.append('paymentBankName', formData.paymentBankName);
      if (logoFile) formDataToSend.append('file', logoFile);

      const response = await axios.post('/api/dbhandler?model=business', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.id) {
         // backend now initializes project settings, home page and placeholder content
         toast.success('Store created successfully!');
         const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
         router.push(`/${slug}`);
      }
    } catch (error: any) {
      console.error('Error creating store:', error);
      toast.error(error.response?.data?.error || 'Failed to create store. Name might be taken.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center space-y-2 border-b">
            <div className="mx-auto bg-accent/10 h-16 w-16 rounded-full flex items-center justify-center mb-2">
               <Building2 className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold">Build Your Dream Store</CardTitle>
            <CardDescription className="text-lg">Set up your identity and choose a theme to get started.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Store Name */}
              <div className="space-y-3">
                <Label htmlFor="storeName" className="text-lg font-semibold">Store Name</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="storeName"
                    placeholder="e.g. My Awesome Shop"
                    className="pl-10 h-12 text-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                   Your store will be available at: <strong>/{formData.name.toLowerCase().replace(/\s+/g, '-') || 'your-store-name'}</strong>
                   <span className="block mt-1 text-sm text-muted-foreground">Only the store name is required. You can add logo, contact details, payment info and address later from your store dashboard.</span>
                </p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label htmlFor="logo" className="text-lg font-semibold">Store Logo (Optional)</Label>
                <div className="relative">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/90"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a logo for your store. If not provided, we'll use your store name as text.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Contact Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="support@yourstore.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Physical Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State, ZIP"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Payment Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentAccountName" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Account Name
                    </Label>
                    <Input
                      id="paymentAccountName"
                      placeholder="John Doe"
                      value={formData.paymentAccountName}
                      onChange={(e) => setFormData({ ...formData, paymentAccountName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentBankName" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Name
                    </Label>
                    <Input
                      id="paymentBankName"
                      placeholder="Bank of America"
                      value={formData.paymentBankName}
                      onChange={(e) => setFormData({ ...formData, paymentBankName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Your World...
                    </>
                  ) : (
                    'Launch My Business →'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 justify-center border-t">
             <p className="text-sm text-muted-foreground">You can change your template and settings later in the admin dashboard.</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
