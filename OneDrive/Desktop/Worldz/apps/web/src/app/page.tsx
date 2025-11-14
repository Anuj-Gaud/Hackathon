'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h1 className="section-title mb-6">
                Find Your Dream Job or Internship
              </h1>
              <p className="section-description mb-8">
                Connect with top companies worldwide and take your career to new heights. Whether you're looking for a full-time position or an internship, we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link href="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="btn-primary">
                      Get Started
                    </Link>
                    <Link href="/login" className="btn-outline">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative">
                <div className="relative z-10 bg-primary/5 rounded-2xl p-8">
                  <div className="flex flex-wrap -m-4">
                    <div className="w-full md:w-1/2 p-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Global Opportunities</h3>
                          <p className="card-description">
                            Access jobs and internships from companies worldwide
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Career Growth</h3>
                          <p className="card-description">
                            Find opportunities that match your career goals
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Smart Matching</h3>
                          <p className="card-description">
                            Our AI helps you find the perfect match
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Easy Application</h3>
                          <p className="card-description">
                            Apply to multiple positions with just a few clicks
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Why Choose Worldz?</h2>
            <p className="section-description">
              We're committed to helping you succeed in your career journey
            </p>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="w-full md:w-1/3 p-4">
              <div className="card h-full">
                <div className="card-header">
                  <h3 className="card-title">Global Network</h3>
                  <p className="card-description">
                    Connect with employers from around the world
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="card h-full">
                <div className="card-header">
                  <h3 className="card-title">Career Resources</h3>
                  <p className="card-description">
                    Access tools and guides to boost your career
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="card h-full">
                <div className="card-header">
                  <h3 className="card-title">Smart Analytics</h3>
                  <p className="card-description">
                    Track your application progress and success
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="card bg-primary text-primary-foreground">
            <div className="card-header text-center">
              <h2 className="card-title">Ready to Start Your Journey?</h2>
              <p className="card-description">
                Join thousands of professionals who found their dream jobs through Worldz
              </p>
            </div>
            <div className="card-footer justify-center">
              {user ? (
                <Link href="/dashboard" className="btn-secondary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/signup" className="btn-secondary">
                  Get Started Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
