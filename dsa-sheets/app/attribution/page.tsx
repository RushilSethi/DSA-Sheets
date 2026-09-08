import type { Metadata } from 'next';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Attribution & Disclaimer – DSA Sheets',
  description: 'Attribution and disclaimer for DSA Sheets',
};

export default function AttributionPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <DynamicBreadcrumb />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Attribution &amp; Disclaimer</h1>
        <p className="text-muted-foreground text-sm">Last updated: June 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          This website is an independent educational resource created to help students practice
          Data Structures and Algorithms (DSA).
        </p>
        <p>
          The problem sheets, roadmaps, and learning paths featured on this website are compiled
          from publicly available resources created by various members of the programming community,
          including but not limited to Striver, NeetCode, Love Babbar, and other educators. Full
          credit for the original creation, organization, and curation of these sheets belongs to
          their respective authors.
        </p>
        <p>
          This website does not claim ownership of any third-party sheets, roadmaps, trademarks,
          brand names, or educational content. The purpose of this platform is solely to provide
          a free, ad-free, and accessible interface that helps learners.
        </p>
        <p>
          If you are the owner of any content featured on this website and believe that attribution
          is missing, incorrect, or that any material should be modified or removed, please contact
          us and we will promptly review the request.
        </p>
        <p>
          All trademarks, logos, brand names, and copyrights remain the property of their respective
          owners.
        </p>
      </div>
    </div>
  );
}
