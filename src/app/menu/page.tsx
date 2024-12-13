// app/menu/page.tsx
'use client';

import { query } from '@/lib/db';
import MenuSection from '@/components/menu/MenuSection';
import CartWrapper from '@/components/menu/CartWrapper';
import CartSummary from '@/components/menu/CartSummary';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

// Helper function to add category prefix to IDs and image paths
function addCategoryPrefix(items: any[], prefix: string, imagePrefix: string) {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}_${item.id}`,
    imagePath: imagePrefix ? `${imagePrefix}-${(index + 1).toString().padStart(3, '0')}.${getImageExtension(imagePrefix, index + 1)}` : undefined
  }));
}

// Helper function to get the correct image extension
function getImageExtension(prefix: string, index: number): string {
  if (prefix === 'sal' && index === 1) return 'webp';
  if (prefix === 'sal' && index === 3) return 'png';
  if (prefix === 'mns' && index === 7) return 'avif';
  return 'jpg';
}

// New ConfirmReservationButton Component
function ConfirmReservationButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const { tokens } = await fetchAuthSession();
      if (!tokens?.accessToken) {
        throw new Error('No auth token');
      }

      const selectedSeats = searchParams.get('selectedSeats')?.split(',') || [];
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken.toString()}`
        },
        body: JSON.stringify({
          date: searchParams.get('date'),
          startTime: searchParams.get('startTime'),
          endTime: searchParams.get('endTime'),
          guestCount: parseInt(searchParams.get('guestCount') || '0'),
          reservationType: searchParams.get('reservationType'),
          selectedSeats,
        }),
      });

      if (!response.ok) throw new Error('Failed to create reservation');

      // Redirect to success page or dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert('Failed to confirm reservation. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  // Show reservation details
  const ReservationDetails = () => (
    <div className="text-sm text-gray-600">
      <p>Date: {searchParams.get('date')}</p>
      <p>Time: {searchParams.get('startTime')} - {searchParams.get('endTime')}</p>
      <p>Seats: {searchParams.get('selectedSeats')?.split(',').join(', ')}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-end gap-2">
      <ReservationDetails />
      <button
        onClick={handleConfirm}
        disabled={isConfirming}
        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {isConfirming ? 'Confirming Reservation...' : 'Confirm Reservation'}
      </button>
    </div>
  );
}

export default async function Menu() {
  // Fetch all menu items
  const [
    champagnes,
    desserts,
    mains,
    sides,
    starters,
    spritzes,
    steaks,
    specialties,
    salads,
    ginTonics
  ] = await Promise.all([
    query('SELECT * FROM champagnes'),
    query('SELECT * FROM desserts'),
    query('SELECT * FROM mains'),
    query('SELECT * FROM sides'),
    query('SELECT * FROM snacks_and_starters'),
    query('SELECT * FROM spritzes'),
    query('SELECT * FROM steaks'),
    query('SELECT * FROM specialties'),
    query('SELECT * FROM salads'),
    query('SELECT * FROM gin_and_tonics')
  ]);

  // Add category prefixes and image paths
  const processedChampagnes = addCategoryPrefix(champagnes, 'champ', '');
  const processedDesserts = addCategoryPrefix(desserts, 'dess', 'des');
  const processedMains = addCategoryPrefix(mains, 'main', 'mns');
  const processedSides = addCategoryPrefix(sides, 'side', '');
  const processedStarters = addCategoryPrefix(starters, 'start', '');
  const processedSpritzes = addCategoryPrefix(spritzes, 'spritz', '');
  const processedSteaks = addCategoryPrefix(steaks, 'steak', 'stk');
  const processedSpecialties = addCategoryPrefix(specialties, 'spec', 'spc');
  const processedSalads = addCategoryPrefix(salads, 'salad', 'sal');
  const processedGinTonics = addCategoryPrefix(ginTonics, 'gin', '');

  // Define themes for different sections
  const themes = {
    specialty: {
      backgroundColor: 'bg-amber-50',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800',
      priceColor: 'text-amber-900'
    },
    champagne: {
      backgroundColor: 'bg-yellow-50',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      priceColor: 'text-yellow-900'
    },
    dessert: {
      backgroundColor: 'bg-pink-50',
      titleColor: 'text-pink-800',
      textColor: 'text-pink-700',
      priceColor: 'text-pink-900'
    },
    main: {
      backgroundColor: 'bg-blue-50',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      priceColor: 'text-blue-900'
    },
    steak: {
      backgroundColor: 'bg-red-50',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      priceColor: 'text-red-900'
    },
    salad: {
      backgroundColor: 'bg-green-50',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      priceColor: 'text-green-900'
    }
  };

  return (
    <CartWrapper>
      <main className="container mx-auto px-4 py-8 mb-24">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 rounded-lg text-center mb-12 shadow-xl">
          <h1 className="text-4xl font-black tracking-tight">Our Menu</h1>
          <p className="text-gray-300 mt-2">(Optional) Select items to add to your reservation</p>
        </div>

        {/* Menu Sections */}
        <div className="space-y-16">
          {/* All your existing menu sections */}
          {processedSpecialties.length > 0 && (
            <div className="mb-20">
              <MenuSection 
                title="House Specialties" 
                items={processedSpecialties}
                theme={themes.specialty}
              />
            </div>
          )}

          <MenuSection 
            title="Salads" 
            items={processedSalads}
            theme={themes.salad}
          />

          <MenuSection 
            title="Main Courses" 
            items={processedMains} 
            theme={themes.main}
          />

          <MenuSection 
            title="Steaks" 
            items={processedSteaks} 
            theme={themes.steak}
          />

          <MenuSection 
            title="Desserts" 
            items={processedDesserts} 
            theme={themes.dessert}
          />

          <MenuSection 
            title="Gin & Tonics" 
            items={processedGinTonics}
          />

          <MenuSection 
            title="Champagnes & Sparkling" 
            items={processedChampagnes} 
            theme={themes.champagne} 
          />

          <MenuSection 
            title="Spritzes & Cocktails" 
            items={processedSpritzes}
          />

          <MenuSection 
            title="Starters & Small Plates" 
            items={processedStarters}
          />

          <MenuSection 
            title="Side Dishes" 
            items={processedSides}
          />
        </div>
      </main>

      {/* Fixed bottom bar for cart and confirmation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <CartSummary />
          <ConfirmReservationButton />
        </div>
      </div>
    </CartWrapper>
  );
}