import QuestionnaireClient from './QuestionnaireClient';

export const dynamic = 'force-dynamic';

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  return <QuestionnaireClient profileId={profileId} />;
}
