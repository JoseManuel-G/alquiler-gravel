import { Account } from "@/components/account";
export const metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main>
      <Account />
    </main>
  );
}
