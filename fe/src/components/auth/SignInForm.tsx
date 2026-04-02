import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { APIlogin } from "../../services/API_CALL";
import { useAuthStore, useUserStore } from "../../services/state";
import Alert from "../ui/alert/Alert";
import { jwtDecode } from "jwt-decode";
import { sweetAlert } from "../ui/sweetAlert/sweetAlert";
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
    roleId: "",
  });
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await APIlogin(dataLogin);

      setAccessToken((res as any)?.accessToken);
      setErrorLogin("loading...");
      if (res.message) {
        sweetAlert(
          "Informasi Akun",
          "Verfikasi Email lewat gmail",
          "warning",
          9000,
        );
        setErrorLogin("");
        setDataLogin((prev) => ({ ...prev, email: "", password: "" }));
      }
      setErrorLogin("");
      const payload = jwtDecode<any>(res.accessToken);
      setUser({
        id: payload.id,
        email: payload.sub,
        name: payload.username,
        foto: payload.foto,
        roleId: payload.roleId,
        roleName: payload.roleName,
        divisiId: payload.divisiId,
        divisiName: payload.divisiName,
        mentorId: payload.mentorId,
        mentorName: payload.mentorName,
        nim: payload.nim,
      });
      navigate("/dashboard");
    } catch (error) {
      setErrorLogin((error as any)?.message);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Kembali ke Halaman Utama
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan email dan kata sandi Anda untuk masuk!
            </p>
          </div>
          <div>
            {errorLogin !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorLogin}
                showLink={false}
              />
            )}
            <form className="mt-5" onSubmit={(e) => handleSubmit(e)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    minLength={5}
                    value={dataLogin.email}
                    onChange={(e) => handleChange(e)}
                    name="email"
                    type="email"
                    placeholder="info@gmail.com"
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      minLength={5}
                      value={dataLogin.password}
                      onChange={(e) => handleChange(e)}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Belum punya akun?? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
