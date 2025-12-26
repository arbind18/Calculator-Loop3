'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  affiliatePartners, 
  trackAffiliateClick, 
  generateAffiliateLink,
  type AffiliatePartner 
} from '@/lib/affiliates';
import { ExternalLink, Star, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';

interface AffiliateRecommendationsProps {
  calculationType: string;
  amount?: number;
  title?: string;
  description?: string;
}

export function AffiliateRecommendations({
  calculationType,
  amount,
  title = 'Recommended Partners',
  description = 'Get the best deals from our trusted partners',
}: AffiliateRecommendationsProps) {
  const [clickedPartners, setClickedPartners] = useState<Set<string>>(new Set());

  const categoryMap: Record<string, AffiliatePartner['category']> = {
    'emi-calculator': 'loan',
    'home-loan-calculator': 'loan',
    'personal-loan-calculator': 'loan',
    'car-loan-calculator': 'loan',
    'sip-calculator': 'investment',
    'lumpsum-calculator': 'investment',
    'fd-calculator': 'investment',
    'bmi-calculator': 'insurance',
  };

  const category = categoryMap[calculationType];
  if (!category) return null;

  let partners = affiliatePartners.filter(
    (p) => p.category === category && p.isActive
  );

  // Filter by amount if applicable
  if (amount) {
    partners = partners.filter((p) => !p.minimumAmount || amount >= p.minimumAmount);
  }

  // Sort by rating
  partners = partners.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  if (partners.length === 0) return null;

  const handlePartnerClick = async (partner: AffiliatePartner) => {
    setClickedPartners((prev) => new Set(prev).add(partner.id));
    
    await trackAffiliateClick(partner.id, undefined, {
      calculator_type: calculationType,
      amount,
    });

    const affiliateLink = generateAffiliateLink(partner, undefined, calculationType);
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'loan':
        return <TrendingUp className="h-5 w-5" />;
      case 'investment':
        return <Zap className="h-5 w-5" />;
      case 'insurance':
        return <Shield className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  return (
    <Card className="mt-8 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {getCategoryIcon()}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="hover:shadow-lg transition-shadow border-border"
            >
              <CardContent className="p-6 space-y-4">
                {/* Partner Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                    {partner.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{partner.rating}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">{partner.category}</Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{partner.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {partner.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePartnerClick(partner)}
                  className="w-full gap-2"
                  variant={clickedPartners.has(partner.id) ? 'outline' : 'default'}
                >
                  {clickedPartners.has(partner.id) ? 'Visited' : 'Apply Now'}
                  <ExternalLink className="h-4 w-4" />
                </Button>

                {/* Commission Info */}
                {partner.commission.type === 'fixed' && (
                  <p className="text-xs text-center text-muted-foreground">
                    Sponsored Partner
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Disclosure:</strong> We may earn a commission when you apply through our
            partner links. This doesn't affect your interest rate or fees. All partners are
            carefully vetted to ensure they offer competitive rates and quality service.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
