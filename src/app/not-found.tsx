"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-white">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-black overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-neutral-100 rounded-full blur-3xl opacity-60"></div>
            </div>
            <h1 className="text-9xl font-black text-black mb-2 relative tracking-tighter">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 text-neutral-500">
              <div className="h-px w-12 bg-black"></div>
              <span className="text-sm font-bold tracking-wider">
                PAGE NOT FOUND
              </span>
              <div className="h-px w-12 bg-black"></div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-bold text-black">
              Oops! This page has gone missing
            </h2>
            <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Don't
              worry, it happens to the best of us.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/">
              <Button
                className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white"
                size="lg"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-black hover:bg-black hover:text-white transition-colors"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Link href="/search">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-black hover:bg-neutral-100"
                size="lg"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-neutral-200">
            <p className="text-sm text-neutral-600">
              Need help?{" "}
              <a
                href="/contact"
                className="text-black hover:underline font-bold"
              >
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
