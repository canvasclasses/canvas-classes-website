import ResultsClient from './ResultsClient';

export const dynamic = 'force-dynamic';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  return <ResultsClient profileId={profileId} />;
}
