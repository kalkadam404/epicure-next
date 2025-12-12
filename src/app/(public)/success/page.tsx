"use client";

import Link from "next/link";

export default function successPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <svg
          className="mx-auto mb-6 h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Оплата прошла успешно!
        </h1>
        <p className="text-gray-600 mb-6">
          Спасибо за вашу бронь. Подтверждение отправлено на вашу почту.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
