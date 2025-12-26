'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import EventTracker from '@/components/analytics/EventTracker';
import ConversionTracker from '@/components/analytics/ConversionTracker';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export default function AnalyticsExample() {
  const {
    trackCalculator,
    trackShareEvent,
    trackDownloadEvent,
    trackSearchEvent,
    trackFavoriteEvent,
    trackJourneyStep,
    trackConversionEvent,
    trackEngagementMetric,
  } = useAnalytics();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analytics Implementation</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics tracking with Google Analytics 4 and Microsoft Clarity
        </p>
      </div>

      {/* Event Tracking Demo */}
      <EventTracker eventName="analytics_page_view" trackScroll trackClicks trackTime>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Event Tracking Demo</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            This section is being tracked automatically with scroll, click, and time metrics.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() =>
                trackCalculator('Sample Calculator', {
                  amount: 100000,
                  rate: 7.5,
                  tenure: 10,
                })
              }
            >
              Track Calculator Use
            </Button>
            <Button
              onClick={() => trackShareEvent('whatsapp', 'calculator', 'emi-calc-123')}
              variant="outline"
            >
              Track Share Event
            </Button>
            <Button
              onClick={() => trackDownloadEvent('pdf', 'calculation-report.pdf', 'EMI')}
              variant="outline"
            >
              Track Download
            </Button>
            <Button
              onClick={() => trackSearchEvent('loan calculator', 15)}
              variant="outline"
            >
              Track Search
            </Button>
            <Button
              onClick={() => trackFavoriteEvent('add', 'emi-calculator')}
              variant="outline"
            >
              Track Favorite
            </Button>
            <Button
              onClick={() =>
                trackJourneyStep('calculator_result_viewed', { calculator: 'EMI' })
              }
              variant="outline"
            >
              Track Journey Step
            </Button>
          </div>
        </Card>
      </EventTracker>

      {/* Conversion Tracking */}
      <ConversionTracker
        conversionType="page_view"
        triggerOnMount
        value={1}
      >
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Conversion Tracking</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            This card has automatic conversion tracking enabled on mount.
          </p>
          <Button
            onClick={() => trackConversionEvent('calculator_completed', 1)}
            className="bg-green-600 hover:bg-green-700"
          >
            Track Conversion Manually
          </Button>
        </Card>
      </ConversionTracker>

      {/* Features List */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Implemented Features</h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Google Analytics 4</h3>
              <p className="text-sm text-muted-foreground">
                Full GA4 integration with pageview tracking, custom events, user properties,
                and e-commerce tracking
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold">Microsoft Clarity</h3>
              <p className="text-sm text-muted-foreground">
                Heatmaps, session recordings, and user behavior insights with custom tags and
                metadata
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold">User Journey Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Complete user flow tracking from landing to conversion with custom journey
                steps
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Tracked Events:</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Page views
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Calculator usage
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Share events
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Downloads
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Search queries
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Favorites
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Conversions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Errors
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Time on page
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Scroll depth
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Click tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Session tracking
            </li>
          </ul>
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Setup Instructions</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>1. Google Analytics 4:</strong> Add{' '}
            <code className="bg-muted px-1 py-0.5 rounded">
              NEXT_PUBLIC_GA_MEASUREMENT_ID
            </code>{' '}
            to your .env file
          </p>
          <p>
            <strong>2. Microsoft Clarity:</strong> Add{' '}
            <code className="bg-muted px-1 py-0.5 rounded">
              NEXT_PUBLIC_CLARITY_PROJECT_ID
            </code>{' '}
            to your .env file
          </p>
          <p>
            <strong>3. Deploy:</strong> Analytics will automatically start tracking once
            environment variables are configured
          </p>
        </div>
      </Card>
    </div>
  );
}
