import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    // A not-found file cannot export metadata; React hoists this <title>.
    <div className="wrap">
      <title>{t("title")}</title>
      <div className="page-head">
        <h1>404</h1>
        <p>{t("body")}</p>
      </div>
    </div>
  );
}
