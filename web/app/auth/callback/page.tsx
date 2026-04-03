import { AuthCallbackExperience } from "../../../components/app/AuthCallbackExperience";

type AuthCallbackPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  return (
    <AuthCallbackExperience
      code={readParam(searchParams?.code)}
      error={readParam(searchParams?.error)}
      errorDescription={readParam(searchParams?.error_description)}
    />
  );
}
