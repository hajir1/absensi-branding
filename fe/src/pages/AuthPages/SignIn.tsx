import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuthStore } from "../../services/state";

export default function SignIn() {
  // const token = useAuthStore.getState().accessToken; // ambil dari Zustand

  // useEffect(() => {
  //   if (token) {
  //     window.location.href = "/dashboard"; // redirect hanya dijalankan setelah render
  //   }
  // }, [token]);
  return (
    <>
      <PageMeta title="Sign In" description="Sign In" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
