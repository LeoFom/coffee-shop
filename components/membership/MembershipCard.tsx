'use client';

import React from 'react';
import Image from "next/image";

// Мокові дані користувача
const MOCK_MEMBER = {
  uid: 'USR-8472-COFFEO',
  coffeesBought: 7,
  totalRequired: 10,
};

export default function MembershipCard() {
  const { coffeesBought, totalRequired, uid } = MOCK_MEMBER;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uid}&color=4B2C20&bgcolor=F9F5F2`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Картка з QR кодом */}
      <div className="lg:col-span-1 bg-brand-brown rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
        {/* Декоративний фон */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-bg/10 rounded-full blur-3xl -ml-10 -mb-10" />

        <h3 className="font-serif text-2xl text-brand-bg font-bold mb-2 relative z-10">Coffeo Pass</h3>
        <p className="text-brand-bg/80 text-sm mb-8 relative z-10">Scan at checkout for perks</p>

        <div className="bg-brand-bg p-4 rounded-2xl shadow-inner relative z-10 mb-6">
          {/* Використовуємо API для генерації QR-коду */}
          <Image
            src={qrCodeUrl}
            alt={`QR Code for ${uid}`}
            width={160}
            height={160}
            className="rounded-lg mix-blend-multiply"
          />
        </div>

        <p className="text-brand-bg/60 font-mono text-xs tracking-widest relative z-10">{uid}</p>
      </div>

      {/* Інформація про прогрес та знижки */}
      <div className="lg:col-span-2 space-y-6">
        {/* Прогрес 10-ї кави */}
        <div className="bg-white border border-brand-brown/10 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h4 className="font-serif font-bold text-brand-brown text-xl mb-1">Free Coffee Progress</h4>
              <p className="text-brand-muted text-sm">Buy {totalRequired} coffees, get 1 free!</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-brand-brown">{coffeesBought}</span>
              <span className="text-brand-muted">/{totalRequired}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {Array.from({ length: totalRequired }).map((_, index) => {
              const isEarned = index < coffeesBought;
              return (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isEarned
                      ? 'bg-brand-brown border-brand-brown text-white'
                      : 'bg-transparent border-brand-brown/20 text-brand-brown/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 3H6C4.9 3 4 3.9 4 5V13C4 16.9 7.1 20 11 20H13C16.9 20 20 16.9 20 13V5C20 3.9 19.1 3 18 3ZM18 13C18 15.8 15.8 18 13 18H11C8.2 18 6 15.8 6 13V5H18V13Z" />
                    <path d="M22 7H20V11H22C23.1 11 24 10.1 24 9C24 7.9 23.1 7 22 7Z" />
                  </svg>
                </div>
              );
            })}
          </div>

          {coffeesBought >= totalRequired ? (
            <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
              🎉 You&#39;ve earned a free coffee! Show your QR code to claim.
            </div>
          ) : (
            <p className="mt-6 text-sm text-brand-muted">
              Just {totalRequired - coffeesBought} more coffees to go!
            </p>
          )}
        </div>

        {/* Картка знижки */}
        <div className="bg-card-sand border border-brand-brown/10 rounded-3xl p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-brown text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="font-bold text-2xl">10%</span>
          </div>
          <div>
            <h4 className="font-serif font-bold text-brand-brown text-lg mb-1">Member Discount</h4>
            <p className="text-brand-text text-sm">
              Scan your QR code for every purchase to automatically apply a 10% discount on all coffee beans and drinks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}