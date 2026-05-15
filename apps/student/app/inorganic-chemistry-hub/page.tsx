import { redirect } from 'next/navigation';

export default function InorganicChemistryHubRedirect() {
    // Redirect to VSEPR simulator (default landing page)
    redirect('/inorganic-chemistry-hub/vsepr');
}
