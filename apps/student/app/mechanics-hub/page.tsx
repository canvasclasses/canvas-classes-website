import { redirect } from 'next/navigation';

export default function MechanicsHubRedirect() {
    // Vectors is the flagship + default landing for the Mechanics Hub.
    redirect('/mechanics-hub/vectors');
}
